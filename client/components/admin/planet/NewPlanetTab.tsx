import React, { useState } from "react";
import { toast } from "sonner";
import { PlanetFormFields } from "./PlanetFormFields";
import { Button } from "@/components/ui/button";
import { imageError } from "@/lib/imageFile";

export interface PlanetData {
    id?: string;
    name: string;
    ingamePosition: string;
    description: string;
    left: string;
    top: string;
    size: string;
    pic: File | null;
    legion1: string;
    legion2: string;
}

interface NewPlanetTabProps {
    initialValues: PlanetData;
    onSubmit: (data: FormData) => void;
}

export const NewPlanetTab: React.FC<NewPlanetTabProps> = ({ initialValues, onSubmit }) => {
    const [values, setValues] = useState<PlanetData>(initialValues);
    const [formKey, setFormKey] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const file = (e.target as HTMLInputElement).files?.[0] ?? null;

        setValues(prev => ({
            ...prev,
            [name]: name === "pic" ? file : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!values.name.trim()) {
            toast.error("Укажите название планеты");
            return;
        }
        if (values.legion1 && values.legion1 === values.legion2) {
            toast.error("Выберите два разных легиона");
            return;
        }
        const picError = values.pic && imageError(values.pic);
        if (picError) {
            toast.error(picError);
            return;
        }

        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("ingamePosition", values.ingamePosition);
        formData.append("description", values.description);
        formData.append("left", values.left);
        formData.append("top", values.top);
        formData.append("size", values.size);
        formData.append("legion1", values.legion1);
        formData.append("legion2", values.legion2);
        if (values.pic) {
            formData.append("pic", values.pic);
        }

        onSubmit(formData);
    };

    const handleReset = () => {
        setValues(initialValues);
        setFormKey(key => key + 1);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PlanetFormFields
                key={formKey}
                values={values}
                onChange={handleChange}
                isNew={!initialValues.id}
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleReset}>
                    Сбросить
                </Button>
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    );
};
