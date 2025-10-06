import { NestFactory } from "@nestjs/core";
import { AppModule } from "./main-app.module";
import fs from 'fs-extra';
const start = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        const app = await NestFactory.create(AppModule);
        async function returnStatic() {
            const TEMP_DIR = './.temp_static_backup';
            const DIST_STATIC = './dist/static';
            try {
                await fs.copy(TEMP_DIR, DIST_STATIC);
                await fs.remove(TEMP_DIR); // Очищаем временную папку
                console.log('📂 restore: Copied', TEMP_DIR, '→', DIST_STATIC);
                
            } catch (error) {
                console.log("ошибка копирования ститики",error)
            }
        
        }
        await returnStatic()
        app.enableCors({
            origin: "http://45.141.76.253", // разрешенный адрес сайта
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'// разрешенные методы
        });

        await app.listen(PORT, () => { console.log(`server was started on  ${PORT}`) })
        await returnStatic();

    } catch (e) {
        console.log(e);
    };
};

start()