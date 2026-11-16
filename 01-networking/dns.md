# DNS Fundamentals & Zone Reconnaissance

- **Module:** `01-networking`
- **Topic:** Domain Name System & Record Types

---

## 1. What is it?
The Domain Name System (DNS) resolves human-friendly names (e.g., `example.com`) to machine-usable IP addresses, mail servers, and domain verification records.

Common record types:
- `A` / `AAAA`: Hostname to IPv4 / IPv6
- `CNAME`: Canonical Name (alias)
- `MX`: Mail Exchange server
- `TXT`: Text metadata (used for SPF, DKIM, domain ownership validation)
- `NS`: Authoritative Name Server
- `SOA`: Start of Authority (zone serial number, TTL)
- `PTR`: Reverse DNS lookup (IP to hostname)

---

## 2. How does it work?
DNS queries operate primarily over UDP port 53 for speed, falling back to TCP port 53 for responses exceeding 512 bytes or during full Zone Transfers (AXFR).

---

## 3. Why does a security professional need it?
- **Subdomain Enumeration:** Revealing dev/staging subdomains (`dev.example.com`, `vpn.example.com`, `admin.example.com`).
- **Zone Transfer (AXFR) Misconfiguration:** If a DNS server allows unrestricted AXFR queries, an attacker can download the entire internal DNS zone map in one command.
- **DNS Tunneling:** Red team C2 channels can encode exfiltrated data into subdomain requests (`<base64-secret>.attacker-c2.com`).

---

## 4. What did I practise?
```bash
dig axfr @ns1.example.com target.domain
dig TXT target.domain +short
```

---

## 5. What did I learn from the exercise?
- DNS is one of the richest information gathering sources during initial OSINT and passive reconnaissance.
