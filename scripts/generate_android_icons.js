import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const svgContent = fs.readFileSync('public/icon.svg', 'utf-8');

// 1. Standard square/rounded icon (uses public/icon.svg directly)
// 2. Round icon (clipped by circle)
const roundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="circleMask">
      <circle cx="256" cy="256" r="256" />
    </clipPath>
  </defs>
  <g clip-path="url(#circleMask)">
    ${svgContent.replace(/<\/?svg[^>]*>/g, '')}
  </g>
</svg>
`;

// 3. Adaptive Foreground Icon:
// Canvas is 512x512. Android adaptive icon safe zone is center 66%.
// We scale the whole icon to 72% (368x368) and center it with (72, 72) offset.
const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(72, 72) scale(0.71875)">
    ${svgContent.replace(/<\/?svg[^>]*>/g, '')}
  </g>
</svg>
`;

const densities = [
  { name: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { name: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { name: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { name: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432 }
];

for (const d of densities) {
  const dir = path.join('android/app/src/main/res', d.name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Standard icon
  const resvgSquare = new Resvg(svgContent, { fitTo: { mode: 'width', value: d.size } });
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), resvgSquare.render().asPng());

  // Round icon
  const resvgRound = new Resvg(roundSvg, { fitTo: { mode: 'width', value: d.size } });
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), resvgRound.render().asPng());

  // Adaptive Foreground
  const resvgFg = new Resvg(foregroundSvg, { fitTo: { mode: 'width', value: d.fgSize } });
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), resvgFg.render().asPng());

  console.log(`Generated icons for ${d.name}`);
}

console.log('All Android mipmap icons generated successfully!');
