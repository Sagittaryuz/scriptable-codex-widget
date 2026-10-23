$ErrorActionPreference='Stop'
$taskFile=Join-Path $env:LOCALAPPDATA 'CodexWidget/github-token.dpapi'
if(!(Test-Path -LiteralPath $taskFile)){exit 0}
$secure=Get-Content -LiteralPath $taskFile -Raw | ConvertTo-SecureString
$pointer=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try{[Console]::Out.Write([Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer))}
finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)}
