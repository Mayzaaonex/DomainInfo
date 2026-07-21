# Domain Info

<p align="center">
  <img src="https://img.shields.io/badge/Author-Mayzaa-green?style=for-the-badge" alt="Author">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Node.js-24.x-brightgreen?style=for-the-badge" alt="Node.js">
  <img src="https://img.shields.io/npm/v/axios?label=axios&style=for-the-badge" alt="Axios">
</p>

<p align="center">
  Domain Information Lookup - DNS, IP, SSL, MX, NS, Geolocation.
  <br>
  Get complete domain info in clean JSON format.
</p>

---

## 📸 Screenshot

<p align="center">
  <img src="https://raw.githubusercontent.com/Mayzaaonex/Screenshoot-project/main/domaininfo.png" alt="Domain Info Screenshot" width="700">
</p>

---

## 📦 Installation

```bash
git clone https://github.com/Mayzaaonex/domain-info.git
cd domain-info
npm install
```

## 📚 Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| [axios](https://www.npmjs.com/package/axios) | ^1.7.0 | HTTP Client |

---

## 🚀 Usage

### Command Line

```bash
node domaininfo.js <domain>
```

**Examples:**

```bash
node domaininfo.js google.com
node domaininfo.js github.com
node domaininfo.js api.mayzaa.my.id
```

### As Module

```js
const { lookup } = require('./domaininfo');

lookup('google.com').then(console.log);
```

---

## 📤 Output

### Success

```json
{
  "author": "Mayzaa",
  "success": true,
  "domain": "google.com",
  "dns": [
    { "type": "A", "value": "142.250.80.78", "ttl": 300 },
    { "type": "AAAA", "value": "2607:f8b0:4006:81d::200e", "ttl": 300 }
  ],
  "ip": [
    { "ip": "142.250.80.78", "type": "IPv4" },
    { "ip": "2607:f8b0:4006:81d::200e", "type": "IPv6" }
  ],
  "mx": [
    { "priority": 10, "server": "smtp.google.com" }
  ],
  "ns": [
    "ns1.google.com",
    "ns2.google.com"
  ],
  "ssl": {
    "issuer": "WR2",
    "valid_from": "2026-06-30T00:00:00Z",
    "valid_to": "2026-09-22T23:59:59Z",
    "alternative_names": ["*.google.com", "google.com"]
  },
  "geo": {
    "ip": "142.250.80.78",
    "country": "United States",
    "countryCode": "US",
    "city": "Mountain View",
    "isp": "Google LLC",
    "timezone": "America/Los_Angeles",
    "coordinates": { "lat": 37.4223, "lon": -122.085 }
  }
}
```

### Error

```json
{
  "author": "Mayzaa",
  "success": false,
  "error": "getaddrinfo ENOTFOUND invalid.domain"
}
```

---

## ✨ Features

- ✅ DNS Records (A, AAAA, MX, NS, TXT, CNAME)
- ✅ IP Addresses (IPv4 + IPv6)
- ✅ MX Mail Server Records
- ✅ NS Name Server Records
- ✅ SSL Certificate Information
- ✅ IP Geolocation (Country, City, ISP, Coordinates)
- ✅ Clean JSON Output
- ✅ CLI & Module Support

## 🧪 Test on Scraper Tester

```js
const axios = require('axios');

async function chat(prompt) {
  const domain = prompt.trim() || 'google.com';
  const { data } = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`);
  const ips = (data.Answer || []).map(r => ({ ip: r.data }));
  const geo = await axios.get(`http://ip-api.com/json/${ips[0]?.ip}`);
  return { domain, ips, geo: { country: geo.data.country, city: geo.data.city, isp: geo.data.isp } };
}

module.exports = { chat };
```

## 🔗 Related Projects

- [IP Locations](https://github.com/Mayzaaonex/iplocations) - IP Geolocation Lookup
- [AI Scraper Tester](https://scraper.mayzaa.my.id) - Test scraper scripts online

## 👤 Author

**Mayzaa** - [GitHub](https://github.com/Mayzaaonex)

## 📄 License

MIT © 2026 Mayzaa
