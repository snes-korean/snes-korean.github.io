$dir = "$env:LOCALAPPDATA\ImeGuard"
New-Item -ItemType Directory -Force $dir | Out-Null
$src = Split-Path -Parent $MyInvocation.MyCommand.Path
Copy-Item "$src\ime_guard.ps1","$src\ime_panic.ps1" $dir -Force
$ps = "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe"
$sh = New-Object -ComObject WScript.Shell
# 1) 로그온 시 감시 자동 실행 (창 숨김)
$startup = [Environment]::GetFolderPath('Startup')
$l = $sh.CreateShortcut("$startup\ImeGuard.lnk")
$l.TargetPath = $ps
$l.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dir\ime_guard.ps1`""
$l.WindowStyle = 7
$l.Save()
# 2) 비상 리셋 바로가기 + 단축키 Ctrl+Alt+F12 (시작 메뉴에 둬야 단축키 동작)
$sm = [Environment]::GetFolderPath('Programs')
foreach ($t in @("$sm\입력 비상 리셋.lnk", ([Environment]::GetFolderPath('Desktop') + "\입력 비상 리셋.lnk"))) {
  $k = $sh.CreateShortcut($t)
  $k.TargetPath = $ps
  $k.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dir\ime_panic.ps1`""
  $k.WindowStyle = 7
  if ($t -like "$sm*") { $k.Hotkey = "CTRL+ALT+F12" }
  $k.Save()
}
# 3) 지금 바로 감시 시작 (중복 실행 방지)
$running = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*ime_guard.ps1*' }
if (-not $running) { Start-Process $ps -ArgumentList "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dir\ime_guard.ps1`"" -WindowStyle Hidden }
"설치 완료: $dir"
"Startup: " + (Test-Path "$startup\ImeGuard.lnk")
"단축키 바로가기: " + (Test-Path "$sm\입력 비상 리셋.lnk")
"ctfmon 개수: " + @(Get-Process ctfmon -ErrorAction SilentlyContinue).Count
"감시 실행중: " + [bool](Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" | Where-Object { $_.CommandLine -like '*ime_guard.ps1*' })
