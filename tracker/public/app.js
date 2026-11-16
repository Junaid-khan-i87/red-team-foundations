/**
 * Red Team Foundations // 90-Day Command Center & Journal
 * Frontend Engine
 */

// Application State
const state = {
  roadmap: null,
  progress: null,
  drafts: [],
  notes: [],
  currentDraftId: null,
  activeTab: 'studio',
  activeView: 'split',
  activePhaseFilter: 'all',
  
  // Timer State
  timer: {
    totalSeconds: 30 * 60, // 30 minutes = 1800s
    remainingSeconds: 30 * 60,
    isRunning: false,
    intervalId: null,
    currentPhase: 1 // 1: Recall (30-25m), 2: Study (25-10m), 3: Practice (10-0m)
  }
};

// Web Audio API Synthesizer (Zero external sound dependencies)
const soundFx = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playBeep(freq = 600, duration = 0.15, type = 'sine') {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { console.warn(e); }
  },
  playVictory() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch (e) { console.warn(e); }
  }
};

// DOM Elements
const dom = {
  // Tabs
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabPanes: document.querySelectorAll('.tab-pane'),

  // Studio Elements
  daySelect: document.getElementById('daySelect'),
  folderSelect: document.getElementById('folderSelect'),
  folderPrefixLabel: document.getElementById('folderPrefixLabel'),
  filenameInput: document.getElementById('filenameInput'),
  titleInput: document.getElementById('titleInput'),
  markdownEditor: document.getElementById('markdownEditor'),
  markdownPreview: document.getElementById('markdownPreview'),
  commitMsgInput: document.getElementById('commitMsgInput'),
  wordCountLabel: document.getElementById('wordCountLabel'),
  readingTimeLabel: document.getElementById('readingTimeLabel'),
  draftStatusText: document.getElementById('draftStatusText'),
  draftCountBadge: document.getElementById('draftCountBadge'),
  panesWrapper: document.getElementById('panesWrapper'),
  viewBtns: document.querySelectorAll('.view-btn'),

  // Studio Buttons
  btnLoad5Questions: document.getElementById('btnLoad5Questions'),
  btnLoadDay1: document.getElementById('btnLoadDay1'),
  btnLoadLabTemplate: document.getElementById('btnLoadLabTemplate'),
  btnClearEditor: document.getElementById('btnClearEditor'),
  btnSaveDraftManual: document.getElementById('btnSaveDraftManual'),
  btnOpenDraftsModal: document.getElementById('btnOpenDraftsModal'),
  btnPostToGitHub: document.getElementById('btnPostToGitHub'),
  btnCopyMarkdown: document.getElementById('btnCopyMarkdown'),

  // Roadmap Elements
  weeksAccordionContainer: document.getElementById('weeksAccordionContainer'),
  roadmapProgressBar: document.getElementById('roadmapProgressBar'),
  roadmapPercent: document.getElementById('roadmapPercent'),
  completedCountText: document.getElementById('completedCountText'),
  daysRemainingText: document.getElementById('daysRemainingText'),
  roadmapProgressBadge: document.getElementById('roadmapProgressBadge'),
  phaseBtns: document.querySelectorAll('.phase-btn'),

  // Timer Elements
  timerDisplay: document.getElementById('timerDisplay'),
  timerCurrentPhaseName: document.getElementById('timerCurrentPhaseName'),
  timerProgressCircle: document.getElementById('timerProgressCircle'),
  btnTimerToggle: document.getElementById('btnTimerToggle'),
  timerToggleIcon: document.getElementById('timerToggleIcon'),
  timerToggleText: document.getElementById('timerToggleText'),
  btnTimerReset: document.getElementById('btnTimerReset'),
  btnTimerSoundTest: document.getElementById('btnTimerSoundTest'),
  btnOpenTimerHeader: document.getElementById('btnOpenTimerHeader'),
  btnQuickNewNote: document.getElementById('btnQuickNewNote'),
  phaseBox1: document.getElementById('phaseBox1'),
  phaseBox2: document.getElementById('phaseBox2'),
  phaseBox3: document.getElementById('phaseBox3'),

  // Explorer Elements
  notesCountBadge: document.getElementById('notesCountBadge'),
  notesTreeContainer: document.getElementById('notesTreeContainer'),
  notesSearchInput: document.getElementById('notesSearchInput'),
  btnRefreshNotes: document.getElementById('btnRefreshNotes'),
  viewerPath: document.getElementById('viewerPath'),
  viewerContent: document.getElementById('viewerContent'),
  viewerActions: document.getElementById('viewerActions'),
  btnEditInStudio: document.getElementById('btnEditInStudio'),
  btnOpenOnGitHub: document.getElementById('btnOpenOnGitHub'),

  // Status & Settings Elements
  gitBranchVal: document.getElementById('gitBranchVal'),
  commitsList: document.getElementById('commitsList'),

  // Modals
  draftsModal: document.getElementById('draftsModal'),
  btnCloseDraftsModal: document.getElementById('btnCloseDraftsModal'),
  draftsListContainer: document.getElementById('draftsListContainer'),
  successModal: document.getElementById('successModal'),
  btnCloseSuccessModal: document.getElementById('btnCloseSuccessModal'),
  successFileLink: document.getElementById('successFileLink'),
  successCommitLink: document.getElementById('successCommitLink'),
  successDesc: document.getElementById('successDesc')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  // Render Lucide Icons
  lucide.createIcons();

  setupTabs();
  setupEditorEvents();
  setupTimer();
  setupModals();

  // Load Initial Data from Backend
  await Promise.all([
    loadRoadmap(),
    loadProgress(),
    loadDrafts(),
    loadNotes(),
    loadStatus()
  ]);

  // Check LocalStorage for unsaved draft
  restoreLocalDraft();

  // Periodic Auto-save every 5 seconds
  setInterval(autoSaveLocalDraft, 5000);
});

