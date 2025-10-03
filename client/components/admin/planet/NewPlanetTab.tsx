// NewPlanetTab.tsx
import React, { useState } from "react";
import { PlanetFormFields, PlanetFormFieldsProps } from "./PlanetFormFields";
import { Button } from "@/components/ui/button";

export interface PlanetData {
    id?: string;
    name: string;
    ingamePosition: string;
    description?: string;
    left: string;
    top: string;
    size: string;
    pic: File | null;
    legion1?: string;
    legion2?: string;
}

interface NewPlanetTabProps {
    initialValues: PlanetData;
    onSubmit: (data: FormData) => void;
}

export const NewPlanetTab: React.FC<NewPlanetTabProps> = ({ initialValues, onSubmit }) => {
    const [values, setValues] = useState<PlanetData>(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files} = e.target;


        setValues(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));

    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        for (const key in values) {
            const typedKey = key as keyof PlanetData;
            const value = values[typedKey];


            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((file) => {
                    if (file instanceof File) {
                        formData.append(key, file);
                    }
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        }

        onSubmit(formData);
    };

    const handleReset = () => {
        setValues(initialValues);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <PlanetFormFields values={values} onChange={handleChange} />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleReset}>
                    Сбросить
                </Button>
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    );
};
