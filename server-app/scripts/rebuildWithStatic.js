const fs = require('fs-extra');
const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

async function buildAndCopyStatic() {
  const TEMP_DIR = './.temp_static_backup';
  const DIST_STATIC = './dist/static';

  try {
            if(!fs.existsSync(TEMP_DIR)){
                        await fs.mkdirSync(TEMP_DIR)
            }
    // 1. Копируем static во временную папку (если она есть)
    if (fs.existsSync(DIST_STATIC)) {
            
      await fs.copy(DIST_STATIC, TEMP_DIR);
      console.log('📂 backup: Copied static →', TEMP_DIR);
    }

    // 2. Запускаем сборку Nest (очищает dist)
    console.log('⚙️  Building Nest...');
    execSync('nest build', { stdio: 'inherit' });
    console.log('✅ Build completed.');

    // 3. Возвращаем static в dist
    if (fs.existsSync(TEMP_DIR)) {
      await fs.copy(TEMP_DIR, DIST_STATIC);
      await fs.remove(TEMP_DIR); // Очищаем временную папку
      console.log('📂 restore: Copied', TEMP_DIR, '→', DIST_STATIC);

    }
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

buildAndCopyStatic();