// ==========================================
// Tab Management
// ==========================================
function setupTabs() {
  dom.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  if (dom.btnOpenTimerHeader) {
    dom.btnOpenTimerHeader.addEventListener('click', () => switchTab('timer'));
  }
  if (dom.btnQuickNewNote) {
    dom.btnQuickNewNote.addEventListener('click', () => switchTab('studio'));
  }
}

function switchTab(tabName) {
  state.activeTab = tabName;
  dom.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  dom.tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `pane-${tabName}`);
  });
  lucide.createIcons();
}

// ==========================================
// Editor & Live Markdown Engine
// ==========================================
function setupEditorEvents() {
  // Live Markdown Rendering
  dom.markdownEditor.addEventListener('input', () => {
    renderMarkdown();
    updateEditorStats();
  });

  // Folder prefix updates
  dom.folderSelect.addEventListener('change', () => {
    const folder = dom.folderSelect.value;
    dom.folderPrefixLabel.textContent = `${folder}/`;
    updateCommitMessageSuggestion();
  });

  // Day dropdown change
  dom.daySelect.addEventListener('change', () => {
    const dayNum = parseInt(dom.daySelect.value, 10);
    if (!state.roadmap) return;
    const dayData = state.roadmap.days.find(d => d.day === dayNum);
    if (dayData) {
      dom.titleInput.value = dayData.title;
      dom.folderSelect.value = dayData.folder;
      dom.folderPrefixLabel.textContent = `${dayData.folder}/`;
      dom.filenameInput.value = dayData.file || `day-${String(dayNum).padStart(2, '0')}.md`;
      updateCommitMessageSuggestion();
    }
  });

  // Title changes
  dom.titleInput.addEventListener('input', () => {
    updateCommitMessageSuggestion();
  });

  // Filename input changes
  dom.filenameInput.addEventListener('input', () => {
    updateCommitMessageSuggestion();
  });

  // View modes
  dom.viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-view');
      setViewMode(mode);
    });
  });

  // Template buttons
  dom.btnLoad5Questions.addEventListener('click', () => {
    soundFx.playBeep(450, 0.08);
    insert5QuestionsTemplate();
  });

  dom.btnLoadDay1.addEventListener('click', () => {
    soundFx.playBeep(520, 0.1);
    loadDay1Kickoff();
  });

  dom.btnLoadLabTemplate.addEventListener('click', () => {
    soundFx.playBeep(400, 0.08);
    loadLabReportTemplate();
  });

  dom.btnClearEditor.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      dom.markdownEditor.value = '';
      renderMarkdown();
      updateEditorStats();
    }
  });

  dom.btnSaveDraftManual.addEventListener('click', () => {
    saveDraftToServer();
  });

  dom.btnOpenDraftsModal.addEventListener('click', () => {
    openDraftsModal();
  });

  dom.btnCopyMarkdown.addEventListener('click', () => {
    navigator.clipboard.writeText(dom.markdownEditor.value);
    dom.btnCopyMarkdown.innerHTML = `<i data-lucide="check"></i> Copied!`;
    lucide.createIcons();
    setTimeout(() => {
      dom.btnCopyMarkdown.innerHTML = `<i data-lucide="copy"></i> Copy`;
      lucide.createIcons();
    }, 2000);
  });

  // Post to GitHub Button
  dom.btnPostToGitHub.addEventListener('click', () => {
    publishNoteToGitHub();
  });

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (state.activeTab === 'studio') {
        e.preventDefault();
        publishNoteToGitHub();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      if (state.activeTab === 'studio') {
        e.preventDefault();
        saveDraftToServer();
      }
    }
  });
}

