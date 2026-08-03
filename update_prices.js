import fs from 'fs';

const updates = {
  'prop-3': { price: 'USD 115.000', num: 115000 },
  'prop-14': { price: 'USD 185.000', num: 185000 },
  'prop-1': { price: 'USD 78.000', num: 78000 },
  'prop-19': { price: 'USD 45.000', num: 45000 },
  'prop-20': { price: 'USD 35.000', num: 35000 },
  'prop-7': { price: 'USD 40.000', num: 40000 },
  'prop-18': { price: 'USD 69.000', num: 69000 },
  'prop-quinta-el-maestro': { price: 'USD 125.000', num: 125000 },
  'prop-cassafousth-terreno': { price: 'USD 55.000', num: 55000 },
  'prop-5': { price: 'USD 250.000', num: 250000 },
  'prop-21': { price: 'USD 160.000', num: 160000 },
  'prop-17': { price: 'USD 135.000', num: 135000 },
  'prop-2': { price: 'USD 155.000', num: 155000 },
  'prop-23': { price: 'USD 95.000', num: 95000 },
  'prop-8': { price: 'USD 135.000', num: 135000 },
  'prop-4': { price: 'USD 145.000', num: 145000 },
  'prop-13': { price: 'USD 195.000', num: 195000 },
  'prop-ceretti-1300': { price: 'USD 230.000', num: 230000 },
  'prop-rosalia-alquiler': { price: '$ 1.500.000', num: 1500000 },
  'prop-9': { price: '$ 850.000', num: 850000 },
  'prop-12': { price: 'USD 1.500', num: 1500 },
  'prop-ejercito-de-los-andes': { price: '$ 1.000.000', num: 1000000 }
};

let data = fs.readFileSync('src/data.ts', 'utf-8');
const lines = data.split('\n');

let inProp = false;
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('  {') && line.trim() === '{') {
    inProp = true;
    currentId = null;
  }
  
  if (inProp) {
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (idMatch) {
      currentId = idMatch[1];
    }
    
    if (currentId && updates[currentId]) {
      if (line.includes('price:')) {
        lines[i] = line.replace(/price:\s*'([^']+)'/, `price: '${updates[currentId].price}'`);
      }
      if (line.includes('priceNumeric:')) {
        lines[i] = line.replace(/priceNumeric:\s*\d+/, `priceNumeric: ${updates[currentId].num}`);
      }
    }
    
    if (line.includes('  },') && line.trim() === '},') {
      inProp = false;
      currentId = null;
    }
  }
}

fs.writeFileSync('src/data.ts', lines.join('\n'));
console.log('Update complete!');
