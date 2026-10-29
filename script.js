"use strict";

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

document.getElementById("year").textContent = new Date().getFullYear();

// Small status message
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

// Resume data used by the PDF generator
const resumeSections = [
  ["PROFESSIONAL SUMMARY", [
    "Computer Science undergraduate with hands-on SOC operations practice demonstrated through a Top 2 percent TryHackMe global ranking in the Platinum League and simulated alert triage on LetsDefend. Built a Java-based SIEM prototype with rule-based threat detection and Windows Event Log analysis concepts. Skilled in phishing investigation, MITRE ATT&CK mapping, IOC extraction, and incident documentation. Trained through the Google Cybersecurity Certificate pathway. Seeking a SOC L1 Analyst role. Available for 24/7 rotational shifts."
  ]],
  ["TECHNICAL SKILLS", [
    "Security Operations: Alert triage, incident response, phishing analysis, log correlation, threat intelligence, IOC extraction, MITRE ATT&CK, Blue Team operations.",
    "SIEM and Monitoring: Java Mini-SIEM, Windows Event Logs, Wazuh, Splunk fundamentals, Sysmon, Windows Event Viewer, Linux logs.",
    "Network Security: TCP/IP, DNS, DHCP, Wireshark, Nmap, firewall rule creation, OWASP Top 10.",
    "Tools and Scripting: Java, PowerShell, Bash, SQL, SQLite, Git, GitHub, VS Code, VirtualBox, VMware.",
    "Operating Systems: Windows client/server, Ubuntu, Debian, Linux permissions, system hardening fundamentals."
  ]],
  ["CYBERSECURITY PROJECTS", [
    "Java-Based Mini-SIEM Detection Engine | Personal Project",
    "Technologies: Java, SQLite, JavaFX, Windows Event Logs, MITRE ATT&CK.",
    "- Developed a Java prototype to ingest and parse Windows Event Logs, applying event-processing and log-normalization concepts.",
    "- Implemented rule-based detection scenarios for suspicious authentication failures and potential privilege escalation activity.",
    "- Mapped relevant scenarios to MITRE ATT&CK T1078 (Valid Accounts) and T1134 (Access Token Manipulation).",
    "- Designed SQLite persistence for historical event analysis and a JavaFX dashboard for event visualization.",
    "Phishing Incident Analysis Lab | Personal Project",
    "- Investigated suspicious emails by reviewing headers, URLs, and attachments.",
    "- Extracted sender domains, suspicious URLs, and file hashes and documented findings in incident reports.",
    "- Mapped phishing scenarios to MITRE ATT&CK T1566.001 (Spearphishing Attachment).",
    "Windows Firewall Security Lab | Personal Project",
    "- Configured Windows Defender Firewall inbound and outbound rules using PowerShell.",
    "- Tested rule behavior against simulated network access scenarios and reviewed enforcement outcomes."
  ]],
  ["PRACTICAL EXPERIENCE", [
    "LetsDefend — SOC Simulation",
    "- Triaged simulated alerts involving malware, ransomware, brute-force activity, privilege escalation, and unauthorized access.",
    "- Practiced evidence review, threat classification, incident closure, and SOC escalation procedures.",
    "Mastercard Cybersecurity Job Simulation — Forage",
    "- Analyzed simulated security incidents, considered possible causes and containment actions, and documented remediation recommendations."
  ]],
  ["CERTIFICATIONS AND TRAINING", [
    "Google Cybersecurity Certificate Pathway (Coursera): Foundations of Cybersecurity; Play It Safe: Manage Security Risks; Connect and Protect: Networks and Network Security; Tools of the Trade: Linux and SQL.",
    "Mastercard Cybersecurity Job Simulation — Forage."
  ]],
  ["ACHIEVEMENTS", [
    "TryHackMe Top 2 percent global ranking; Platinum League; Capability Score 55; highest practice streak of 84 days.",
    "Badges: SOC Apprentice, First Step into SOC, Shield Apprentice, Defensive Toolsmith, Networking Nerd, and Pentester Tools."
  ]],
  ["EDUCATION", [
    "B.E. Computer Science — DIT University. Expected graduation: June 2027.",
    "Intermediate — Science, Evergreen Senior Secondary School, 2023."
  ]]
];