function renderMarkdown() {
  const rawText = dom.markdownEditor.value;
  if (!rawText.trim()) {
    dom.markdownPreview.innerHTML = `
      <div class="empty-state">
        <i data-lucide="eye" class="empty-icon"></i>
        <p>Live preview will appear here formatted with GitHub Flavored Markdown.</p>
      </div>`;
    lucide.createIcons();
    return;
  }
  dom.markdownPreview.innerHTML = marked.parse(rawText);
}

function updateEditorStats() {
  const text = dom.markdownEditor.value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  dom.wordCountLabel.textContent = `${words.toLocaleString()} words`;
  dom.readingTimeLabel.textContent = `${readingTime} min read`;
}

function setViewMode(mode) {
  state.activeView = mode;
  dom.viewBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === mode);
  });
  dom.panesWrapper.className = `studio-panes-wrapper ${mode}-mode`;
}

function updateCommitMessageSuggestion() {
  const day = dom.daySelect.value;
  const title = dom.titleInput.value.trim() || dom.filenameInput.value.trim();
  dom.commitMsgInput.value = `feat(notes): Day ${String(day).padStart(2, '0')} - ${title}`;
}

// Templates
function insert5QuestionsTemplate() {
  const day = dom.daySelect.value;
  const title = dom.titleInput.value.trim() || 'Concept Title';
  const folder = dom.folderSelect.value;
  const today = new Date().toISOString().split('T')[0];

  const template = `# ${title}

- **Date:** ${today}
- **Module:** \`${folder}\`
- **Track:** Red Team Foundation Roadmap (Day ${day} of 90)
- **Status:** In Progress / Completed
- **Session Duration:** 30 Minutes

---

## 1. What is it?
> Briefly define the concept or technology in simple, clear terms.

[Write definition here...]

---

## 2. How does it work?
> Explain the underlying architecture, mechanism, protocol flow, or data structure.

[Explain mechanics, diagrams, packet flows, or architecture here...]

---

## 3. Why does a security professional need it?
> Connect this technical foundation to offensive/defensive cybersecurity. How do attackers exploit it, or how do defenders monitor it?

[Explain the security perspective, attack vectors, or defense importance here...]

---

## 4. What did I practise?
> Document hands-on action: commands run, Wireshark packets analyzed, scripts executed, or challenges solved.

\`\`\`bash
# Commands executed during the 30-minute practice session
\`\`\`

- Observations:
  - 

---

## 5. What did I learn from the exercise?
> Key takeaways, mistakes made, "aha" moments, and one sentence summary of understanding.

- Key takeaway:
- What surprised me:
- Next step:
`;

  dom.markdownEditor.value = template;
  renderMarkdown();
  updateEditorStats();
}

