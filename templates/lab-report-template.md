# Security Assessment Lab Report: [Target Name / Lab Title]

- **Date:** YYYY-MM-DD
- **Target / Application:** [e.g. OWASP Juice Shop / PortSwigger Lab]
- **Tester:** Junaid Khan
- **Status:** Completed / In Progress
- **Scope:** [URL / Local Docker / Specific Endpoint]

---

## 1. Executive Summary & Lab Scope
Brief summary of what was assessed, rules of engagement, and overall security posture observed.

---

## 2. Methodology & Exploration
- Tools used: Nmap / Burp Suite / Browser DevTools / Curl
- Reconnaissance steps:
- Surface mapping:

---

## 3. Vulnerability Findings & Evidence

### Finding 1: [Vulnerability Name - e.g. SQL Injection / IDOR / Broken Auth]
- **Severity:** [Critical / High / Medium / Low / Info]
- **Vulnerable Endpoint:** `GET/POST /api/...`
- **Description:** 
- **Proof of Concept (PoC) & Steps to Reproduce:**
  1. Step 1...
  2. Step 2...
- **Screenshots / Request & Response Payloads:**
  ```http
  POST /api/login HTTP/1.1
  Host: target.local
  ...
  ```
- **Risk & Business Impact:**

---

## 4. Remediation & Hardening Recommendations
Actionable steps to fix the root cause and defend against this vulnerability.

- Secure coding practice:
- Configuration hardening:

---

## 5. Personal Learnings & Key Takeaways
What new offensive concept did I observe? How does this apply to real-world Red Team assessments?
