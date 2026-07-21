/**
 * Domain Info - DNS, IP, SSL, Geo
 * Author: Mayzaa
 * Usage: node domaininfo.js api.mayzaa.my.id
 */

const axios = require('axios');

async function lookup(domain) {
  try {
    domain = domain.replace(/https?:\/\//, '').replace(/\/$/, '');

    const dnsRes = await axios.get(`https://dns.google/resolve?name=${domain}&type=ANY`, { timeout: 10000 });
    const typeMap = { 1: 'A', 28: 'AAAA', 15: 'MX', 2: 'NS', 16: 'TXT', 5: 'CNAME', 13: 'HINFO' };
    const dnsRecords = (dnsRes.data.Answer || []).map(r => ({
      type: typeMap[r.type] || `TYPE${r.type}`,
      value: r.data,
      ttl: r.TTL
    }));

    const ipRes = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`, { timeout: 10000 });
    const ipv6Res = await axios.get(`https://dns.google/resolve?name=${domain}&type=AAAA`, { timeout: 10000 });
    const ipAddresses = [
      ...(ipRes.data.Answer || []).filter(r => r.type === 1).map(r => ({ ip: r.data, type: 'IPv4' })),
      ...(ipv6Res.data.Answer || []).filter(r => r.type === 28).map(r => ({ ip: r.data, type: 'IPv6' }))
    ];

    let mxRecords = [];
    try {
      const mxRes = await axios.get(`https://dns.google/resolve?name=${domain}&type=MX`, { timeout: 10000 });
      mxRecords = (mxRes.data.Answer || []).map(r => {
        const parts = r.data.split(' ');
        return { priority: parseInt(parts[0]), server: parts[1]?.replace(/\.$/, '') };
      });
    } catch {}

    let nsRecords = [];
    try {
      const nsRes = await axios.get(`https://dns.google/resolve?name=${domain}&type=NS`, { timeout: 10000 });
      nsRecords = (nsRes.data.Answer || []).map(r => r.data.replace(/\.$/, ''));
    } catch {}

    let sslInfo = null;
    try {
      const sslRes = await axios.get(
        `https://api.certspotter.com/v1/issuances?domain=${domain}&expand=dns_names&expand=issuer`,
        { timeout: 10000 }
      );
      const cert = sslRes.data?.[0];
      if (cert) {
        sslInfo = {
          issuer: cert.issuer?.name || null,
          valid_from: cert.not_before || null,
          valid_to: cert.not_after || null,
          serial_number: cert.serial_number || null,
          fingerprint_sha256: cert.sha256 || null,
          alternative_names: cert.dns_names || []
        };
      }
    } catch {}

    let geoInfo = null;
    const firstIPv4 = ipAddresses.find(ip => ip.type === 'IPv4');
    if (firstIPv4) {
      try {
        const geoRes = await axios.get(`http://ip-api.com/json/${firstIPv4.ip}`, { timeout: 10000 });
        if (geoRes.data.status === 'success') {
          geoInfo = {
            ip: geoRes.data.query,
            country: geoRes.data.country,
            countryCode: geoRes.data.countryCode,
            region: geoRes.data.regionName,
            city: geoRes.data.city,
            zip: geoRes.data.zip,
            isp: geoRes.data.isp,
            org: geoRes.data.org,
            timezone: geoRes.data.timezone,
            coordinates: { lat: geoRes.data.lat, lon: geoRes.data.lon }
          };
        }
      } catch {}
    }

    return {
      success: true,
      domain,
      dns: dnsRecords,
      ip: ipAddresses,
      mx: mxRecords,
      ns: nsRecords,
      ssl: sslInfo,
      geo: geoInfo
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { lookup };

if (require.main === module) {
  const domain = process.argv[2] || 'api.mayzaa.my.id';
  lookup(domain).then(r => console.log(JSON.stringify({ author: 'Mayzaa', ...r }, null, 2)));
}
