async function returnStatic() {
            const TEMP_DIR = './.temp_static_backup';
            const DIST_STATIC = './dist/static';
            if (fs.existsSync(TEMP_DIR)) {
                  await fs.copy(TEMP_DIR, DIST_STATIC);
                  await fs.remove(TEMP_DIR); // Очищаем временную папку
                  console.log('📂 restore: Copied', TEMP_DIR, '→', DIST_STATIC);
            
            }
}
returnStatic()