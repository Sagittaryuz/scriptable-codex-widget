param([switch]$Update)
$ErrorActionPreference='Stop'
$taskRoot=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$remote=git -C $taskRoot remote get-url origin
if($remote -ne 'https://github.com/Sagittaryuz/scriptable-codex-widget.git'){throw 'Repositório inesperado.'}
$taskNode=(Get-Command node -ErrorAction Stop).Source
$taskScript=Join-Path $taskRoot 'scripts/watch-scripting.cjs'
$taskWork=Join-Path $taskRoot 'work'
New-Item -ItemType Directory -Path $taskWork -Force | Out-Null
# Scheduler PATH differs from the terminal. Paths only: never persist tokens/env dumps.
$taskConfiguration=@{secretDirectory=(Join-Path $taskWork 'private-runtime');executables=@{codex=(Get-Command codex -ErrorAction Stop).Source;gh=(Get-Command gh -ErrorAction Stop).Source;git=(Get-Command git -ErrorAction Stop).Source}}
$taskConfiguration | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $taskWork 'scripting-runtime.json') -Encoding utf8
# Reuse the authorized gh session; no new cloud token is created. Never echo it.
$taskToken=& $taskConfiguration.executables.gh auth token
if($LASTEXITCODE -ne 0 -or !$taskToken){throw 'Sessão GitHub indisponível.'}
$taskSecretDirectory=$taskConfiguration.secretDirectory
New-Item -ItemType Directory -Path $taskSecretDirectory -Force | Out-Null
$taskSecretFile=Join-Path $taskSecretDirectory 'github-token.dpapi'
Add-Type -AssemblyName System.Security
$taskBytes=[Text.Encoding]::UTF8.GetBytes($taskToken.Trim())
try{$taskProtected=[Security.Cryptography.ProtectedData]::Protect($taskBytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser);[IO.File]::WriteAllText($taskSecretFile,[Convert]::ToBase64String($taskProtected))}
finally{[Array]::Clear($taskBytes,0,$taskBytes.Length)}
$taskToken=$null
$taskSid=[Security.Principal.WindowsIdentity]::GetCurrent().User.Value
& icacls.exe $taskSecretFile /inheritance:r /grant:r ('*'+$taskSid+':(F)') | Out-Null
if($LASTEXITCODE -ne 0){throw 'Não foi possível proteger a credencial local.'}
$taskName='CodexWidget-Scripting-Collector'
$action=New-ScheduledTaskAction -Execute $taskNode -Argument ('"'+$taskScript+'"') -WorkingDirectory $taskRoot
$trigger=New-ScheduledTaskTrigger -AtLogOn -User ([Security.Principal.WindowsIdentity]::GetCurrent().Name)
$settings=New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
$existing=Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if($existing){
  if(!$Update -or $existing.Actions.Arguments -ne ('"'+$taskScript+'"')){throw 'Já existe um coletor registrado. Confira seu diretório antes de substituir.'}
  Stop-ScheduledTask -TaskName $taskName
}
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description 'Coleta somente metadados do Codex e publica dados privados. Não executa tarefas ou modelos.' -Force | Out-Null
Start-ScheduledTask -TaskName $taskName
Get-ScheduledTask -TaskName $taskName | Select-Object TaskName,State
