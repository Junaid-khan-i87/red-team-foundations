# OSI Model vs TCP/IP Protocol Suite

- **Module:** `01-networking`
- **Topic:** OSI 7 Layers & TCP/IP 4-Layer Architecture

---

## 1. What is it?
The OSI (Open Systems Interconnection) reference model and TCP/IP protocol suite provide standard conceptual frameworks for network communication.

| OSI Layer | Name | TCP/IP Equivalent | Protocols & Data Unit |
|---|---|---|---|
| 7 | Application | Application | HTTP, DNS, SSH, FTP (Data) |
| 6 | Presentation | Application | TLS/SSL, JPEG, ASCII (Data) |
| 5 | Session | Application | NetBIOS, RPC (Data) |
| 4 | Transport | Transport | TCP, UDP (Segment / Datagram) |
| 3 | Network | Internet | IP, ICMP, IPSec (Packet) |
| 2 | Data Link | Network Access | Ethernet, ARP, VLAN (Frame) |
| 1 | Physical | Network Access | Fiber, Cat6, Radio RF (Bits) |

---

## 2. How does it work?
- **Encapsulation (Sender):** Data is passed down the stack; each layer prepends headers containing control metadata (ports at L4, IP addresses at L3, MAC addresses at L2).
- **Decapsulation (Receiver):** As bits hit the receiver NIC, each layer strips its corresponding header, validates integrity (FCS checksums), and forwards the payload up.

---

## 3. Why does a security professional need it?
- Attacks occur at distinct layers:
  - Layer 2: ARP Poisoning, MAC flooding, VLAN hopping.
  - Layer 3: IP spoofing, ICMP tunneling, routing attacks (BGP hijacking).
  - Layer 4: SYN Flood DoS, port scanning, TCP session hijacking.
  - Layer 7: SQLi, XSS, CSRF, HTTP smuggling, API authorization bypasses.
- Red Teamers choose their attack vector based on which layer bypasses perimeter inspection.

---

## 4. What did I practise?
- Observed packet encapsulation using Wireshark and `tcpdump`.
- Command:
  ```bash
  sudo tcpdump -i any -c 5 -nn
  ```

---

## 5. What did I learn from the exercise?
- Encapsulation guarantees that higher layers don't need to know physical transmission media, making internet routing universally compatible.
