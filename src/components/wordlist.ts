export const WORDLISTS = [
  { 
    category: "Subdomain Enumeration", 
    lists: [
      { name: "Top 1M Subdomains", path: "/usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt", tool: "Subfinder / Amass" },
      { name: "Deep Bruteforce (5000)", path: "/usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt", tool: "Gobuster / ffuf" },
      { name: "Common DNS", path: "/usr/share/seclists/Discovery/DNS/namelist.txt", tool: "Nmap DNS-Brute" },
      { name: "Wildcard Subdomains", path: "/usr/share/seclists/Discovery/DNS/sortedcombined-nm-600.txt", tool: "Amass / PureDNS" },
      { name: "Cloud Assets", path: "/usr/share/seclists/Discovery/DNS/cloud-prefixes.txt", tool: "Cloud Discovery" }
    ]
  },
  { 
    category: "Web Fuzzing (Directories)", 
    lists: [
      { name: "Common", path: "/usr/share/wordlists/dirb/common.txt", tool: "Gobuster / Dirsearch" },
      { name: "Directory Medium 2.3", path: "/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt", tool: "ffuf / Feroxbuster" },
      { name: "Big List", path: "/usr/share/wordlists/dirb/big.txt", tool: "Gobuster" },
      { name: "Raft Medium Files", path: "/usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt", tool: "ffuf" }
    ]
  },
  { 
    category: "Passwords & Brute Force", 
    lists: [
      { name: "RockYou", path: "/usr/share/wordlists/rockyou.txt", tool: "Hashcat / John" },
      { name: "Fasttrack", path: "/usr/share/wordlists/fasttrack.txt", tool: "Metasploit / Nmap" },
      { name: "Default Credentials", path: "/usr/share/seclists/Passwords/Default-Credentials/everything.txt", tool: "Hydra" },
      { name: "Top 10k Passwords", path: "/usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt", tool: "Brute Force" }
    ]
  },
  { 
    category: "Active Directory & Users", 
    lists: [
      { name: "Usernames Top 1k", path: "/usr/share/seclists/Usernames/top-usernames-shortlist.txt", tool: "Kerbrute / Hydra" },
      { name: "Common Names", path: "/usr/share/seclists/Usernames/Names/names.txt", tool: "AS-REP Roasting" },
      { name: "AD Specific", path: "/usr/share/seclists/Usernames/xato-net-10-million-usernames.txt", tool: "User Spraying" }
    ]
  },
  { 
    category: "Vulnerability Payloads", 
    lists: [
      { name: "LFI Payloads", path: "/usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt", tool: "ffuf / Burp" },
      { name: "XSS Payloads", path: "/usr/share/seclists/Fuzzing/XSS/XSS-Jhaddix.txt", tool: "Manual / Burp" },
      { name: "Parameters", path: "/usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt", tool: "Arjun / ffuf" }
    ]
  }
];