import { NestFactory } from "@nestjs/core";
import { AppModule } from "./main-app.module";
const fs = require('fs-extra');
const start =async()=>{
    try{
        const PORT = process.env.PORT || 5000;
        const app =await NestFactory.create(AppModule);
        async function returnStatic() {
            const TEMP_DIR = './.temp_static_backup';
            const DIST_STATIC = './dist/static';
            if (fs.existsSync(TEMP_DIR)) {
                await fs.copy(TEMP_DIR, DIST_STATIC);
                await fs.remove(TEMP_DIR); // Очищаем временную папку
                console.log('📂 restore: Copied', TEMP_DIR, '→', DIST_STATIC);
            
            }
        }
        await returnStatic()
        app.enableCors({
            origin: "http://localhost:3000",
            credentials: true,
        });
        await app.listen(PORT,()=>{console.log(`server was started on PORT ${PORT}`)})
    }catch(e){
        console.log(e);
    };
};

start()