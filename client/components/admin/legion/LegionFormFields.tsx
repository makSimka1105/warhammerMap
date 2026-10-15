import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegionData } from "./NewLegionTab";
import { IMAGE_ACCEPT } from "@/lib/imageFile";

interface LegionFormFieldsProps {
    values: LegionData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isNew: boolean;
}

export const LegionFormFields: React.FC<LegionFormFieldsProps> = ({ values, onChange, isNew }) => (
    <div className="grid gap-4">
        <div className="grid gap-3">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" name="name" value={values.name} onChange={onChange} required />
        </div>

        <div className="grid gap-3">
            <Label htmlFor="description">Описание</Label>
            <Input
                id="description"
                name="description"
                value={values.description}
                onChange={onChange}
            />
        </div>

        <div className="grid gap-3">
            <Label htmlFor="icon">{isNew ? "Иконка" : "Новая иконка (необязательно)"}</Label>
            <Input
                type="file"
                id="icon"
                name="icon"
                onChange={onChange}
                accept={IMAGE_ACCEPT}
                required={isNew}
            />
        </div>
    </div>
);
