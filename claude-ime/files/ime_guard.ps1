# ctfmon 중복 감시: 2개 이상이면 가장 오래된 것만 남기고 종료
$log = "$env:LOCALAPPDATA\ime_guard.log"
while ($true) {
  try {
    $p = @(Get-Process ctfmon -ErrorAction SilentlyContinue | Where-Object { $_.SessionId -eq (Get-Process -Id $PID).SessionId } | Sort-Object StartTime)
    if ($p.Count -gt 1) {
      $p | Select-Object -Skip 1 | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Add-Content $log ("{0} ctfmon 중복 종료 PID {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $_.Id)
      }
    }
  } catch {}
  Start-Sleep -Seconds 5
}
