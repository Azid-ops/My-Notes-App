export const identifyHash = (hash: string) => {
  const cleanHash = hash.trim().replace(/\s/g, ""); // Spaces khatam karne ke liye
  const len = cleanHash.length;

  const patterns = [
    // --- Specific Formats (Prefix based) ---
    { name: "Net-NTLMv2", regex: /^(.+)::(.*?):[0-9a-fA-F]{10,16}:[0-9a-fA-F]+:[0-9a-fA-F]+$/, mode: "5600", john: "netntlmv2", color: "text-red-500" },
    { name: "Kerberoast (TGS-REP)", regex: /^\$krb5tgs\$23\$.+$/, mode: "13100", john: "krb5tgs", color: "text-yellow-400" },
    { name: "AS-REP Roasting", regex: /^\$krb5asrep\$23\$.+$/, mode: "18200", john: "krb5asrep", color: "text-purple-400" },
    { name: "SHA-512 Crypt (Linux)", regex: /^\$6\$.+$/, mode: "1800", john: "sha512crypt", color: "text-green-400" },
    { name: "Bcrypt", regex: /^\$2[ayb]\$.+$/, mode: "3200", john: "bf", color: "text-pink-400" },
    { name: "MySQL 4.1+", regex: /^\*[0-9a-fA-F]{40}$/, mode: "300", john: "mysql-sha1", color: "text-cyan-400" },
    { name: "MSSQL 2012+", regex: /^0x0200[0-9a-fA-F].+$/, mode: "1731", john: "mssql12", color: "text-indigo-600" },
    { name: "Zip (PKZIP)", regex: /^\$pkzip\$.+$/, mode: "17200", john: "pkzip", color: "text-amber-500" }
  ];

  // 1. First try Exact Regex Match
  for (const p of patterns) {
    if (p.regex.test(cleanHash)) return p;
  }

  // 2. Fallback: Identify by Length (For Raw/Hex Hashes)
  if (/^[0-9a-fA-F]+$/.test(cleanHash)) {
    if (len === 32) return { name: "NTLM / MD5", mode: "1000", john: "nt", color: "text-blue-400" };
    if (len === 40) return { name: "SHA-1", mode: "100", john: "raw-sha1", color: "text-orange-400" };
    if (len === 48) return { name: "MD5-Salt / SHA-1", mode: "10", john: "md5", color: "text-teal-400" };
    if (len === 56) return { name: "SHA-224", mode: "1300", john: "raw-sha224", color: "text-yellow-200" };
    if (len >= 50 && len <= 64) return { name: "SHA-256 / Raw Hex", mode: "1400", john: "raw-sha256", color: "text-teal-400" };
    if (len === 128) return { name: "SHA-512", mode: "1700", john: "raw-sha512", color: "text-green-600" };
  }

  return { 
    name: "Unknown / Raw", 
    mode: "???", 
    john: "???", 
    color: "text-gray-500" 
  };
};