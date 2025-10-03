import React, { useState } from "react";
import { LegionFormFields } from "./LegionFormFields";
import { Button } from "@/components/ui/button";

export interface LegionData {
  id?: string;
  name: string;
  description?: string;
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
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in values) {
      const value = values[key as keyof LegionData];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LegionFormFields values={values} onChange={handleChange} />
      <div className="flex justify-end gap-2">
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  );
};
