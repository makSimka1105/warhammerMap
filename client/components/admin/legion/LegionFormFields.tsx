// PlanetFormFields.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LegionData } from "./NewLegionTab";
import { useAppSelector } from "@/hooks/useStore";


export interface LegionFormFieldsProps {
  values:LegionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LegionFormFields: React.FC<LegionFormFieldsProps> = ({ values, onChange }) => {



  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          name="name"
          value={values.name}
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
        <Label htmlFor="icon">Иконка</Label>
        <Input
          type="file"
          id="icon"
          name="icon"
          onChange={onChange}
          accept="image/*"
          value={undefined}
        />
      </div>
     
      
    </div>
  );
};
