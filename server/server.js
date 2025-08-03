// const fs = require('fs');
// const path = require('path');
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const multer = require('multer');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(bodyParser.json({ limit: '2mb' }));

// const DB_DIR = path.join(__dirname, 'db');
// const KEYS_FILE = path.join(DB_DIR, 'keys.json');
// const MESSAGES_FILE = path.join(DB_DIR, 'messages.json');
// const UPLOADS_DIR = path.join(DB_DIR, 'uploads');

// // Ensure directories and files exist
// if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);
// if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
// if (!fs.existsSync(KEYS_FILE)) fs.writeFileSync(KEYS_FILE, '{}');
// if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]');

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOADS_DIR);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // 🔐 Generate and store key pair
// app.post('/api/generate-keys', (req, res) => {
//   const { publicKey, privateKey } = req.body || {};

//   if (!publicKey || !privateKey) {
//     console.log('❌ Missing keys');
//     return res.status(400).json({ success: false, message: 'Missing keys' });
//   }

//   try {
//     const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8') || '{}');
//     keys[privateKey] = publicKey;
//     fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
//     console.log(`✅ Key pair saved: ${privateKey} → ${publicKey}`);
//     return res.json({ success: true, publicKey, privateKey });
//   } catch (err) {
//     console.error('❌ Key file write error:', err);
//     return res.status(500).json({ success: false, message: 'Key file write error' });
//   }
// });

// // 🔑 Login using private key
// app.post('/api/login', (req, res) => {
//   const { privateKey } = req.body || {};
//   if (!privateKey) {
//     console.log('❌ Missing privateKey');
//     return res.status(400).json({ success: false, message: 'Missing private key' });
//   }

//   try {
//     const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
//     const publicKey = keys[privateKey];

//     if (publicKey) {
//       return res.json({ success: true, publicKey });
//     } else {
//       return res.status(401).json({ success: false, message: 'Invalid private key' });
//     }
//   } catch (err) {
//     console.error('❌ Key file read error:', err);
//     return res.status(500).json({ success: false, message: 'Key file read error' });
//   }
// });

// // 📨 Send a message (supports file)
// app.post('/api/send', upload.single('file'), (req, res) => {
//   const { fromPublicKey, toPublicKey, message } = req.body || {};
//   const file = req.file;

//   if (!fromPublicKey || !toPublicKey || !message) {
//     console.log('❌ Missing fields:', { fromPublicKey, toPublicKey, message });
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
//   }

//   try {
//     const messages = fs.existsSync(MESSAGES_FILE)
//       ? JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]')
//       : [];

//     const timestamp = new Date().toISOString();

//     const sentMessage = {
//       from: fromPublicKey,
//       to: toPublicKey,
//       message,
//       timestamp,
//       fileName: file ? file.filename : null,
//       originalName: file ? file.originalname : null
//     };

//     messages.push(sentMessage);
//     fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
//     console.log(`📨 Message sent: ${fromPublicKey} ➡️ ${toPublicKey}`);

//     return res.json({ success: true, message: 'Message sent successfully.' });
//   } catch (err) {
//     console.error('❌ Message write error:', err);
//     return res.status(500).json({ success: false, message: 'Message write error' });
//   }
// });

// // 📥 Fetch Inbox
// app.post('/api/inbox', (req, res) => {
//   const { privateKey } = req.body || {};
//   if (!privateKey) return res.status(400).json({ success: false, message: 'Missing private key' });

//   try {
//     const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
//     const publicKey = keys[privateKey];

//     if (!publicKey) return res.status(401).json({ success: false, message: 'Invalid private key' });

//     const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]');
//     const userMessages = messages.filter(msg => msg.to === publicKey);

//     return res.json({ success: true, messages: userMessages });
//   } catch (err) {
//     console.error('❌ Inbox fetch error:', err);
//     return res.status(500).json({ success: false, message: 'Failed to fetch inbox' });
//   }
// });


