# OWASP Top 10 Web Application Security

- **Module:** `05-web-security`
- **Topic:** The 10 Most Critical Web Application Security Risks

---

## 1. What is it?
The Open Worldwide Application Security Project (OWASP) Top 10 is the globally recognized standard awareness document for developers and web application security testers.

1. **A01: Broken Access Control** (IDOR, unauthorized privilege bypass)
2. **A02: Cryptographic Failures** (sensitive data exposure, weak ciphers)
3. **A03: Injection** (SQLi, Command Injection, LDAP Injection)
4. **A04: Insecure Design**
5. **A05: Security Misconfiguration** (default passwords, exposed stack traces)
6. **A06: Vulnerable and Outdated Components**
7. **A07: Identification and Authentication Failures** (brute-force, credential stuffing)
8. **A08: Software and Data Integrity Failures**
9. **A09: Security Logging and Monitoring Failures**
10. **A10: Server-Side Request Forgery (SSRF)**

---

## 2. How does it work?
Vulnerabilities stem from untrusted user input being interpreted as code (Injection), improper verification of user identity/rights (Broken Access Control), or neglecting secure defaults.

---

## 3. Why does a security professional need it?
Web applications are often the initial perimeter breach point into enterprise networks. Red Teamers probe these exact 10 categories to achieve Remote Code Execution (RCE) or acquire internal network footholds.

---

## 4. What did I practise?
- Solved initial labs on PortSwigger Web Security Academy.

---

## 5. What did I learn from the exercise?
- Broken Access Control is currently the #1 vulnerability found in modern web apps and APIs.
