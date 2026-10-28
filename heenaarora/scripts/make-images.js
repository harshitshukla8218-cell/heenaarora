import sharp from 'sharp';

async function generateResponsiveAssets() {
  console.log('Generating optimized responsive assets for phone, tablet, and laptop...');

  // 1. Model extract: 0 to 1080 (width: 1080, height: 992)
  const modelRaw = await sharp('public/front-page.png')
    .extract({ left: 0, top: 0, width: 1080, height: 992 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Fade the bottom edge (last 80px) and right edge (last 45px) of the model smoothly into black
  {
    const { data, info } = modelRaw;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        let factor = 1.0;
        if (y > 910) {
          const dy = (y - 910) / (992 - 910);
          factor *= Math.cos(dy * Math.PI / 2);
        }
        if (x > 1030) {
          const dx = (x - 1030) / (1080 - 1030);
          factor *= Math.cos(dx * Math.PI / 2);
        }
        const idx = (y * info.width + x) * info.channels;
        data[idx] = Math.round(data[idx] * factor);
        data[idx + 1] = Math.round(data[idx + 1] * factor);
        data[idx + 2] = Math.round(data[idx + 2] * factor);
      }
    }
  }

  const modelProcessed = await sharp(modelRaw.data, {
    raw: { width: modelRaw.info.width, height: modelRaw.info.height, channels: modelRaw.info.channels }
  }).png().toBuffer();

  // 2. Logo extract: 1080 to 1560 (width: 480, height: 520)
  const logoRaw = await sharp('public/front-page.png')
    .extract({ left: 1080, top: 200, width: 480, height: 520 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Feather the outer 30px boundary of the logo box so it melts into black with zero seams
  {
    const { data, info } = logoRaw;
    const border = 30;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        let minD = Math.min(x, info.width - 1 - x, y, info.height - 1 - y);
        let factor = 1.0;
        if (minD < border) {
          factor = Math.sin((minD / border) * (Math.PI / 2));
        }
        const idx = (y * info.width + x) * info.channels;
        data[idx] = Math.round(data[idx] * factor);
        data[idx + 1] = Math.round(data[idx + 1] * factor);
        data[idx + 2] = Math.round(data[idx + 2] * factor);
      }
    }
  }

  const logoProcessed = await sharp(logoRaw.data, {
    raw: { width: logoRaw.info.width, height: logoRaw.info.height, channels: logoRaw.info.channels }
  }).png().toBuffer();

  // ==========================================
  // 1. MOBILE PHONE FRAME (1080 x 1600, Ratio 9:13.3)
  // Perfectly proportioned for smartphone screens
  // ==========================================
  await sharp({
    create: {
      width: 1080,
      height: 1600,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([
    { input: modelProcessed, top: 24, left: 0 },
    { input: logoProcessed, top: 1010, left: 300 }
  ])
  .png({ quality: 95 })
  .toFile('public/front-page-mobile.png');
  console.log('Created public/front-page-mobile.png');

  // ==========================================
  // 2. TABLET FRAME (1200 x 1560, Ratio ~ 3:3.9 / 3:4)
  // Perfectly proportioned for iPad and tablets
  // ==========================================
  await sharp({
    create: {
      width: 1200,
      height: 1560,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([
    { input: modelProcessed, top: 24, left: 60 },
    { input: logoProcessed, top: 1010, left: 360 }
  ])
  .png({ quality: 95 })
  .toFile('public/front-page-tablet.png');
  console.log('Created public/front-page-tablet.png');

  // ==========================================
  // 3. LAPTOP / DESKTOP FRAME (1728 x 1000, Ratio 1.73:1 / 16:9.3)
  // Designed for Laptop screens and Widescreen monitors
  // ==========================================
  await sharp({
    create: {
      width: 1728,
      height: 1000,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([
    { input: modelProcessed, top: 4, left: 0 },
    { input: logoProcessed, top: 240, left: 1140 }
  ])
  .png({ quality: 95 })
  .toFile('public/front-page-desktop.png');
  console.log('Created public/front-page-desktop.png');

  console.log('All responsive assets generated successfully!');
}

generateResponsiveAssets().catch(console.error);
