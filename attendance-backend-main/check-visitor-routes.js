const fs = require('fs');
const c = fs.readFileSync('generated/routes.ts', 'utf8');
const lines = c.split('\n').filter(l => l.includes('/api/visitors'));
lines.forEach((l, i) => console.log((i+1) + ': ' + l.trim()));
