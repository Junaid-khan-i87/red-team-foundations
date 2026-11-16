# Linux Permissions & Privilege Escalation Fundamentals

- **Module:** `02-linux`
- **Topic:** POSIX permissions, SUID/SGID bits, sudo privileges

---

## 1. What is it?
Linux employs a discretionary access control model based on Users, Groups, and Others (rwx bits: 4=Read, 2=Write, 1=Execute), along with special permissions (SUID=4000, SGID=2000, Sticky Bit=1000).

---

## 2. How does it work?
- **SUID (Set User ID):** When executed, the binary runs with the privileges of the file owner (often root) rather than the executing user.
- **Sudoers (`/etc/sudoers`):** Dictates which commands a user can execute with elevated privileges (e.g., `NOPASSWD:` entries).

---

## 3. Why does a security professional need it?
- **Privilege Escalation:** Exploiting misconfigured SUID binaries (see GTFOBins) or permissive sudo rules to elevate from low-privileged user (e.g. `www-data`) to full `root` control.

---

## 4. What did I practise?
```bash
# Finding all SUID binaries on system
find / -perm -4000 -type f -exec ls -la {} 2>/dev/null \;
# Checking current user sudo privileges
sudo -l
```

---

## 5. What did I learn from the exercise?
- Never grant sudo privileges or SUID bits to interpreters (bash, python, perl) or text editors (vim, nano) without strict restrictions.