function loadDay1Kickoff() {
  dom.daySelect.value = "1";
  dom.folderSelect.value = "01-networking";
  dom.folderPrefixLabel.textContent = "01-networking/";
  dom.filenameInput.value = "day-01-networking-fundamentals.md";
  dom.titleInput.value = "Client-Server Architecture, IP & MAC Addresses, DNS Intro";
  updateCommitMessageSuggestion();

  const day1Text = `# Day 01: Computer & Networking Fundamentals

- **Date:** 2026-11-16
- **Module:** \`01-networking\`
- **Track:** Red Team Foundation Roadmap (Day 1 of 90)
- **Status:** Completed
- **Session Focus:** Client-Server Architecture, IP & MAC Addresses, DNS Resolution

---

## 1. What is it?
Computer networking is the interconnected system of computing devices exchanging data over communication links. 

On Day 1, we focus on three core building blocks:
1. **Client-Server Architecture:** A distributed computing framework where service requestors (*clients*, e.g., web browser, mobile app, API caller) communicate with centralized service providers (*servers*, e.g., Nginx, Apache, Node.js backend).
2. **Addressing (IP vs MAC):**
   - **MAC Address (Media Access Control):** Hardware Layer-2 physical identifier burned into the Network Interface Card (NIC) (e.g. \`00:1A:2B:3C:4D:5E\`), used for local communication inside a LAN segment.
   - **IP Address (Internet Protocol):** Logical Layer-3 routable identifier (IPv4 e.g. \`142.250.190.46\` or IPv6) assigned to identify host interfaces across interconnected networks.
3. **DNS (Domain Name System):** The distributed hierarchical naming service that translates human-readable hostnames (such as \`google.com\`) into computer-routable IP addresses.

---

## 2. How does it work?

### Client-Server Interaction Flow
\`\`\`
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
\`\`\`

### DNS Resolution Mechanics
When querying a new domain:
1. Local resolver checks OS cache and hosts file (\`/etc/hosts\`).
2. If absent, the query goes to the Recursive DNS Resolver (e.g., ISP, \`8.8.8.8\`, \`1.1.1.1\`).
3. Recursive resolver queries the Root Nameserver (\`.\`).
4. Root directs to Top-Level Domain (TLD) Nameserver (\`.com\`).
5. TLD nameserver directs to the Authoritative Nameserver for \`google.com\`.
6. Authoritative server returns the A/AAAA record (IP address) to the client.

### What happens when you open \`google.com\` (5-Line Summary):
1. **Input & Resolution:** You enter \`https://google.com\` in the browser; the browser parses the URL, checks its cache, and sends a DNS query to find Google's IP address.
2. **ARP & Local Routing:** If communicating outside the subnet, your machine issues an ARP query to get the default gateway router's MAC address and encapsulates the packet into an Ethernet frame.
3. **TCP 3-Way Handshake & TLS:** Your client initiates a TCP handshake (SYN, SYN-ACK, ACK) on port 443, followed by the TLS handshake to negotiate cryptographic keys and authenticate Google's certificate.
4. **HTTP Request Transmission:** The browser encrypts and dispatches an HTTP \`GET /\` request over the established secure TLS tunnel.
5. **Server Processing & DOM Render:** Google's web servers process the request, return an HTTP \`200 OK\` response with HTML/CSS/JS assets, and the browser parses the DOM to render the search page.

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

\`\`\`bash
# 1. Inspecting local network interfaces and MAC address
ip addr show

# 2. Testing DNS resolution for google.com
dig google.com +noall +answer

# 3. Tracing DNS resolution hierarchy
nslookup google.com 8.8.8.8

# 4. Checking default gateway and ARP cache
ip route show
arp -n
\`\`\`

- Observations:
  - \`dig google.com +noall +answer\` returned Google's IPv4 \`A\` record within 12ms.
  - Gateway MAC address was properly resolved in the local ARP table.

---

## 5. What did I learn from the exercise?
- **Key Takeaway:** An IP address gets a packet across global networks (routing), but a MAC address delivers the packet from hop to hop inside physical network segments.
- **Insight:** Security tooling without foundational networking understanding is just "button clicking". Recognizing how DNS, ARP, and TCP interact exposes every potential interception and inspection point.
- **Next Target:** Day 2 - Deep dive into OSI vs TCP/IP models, TCP flags, UDP behavior, and Wireshark packet dissection.
`;

  dom.markdownEditor.value = day1Text;
  renderMarkdown();
  updateEditorStats();
}

function loadLabReportTemplate() {
  dom.folderSelect.value = "06-red-team/lab-reports";
  dom.folderPrefixLabel.textContent = "06-red-team/lab-reports/";
  dom.filenameInput.value = "juice-shop-assessment.md";
  dom.titleInput.value = "OWASP Juice Shop Security Assessment Report";
  updateCommitMessageSuggestion();

  const labTemplate = `# Security Assessment Lab Report: OWASP Juice Shop

- **Date:** ${new Date().toISOString().split('T')[0]}
- **Target / Application:** OWASP Juice Shop (Deliberately Vulnerable Modern Web App)
- **Tester:** Junaid Khan
- **Status:** In Progress
- **Scope:** http://localhost:3000 / Authorized Local Security Assessment

---

## 1. Executive Summary & Lab Scope
A black-box / gray-box web application security assessment was conducted against the target environment. The objective was to discover common web vulnerabilities (OWASP Top 10), document reproducible proofs-of-concept, and evaluate business risk.

---

## 2. Methodology & Surface Mapping
- **Tools Used:** Burp Suite Community, Browser DevTools, Curl
- **Reconnaissance Steps:**
  - Mapped client-side Angular source code and API route definitions.
  - Inspected authentication endpoints and token handling.

---

## 3. Vulnerability Findings & Evidence

### Finding 1: [Vulnerability Title - e.g. SQL Injection on Login]
- **Severity:** High
- **Vulnerable Endpoint:** \`POST /rest/user/login\`
- **Description:** 
- **Proof of Concept (PoC) & Steps to Reproduce:**
  1. Open Burp Suite Repeater.
  2. Inject SQL payload into email parameter: \`' OR 1=1--\`
- **Evidence / HTTP Payload:**
  \`\`\`http
  POST /rest/user/login HTTP/1.1
  Host: localhost:3000
  Content-Type: application/json

  {"email":"' OR 1=1--","password":"pass"}
  \`\`\`
- **Impact Analysis:** Bypasses authentication and logs in as the administrator account.

---

## 4. Remediation & Hardening Recommendations
- Replace dynamic SQL concatenation with parameterized queries / Prepared Statements.
- Implement server-side input validation and strict ORM configurations.

---

## 5. Personal Learnings & Key Takeaways
- Understanding the difference between client-side validation and backend database interpretation.
`;

  dom.markdownEditor.value = labTemplate;
  renderMarkdown();
  updateEditorStats();
}

