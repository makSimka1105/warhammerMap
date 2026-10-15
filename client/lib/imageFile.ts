const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

export const imageError = (file: File): string | null => {
    if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
        return `Файл ${file.name}: допустимы только png, jpeg и webp`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return `Файл ${file.name}: размер больше 4 МБ`;
    }
    return null;
};