document.getElementById("downloadResume").addEventListener("click", () => {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    showToast("PDF library did not load. Check your internet connection and retry.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const color = {
    navy: [23, 43, 77],
    green: [83, 139, 38],
    ink: [35, 43, 54],
    gray: [82, 96, 112],
    line: [205, 214, 224]
  };
  let y = 16;

  function checkSpace(height) {
    if (y + height > pageHeight - 15) {
      pdf.addPage();
      y = 16;
    }
  }

  function addText(text, options = {}) {
    const size = options.size || 8.3;
    const lineHeight = options.lineHeight || 4;
    pdf.setFont("helvetica", options.bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...(options.color || color.ink));

    const lines = pdf.splitTextToSize(text, contentWidth - (options.indent || 0));
    checkSpace(lines.length * lineHeight + 2);
    pdf.text(lines, margin + (options.indent || 0), y);
    y += lines.length * lineHeight + (options.after ?? 1.2);
  }

  function addHeading(title) {
    checkSpace(11);
    y += 1;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...color.navy);
    pdf.text(title, margin, y);
    y += 2;
    pdf.setDrawColor(...color.line);
    pdf.setLineWidth(0.35);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4;
  }

  function addBullet(text) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.1);
    const lines = pdf.splitTextToSize(text, contentWidth - 6);
    checkSpace(lines.length * 3.9 + 2);
    pdf.setTextColor(...color.green);
    pdf.text("•", margin + 1, y);
    pdf.setTextColor(...color.ink);
    pdf.text(lines, margin + 5, y);
    y += lines.length * 3.9 + 1;
  }

  // Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...color.navy);
  pdf.text("DEEPAK RAWAT", margin, y);
  y += 6;

  pdf.setFontSize(8.6);
  pdf.setTextColor(...color.green);
  pdf.text("SOC L1 ANALYST | SECURITY MONITORING AND INCIDENT TRIAGE", margin, y);
  y += 5;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...color.gray);

  const contacts = [
    "Rishikesh, Uttarakhand, India | +91-8791657089 | deepakrwt594@gmail.com",
    "LinkedIn: linkedin.com/in/deepak-rawatcybersecurity | GitHub: github.com/Deepak2652005",
    "TryHackMe: tryhackme.com/p/deepakrt594 | LetsDefend: letsdefend.io/user/Deepak575"
  ];

  contacts.forEach(line => {
    const lines = pdf.splitTextToSize(line, contentWidth);
    checkSpace(lines.length * 3.6 + 1);
    pdf.text(lines, margin, y);
    y += lines.length * 3.6;
  });

  y += 2;
  pdf.setDrawColor(...color.green);
  pdf.setLineWidth(0.7);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 3;

  // Main sections
  resumeSections.forEach(([title, lines]) => {
    addHeading(title);

    lines.forEach(line => {
      if (line.startsWith("- ")) {
        addBullet(line.slice(2));
      } else {
        const isHeading =
          /^(Java-Based|Phishing Incident|Windows Firewall|LetsDefend|Mastercard Cybersecurity)/.test(line);
        addText(line, {
          size: line.startsWith("Technologies:") ? 7.8 : 8.15,
          bold: isHeading,
          color: line.startsWith("Technologies:") ? color.gray : color.ink
        });
      }
    });
  });

  // Add page numbers to every page
  const pageCount = pdf.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page);
    pdf.setDrawColor(...color.line);
    pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(...color.gray);
    pdf.text("Deepak Rawat | SOC L1 Analyst", margin, pageHeight - 5.5);
    pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 5.5, { align: "right" });
  }

  pdf.save("Deepak_Rawat_SOC_L1_Analyst_Resume.pdf");
  showToast("Resume PDF generated and downloaded.");
});