// // Fetch sent messages (by public key)
// app.post('/api/sent', (req, res) => {
//   const { publicKey } = req.body;

//   try {
//     const messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));

//     const sentMessages = messages.filter(
//       (msg) => msg.senderPublicKey === publicKey
//     );

//     res.json({ success: true, messages: sentMessages });
//   } catch (err) {
//     console.error('Error reading messages.json:', err);
//     res.status(500).json({ success: false, error: 'Failed to read messages' });
//   }
// });


// // 📎 Download file
// app.get('/download/:privateKey/:index', (req, res) => {
//   const { privateKey, index } = req.params;

//   try {
//     const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
//     const publicKey = keys[privateKey];

//     if (!publicKey) return res.status(401).send('Invalid key');

//     const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
//     const message = messages[parseInt(index)];

//     if (!message || message.to !== publicKey || !message.fileName) {
//       return res.status(404).send('File not found');
//     }

//     const filePath = path.join(UPLOADS_DIR, message.fileName);
//     if (!fs.existsSync(filePath)) return res.status(404).send('File missing');

//     res.download(filePath, message.originalName || message.fileName);
//   } catch (err) {
//     console.error('❌ Download error:', err);
//     res.status(500).send('Server error');
//   }
// });


// // 📤 Fetch sent messages
// app.get('/sent/:senderKey', (req, res) => {
//   const senderKey = req.params.senderKey;

//   if (!senderKey) {
//     return res.status(400).json({ success: false, message: 'Missing sender public key' });
//   }

//   try {
//     const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8') || '[]');
//     const sentMessages = messages.filter(msg => msg.from === senderKey);
//     return res.json(sentMessages);
//   } catch (err) {
//     console.error('❌ Sent fetch error:', err);
//     return res.status(500).json({ success: false, message: 'Failed to fetch sent messages' });
//   }
// });



// // 🗑️ Delete a message
// app.post('/api/delete', (req, res) => {
//   const { privateKey, messageIndex } = req.body;

//   if (!privateKey || messageIndex === undefined) {
//     return res.status(400).json({ success: false, message: 'Missing data' });
//   }

//   try {
//     const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
//     const publicKey = keys[privateKey];
//     if (!publicKey) {
//       return res.status(401).json({ success: false, message: 'Invalid private key' });
//     }

//     const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
//     const userMessages = messages.filter(msg => msg.to === publicKey);

//     // Get actual message to delete (need full index in original list)
//     const targetMessage = userMessages[messageIndex];
//     if (!targetMessage) {
//       return res.status(400).json({ success: false, message: 'Message not found' });
//     }

//     // Find its index in the original message list
//     const fullIndex = messages.findIndex(
//       msg => msg.to === publicKey && msg.message === targetMessage.message && msg.timestamp === targetMessage.timestamp
//     );

//     if (fullIndex === -1) {
//       return res.status(400).json({ success: false, message: 'Message index not found' });
//     }

//     // Delete file if attached
//     if (messages[fullIndex].fileName) {
//       const filePath = path.join(UPLOADS_DIR, messages[fullIndex].fileName);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     }

//     messages.splice(fullIndex, 1); // Remove the message
//     fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

//     return res.json({ success: true, message: 'Message deleted successfully' });
//   } catch (err) {
//     console.error('❌ Delete error:', err);
//     return res.status(500).json({ success: false, message: 'Server error during deletion' });
//   }
// });



// // 🟢 Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });




const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

const DB_DIR = path.join(__dirname, 'db');
const KEYS_FILE = path.join(DB_DIR, 'keys.json');
const MESSAGES_FILE = path.join(DB_DIR, 'messages.json');
const UPLOADS_DIR = path.join(DB_DIR, 'uploads');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(KEYS_FILE)) fs.writeFileSync(KEYS_FILE, '{}');
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/api/generate-keys', (req, res) => {
  const { publicKey, privateKey } = req.body || {};
  if (!publicKey || !privateKey)
    return res.status(400).json({ success: false, message: 'Missing keys' });

  try {
    const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
    keys[privateKey] = publicKey;
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
    return res.json({ success: true, publicKey, privateKey });
  } catch {
    return res.status(500).json({ success: false, message: 'Key file write error' });
  }
});

