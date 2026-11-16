# 🛡️ Red Team Foundation Roadmap: 90 Days → Full-Time Specialization

> **"Understand how computers, networks, operating systems and applications work before learning how to assess their security."**

![Status](https://img.shields.io/badge/Mission-90--Day%20Red%20Team%20Foundations-red?style=for-the-badge&logo=target)
![Progress](https://img.shields.io/badge/Progress-Day%2001%2F90-brightgreen?style=for-the-badge)
![Commitment](https://img.shields.io/badge/Daily%20Commitment-30%20Min-blue?style=for-the-badge)
![Operator](https://img.shields.io/badge/Operator-Junaid%20Khan-orange?style=for-the-badge&logo=github)

---

## 🎯 1. Mission Overview

- **Start Date:** `16 November 2026`
- **Target Completion:** `16 February 2027`
- **Daily Time Commitment:** `30 Minutes` (Non-negotiable consistency)
- **Estimated Total Learning Time:** `~45–46 Hours`

### 🎯 Exit Target Criteria
By the end of this 90-day foundation journey:
- [x] Day 1 Kickoff: Client-Server Architecture & Networking Basics
- [ ] Understand networking and TCP/IP inside out.
- [ ] Work comfortably in Linux and Windows CLI without GUI reliance.
- [ ] Write functional automation scripts in Python, Bash, and PowerShell.
- [ ] Understand web application architecture, HTTP protocol, cookies, and APIs.
- [ ] Grasp modern penetration testing methodologies & ethics.
- [ ] Complete practical hands-on beginner labs (OverTheWire Bandit, PortSwigger, OWASP Juice Shop).
- [ ] **Be fully prepared for intensive, full-time Red Team specialization training.**

---

## ⏱️ 2. The Daily 30-Minute Protocol

Every single daily session is divided into 3 intentional blocks:

```
┌─────────────────┬────────────────────────────────────────────────────────┐
│  00 - 05 Mins   │ 🧠 Active Recall / Revision                             │
│                 │ Recall yesterday's concepts WITHOUT checking notes.    │
├─────────────────┼────────────────────────────────────────────────────────┤
│  05 - 20 Mins   │ 📖 Deep Concept Learning                               │
│                 │ Study one concept from documentation, course, or RFC.  │
├─────────────────┼────────────────────────────────────────────────────────┤
│  20 - 30 Mins   │ 💻 Hands-on Practice & Documentation                   │
│                 │ Run commands, inspect packets, code script, save note. │
└─────────────────┴────────────────────────────────────────────────────────┘
```

> **The Golden Rule:** Never just watch videos passively. Every day, produce something: execute a command, capture a packet, write a script, solve a challenge, or document an explanation.

---

## 🗺️ 3. The Complete 12-Week Roadmap

### 📦 Month 1: Technical Foundations (Weeks 1–4)
*Understand the systems that security professionals assess.*

- **[Week 1 — Computer & Networking Fundamentals](01-networking/)**
  - Client-server architecture, LAN/WAN, IP & MAC addresses, routers, switches, gateways, DNS, DHCP.
  - *Practical Goal:* Understand what happens when you type `https://google.com` into your browser.
- **[Week 2 — Networking Deeper](01-networking/)**
  - OSI vs TCP/IP models, TCP vs UDP, ports & protocols, subnetting basics, HTTP/TLS, packet analysis.
  - *Practical Goal:* Wireshark packet capture; trace DNS queries and 3-way TCP handshakes.
- **[Week 3 — Linux Fundamentals](02-linux/)**
  - Filesystem hierarchy, terminal commands, users & groups, file permissions (`chmod`, `chown`).
  - *Practical Goal:* Navigate and manipulate Linux systems purely through CLI.
- **[Week 4 — Linux Administration](02-linux/)**
  - Processes, services, SSH remote access, package management, system logs, environment variables.
  - *Practical Goal:* OverTheWire Bandit challenges; understand what is happening inside a Linux host.

---

### 💻 Month 2: Operating Systems & Programming (Weeks 5–8)
*Understand the technology attackers exploit and defenders safeguard.*

- **[Week 5 — Windows Fundamentals](03-windows/)**
  - Windows architecture, users & groups, NTFS permissions, processes & services, Event Viewer, PowerShell & Active Directory intro.
  - *Practical Goal:* Understand Windows access control, process management, and Active Directory objects.
- **[Week 6 — Python & Bash Scripting](04-programming/)**
  - Data types, loops, functions, file I/O, regex, JSON, Bash automation, basic PowerShell scripting.
  - *Practical Goal:* Build scripts automating administrative tasks and parsing security log files.
- **[Week 7 — Web Development & Application Architecture](05-web-security/)**
  - HTTP verbs (GET, POST, PUT, DELETE), cookies & sessions, JWT/auth, REST APIs, SQL databases.
  - *Practical Goal:* Understand how authentication and sessions work under the hood.
- **[Week 8 — Cybersecurity Fundamentals](05-web-security/)**
  - CIA Triad, threat vs vulnerability vs exploit, hashing vs encryption, risk assessment, Rules of Engagement (RoE).
  - *Practical Goal:* Understand scoping, authorized security testing methodologies, and NIST SP 800-115 standards.

---

### ⚔️ Month 3: Introduction to Red Team Methodology (Weeks 9–12)
*Connect technical knowledge with practical offensive security assessments.*

- **[Week 9 — Network Reconnaissance](06-red-team/)**
  - Network discovery, host enumeration, port states, service fingerprinting, Nmap scanning mechanics.
  - *Practical Goal:* Audit and map local lab machine services with Nmap and Wireshark.
- **[Week 10 — Web Application Security](05-web-security/)**
  - OWASP Top 10, SQL injection, XSS, Broken Access Control (IDOR), Burp Suite intercepting proxy.
  - *Practical Goal:* Complete beginner PortSwigger Web Security Academy labs.
- **[Week 11 — Red Team Concepts & MITRE ATT&CK](06-red-team/)**
  - Red vs Blue vs Purple teams, threat modeling, Cyber Kill Chain, MITRE ATT&CK tactics & techniques.
  - *Practical Goal:* Map adversary behaviors using MITRE ATT&CK matrix.
- **[Week 12 — Capstone Security Assessment Project](06-red-team/lab-reports/)**
  - Build a controlled security testing lab using OWASP Juice Shop.
  - Scope definition, recon, finding vulnerabilities, documenting proof-of-concept, writing remediation report.

---

## 📝 4. Documentation Standard (The 5 Core Questions)

For every topic documented in this repository, answer:
1. **What is it?** (Clear definition)
2. **How does it work?** (Underlying architecture & protocols)
3. **Why does a security professional need it?** (Offensive & defensive perspective)
4. **What did I practise?** (Commands run, screenshots, or scripts executed)
5. **What did I learn from the exercise?** (Key takeaways & insights)

---

## 🗂️ 5. Repository Structure

```
red-team-foundations/
│
├── 01-networking/               # Weeks 1-2: Networking & Packet Analysis
│   ├── day-01-networking-fundamentals.md
│   ├── osi-model.md
│   ├── tcp-ip.md
│   └── dns.md
│
├── 02-linux/                    # Weeks 3-4: Linux Fundamentals & Administration
│   ├── commands.md
│   └── permissions.md
│
├── 03-windows/                  # Week 5: Windows Architecture & PowerShell
│   ├── windows-basics.md
│   └── powershell.md
│
├── 04-programming/              # Week 6: Python & Bash Scripting Automation
│   ├── python.md
│   └── bash.md
│
├── 05-web-security/             # Weeks 7, 8, 10: Web Apps, HTTP & OWASP Top 10
│   ├── http.md
│   └── owasp.md
│
├── 06-red-team/                 # Weeks 9, 11, 12: Recon, MITRE ATT&CK & Labs
│   ├── mitre-attack.md
│   └── lab-reports/             # Capstone & lab assessments
│
├── daily-logs/                  # Daily Journal Entries
├── templates/                   # Reusable Study & Report Templates
│   ├── daily-study-template.md
│   └── lab-report-template.md
│
└── tracker/                     # 🚀 Integrated Web App (Daily Writer & Git Sync)
```

---

## 🚀 6. Web Application: Red Team Command Center & Journal

This repository comes with an integrated **Web Application** designed for:
- ✍️ Writing daily notes in Markdown with live preview.
- 💾 Auto-saving and managing local drafts.
- 🚀 **1-Click Post to GitHub** (automatically commits and pushes directly to this repository!).
- ⏱️ 30-Minute Daily Protocol Timer (5m Revision, 15m Study, 10m Practice).
- 🗺️ Interactive 90-Day Roadmap Checklist.

To run the Web App locally:
```bash
cd tracker
npm install
npm start
# Opens at http://localhost:3000
```