// ==========================================
// Drafts Management
// ==========================================
function autoSaveLocalDraft() {
  const content = dom.markdownEditor.value;
  if (!content.trim()) return;

  const draftData = {
    day: dom.daySelect.value,
    folder: dom.folderSelect.value,
    filename: dom.filenameInput.value,
    title: dom.titleInput.value,
    content: content,
    updatedAt: new Date().toLocaleTimeString()
  };

  localStorage.setItem('redteam_current_draft', JSON.stringify(draftData));
  dom.draftStatusText.textContent = `Draft auto-saved at ${draftData.updatedAt}`;
}

function restoreLocalDraft() {
  try {
    const raw = localStorage.getItem('redteam_current_draft');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.content && !dom.markdownEditor.value) {
        dom.markdownEditor.value = data.content;
        if (data.day) dom.daySelect.value = data.day;
        if (data.folder) {
          dom.folderSelect.value = data.folder;
          dom.folderPrefixLabel.textContent = `${data.folder}/`;
        }
        if (data.filename) dom.filenameInput.value = data.filename;
        if (data.title) dom.titleInput.value = data.title;
        renderMarkdown();
        updateEditorStats();
        dom.draftStatusText.textContent = `Restored draft from ${data.updatedAt || 'cache'}`;
      }
    } else {
      // Default load Day 1
      loadDay1Kickoff();
    }
  } catch (e) {
    console.warn(e);
  }
}

async function saveDraftToServer() {
  const content = dom.markdownEditor.value;
  if (!content.trim()) {
    alert('Cannot save an empty note as draft.');
    return;
  }

  const payload = {
    id: state.currentDraftId,
    title: dom.titleInput.value || 'Untitled Note',
    folder: dom.folderSelect.value,
    filename: dom.filenameInput.value,
    content: content,
    day: parseInt(dom.daySelect.value, 10),
    tags: []
  };

  try {
    const res = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      state.currentDraftId = result.draft.id;
      dom.draftStatusText.textContent = `Saved to drafts list at ${new Date().toLocaleTimeString()}`;
      soundFx.playBeep(600, 0.1);
      await loadDrafts();
    }
  } catch (err) {
    console.error('Failed to save draft to server:', err);
    autoSaveLocalDraft();
  }
}

async function loadDrafts() {
  try {
    const res = await fetch('/api/drafts');
    state.drafts = await res.json();
    dom.draftCountBadge.textContent = state.drafts.length;
  } catch (err) {
    console.warn('Could not load drafts:', err);
  }
}

function openDraftsModal() {
  renderDraftsList();
  dom.draftsModal.classList.add('open');
}

