import { useState } from "react";
import { de } from "zod/v4/locales";

const InputTextCustom = () => {
    const [inputValue, setInputValue] = useState("Введите текст");



const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
            setInputValue(event.target.value);
};

    return (
        <div className="relative w-64 h-12 border-2 border-gray-300 rounded-lg">
            <input 
                type="text" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                placeholder=" " 
                onChange={handleInputChange} // Добавляем обработчик
            />
            <div className="flex items-center justify-center h-full text-gray-500 pointer-events-none">
                <span className="absolute">{inputValue}</span>
            </div>
        </div>
    );
};

export default InputTextCustom;