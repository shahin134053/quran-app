/**
 * Helper utility for downloading the official app logo assets in high resolution (SVG or PNG)
 */

export async function downloadAppLogoSvg(filename = 'Al_Shahin_Quran_Logo.svg') {
  try {
    const response = await fetch('/icon.svg');
    const svgText = await response.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download SVG logo:', err);
    return false;
  }
}

export async function downloadAppLogoPng(size = 1024, filename = 'Al_Shahin_Quran_Logo_1024x1024.png') {
  try {
    const response = await fetch('/icon.svg');
    const svgText = await response.text();
    
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(false);
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pngUrl);
            URL.revokeObjectURL(url);
            resolve(true);
          } else {
            URL.revokeObjectURL(url);
            resolve(false);
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  } catch (err) {
    console.error('Failed to download PNG logo:', err);
    return false;
  }
}
