import fs from 'fs';

let data = fs.readFileSync('src/data.ts', 'utf-8');
const lines = data.split('\n');

let start = -1;
let end = -1;
let inProp = false;

// Buscar 'prop-juan-pio-gana'
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('  {') && line.trim() === '{') {
    inProp = true;
    start = i;
  }
  if (inProp && line.includes("id: 'prop-juan-pio-gana'")) {
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
  // Extraer el bloque
  let propLines = lines.splice(start, end - start + 1);
  let propText = propLines.join('\n');
  
  // Cambiar isFeatured: true a isFeatured: false
  propText = propText.replace(/isFeatured:\s*true,/, 'isFeatured: false,');
  
  // Buscar donde termina el array properties (antes del ]; final o simplemente al final de los elementos de array)
  // Como al final puede haber otras variables, buscaremos el cierre del array
  let arrayEndIndex = -1;
  let arrayCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export const properties: Property[] = [')) {
      arrayCount++;
    }
    if (arrayCount > 0) {
      if (lines[i].trim() === '];') {
        arrayEndIndex = i;
        break;
      }
    }
  }

  if (arrayEndIndex !== -1) {
    // Insertar justo antes del cierre ];
    lines.splice(arrayEndIndex, 0, propText);
    fs.writeFileSync('src/data.ts', lines.join('\n'));
    console.log('Propiedad movida al final exitosamente.');
  } else {
    console.log('No se encontro el final del array properties.');
  }

} else {
  console.log('No se encontro Juan Pio Gana.');
}
