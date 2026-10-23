$ErrorActionPreference='Stop'
$taskRoot=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$remote=git -C $taskRoot remote get-url origin
if($remote -ne 'https://github.com/Sagittaryuz/scriptable-codex-widget.git'){throw 'Repositório inesperado.'}
$taskNode=(Get-Command node -ErrorAction Stop).Source
$taskScript=Join-Path $taskRoot 'scripts/watch-scripting.cjs'
$taskName='CodexWidget-Scripting-Collector'
$action=New-ScheduledTaskAction -Execute $taskNode -Argument ('"'+$taskScript+'"') -WorkingDirectory $taskRoot
$trigger=New-ScheduledTaskTrigger -AtLogOn -User ([Security.Principal.WindowsIdentity]::GetCurrent().Name)
$settings=New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
$existing=Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if($existing){throw 'Já existe um coletor registrado. Confira seu diretório antes de substituir.'}
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description 'Coleta somente metadados do Codex e publica dados privados. Não executa tarefas ou modelos.' | Out-Null
Start-ScheduledTask -TaskName $taskName
Get-ScheduledTask -TaskName $taskName | Select-Object TaskName,State
