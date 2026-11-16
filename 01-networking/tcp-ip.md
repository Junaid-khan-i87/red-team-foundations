# TCP vs UDP Protocols

- **Module:** `01-networking`
- **Topic:** Transmission Control Protocol (TCP) and User Datagram Protocol (UDP)

---

## 1. What is it?
Layer-4 transport protocols responsible for host-to-host process communication:
- **TCP:** Connection-oriented, stateful, reliable protocol featuring 3-way handshaking, sequence acknowledgment, flow control, and retransmission.
- **UDP:** Connectionless, stateless, lightweight protocol optimized for low latency where dropped packets are acceptable (DNS queries, VoIP, streaming, gaming).

---

## 2. How does it work?
- **TCP 3-Way Handshake:**
  - Client sends `[SYN]` with sequence number $X$.
  - Server sends `[SYN-ACK]` with sequence number $Y$ and acknowledgment $X+1$.
  - Client sends `[ACK]` with acknowledgment $Y+1$.
- **TCP Teardown:** `[FIN] -> [ACK] -> [FIN] -> [ACK]` or abrupt termination via `[RST]`.
- **UDP Header:** Compact 8-byte header (Source Port, Destination Port, Length, Checksum) with zero handshaking.

---

## 3. Why does a security professional need it?
- **Port Scanning:** Tools like Nmap leverage TCP flags (`-sS` SYN Stealth Scan, `-sT` Full Connect Scan, `-sF` FIN Scan, `-sX` Xmas Scan) to infer open/closed ports based on firewall and OS response behavior (e.g. `RST` on closed ports).
- **Amplification Attacks:** UDP's stateless nature allows IP spoofing without handshakes, making it the primary vehicle for NTP, DNS, and SNMP reflection DDoS attacks.

---

## 4. What did I practise?
- Testing socket connections with `nc` (netcat):
  ```bash
  nc -zv 1.1.1.1 53    # TCP check
  nc -zvu 1.1.1.1 53   # UDP check
  ```

---

## 5. What did I learn from the exercise?
- TCP guarantees data integrity at the expense of handshake latency; UDP sacrifices delivery guarantees for extreme speed.
