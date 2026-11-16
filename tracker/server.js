const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;
const REPO_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Run shell command in REPO_ROOT
function runGit(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: REPO_ROOT }, (error, stdout, stderr) => {
      if (error) {
        return resolve({ success: false, error: stderr || stdout || error.message });
      }
      resolve({ success: true, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

// Ensure data files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const progressFile = path.join(DATA_DIR, 'progress.json');
const draftsFile = path.join(DATA_DIR, 'drafts.json');
const roadmapFile = path.join(DATA_DIR, 'roadmap.json');

// API: System & Git Status
app.get('/api/status', async (req, res) => {
  try {
    const branchRes = await runGit('git branch --show-current');
    const remoteRes = await runGit('git remote get-url origin');
    const logRes = await runGit('git log -n 5 --pretty=format:"%h|%s|%an|%ar|%ad"');
    const statusRes = await runGit('git status --porcelain');

    const commits = logRes.stdout ? logRes.stdout.split('\n').map(line => {
      const [hash, msg, author, relDate, fullDate] = line.split('|');
      return { hash, msg, author, relDate, fullDate };
    }) : [];

    res.json({
      success: true,
      repoRoot: REPO_ROOT,
      branch: branchRes.stdout || 'main',
      remoteUrl: remoteRes.stdout || 'https://github.com/Junaid-khan-i87/red-team-foundations.git',
      hasUncommittedChanges: statusRes.stdout.length > 0,
      recentCommits: commits,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Roadmap
app.get('/api/roadmap', (req, res) => {
  try {
    if (fs.existsSync(roadmapFile)) {
      const data = JSON.parse(fs.readFileSync(roadmapFile, 'utf8'));
      return res.json(data);
    }
    res.status(404).json({ error: 'Roadmap data not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Progress
app.get('/api/progress', (req, res) => {
  try {
    if (fs.existsSync(progressFile)) {
      const data = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      return res.json(data);
    }
    const defaultProgress = {
      completedDays: [1],
      currentStreak: 1,
      lastActivityDate: new Date().toISOString().split('T')[0],
      activeDay: 1,
      stats: { totalCommits: 1, totalNotes: 1, totalMinutesStudied: 30 }
    };
    fs.writeFileSync(progressFile, JSON.stringify(defaultProgress, null, 2));
    res.json(defaultProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress', (req, res) => {
  try {
    const current = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, 'utf8')) : {};
    const updated = { ...current, ...req.body };
    fs.writeFileSync(progressFile, JSON.stringify(updated, null, 2));
    res.json({ success: true, progress: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Drafts
app.get('/api/drafts', (req, res) => {
  try {
    if (fs.existsSync(draftsFile)) {
      const drafts = JSON.parse(fs.readFileSync(draftsFile, 'utf8'));
      return res.json(drafts);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/draft', (req, res) => {
  try {
    let drafts = [];
    if (fs.existsSync(draftsFile)) {
      drafts = JSON.parse(fs.readFileSync(draftsFile, 'utf8'));
    }

    const { id, title, folder, filename, content, day, tags } = req.body;
    const draftId = id || `draft_${Date.now()}`;
    const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;

    const draftItem = {
      id: draftId,
      title: title || 'Untitled Note',
      folder: folder || '01-networking',
      filename: filename || 'daily-note.md',
      content: content || '',
      day: day || null,
      tags: tags || [],
      wordCount,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = drafts.findIndex(d => d.id === draftId);
    if (existingIndex >= 0) {
      drafts[existingIndex] = draftItem;
    } else {
      drafts.unshift(draftItem);
    }

    fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
    res.json({ success: true, draft: draftItem, totalDrafts: drafts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/draft/:id', (req, res) => {
  try {
    if (fs.existsSync(draftsFile)) {
      let drafts = JSON.parse(fs.readFileSync(draftsFile, 'utf8'));
      drafts = drafts.filter(d => d.id !== req.params.id);
      fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: List notes in repository
app.get('/api/notes', (req, res) => {
  try {
    const modules = ['01-networking', '02-linux', '03-windows', '04-programming', '05-web-security', '06-red-team', 'daily-logs', 'templates'];
    const notes = [];

    function scanDir(dirRelative) {
      const fullDir = path.join(REPO_ROOT, dirRelative);
      if (!fs.existsSync(fullDir)) return;

      const entries = fs.readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        const relPath = path.join(dirRelative, entry.name);
        if (entry.isDirectory()) {
          scanDir(relPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const fullPath = path.join(fullDir, entry.name);
          const stats = fs.statSync(fullPath);
          const content = fs.readFileSync(fullPath, 'utf8');
          const firstLine = content.split('\n').find(l => l.startsWith('# '));
          const title = firstLine ? firstLine.replace('# ', '').trim() : entry.name;
          const words = content.trim().split(/\s+/).filter(Boolean).length;

          notes.push({
            title,
            path: relPath,
            folder: dirRelative.split(path.sep)[0],
            filename: entry.name,
            size: stats.size,
            words,
            modified: stats.mtime,
            githubUrl: `https://github.com/Junaid-khan-i87/red-team-foundations/blob/main/${relPath}`
          });
        }
      }
    }

    modules.forEach(scanDir);
    notes.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get single note content
app.get('/api/note', (req, res) => {
  try {
    const targetRel = req.query.path;
    if (!targetRel || targetRel.includes('..')) {
      return res.status(400).json({ error: 'Invalid path parameter' });
    }
    const fullPath = path.join(REPO_ROOT, targetRel);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    res.json({ path: targetRel, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Publish & Commit directly to GitHub
app.post('/api/publish', async (req, res) => {
  try {
    const { folder, filename, title, content, commitMessage, day, draftId } = req.body;

    if (!content || !filename) {
      return res.status(400).json({ error: 'Filename and content are required' });
    }

    // Clean folder & filename
    const cleanFolder = (folder || 'daily-logs').replace(/[^a-zA-Z0-9_\-\/]/g, '');
    let cleanFile = filename.trim().replace(/[^a-zA-Z0-9_\-\.]/g, '');
    if (!cleanFile.endsWith('.md')) cleanFile += '.md';

    const dirPath = path.join(REPO_ROOT, cleanFolder);
    const filePath = path.join(dirPath, cleanFile);
    const relativePath = path.join(cleanFolder, cleanFile);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write file to repository
    fs.writeFileSync(filePath, content, 'utf8');

    // Run Git add, commit, push
    const msg = commitMessage || `feat(notes): ${title || cleanFile} [Day ${day || 'Auto'}]`;
    const escapedMsg = msg.replace(/"/g, '\\"');

    const addRes = await runGit(`git add "${relativePath}"`);
    if (!addRes.success) {
      return res.status(500).json({ error: `Git add failed: ${addRes.error}` });
    }

    const commitRes = await runGit(`git commit -m "${escapedMsg}"`);
    // Note: if nothing changed, commit might exit with status, but git push still works
    
    const pushRes = await runGit('git push origin main');
    if (!pushRes.success && !pushRes.error.includes('Everything up-to-date')) {
      return res.status(500).json({ error: `Git push failed: ${pushRes.error}` });
    }

    // Get latest commit hash
    const hashRes = await runGit('git rev-parse --short HEAD');
    const commitHash = hashRes.stdout || 'latest';

    // If day was provided, mark as completed in progress.json
    if (day && fs.existsSync(progressFile)) {
      const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      const dayNum = parseInt(day, 10);
      if (!progress.completedDays.includes(dayNum)) {
        progress.completedDays.push(dayNum);
        progress.completedDays.sort((a, b) => a - b);
      }
      progress.stats = progress.stats || {};
      progress.stats.totalCommits = (progress.stats.totalCommits || 1) + 1;
      progress.stats.totalNotes = (progress.stats.totalNotes || 1) + 1;
      progress.lastActivityDate = new Date().toISOString().split('T')[0];
      fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    }

    // If draftId was provided, remove it from drafts
    if (draftId && fs.existsSync(draftsFile)) {
      let drafts = JSON.parse(fs.readFileSync(draftsFile, 'utf8'));
      drafts = drafts.filter(d => d.id !== draftId);
      fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
    }

    const githubUrl = `https://github.com/Junaid-khan-i87/red-team-foundations/blob/main/${relativePath}`;
    const commitUrl = `https://github.com/Junaid-khan-i87/red-team-foundations/commit/${commitHash}`;

    res.json({
      success: true,
      commitHash,
      relativePath,
      githubUrl,
      commitUrl,
      message: `Successfully committed and pushed to GitHub!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[+] Red Team Foundation Tracker & Command Center running on http://0.0.0.0:${PORT}`);
});