function renderDraftsList() {
  if (!state.drafts || state.drafts.length === 0) {
    dom.draftsListContainer.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox" class="empty-icon"></i>
        <p>No saved drafts yet. Click "Save Draft" in the Studio anytime to save your work!</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  dom.draftsListContainer.innerHTML = state.drafts.map(d => `
    <div class="draft-item-card">
      <div class="draft-item-info">
        <h4>${escapeHtml(d.title)}</h4>
        <p>
          <span style="color: var(--accent-yellow);">${escapeHtml(d.folder)}/${escapeHtml(d.filename)}</span>
          • Day ${d.day || 'Auto'} • ${d.wordCount || 0} words • ${new Date(d.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div class="draft-item-actions">
        <button class="btn btn-primary btn-xs" onclick="loadDraftIntoEditor('${d.id}')">
          <i data-lucide="edit-3"></i> Load
        </button>
        <button class="btn btn-secondary btn-xs" onclick="deleteDraftItem('${d.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

window.loadDraftIntoEditor = (draftId) => {
  const draft = state.drafts.find(d => d.id === draftId);
  if (!draft) return;
  state.currentDraftId = draft.id;
  dom.titleInput.value = draft.title;
  dom.folderSelect.value = draft.folder;
  dom.folderPrefixLabel.textContent = `${draft.folder}/`;
  dom.filenameInput.value = draft.filename;
  if (draft.day) dom.daySelect.value = draft.day;
  dom.markdownEditor.value = draft.content;
  renderMarkdown();
  updateEditorStats();
  dom.draftsModal.classList.remove('open');
  dom.draftStatusText.textContent = `Loaded draft: ${draft.title}`;
  soundFx.playBeep(550, 0.1);
};

window.deleteDraftItem = async (draftId) => {
  if (!confirm('Delete this draft permanently?')) return;
  try {
    await fetch(`/api/draft/${draftId}`, { method: 'DELETE' });
    await loadDrafts();
    renderDraftsList();
  } catch (err) {
    console.error(err);
  }
};

// ==========================================
// Publish to GitHub
// ==========================================
async function publishNoteToGitHub() {
  const content = dom.markdownEditor.value.trim();
  if (!content) {
    alert('Please enter your learning notes before publishing to GitHub.');
    return;
  }

  const folder = dom.folderSelect.value;
  const filename = dom.filenameInput.value.trim();
  const title = dom.titleInput.value.trim();
  const commitMessage = dom.commitMsgInput.value.trim();
  const day = parseInt(dom.daySelect.value, 10);

  dom.btnPostToGitHub.disabled = true;
  dom.btnPostToGitHub.innerHTML = `<i data-lucide="loader" class="spin"></i> <span>COMMITTING & PUSHING...</span>`;
  lucide.createIcons();

  try {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folder,
        filename,
        title,
        content,
        commitMessage,
        day,
        draftId: state.currentDraftId
      })
    });

    const result = await res.json();
    if (!result.success) {
      alert(`GitHub Push Error: ${result.error}`);
      return;
    }

    // Success! Clear local draft cache
    localStorage.removeItem('redteam_current_draft');
    state.currentDraftId = null;

    // Victory sound and confetti
    soundFx.playVictory();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Show Success Modal
    dom.successFileLink.href = result.githubUrl;
    dom.successFileLink.textContent = result.relativePath;
    dom.successCommitLink.href = result.commitUrl;
    dom.successCommitLink.textContent = `Commit #${result.commitHash}`;
    dom.successDesc.textContent = `Day ${day} note successfully saved in ${folder}/${filename} and pushed to origin/main on GitHub!`;
    dom.successModal.classList.add('open');

    // Refresh application state
    await Promise.all([
      loadProgress(),
      loadNotes(),
      loadStatus(),
      loadDrafts()
    ]);

  } catch (err) {
    alert(`Network Error: ${err.message}`);
  } finally {
    dom.btnPostToGitHub.disabled = false;
    dom.btnPostToGitHub.innerHTML = `<i data-lucide="rocket"></i> <span>POST & COMMIT TO GITHUB</span>`;
    lucide.createIcons();
  }
}

// ==========================================
// 90-Day Roadmap & Tracker
// ==========================================
async function loadRoadmap() {
  try {
    const res = await fetch('/api/roadmap');
    state.roadmap = await res.json();
    populateDaySelect();
    renderRoadmapWeeks();
  } catch (err) {
    console.warn('Could not load roadmap:', err);
  }
}

function populateDaySelect() {
  if (!state.roadmap || !state.roadmap.days) return;
  dom.daySelect.innerHTML = state.roadmap.days.map(d => `
    <option value="${d.day}">Day ${String(d.day).padStart(2, '0')}: ${escapeHtml(d.title.substring(0, 40))}${d.title.length > 40 ? '...' : ''}</option>
  `).join('');
}

function renderRoadmapWeeks() {
  if (!state.roadmap) return;
  const { weeks, days } = state.roadmap;
  const completed = (state.progress && state.progress.completedDays) || [];

  const filteredWeeks = weeks.filter(w => {
    if (state.activePhaseFilter === 'all') return true;
    return w.phaseId === parseInt(state.activePhaseFilter, 10);
  });

  dom.weeksAccordionContainer.innerHTML = filteredWeeks.map((w, index) => {
    const weekDays = days.filter(d => d.week === w.week);
    const completedInWeek = weekDays.filter(d => completed.includes(d.day)).length;
    const isWeekComplete = completedInWeek === weekDays.length;

    return `
      <div class="week-card ${index === 0 ? 'open' : ''}" id="weekCard-${w.week}">
        <div class="week-card-header" onclick="toggleWeekCard('${w.week}')">
          <div class="week-card-title-group">
            <span class="week-number-pill">WEEK ${w.week}</span>
            <div>
              <h3>${escapeHtml(w.title)}</h3>
              <p>${escapeHtml(w.summary)}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-family: var(--font-mono); font-size: 11px; color: ${isWeekComplete ? 'var(--accent-green)' : 'var(--text-sub)'}">
              ${completedInWeek}/${weekDays.length} Done
            </span>
            <i data-lucide="chevron-down" class="chevron"></i>
          </div>
        </div>

        <div class="week-card-body">
          <div class="week-meta-bar">
            <span><strong>Goal:</strong> ${escapeHtml(w.goal)}</span>
            <span><strong>Resource:</strong> <a href="${w.resourceUrl}" target="_blank" class="cyber-link">${escapeHtml(w.resource)}</a></span>
          </div>

          <div class="days-list">
            ${weekDays.map(d => {
              const isDone = completed.includes(d.day);
              return `
                <div class="day-item-row">
                  <div class="day-item-left">
                    <button class="day-check-btn ${isDone ? 'checked' : ''}" onclick="toggleDayProgress(${d.day})" title="Toggle Day Status">
                      <i data-lucide="check"></i>
                    </button>
                    <div>
                      <span class="day-badge">DAY ${String(d.day).padStart(2, '0')}</span>
                      <span class="day-title-text">${escapeHtml(d.title)}</span>
                    </div>
                  </div>
                  <div class="day-actions">
                    <span class="day-file-hint">${escapeHtml(d.folder)}/${escapeHtml(d.file || '')}</span>
                    <button class="btn btn-outline btn-xs" onclick="startWritingForDay(${d.day})">
                      <i data-lucide="edit-3"></i> Write Note
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

window.toggleWeekCard = (weekNum) => {
  const card = document.getElementById(`weekCard-${weekNum}`);
  if (card) card.classList.toggle('open');
};

window.toggleDayProgress = async (dayNum) => {
  if (!state.progress) state.progress = { completedDays: [] };
  const idx = state.progress.completedDays.indexOf(dayNum);
  if (idx >= 0) {
    state.progress.completedDays.splice(idx, 1);
  } else {
    state.progress.completedDays.push(dayNum);
    soundFx.playBeep(650, 0.1);
  }

  renderRoadmapWeeks();
  updateProgressDisplays();

  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedDays: state.progress.completedDays })
    });
  } catch (err) {
    console.error(err);
  }
};

