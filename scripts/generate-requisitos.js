import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const outputDir = path.join(publicDir, 'requisitos');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Read properties from src/data.ts
const dataFile = fs.readFileSync(path.join(rootDir, 'src', 'data.ts'), 'utf-8');

function parsePropertiesFromData(code) {
  const props = [];
  const lines = code.split('\n');
  let currentBlock = [];
  let inProp = false;
  let bracketCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('export const properties: Property[] = [')) {
      inProp = true;
      continue;
    }
    if (!inProp) continue;
    if (line.trim() === '];') {
      break;
    }

    if (line.includes('{')) bracketCount += (line.match(/{/g) || []).length;
    if (line.includes('}')) bracketCount -= (line.match(/}/g) || []).length;

    currentBlock.push(line);

    if (bracketCount === 0 && currentBlock.length > 0 && currentBlock.join('\n').includes('id:')) {
      const blockStr = currentBlock.join('\n');
      
      const idMatch = blockStr.match(/id:\s*'([^']+)'/);
      const titleMatch = blockStr.match(/title:\s*'([^']+)'/);
      const subtitleMatch = blockStr.match(/subtitle:\s*'([^']+)'/);
      const priceMatch = blockStr.match(/price:\s*'([^']+)'/);
      const locationMatch = blockStr.match(/location:\s*'([^']+)'/);
      const streetsMatch = blockStr.match(/streets:\s*'([^']+)'/);
      const categoryMatch = blockStr.match(/category:\s*'([^']+)'/);
      const transactionTypeMatch = blockStr.match(/transactionType:\s*'([^']+)'/);
      const imageMatch = blockStr.match(/image:\s*'([^']+)'/);
      const bedsMatch = blockStr.match(/beds:\s*(\d+)/);
      const bathsMatch = blockStr.match(/baths:\s*(\d+)/);
      const areaMatch = blockStr.match(/area:\s*'([^']+)'/);
      const statusMatch = blockStr.match(/status:\s*'([^']+)'/);

      if (idMatch) {
        props.push({
          id: idMatch[1],
          title: titleMatch ? titleMatch[1] : 'Propiedad',
          subtitle: subtitleMatch ? subtitleMatch[1] : '',
          price: priceMatch ? priceMatch[1] : 'Consultar',
          location: locationMatch ? locationMatch[1] : '20 de Junio, Zona Oeste',
          streets: streetsMatch ? streetsMatch[1] : '',
          category: categoryMatch ? categoryMatch[1] : 'casas',
          transactionType: transactionTypeMatch ? transactionTypeMatch[1] : 'venta',
          image: imageMatch ? imageMatch[1] : '/iavana-molina-favion-cabecera.webp',
          beds: bedsMatch ? parseInt(bedsMatch[1], 10) : 0,
          baths: bathsMatch ? parseInt(bathsMatch[1], 10) : 0,
          area: areaMatch ? areaMatch[1] : 'Superficie a consultar',
          status: statusMatch ? statusMatch[1] : '',
        });
      }
      currentBlock = [];
    }
  }

  return props;
}

const properties = parsePropertiesFromData(dataFile);
console.log(`\n======================================================`);
console.log(`🔎 INMOBILIARIA WEBSITE - GENERADOR DE REQUISITOS HTML`);
console.log(`======================================================`);
console.log(`📋 Total de propiedades detectadas: ${properties.length}`);

