# Day 02: LAN, WAN, Routers, Switches, and Gateways

- **Date:** 2026-11-17
- **Module:** `01-networking`
- **Track:** Red Team Foundation Roadmap (Day 2 of 90)
- **Status:** Completed

---

## 1. What is it?
LANs connect hosts locally inside a single broadcast domain, while WANs interconnect geographically distributed networks across ISPs.

---

## 2. How does it work?
Switches forward frames using Layer 2 MAC addresses (CAM table), while routers inspect Layer 3 IP headers and route packets between subnets using routing protocols.

---

## 3. Why does a security professional need it?
Red Teamers target Layer 2 broadcast domains with ARP cache poisoning and MAC table flooding to intercept traffic and position themselves as Man-in-the-Middle.

---

## 4. What did I practise?
```bash
ip route show
arp -a
```

---

## 5. What did I learn from the exercise?
Switches isolate collision domains but do not isolate broadcast domains without VLAN segmentation.