window.startWritingForDay = (dayNum) => {
  dom.daySelect.value = String(dayNum);
  const event = new Event('change');
  dom.daySelect.dispatchEvent(event);
  insert5QuestionsTemplate();
  switchTab('studio');
};

// Phase Filters
dom.phaseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    dom.phaseBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activePhaseFilter = btn.getAttribute('data-phase');
    renderRoadmapWeeks();
  });
});

async function loadProgress() {
  try {
    const res = await fetch('/api/progress');
    state.progress = await res.json();
    updateProgressDisplays();
  } catch (err) {
    console.warn('Could not load progress:', err);
  }
}

function updateProgressDisplays() {
  if (!state.progress) return;
  const count = state.progress.completedDays ? state.progress.completedDays.length : 0;
  const percent = ((count / 90) * 100).toFixed(1);
  const remaining = 90 - count;

  dom.roadmapPercent.textContent = `${percent}%`;
  dom.roadmapProgressBar.style.width = `${Math.max(1, percent)}%`;
  dom.completedCountText.textContent = `${count} of 90 Days Completed`;
  dom.daysRemainingText.textContent = `${remaining} Days Remaining`;
  dom.roadmapProgressBadge.textContent = `Day ${count}/90`;
}

// ==========================================
// 30-Minute Protocol Timer
// ==========================================
function setupTimer() {
  dom.btnTimerToggle.addEventListener('click', toggleTimer);
  dom.btnTimerReset.addEventListener('click', resetTimer);
  dom.btnTimerSoundTest.addEventListener('click', () => {
    soundFx.playBeep(700, 0.2);
  });
}

function toggleTimer() {
  if (state.timer.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  state.timer.isRunning = true;
  dom.timerToggleText.textContent = "Pause Session";
  dom.timerToggleIcon.setAttribute('data-lucide', 'pause');
  lucide.createIcons();
  soundFx.playBeep(520, 0.12);

  state.timer.intervalId = setInterval(() => {
    if (state.timer.remainingSeconds > 0) {
      state.timer.remainingSeconds--;
      updateTimerUI();
    } else {
      // Finished 30 minutes!
      pauseTimer();
      soundFx.playVictory();
      confetti({ particleCount: 80, spread: 60 });
      alert("🎯 30-Minute Practice Protocol Completed! Excellent focus, Operator.");
    }
  }, 1000);
}

function pauseTimer() {
  state.timer.isRunning = false;
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }
  dom.timerToggleText.textContent = "Resume Session";
  dom.timerToggleIcon.setAttribute('data-lucide', 'play');
  lucide.createIcons();
}

function resetTimer() {
  pauseTimer();
  state.timer.remainingSeconds = 30 * 60;
  dom.timerToggleText.textContent = "Start 30-Min Session";
  dom.timerToggleIcon.setAttribute('data-lucide', 'play');
  lucide.createIcons();
  updateTimerUI();
}

