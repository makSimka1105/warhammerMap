import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanetData } from "./NewPlanetTab";
import { useAppSelector } from "@/hooks/useStore";
import { IMAGE_ACCEPT } from "@/lib/imageFile";

interface PlanetFormFieldsProps {
    values: PlanetData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isNew: boolean;
}

const legionFields = [
    { name: "legion1", label: "Легион 1" },
    { name: "legion2", label: "Легион 2" },
] as const;

export const PlanetFormFields: React.FC<PlanetFormFieldsProps> = ({ values, onChange, isNew }) => {
    const legions = useAppSelector((state) => state.reducerLegions.legions);

    return (
        <div className="grid gap-4">
            <div className="grid gap-3">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" value={values.name} onChange={onChange} required />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="ingamePosition">Корды в игре</Label>
                <Input
                    id="ingamePosition"
                    name="ingamePosition"
                    value={values.ingamePosition}
                    onChange={onChange}
                />
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
                <Label htmlFor="left">Расстояние по x</Label>
                <Input
                    id="left"
                    name="left"
                    type="number"
                    step="any"
                    value={values.left}
                    onChange={onChange}
                    required
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="top">Расстояние по y</Label>
                <Input
                    id="top"
                    name="top"
                    type="number"
                    step="any"
                    value={values.top}
                    onChange={onChange}
                    required
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="size">Размер</Label>
                <Input
                    id="size"
                    name="size"
                    type="number"
                    min="1"
                    step="any"
                    value={values.size}
                    onChange={onChange}
                    required
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="pic">{isNew ? "Иконка" : "Новая иконка (необязательно)"}</Label>
                <Input
                    type="file"
                    id="pic"
                    name="pic"
                    onChange={onChange}
                    accept={IMAGE_ACCEPT}
                    required={isNew}
                />
            </div>
            {legionFields.map(({ name, label }) => (
                <div key={name} className="grid gap-3">
                    <Label htmlFor={name}>{label}</Label>
                    <select id={name} name={name} value={values[name]} onChange={onChange}>
                        <option value="">без легиона</option>
                        {legions?.map((legion) => (
                            <option key={legion._id} value={legion._id}>{legion.name}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};
