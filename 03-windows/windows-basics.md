# Windows Architecture & Active Directory Fundamentals

- **Module:** `03-windows`
- **Topic:** Windows security architecture, NTFS permissions, Active Directory introduction

---

## 1. What is it?
Windows enterprise environments rely on Windows NT kernel architecture, Security Account Manager (SAM), Local Security Authority Subsystem Service (LSASS), and centralized Active Directory (AD) Domain Services.

---

## 2. How does it work?
- **Authentication:** Local accounts authenticate against SAM; Domain accounts authenticate against Domain Controllers (DCs) using Kerberos (tickets: TGT, TGS) or NTLM challenges.
- **Access Control:** Security Identifiers (SIDs) and Access Control Lists (DACLs/SACLs) control object permissions.

---

## 3. Why does a security professional need it?
- Active Directory is the backbone of 90%+ of global enterprise environments.
- Red Team operators focus heavily on AD credential dumping (Mimikatz LSASS dumping), Kerberoasting, AS-REP Roasting, and lateral movement via SMB/WinRM.

---

## 4. What did I practise?
- Studied AD hierarchy (Forests, Domains, Trees, OUs, Group Policies).
- Inspected Windows services and process trees.

---

## 5. What did I learn from the exercise?
- Windows domain security revolves around Kerberos ticket exchanges and Identity management rather than individual host defenses.
