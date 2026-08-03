import fs from 'fs';

// 1. data.ts
let data = fs.readFileSync('src/data.ts', 'utf-8');
// Remover export const testimonials y stats enteros
const regexTestimonials = /export const testimonials:\s*Testimonial\[\]\s*=\s*\[[\s\S]*?\];/g;
const regexStats = /export const stats:\s*Stat\[\]\s*=\s*\[[\s\S]*?\];/g;
data = data.replace(regexTestimonials, '');
data = data.replace(regexStats, '');
// Remover imports en data.ts (Testimonial, Stat)
data = data.replace(/,\s*Testimonial,\s*Stat/, '');
fs.writeFileSync('src/data.ts', data);

// 2. types.ts
let types = fs.readFileSync('src/types.ts', 'utf-8');
const regexTestType = /export interface Testimonial\s*\{[\s\S]*?\}/g;
const regexStatType = /export interface Stat\s*\{[\s\S]*?\}/g;
types = types.replace(regexTestType, '');
types = types.replace(regexStatType, '');
fs.writeFileSync('src/types.ts', types);

// 3. index.css
let css = fs.readFileSync('src/index.css', 'utf-8');
const marqueeCss = /\/\* Infinite testimonials marquee animation \*\/[\s\S]*?\}\s*\}/g;
css = css.replace(marqueeCss, '');
fs.writeFileSync('src/index.css', css);

console.log('Cleanup completado');