// Locate property folder and look for any PDF files
function findPropertyPDF(prop) {
  if (!prop.image || prop.image.startsWith('http')) return null;

  try {
    const relativeFolder = path.dirname(prop.image).replace(/^\//, '');
    const absoluteFolder = path.join(publicDir, relativeFolder);

    if (fs.existsSync(absoluteFolder) && fs.statSync(absoluteFolder).isDirectory()) {
      const files = fs.readdirSync(absoluteFolder);
      const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'));
      if (pdfs.length > 0) {
        return {
          filename: pdfs[0],
          relativePath: path.join(relativeFolder, pdfs[0]),
          absolutePath: path.join(absoluteFolder, pdfs[0])
        };
      }
    }
  } catch (err) {
    // ignore folder search errors
  }
  return null;
}

function getSlug(prop) {
  return prop.id.replace(/^prop-/, '');
}

const CUSTOM_PROPERTY_REQUIREMENTS = {
  'prop-la-camella-alquiler': {
    priceFormatted: '$ 750.000 / mes',
    renderBody: (prop) => `
        <!-- SECCIÓN 1: PROPUESTA Y DESCRIPCIÓN DEL INMUEBLE -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🏡</div>
            <h2 class="req-card-title">Propuesta de Alquiler con Destino a Vivienda - 20 de Junio</h2>
          </div>
          <div style="color: #e5e5e5; font-size: 14px; margin-bottom: 16px; line-height: 1.7;">
            <p style="margin-bottom: 12px;"><strong>DESCRIPCIÓN:</strong></p>
            <p style="color: #d4d4d4; line-height: 1.7;">
              CASA CON UN LIVING COMEDOR AMPLIO, COCINA CON BAJO MESADA Y ALACENA DE ALGARROBO, MESADA DE MÁRMOL GRANITO. DOS HABITACIONES, UN VESTIDOR AMPLIO, DOS BAÑOS, UN QUINCHO CON PARRILLA, PILETA DE 9X5 MTS APROX, Y 2,20 MTS DE PROFUNDIDAD, ARBOLEDA AÑOSA. MUY BIEN UBICADA. A DOS CUADRAS Y MEDIA DEL ASFALTO.
            </p>
          </div>
          <ul class="req-list" style="margin-top: 16px;">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>DIRECCIÓN:</strong> CASAFFOUTHS 725, 20 DE JUNIO, LA MATANZA.-</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 2: REQUISITOS -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">💰</div>
            <h2 class="req-card-title">Requisitos</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>MES DE INGRESO:</strong> $750.000</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>MES DE DEPÓSITO DE GARANTÍA:</strong> $750.000</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>MES DE HONORARIOS POR INTERVENCIÓN DEL PROFESIONAL:</strong> $750.000</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 3: GARANTÍAS -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🛡️</div>
            <h2 class="req-card-title">Garantías</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>GARANTÍA PROPIETARIA (ESCRITURA):</strong> PEDIDO DE INFORMES A CARGO DEL INQUILINO</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>3 RECIBOS DE SUELDOS:</strong> QUE DUPLIQUEN EL VALOR DEL ALQUILER</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>SEGURO DE CAUCIÓN</strong></div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 4: CONTRATO Y AJUSTE -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">📄</div>
            <h2 class="req-card-title">Condiciones del Contrato</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>PLAZO:</strong> CONTRATO POR (2) DOS AÑOS.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>ACTUALIZACIÓN:</strong> AUMENTO CADA 4 MESES CON UN 12 % MÍNIMO REGIDO POR IPC.</div>
            </li>
          </ul>
        </section>
    `
  },
  'prop-rosalia-alquiler': {
    priceFormatted: '$ 1.250.000 / mes',
    renderBody: (prop) => `
        <!-- SECCIÓN 1: PROPUESTA Y DESCRIPCIÓN DETALLADA -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🏡</div>
            <h2 class="req-card-title">1. Propuesta de Alquiler – Vivienda Permanente</h2>
          </div>
          <p style="color: #e5e5e5; font-size: 14px; margin-bottom: 16px; line-height: 1.7;">
            Alquiler de Casa Quinta con pileta con destino a <strong>Vivienda Permanente</strong> en 20 de Junio, La Matanza.
          </p>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Ubicación y Acceso:</strong> Copahue esquina Rico, 20 de Junio, Partido de La Matanza, Buenos Aires. Acceso por ripio.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Superficie del Terreno:</strong> 2.100 m² con amplios espacios pensados para el descanso y la recreación.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Distribución Interior (5 ambientes):</strong> 3 habitaciones, un amplio living con sala de estar, cocina-comedor integrada y un baño completo. Distribución cómoda y funcional.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Sector Exterior y Recreación:</strong> Quincho equipado con parrilla y pileta de fibra de vidrio de aproximadamente 8 x 3 metros, brindando un entorno ideal para disfrutar al aire libre.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 2: REQUISITOS ECONÓMICOS DE INGRESO -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">💰</div>
            <h2 class="req-card-title">2. Requisitos Económicos de Ingreso</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Mes de Ingreso:</strong> $1.250.000 (primer mes de canon locativo).</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Mes de Depósito:</strong> $1.250.000 (en resguardo, reintegrable conforme al contrato).</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Mes de Honorarios:</strong> $1.250.000 (por gestión e intermediación profesional).</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Gastos Adicionales:</strong> Más gastos administrativos y pedidos de informes de dominio / inhibición.</div>
            </li>
            <li class="req-list-item" style="padding-top: 10px; border-top: 1px solid var(--card-border);">
              <div class="req-list-item-bullet"></div>
              <div><strong>Total de Ingreso:</strong> <strong style="color: var(--accent-gold); font-size: 15px;">$3.750.000</strong> (más gastos administrativos y pedidos de informes).</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 3: GARANTÍAS ACEPTADAS -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🛡️</div>
            <h2 class="req-card-title">3. Garantías Aceptadas</h2>
          </div>
          <p style="color: #a3a3a3; font-size: 13px; margin-bottom: 14px;">Presentar alguna de las siguientes opciones:</p>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Garantía Propietaria:</strong> Copia de escritura de inmueble. Pedido de informes a cargo del inquilino.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Seguro de Caución:</strong> Póliza emitida por compañía de caución aseguradora habilitada.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 4: PLAZO CONTRACTUAL Y ACTUALIZACIÓN -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">📄</div>
            <h2 class="req-card-title">4. Plazo Contractual y Modalidad de Actualización</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Período de Locación:</strong> Dos (2) años de contrato con destino a vivienda permanente.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Actualización:</strong> Cuatrimestral (cada 4 meses) según Índice de Precios al Consumidor (IPC) con un mínimo del 12%.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 5: CONDICIONES A TENER EN CUENTA -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">⚠️</div>
            <h2 class="req-card-title">5. Condiciones Particulares a Tener en Cuenta</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Uso Exclusivo:</strong> No pueden realizarse eventos comerciales ni fiestas masivas.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Seguro Contra Incendios:</strong> Póliza obligatoria por todo el período locado.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Tasas e Impuestos:</strong> El impuesto de Tasas Generales queda a cargo del inquilino.</div>
            </li>
          </ul>
        </section>
    `
  }
};

// Generate the HTML template
function generatePropertyRequirementsHTML(prop, pdfInfo) {
  const isAlquiler = prop.transactionType === 'alquiler';
  const slug = getSlug(prop);
  const customReq = CUSTOM_PROPERTY_REQUIREMENTS[prop.id] || CUSTOM_PROPERTY_REQUIREMENTS[slug];
  const isPetFriendly = prop.category !== 'locales';
  const categoryLabel = {
    'casas-quinta': 'Casa Quinta',
    'casas': 'Casa Residencial',
    'terrenos': 'Lote / Terreno',
    'departamentos': 'Departamento',
    'locales': 'Local Comercial'
  }[prop.category] || prop.category;

  const displayPrice = customReq && customReq.priceFormatted ? customReq.priceFormatted : prop.price;

  const whatsappMsg = encodeURIComponent(
    `Hola Ivana Molina Bienes Raíces. Leí los requisitos de la propiedad "${prop.title}" (${prop.location}) y quisiera recibir más información o coordinar una visita.`
  );

  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Requisitos de ${isAlquiler ? 'Alquiler' : 'Compra'} – ${prop.title} | Ivana Molina Bienes Raíces</title>
  <meta name="description" content="Conocé los requisitos y la documentación necesaria para ${isAlquiler ? 'alquilar' : 'comprar'} ${prop.title} en ${prop.location}. Ivana Molina & Asoc. Bienes Raíces (Mat. 1048 CDMDLM).">
  
  <!-- Favicons -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #030303;
      --card-bg: rgba(18, 18, 18, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.12);
      --text-muted: #a3a3a3;
      --accent-gold: #e6c587;
      --accent-green: #34d399;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Animated background glow */
    .aurora-bg {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .aurora-glow-1 {
      position: absolute;
      top: -20%;
      left: 20%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(230, 197, 135, 0.04) 0%, rgba(0,0,0,0) 70%);
      filter: blur(80px);
    }

    .aurora-glow-2 {
      position: absolute;
      bottom: -20%;
      right: 10%;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, rgba(0,0,0,0) 70%);
      filter: blur(80px);
    }

    .container {
      position: relative;
      z-index: 10;
      max-width: 1120px;
      margin: 0 auto;
      padding: 32px 20px 80px;
    }

    /* Navbar */
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      margin-bottom: 32px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #ffffff;
    }

    .brand img {
      height: 32px;
      width: auto;
    }

    .brand-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-family: 'Space Grotesk', sans-serif;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Property Banner Card */
    .property-banner {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 40px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    @media (min-width: 768px) {
      .property-banner {
        grid-template-columns: 360px 1fr;
      }
    }

    .property-cover {
      position: relative;
      min-height: 240px;
      background: #111;
    }

    .property-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
    }

    .property-cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 60%, rgba(3, 3, 3, 0.8));
    }

    .property-info {
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .badge {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
    }

    .badge-primary {
      background: rgba(230, 197, 135, 0.15);
      color: var(--accent-gold);
      border: 1px solid rgba(230, 197, 135, 0.3);
    }

    .badge-type {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border: 1px solid var(--card-border);
    }

    .badge-status {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .property-title {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
      color: #ffffff;
    }

    .property-location {
      font-size: 13px;
      color: var(--text-muted);
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--card-border);
    }

    @media (min-width: 500px) {
      .specs-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .spec-item span:first-child {
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .spec-item span:last-child {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
    }

    /* Content Layout */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 900px) {
      .main-grid {
        grid-template-columns: 1fr 340px;
      }
    }

    /* Section Cards */
    .req-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 24px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: border-color 0.3s ease;
    }

    .req-card:hover {
      border-color: var(--card-hover);
    }

    .req-card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--card-border);
    }

    .req-card-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .req-card-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .req-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .req-list-item {
      display: flex;
      gap: 12px;
      font-size: 14px;
      color: #d4d4d4;
      line-height: 1.6;
    }

    .req-list-item-bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-gold);
      margin-top: 8px;
      flex-shrink: 0;
      opacity: 0.6;
    }

    .req-list-item strong {
      color: #ffffff;
    }

    .sticky-box {
      position: sticky;
      top: 32px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .sidebar-title {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .sidebar-price {
      font-size: 28px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      color: #ffffff;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
    }

    .btn-whatsapp {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px;
      border-radius: 12px;
      background: #ffffff;
      color: #030303;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
      margin-bottom: 12px;
      transition: transform 0.2s;
    }

    .btn-whatsapp:hover { transform: translateY(-2px); }

    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      color: #ffffff;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      text-decoration: none;
      margin-bottom: 24px;
    }

    .office-info {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .footer {
      border-top: 1px solid var(--card-border);
      padding: 40px 0;
      margin-top: 80px;
      text-align: center;
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .alert-box {
      background: rgba(230, 197, 135, 0.08);
      border: 1px solid rgba(230, 197, 135, 0.2);
      border-radius: 14px;
      padding: 20px;
      margin-top: 24px;
      color: var(--accent-gold);
      font-size: 13px;
      display: flex;
      gap: 12px;
    }
  </style>
</head>
<body>

  <div class="aurora-bg">
    <div class="aurora-glow-1"></div>
    <div class="aurora-glow-2"></div>
  </div>

  <div class="container">
    
    <header class="navbar">
      <a href="/" class="brand">
        <img src="/iavana-molina-favion-cabecera.webp" alt="Logo">
        <span class="brand-title">IVANA MOLINA & ASOC.</span>
      </a>
      <a href="/#todas-propiedades" class="back-btn">← Volver al Catálogo</a>
    </header>

    <div class="property-banner">
      <div class="property-cover">
        <img src="${prop.image}" alt="${prop.title}">
        <div class="property-cover-overlay"></div>
      </div>
      <div class="property-info">
        <div>
          <div class="badge-row">
            <span class="badge badge-primary">✦ Ficha de Requisitos</span>
            <span class="badge badge-type">${isAlquiler ? 'En Alquiler' : 'En Venta'}</span>
            <span class="badge badge-primary">${categoryLabel}</span>
          </div>
          <h1 class="property-title">${prop.title}</h1>
          <p class="property-location">📍 ${prop.location}</p>
        </div>
        <div class="specs-grid">
          <div class="spec-item"><span>Dorm</span><span>${prop.beds || '—'}</span></div>
          <div class="spec-item"><span>Baños</span><span>${prop.baths || '—'}</span></div>
          <div class="spec-item"><span>Sup</span><span>${prop.area || '—'}</span></div>
          <div class="spec-item"><span>Mascotas</span><span>${isPetFriendly ? 'Sí 🐾' : 'No'}</span></div>
        </div>
      </div>
    </div>

    <div class="main-grid">
      
      <!-- Left Column: Detailed Requirements -->
      <main>
        
        ${customReq ? customReq.renderBody(prop) : (isAlquiler ? `
        <!-- SECCIÓN 1: REQUISITOS DEL INQUILINO / SOLICITANTE -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">📋</div>
            <h2 class="req-card-title">1. Requisitos del Solicitante / Inquilino</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Demostración de Ingresos:</strong> Justificación de ingresos formales comprobables (recibos de sueldo, constancia de inscripción en AFIP/ARCA, monotributo o certificación contable de ingresos).</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Relación Ingreso / Canon:</strong> El total de ingresos netos del grupo familiar o titular debe triplicar o duplicar con solidez el valor del canon locativo mensual.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Antigüedad Laboral:</strong> Mínimo de 1 año de antigüedad en relación de dependencia o actividad comercial activa.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Informe Crediticio:</strong> Verificación de antecedentes comerciales y crediticios limpios (sin informes negativos en Veraz / Nosis).</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 2: DOCUMENTACIÓN A PRESENTAR -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">📄</div>
            <h2 class="req-card-title">2. Documentación a Presentar</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Documento de Identidad:</strong> Fotocopia / PDF de DNI (frente y dorso) del titular y de todos los ocupantes mayores de edad.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Comprobantes de Ingresos:</strong> Últimos 3 recibos de sueldo con firma empleadora o últimas 3 declaraciones juradas / facturación con constancia de CUIT.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Comprobante de Domicilio:</strong> Factura de servicio reciente (luz, gas, internet o resumen bancario) a nombre del solicitante.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 3: GARANTÍAS ACEPTADAS -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🛡️</div>
            <h2 class="req-card-title">3. Garantías Aceptadas</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Garantía Propietaria:</strong> Inmueble libre de gravámenes, hipotecas o embargos. Presentar copia de escritura y DNI del titular.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Seguro de Caución:</strong> Aceptamos pólizas de caución de primera línea reconocidas.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Garantes con Recibo de Sueldo:</strong> Sujeto a previa evaluación según cantidad y montos de los garantes presentados.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 4: CONDICIONES ECONÓMICAS DE INGRESO -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">💰</div>
            <h2 class="req-card-title">4. Condiciones Económicas de Ingreso</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Mes de Adelanto:</strong> Correspondiente al primer mes de alquiler a la firma del contrato.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Mes de Depósito en Garantía:</strong> En resguardo del estado del inmueble, reintegrable a la finalización del contrato.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Honorarios Profesionales:</strong> Conforme a las normativas del Colegio de Martilleros y Corredores Públicos de La Matanza (CDMDLM).</div>
            </li>
          </ul>
        </section>
        ` : `
        <!-- SECCIÓN 1: PROCESO Y CONDICIONES DE COMPRAVENTA -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🏛️</div>
            <h2 class="req-card-title">1. Proceso de Compraventa</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Reserva:</strong> Formalización mediante reserva sujeta a aceptación de títulos.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Escrituración:</strong> Redacción por escribanía designada.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 2: DOCUMENTACIÓN DEL COMPRADOR -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">📄</div>
            <h2 class="req-card-title">2. Documentación a Presentar</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Identificación:</strong> DNI original y copia del comprador.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Constancia Impositiva:</strong> Constancia de CUIT / CUIL.</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 3: GASTOS Y HONORARIOS -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">💰</div>
            <h2 class="req-card-title">3. Gastos de Escrituración y Honorarios</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Gastos Notariales:</strong> Según ley (honorarios, sellados, tasas).</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Honorarios Inmobiliarios:</strong> 4% del valor total de la operación (Mat. 1048 CDMDLM).</div>
            </li>
          </ul>
        </section>

        <!-- SECCIÓN 4: ASESORAMIENTO -->
        <section class="req-card">
          <div class="req-card-header">
            <div class="req-card-icon">🤝</div>
            <h2 class="req-card-title">4. Asesoramiento Integral</h2>
          </div>
          <ul class="req-list">
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Visitas:</strong> Acompañamiento profesional en cada recorrida.</div>
            </li>
            <li class="req-list-item">
              <div class="req-list-item-bullet"></div>
              <div><strong>Operaciones Simultáneas:</strong> Tasación y coordinación de compra-venta.</div>
            </li>
          </ul>
        </section>
        `)}

        <div class="alert-box">
          <span style="font-size: 20px;">🔒</span>
          <div>
            <strong>Confidencialidad y Seguridad Jurídica:</strong> Todas las operaciones y consultas son administradas bajo estricta confidencialidad por el equipo matriculado de <em>IVANA MOLINA & ASOC. BIENES RAÍCES (Mat. 1048 CDMDLM)</em>.
          </div>
        </div>

      </main>

      <!-- Right Column: Sticky Contact Sidebar -->
      <aside class="sidebar">
        <div class="sticky-box">
          <div class="sidebar-title">Valor de la Propiedad</div>
          <div class="sidebar-price">${displayPrice}</div>

          <a href="https://wa.me/5491168091223?text=${whatsappMsg}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Consultar por WhatsApp
          </a>

          <a href="/?prop=${prop.id}" class="btn-secondary">
            Ver Ficha Completa
          </a>

          <div class="office-info font-mono">
            <p><strong>Oficina Oficial:</strong></p>
            <p>Manuel Castro 1420, 20 de Junio</p>
            <p>La Matanza, Buenos Aires</p>
            <br>
            <p><strong>Contacto Directo:</strong></p>
            <p>011- 6809 1223 / 011- 4405 1974</p>
            <p>molinaivanabr@gmail.com</p>
            <br>
            <p><strong>Martillera Pública:</strong></p>
            <p>Mat. Nro 1048 CDMDLM</p>
          </div>
        </div>
      </aside>

    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>IVANA MOLINA & ASOC. BIENES RAÍCES · MATRÍCULA NRO: 1048</p>
      <p style="margin-top: 6px; opacity: 0.7;">Martillera Pública, Corredora Inmobiliaria y Administradora de Consorcios.</p>
    </footer>

  </div>

</body>
</html>`;
}

// Generate all files
let count = 0;
let pdfCount = 0;

for (const prop of properties) {
  const pdfInfo = findPropertyPDF(prop);
  if (pdfInfo) {
    pdfCount++;
    console.log(`📄 PDF de requisitos detectado para "${prop.title}": ${pdfInfo.relativePath}`);
  }

  const html = generatePropertyRequirementsHTML(prop, pdfInfo);
  const slug = getSlug(prop);

  // Write by slug e.g. /requisitos/cosquin-1120.html
  const slugPath = path.join(outputDir, `${slug}.html`);
  fs.writeFileSync(slugPath, html, 'utf-8');

  // Also write by ID e.g. /requisitos/prop-cosquin-1120.html to guarantee 100% compatibility
  const idPath = path.join(outputDir, `${prop.id}.html`);
  fs.writeFileSync(idPath, html, 'utf-8');

  count++;
}

console.log(`\n======================================================`);
console.log(`✅ ${count} fichas HTML generadas en /public/requisitos/`);
console.log(`📄 PDFs encontrados en carpetas: ${pdfCount}`);
console.log(`💡 Cuando agregues PDFs en las carpetas de las propiedades,`);
console.log(`   ejecutá "npm run generate:requisitos" para actualizar`);
console.log(`======================================================\n`);
