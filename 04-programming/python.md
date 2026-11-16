# Python Scripting for Security Automation

- **Module:** `04-programming`
- **Topic:** Sockets, HTTP requests, log parsing, automated scanning

---

## 1. What is it?
Python is the de facto scripting language in cybersecurity for writing rapid exploit proofs-of-concept, interacting with APIs, parsing raw network packet pcaps, and automating fuzzing.

---

## 2. How does it work?
Leverages rich standard libraries (`socket`, `subprocess`, `re`, `json`) and third-party modules (`requests`, `scapy`, `pwntools`) to automate network and system tasks.

---

## 3. Why does a security professional need it?
Red Teamers constantly encounter custom targets where existing tools fail. Writing a custom 20-line Python script to automate token extraction or brute-force a proprietary API endpoint saves hours.

---

## 4. What did I practise?
Simple port banner grabber:
```python
import socket

target = "127.0.0.1"
port = 80

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(2.0)
try:
    s.connect((target, port))
    s.send(b"HEAD / HTTP/1.0\r\n\r\n")
    banner = s.recv(1024)
    print(banner.decode())
finally:
    s.close()
```

---

## 5. What did I learn from the exercise?
- Python's simplicity allows rapid prototype development before converting to compiled C/C# or Go for evasion.
