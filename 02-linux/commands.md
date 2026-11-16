# Linux Core Commands & Shell Navigation

- **Module:** `02-linux`
- **Topic:** Shell basics, file inspection, piping, and filtering

---

## 1. What is it?
The Linux command line is the primary interface used by operators to control Linux hosts, cloud servers, and containerized workloads without a graphical UI.

---

## 2. How does it work?
Standard commands interact with the Linux POSIX API and virtual filesystems (`/proc`, `/sys`, `/dev`). Standard Streams (`stdin`, `stdout`, `stderr`) are chained together using pipes (`|`) and redirection (`>`, `>>`, `2>&1`).

---

## 3. Why does a security professional need it?
When getting an initial reverse shell on a compromised Linux host, there is no GUI. Red Teamers must navigate directories, inspect running processes, find sensitive credentials in config files, and establish persistence strictly via bash/sh.

---

## 4. What did I practise?
```bash
# Process inspection
ps aux --forest | grep -i nginx
# Grepping recursively for credentials
grep -rni "password" /var/www/ 2>/dev/null
# Finding world-writable files
find / -writable -type d 2>/dev/null
```

---

## 5. What did I learn from the exercise?
- Command piping (`find`, `grep`, `awk`, `cut`, `sort`) allows lightning fast log analysis and host enumeration during post-exploitation.
