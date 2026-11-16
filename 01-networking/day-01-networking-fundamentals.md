# Day 01: Computer & Networking Fundamentals

- **Date:** 2026-11-16
- **Module:** `01-networking`
- **Track:** Red Team Foundation Roadmap (Day 1 of 90)
- **Status:** Completed
- **Session Focus:** Client-Server Architecture, IP & MAC Addresses, DNS Resolution

---

## 1. What is it?
Computer networking is the interconnected system of computing devices exchanging data over communication links. 

On Day 1, we focus on three core building blocks:
1. **Client-Server Architecture:** A distributed computing framework where service requestors (*clients*, e.g., web browser, mobile app, API caller) communicate with centralized service providers (*servers*, e.g., Nginx, Apache, Node.js backend).
2. **Addressing (IP vs MAC):**
   - **MAC Address (Media Access Control):** Hardware Layer-2 physical identifier burned into the Network Interface Card (NIC) (e.g. `00:1A:2B:3C:4D:5E`), used for local communication inside a LAN segment.
   - **IP Address (Internet Protocol):** Logical Layer-3 routable identifier (IPv4 e.g. `142.250.190.46` or IPv6) assigned to identify host interfaces across interconnected networks.
3. **DNS (Domain Name System):** The distributed hierarchical naming service that translates human-readable hostnames (such as `google.com`) into computer-routable IP addresses.

---

## 2. How does it work?

### Client-Server Interaction Flow
```
+----------------+                       +----------------+
|  Client (Host) |                       | Web Server     |
|  Browser / CLI |                       | Port 80 / 443  |
+--------+-------+                       +--------+-------+
         |                                        ^
         | 1. SYN (Port 443)                      |
         +--------------------------------------->|
         |                                        |
         | 2. SYN-ACK                             |
         |<---------------------------------------+
         |                                        |
         | 3. ACK (Connection Established)        |
         +--------------------------------------->|
         |                                        |
         | 4. HTTP GET / Request Payload          |
         +--------------------------------------->|
         |                                        |
         | 5. HTTP 200 OK + Data                  |
         |<---------------------------------------+
```

### DNS Resolution Mechanics
When querying a new domain:
1. Local resolver checks OS cache and hosts file (`/etc/hosts`).
2. If absent, the query goes to the Recursive DNS Resolver (e.g., ISP, `8.8.8.8`, `1.1.1.1`).
3. Recursive resolver queries the Root Nameserver (`.`).
4. Root directs to Top-Level Domain (TLD) Nameserver (`.com`).
5. TLD nameserver directs to the Authoritative Nameserver for `google.com`.
6. Authoritative server returns the A/AAAA record (IP address) to the client.

### What happens when you open `google.com` (5-Line Summary):
1. **Input & Resolution:** You enter `https://google.com` in the browser; the browser parses the URL, checks its cache, and sends a DNS query to find Google's IP address.
2. **ARP & Local Routing:** If communicating outside the subnet, your machine issues an ARP query to get the default gateway router's MAC address and encapsulates the packet into an Ethernet frame.
3. **TCP 3-Way Handshake & TLS:** Your client initiates a TCP handshake (SYN, SYN-ACK, ACK) on port 443, followed by the TLS handshake to negotiate cryptographic keys and authenticate Google's certificate.
4. **HTTP Request Transmission:** The browser encrypts and dispatches an HTTP `GET /` request over the established secure TLS tunnel.
5. **Server Processing & DOM Render:** Google's web servers process the request, return an HTTP `200 OK` response with HTML/CSS/JS assets, and the browser parses the DOM to render the search page.

---

## 3. Why does a security professional need it?
Offensive operators and Red Teamers rely heavily on these core fundamentals:
- **Reconnaissance & Asset Discovery:** Understanding DNS records (A, CNAME, TXT, MX, NS) allows attackers to perform Subdomain Enumeration, discover hidden internal portals, and identify misconfigured cloud assets.
- **Spoofing & Man-in-the-Middle (MitM):** Attackers leverage weaknesses in unauthenticated protocols (e.g. ARP Spoofing on a LAN, DNS Cache Poisoning, Rogue DHCP) to intercept credentials or redirect targets.
- **Command & Control (C2):** Red Team C2 beacons frequently use DNS Tunneling or HTTPS Client-Server traffic to exfiltrate data and receive instructions disguised as legitimate business web traffic.
- **Firewall & Egress Filtering Evasion:** Knowing which ports (80, 443, 53) are commonly permitted through enterprise egress firewalls helps operators maintain persistent remote access.

---

## 4. What did I practise?
Ran command-line diagnostic tools to inspect local addressing and DNS resolution:

```bash
# 1. Inspecting local network interfaces and MAC address
ip addr show

# 2. Testing DNS resolution for google.com
dig google.com +noall +answer

# 3. Tracing DNS resolution hierarchy
nslookup google.com 8.8.8.8

# 4. Checking default gateway and ARP cache
ip route show
arp -n
```

- Observations:
  - `dig google.com +noall +answer` returned Google's IPv4 `A` record within 12ms.
  - Gateway MAC address was properly resolved in the local ARP table.

---

## 5. What did I learn from the exercise?
- **Key Takeaway:** An IP address gets a packet across global networks (routing), but a MAC address delivers the packet from hop to hop inside physical network segments.
- **Insight:** Security tooling without foundational networking understanding is just "button clicking". Recognizing how DNS, ARP, and TCP interact exposes every potential interception and inspection point.
- **Next Target:** Day 2 - Deep dive into OSI vs TCP/IP models, TCP flags, UDP behavior, and Wireshark packet dissection.
