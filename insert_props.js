import fs from 'fs';

let data = fs.readFileSync('src/data.ts', 'utf-8');
const lines = data.split('\n');

let start = -1;
let end = -1;
let inProp = false;

// Encontrar la propiedad prop-13
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('  {') && line.trim() === '{') {
    inProp = true;
    start = i;
  }
  if (inProp && line.includes("id: 'prop-13'")) {
    // Es prop-13
    for (let j = i; j < lines.length; j++) {
      if (lines[j].includes('  },') && lines[j].trim() === '},') {
        end = j;
        break;
      }
    }
    break;
  }
}

if (start !== -1 && end !== -1) {
  const propLines = lines.slice(start, end + 1);
  const propText = propLines.join('\n');
  
  // Crear Depto Copahue
  let depto = propText.replace(/id:\s*'prop-13'/, "id: 'prop-copahue-depto'");
  depto = depto.replace(/title:\s*'[^']+'/, "title: 'La Rosalía - Departamento Independiente'");
  depto = depto.replace(/subtitle:\s*'[^']+'/, "subtitle: 'Departamento de 2 habitaciones en Lote Propio'");
  depto = depto.replace(/price:\s*'[^']+'/, "price: 'USD 80.000'");
  depto = depto.replace(/priceNumeric:\s*\d+/, "priceNumeric: 80000");
  
  // Crear Casa Rosalia
  let casa = propText.replace(/id:\s*'prop-13'/, "id: 'prop-copahue-rosalia'");
  casa = casa.replace(/title:\s*'[^']+'/, "title: 'La Rosalía Quinta - Casa Principal'");
  casa = casa.replace(/subtitle:\s*'[^']+'/, "subtitle: 'Magnífica Casa con Parque y Piscina (Opción Subdivisión)'");
  casa = casa.replace(/price:\s*'[^']+'/, "price: 'USD 135.000'");
  casa = casa.replace(/priceNumeric:\s*\d+/, "priceNumeric: 135000");
  
  // Insertar los dos nuevos strings después del end de prop-13
  lines.splice(end + 1, 0, depto, casa);
  
  fs.writeFileSync('src/data.ts', lines.join('\n'));
  console.log('Fichas de Copahue creadas exitosamente.');
} else {
  console.log('No se pudo encontrar prop-13');
}
