import React, { useState } from "react";
import { toast } from "sonner";
import { LegionFormFields } from "./LegionFormFields";
import { Button } from "@/components/ui/button";
import { imageError } from "@/lib/imageFile";

export interface LegionData {
    id?: string;
    name: string;
    description: string;
    icon: File | null;
}

interface NewLegionTabProps {
    initialValues: LegionData;
    onSubmit: (data: FormData) => void;
}

export const NewLegionTab: React.FC<NewLegionTabProps> = ({ initialValues, onSubmit }) => {
    const [values, setValues] = useState<LegionData>(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: name === "icon" ? (files?.[0] ?? null) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!values.name.trim()) {
            toast.error("Укажите название легиона");
            return;
        }
        const iconError = values.icon && imageError(values.icon);
        if (iconError) {
            toast.error(iconError);
            return;
        }

        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("description", values.description);
        if (values.icon) {
            formData.append("icon", values.icon);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <LegionFormFields values={values} onChange={handleChange} isNew={!initialValues.id} />
            <div className="flex justify-end gap-2">
                <Button type="submit">Сохранить</Button>
            </div>
        </form>
    );
};
