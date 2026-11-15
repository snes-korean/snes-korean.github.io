# 비상 리셋: 입력 서비스 재시작
$log = "$env:LOCALAPPDATA\ime_guard.log"
Add-Content $log ("{0} 비상 리셋 실행" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
Get-Process ctfmon, TextInputHost -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 800
Start-Process "$env:WINDIR\System32\ctfmon.exe"
[console]::beep(1000,150)
