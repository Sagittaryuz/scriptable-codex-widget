param([switch]$Read)
$ErrorActionPreference='Stop'
$taskDirectory=Join-Path $env:LOCALAPPDATA 'CodexWidget'
$taskFile=Join-Path $taskDirectory 'push-key.dpapi'
if($Read){
  if(!(Test-Path -LiteralPath $taskFile)){exit 0}
  $secure=Get-Content -LiteralPath $taskFile -Raw | ConvertTo-SecureString
  $pointer=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try{[Console]::Out.Write([Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer))}
  finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)}
  exit
}
New-Item -ItemType Directory -Path $taskDirectory -Force | Out-Null
$secret=Read-Host 'Chave send-only do Scripting Remote Push (entrada oculta)' -AsSecureString
if($secret.Length -lt 10){throw 'Chave vazia ou inválida.'}
$secret | ConvertFrom-SecureString | Set-Content -LiteralPath $taskFile -Encoding utf8
$acl=Get-Acl -LiteralPath $taskFile
$acl.SetAccessRuleProtection($true,$false)
$identity=[Security.Principal.WindowsIdentity]::GetCurrent().Name
$acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new($identity,'FullControl','Allow'))
Set-Acl -LiteralPath $taskFile -AclObject $acl
Write-Output 'Chave protegida por DPAPI. Reinicie o coletor para ativar o envio.'
