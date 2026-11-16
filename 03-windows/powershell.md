# PowerShell for Security Professionals

- **Module:** `03-windows`
- **Topic:** Cmdlets, object piping, remote administration, and script execution

---

## 1. What is it?
PowerShell is Microsoft's task automation and configuration framework consisting of a command-line shell and scripting language built on the .NET framework.

---

## 2. How does it work?
Unlike traditional Unix shells that pipe raw text streams, PowerShell passes rich .NET objects down the pipeline (`Get-Process | Where-Object {$_.CPU -gt 100}`).

---

## 3. Why does a security professional need it?
- PowerShell is natively present on every modern Windows system ("Living off the Land" - LotL).
- Attackers run payloads in-memory via `powershell -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -Command ...`, evading basic disk-based antivirus scans.

---

## 4. What did I practise?
```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
Get-Service | Where-Object {$_.Status -eq "Running"}
Test-NetConnection -ComputerName 127.0.0.1 -Port 445
```

---

## 5. What did I learn from the exercise?
- Modern defenses utilize Script Block Logging and AMSI (Antimalware Scan Interface) to inspect PowerShell code before execution.
