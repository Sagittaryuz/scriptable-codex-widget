param([switch]$Read)
$ErrorActionPreference='Stop'
$taskRuntimeFile=Join-Path $PSScriptRoot '../work/scripting-runtime.json'
$taskRuntime=if([IO.File]::Exists($taskRuntimeFile)){[IO.File]::ReadAllText($taskRuntimeFile)|ConvertFrom-Json}else{$null}
$taskDirectory=if($taskRuntime.secretDirectory){$taskRuntime.secretDirectory}else{Join-Path $env:LOCALAPPDATA 'CodexWidget'}
$taskFile=Join-Path $taskDirectory 'push-key.dpapi'
if($Read){
  if(![IO.File]::Exists($taskFile)){exit 0}
  Add-Type -AssemblyName System.Security
  $protected=[Convert]::FromBase64String([IO.File]::ReadAllText($taskFile).Trim())
  $plain=[Security.Cryptography.ProtectedData]::Unprotect($protected,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
  try{Write-Output ([Text.Encoding]::UTF8.GetString($plain))}
  finally{[Array]::Clear($plain,0,$plain.Length)}
  exit
}
New-Item -ItemType Directory -Path $taskDirectory -Force | Out-Null
$secret=Read-Host 'Chave send-only do Scripting Remote Push (entrada oculta)' -AsSecureString
if($secret.Length -lt 10){throw 'Chave vazia ou inválida.'}
Add-Type -AssemblyName System.Security
$pointer=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try{$bytes=[Text.Encoding]::UTF8.GetBytes([Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer));$protected=[Security.Cryptography.ProtectedData]::Protect($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser);[IO.File]::WriteAllText($taskFile,[Convert]::ToBase64String($protected))}
finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer);if($bytes){[Array]::Clear($bytes,0,$bytes.Length)}}
$taskSid=[Security.Principal.WindowsIdentity]::GetCurrent().User.Value
& icacls.exe $taskFile /inheritance:r /grant:r ('*'+$taskSid+':(F)') | Out-Null
if($LASTEXITCODE -ne 0){throw 'Não foi possível proteger a chave local.'}
Write-Output 'Chave protegida por DPAPI. Reinicie o coletor para ativar o envio.'
