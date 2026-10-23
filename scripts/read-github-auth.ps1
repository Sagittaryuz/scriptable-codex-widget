param([string]$Directory)
$ErrorActionPreference='Stop'
if(!$Directory){$Directory=Join-Path $env:LOCALAPPDATA 'CodexWidget'}
$taskFile=Join-Path $Directory 'github-token.dpapi'
if(![IO.File]::Exists($taskFile)){exit 0}
Add-Type -AssemblyName System.Security
$protected=[Convert]::FromBase64String([IO.File]::ReadAllText($taskFile).Trim())
$plain=[Security.Cryptography.ProtectedData]::Unprotect($protected,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
try{Write-Output ([Text.Encoding]::UTF8.GetString($plain))}
finally{[Array]::Clear($plain,0,$plain.Length)}
