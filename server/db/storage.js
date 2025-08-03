const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'storage.json');

// Helper to read data
function readData() {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Read error:', err);
    return [];
  }
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Write error:', err);
  }
}

// Add a new key pair
function addKeyPair(pub, priv) {
  const existing = readData();
  existing.push({ pub, priv });
  writeData(existing);
}

// Check private key exists
function verifyPrivateKey(priv) {
  const all = readData();
  return all.find((pair) => pair.priv === priv);
}

module.exports = {
  addKeyPair,
  verifyPrivateKey,
};
