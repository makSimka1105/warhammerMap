import React, {useState} from "react";


interface UseInputReturn {
            value: string;
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useInput = (initialValue: string): UseInputReturn => {
            const [value, setValue] = useState<string>(initialValue);

            const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
                        setValue(e.target.value);
            };

            return {
                        value, onChange
            };
}

