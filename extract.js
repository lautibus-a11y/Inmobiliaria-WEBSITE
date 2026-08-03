import fs from 'fs';

const data = fs.readFileSync('src/data.ts', 'utf-8');
const lines = data.split('\n');
let currentProp = null;
const props = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('  {') && line.trim() === '{') {
    currentProp = { _start: i };
  }
  if (currentProp) {
    if (line.includes('id:')) currentProp.id = line.match(/id:\s*'([^']+)'/)?.[1];
    if (line.includes('title:')) currentProp.title = line.match(/title:\s*'([^']+)'/)?.[1];
    if (line.includes('subtitle:')) currentProp.subtitle = line.match(/subtitle:\s*'([^']+)'/)?.[1];
    if (line.includes('price:')) currentProp.price = line.match(/price:\s*'([^']+)'/)?.[1];
    if (line.includes('location:')) currentProp.location = line.match(/location:\s*'([^']+)'/)?.[1];
    if (line.includes('transactionType:')) currentProp.transactionType = line.match(/transactionType:\s*'([^']+)'/)?.[1];
    if (line.includes('category:')) currentProp.category = line.match(/category:\s*'([^']+)'/)?.[1];
    if (line.includes('image:')) currentProp.image = line.match(/image:\s*'([^']+)'/)?.[1];
    
    if (line.includes('  },') && line.trim() === '},') {
       if (currentProp.id && currentProp.id.startsWith('prop')) {
         props.push(currentProp);
       }
       currentProp = null;
    }
  }
}

console.log(JSON.stringify(props, null, 2));