function updateTimerUI() {
  const mins = Math.floor(state.timer.remainingSeconds / 60);
  const secs = state.timer.remainingSeconds % 60;
  dom.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Calculate Phase:
  // Phase 1 (Recall): 30:00 to 25:00 (1800s to 1500s)
  // Phase 2 (Study): 25:00 to 10:00 (1500s to 600s)
  // Phase 3 (Practice): 10:00 to 00:00 (600s to 0s)
  const rem = state.timer.remainingSeconds;
  let newPhase = 1;
  let phaseText = "Phase 1: Active Recall (5m)";

  if (rem > 1500) {
    newPhase = 1;
    phaseText = "Phase 1: Active Recall";
  } else if (rem > 600) {
    newPhase = 2;
    phaseText = "Phase 2: Deep Concept Study";
  } else {
    newPhase = 3;
    phaseText = "Phase 3: Hands-on Practice & Notes";
  }

  // Phase transition sound cue
  if (newPhase !== state.timer.currentPhase) {
    state.timer.currentPhase = newPhase;
    soundFx.playBeep(880, 0.25, 'triangle');
  }

  dom.timerCurrentPhaseName.textContent = phaseText;
  dom.phaseBox1.classList.toggle('active', newPhase === 1);
  dom.phaseBox2.classList.toggle('active', newPhase === 2);
  dom.phaseBox3.classList.toggle('active', newPhase === 3);

  // SVG Progress circle
  const progressRatio = state.timer.remainingSeconds / state.timer.totalSeconds;
  const circumference = 2 * Math.PI * 45; // ~283
  dom.timerProgressCircle.style.strokeDashoffset = circumference * (1 - progressRatio);
}

// ==========================================
// Repository Explorer
// ==========================================
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    state.notes = await res.json();
    dom.notesCountBadge.textContent = `${state.notes.length} Notes`;
    renderNotesTree(state.notes);
  } catch (err) {
    console.warn('Could not load notes:', err);
  }
}

function renderNotesTree(notesList) {
  if (!notesList || notesList.length === 0) {
    dom.notesTreeContainer.innerHTML = `
      <div class="empty-state">
        <i data-lucide="file-text" class="empty-icon"></i>
        <p>No notes found.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  dom.notesTreeContainer.innerHTML = notesList.map(n => `
    <div class="note-tree-item" onclick="inspectNote('${escapeHtml(n.path)}')">
      <span class="note-tree-title">${escapeHtml(n.title)}</span>
      <div class="note-tree-meta">
        <span class="note-tree-folder">${escapeHtml(n.folder)}</span>
        <span>•</span>
        <span>${n.words} words</span>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

dom.notesSearchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = state.notes.filter(n => 
    n.title.toLowerCase().includes(query) || n.path.toLowerCase().includes(query)
  );
  renderNotesTree(filtered);
});

dom.btnRefreshNotes.addEventListener('click', async () => {
  soundFx.playBeep(500, 0.08);
  await loadNotes();
});

window.inspectNote = async (relativePath) => {
  try {
    const res = await fetch(`/api/note?path=${encodeURIComponent(relativePath)}`);
    const data = await res.json();
    if (data.content) {
      dom.viewerPath.textContent = relativePath;
      dom.viewerContent.innerHTML = marked.parse(data.content);
      dom.viewerActions.style.display = 'flex';
      dom.btnOpenOnGitHub.href = `https://github.com/Junaid-khan-i87/red-team-foundations/blob/main/${relativePath}`;
      
      dom.btnEditInStudio.onclick = () => {
        loadExistingNoteIntoStudio(relativePath, data.content);
      };
      
      // Highlight active in tree
      document.querySelectorAll('.note-tree-item').forEach(el => {
        el.classList.toggle('active', el.textContent.includes(relativePath.split('/').pop()));
      });
      lucide.createIcons();
    }
  } catch (err) {
    console.error(err);
  }
};

function loadExistingNoteIntoStudio(relPath, content) {
  const parts = relPath.split('/');
  const filename = parts.pop();
  const folder = parts.join('/');

  dom.folderSelect.value = folder;
  dom.folderPrefixLabel.textContent = `${folder}/`;
  dom.filenameInput.value = filename;

  const firstLine = content.split('\n').find(l => l.startsWith('# '));
  dom.titleInput.value = firstLine ? firstLine.replace('# ', '').trim() : filename;
  dom.markdownEditor.value = content;

  renderMarkdown();
  updateEditorStats();
  updateCommitMessageSuggestion();
  switchTab('studio');
}

// ==========================================
// Status & Telemetry
// ==========================================
async function loadStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    if (data.success) {
      dom.gitBranchVal.textContent = data.branch;
      if (data.recentCommits && data.recentCommits.length > 0) {
        dom.commitsList.innerHTML = data.recentCommits.map(c => `
          <div class="commit-row">
            <div>
              <span class="commit-hash">${c.hash}</span>
              <span class="commit-msg">${escapeHtml(c.msg)}</span>
            </div>
            <span class="commit-date">${c.relDate}</span>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('Could not load status:', err);
  }
}

// ==========================================
// Modal Helpers
// ==========================================
function setupModals() {
  dom.btnCloseDraftsModal.addEventListener('click', () => {
    dom.draftsModal.classList.remove('open');
  });
  dom.btnCloseSuccessModal.addEventListener('click', () => {
    dom.successModal.classList.remove('open');
  });

  window.addEventListener('click', (e) => {
    if (e.target === dom.draftsModal) dom.draftsModal.classList.remove('open');
    if (e.target === dom.successModal) dom.successModal.classList.remove('open');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
