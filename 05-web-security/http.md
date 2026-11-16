# HTTP Protocol & Web Application Architecture

- **Module:** `05-web-security`
- **Topic:** HTTP Verbs, Headers, Cookies, Sessions, and REST APIs

---

## 1. What is it?
HTTP (Hypertext Transfer Protocol) is the stateless, application-layer protocol powering the World Wide Web.

Key elements:
- **Methods:** `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`, `HEAD`
- **Headers:** `Host`, `User-Agent`, `Cookie`, `Authorization`, `Content-Type`
- **Status Codes:** `2xx` (Success), `3xx` (Redirection), `4xx` (Client error), `5xx` (Server error)
- **State Management:** HTTP Cookies (`Set-Cookie: sessionid=...; Secure; HttpOnly; SameSite=Strict`)

---

## 2. How does it work?
Client establishes a TCP/TLS connection, transmits plaintext/framed HTTP requests, and the server returns headers plus payload body.

---

## 3. Why does a security professional need it?
Every web vulnerability (XSS, SQLi, CSRF, SSRF, IDOR) manipulates HTTP parameters, headers, or request flows. Intercepting proxies like Burp Suite allow Red Teamers to dissect and tamper with raw requests before they hit the backend.

---

## 4. What did I practise?
- Inspected raw headers using curl:
  ```bash
  curl -I -s https://example.com
  ```

---

## 5. What did I learn from the exercise?
- HTTP is completely stateless; session tokens and cookies are the only mechanism servers use to remember who you are. Compromising the token equals compromising the account.