app.post('/api/login', (req, res) => {
  const { privateKey } = req.body || {};
  if (!privateKey)
    return res.status(400).json({ success: false, message: 'Missing private key' });

  try {
    const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
    const publicKey = keys[privateKey];
    return publicKey
      ? res.json({ success: true, publicKey })
      : res.status(401).json({ success: false, message: 'Invalid private key' });
  } catch {
    return res.status(500).json({ success: false, message: 'Key file read error' });
  }
});

app.post('/api/send', upload.single('file'), (req, res) => {
  const { fromPublicKey, toPublicKey, message } = req.body || {};
  const file = req.file;
  if (!fromPublicKey || !toPublicKey || !message)
    return res.status(400).json({ success: false, message: 'Missing fields' });

  try {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    const sentMessage = {
      id: uuidv4(),
      from: fromPublicKey,
      to: toPublicKey,
      message,
      timestamp: new Date().toISOString(),
      fileName: file?.filename || null,
      originalName: file?.originalname || null,
    };
    messages.push(sentMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch {
    res.status(500).json({ success: false, message: 'Message write error' });
  }
});

app.post('/api/inbox', (req, res) => {
  const { privateKey } = req.body;
  if (!privateKey)
    return res.status(400).json({ success: false, message: 'Missing private key' });

  try {
    const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
    const publicKey = keys[privateKey];
    if (!publicKey)
      return res.status(401).json({ success: false, message: 'Invalid private key' });

    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    const userMessages = messages.filter(msg => msg.to === publicKey);
    return res.json({ success: true, messages: userMessages });
  } catch {
    return res.status(500).json({ success: false, message: 'Inbox fetch error' });
  }
});

app.post('/api/sent', (req, res) => {
  const { publicKey } = req.body;
  if (!publicKey)
    return res.status(400).json({ success: false, message: 'Public key missing' });

  try {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    const sentMessages = messages.filter(msg => msg.from === publicKey);
    return res.json({ success: true, messages: sentMessages });
  } catch {
    return res.status(500).json({ success: false, message: 'Sent fetch error' });
  }
});

app.get('/download/:privateKey/:messageId', (req, res) => {
  const { privateKey, messageId } = req.params;

  try {
    const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
    const publicKey = keys[privateKey];
    if (!publicKey) return res.status(401).send('Invalid private key');

    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    const message = messages.find(m => m.id === messageId);

    if (!message) return res.status(404).send('Message not found');
    if (message.to !== publicKey) return res.status(403).send('Not authorized');
    if (!message.fileName) return res.status(404).send('No file attached');

    const filePath = path.join(UPLOADS_DIR, message.fileName);
    if (!fs.existsSync(filePath)) return res.status(404).send('File missing');

    res.download(filePath, message.originalName || message.fileName);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Server error while processing file download');
  }
});

app.post('/api/delete', (req, res) => {
  const { privateKey, messageIndex } = req.body;
  if (!privateKey || messageIndex === undefined)
    return res.status(400).json({ success: false, message: 'Missing data' });

  try {
    const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
    const publicKey = keys[privateKey];
    if (!publicKey)
      return res.status(401).json({ success: false, message: 'Invalid private key' });

    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    const userMessages = messages.filter(msg => msg.to === publicKey);
    const target = userMessages[messageIndex];

    if (!target) return res.status(404).json({ success: false, message: 'Message not found' });

    const index = messages.findIndex(msg => msg.id === target.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Message not found' });

    if (messages[index].fileName) {
      const filePath = path.join(UPLOADS_DIR, messages[index].fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    messages.splice(index, 1);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    res.json({ success: true, message: 'Message deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error during deletion' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
