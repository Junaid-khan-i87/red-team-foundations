# Bash Scripting for Penetration Testers

- **Module:** `04-programming`
- **Topic:** Shell automation, looping over targets, output formatting

---

## 1. What is it?
Bash (Bourne Again SHell) scripting automates terminal commands, coordinates multiple command-line security tools, and conducts fast parallel network sweeps.

---

## 2. How does it work?
Executes commands sequentially or in parallel subshells (`&`), handling input parameters (`$1`, `$@`), exit status codes (`$?`), and pipeline streams.

---

## 3. Why does a security professional need it?
Speed in initial reconnaissance. While heavyweight scanners load, a 5-line bash loop can ping-sweep an entire `/24` subnet in 3 seconds.

---

## 4. What did I practise?
```bash
#!/bin/bash
# Fast ping sweep on /24 subnet
SUBNET="192.168.1"
for ip in $(seq 1 254); do
    ping -c 1 -W 1 "${SUBNET}.${ip}" > /dev/null 2>&1 && echo "[+] Host up: ${SUBNET}.${ip}" &
done
wait
```

---

## 5. What did I learn from the exercise?
- Backgrounding tasks with `&` and synchronizing with `wait` delivers lightning fast multi-threading in pure Bash.
