const fs = require('fs-extra');
const { execSync } = require('child_process');


async function startDevWithStatic() {
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
    console.log('⚙️  starting Nest...');
    execSync('nest start', { stdio: 'inherit' });
    console.log('✅ started .');

    // 3. Возвращаем static в dist
   
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

startDevWithStatic();
