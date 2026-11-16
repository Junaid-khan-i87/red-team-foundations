# MITRE ATT&CK Framework & Adversary Tactics

- **Module:** `06-red-team`
- **Topic:** Adversary Tactics, Techniques, and Common Knowledge (ATT&CK)

---

## 1. What is it?
MITRE ATT&CK is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. It categorizes the entire cyber attack lifecycle from initial access to objective execution.

---

## 2. How does it work?
Organized into 14 Enterprise Tactics:
1. Reconnaissance (TA0043)
2. Resource Development (TA0042)
3. Initial Access (TA0001)
4. Execution (TA0002)
5. Persistence (TA0003)
6. Privilege Escalation (TA0004)
7. Defense Evasion (TA0005)
8. Credential Access (TA0006)
9. Discovery (TA0007)
10. Lateral Movement (TA0008)
11. Collection (TA0009)
12. Command and Control (TA0011)
13. Exfiltration (TA0010)
14. Impact (TA0040)

---

## 3. Why does a security professional need it?
- Red Teams use ATT&CK to plan realistic threat emulation engagements replicating specific Advanced Persistent Threat (APT) groups (e.g. APT29, Lazarus).
- Blue Teams use it to benchmark defensive detection telemetry and identify blind spots.
- Purple Teams use it to test and validate detection engineering rules collaboratively.

---

## 4. What did I practise?
- Navigated the ATT&CK Navigator matrix (https://mitre-attack.github.io/attack-navigator/).
- Mapped a simulated phishing scenario through Initial Access (T1566) -> Execution (T1204) -> Persistence (T1547).

---

## 5. What did I learn from the exercise?
- Real-world attacks are chains of techniques across multiple tactics, not isolated exploits.
