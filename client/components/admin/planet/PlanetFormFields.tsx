// PlanetFormFields.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanetData } from "./NewPlanetTab";
import { useAppSelector } from "@/hooks/useStore";


export interface PlanetFormFieldsProps {
  values: PlanetData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const PlanetFormFields: React.FC<PlanetFormFieldsProps> = ({ values, onChange }) => {

  const { legions, loading, error } = useAppSelector(
    (state) => state.reducerLegions
  );
  if (legions == null) {
    return null
  }


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
        <Label htmlFor="ingamePosition">Корды</Label>
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
        <Label htmlFor="left">Лево</Label>
        <Input
          id="left"
          name="left"
          value={values.left}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="top">Вверх</Label>
        <Input
          id="top"
          name="top"
          value={values.top}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="size">Размер</Label>
        <Input
          id="size"
          name="size"
          value={values.size}
          onChange={onChange}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="pic">Иконка</Label>
        <Input
          type="file"
          id="pic"
          name="pic"
          value={undefined}
          onChange={onChange}
          accept="image/*"
        />
      </div>
      {/* Добавляем выбор легионов */}
      <div className="grid gap-3">
        <Label htmlFor="legion1">Легион 1</Label>
        <select
          id="legion1"
          name="legion1"
          // value={legions[0]}
          onChange={onChange}
          className="input"
          value={values.legion1} // добавить стили под ваш Input, если нужно
        >
          <option value="">без легиона</option>
          {values.legion1 && <option value={values.legion1}>текущий легион</option>}
          {legions.map((legion) => (
            <option key={legion._id} value={legion._id}>{legion.name}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="legion2">Легион 2</Label>
        <select
          id="legion2"
          name="legion2"
          // value={legions[0]}
          onChange={onChange}
          className="input"
          value={values.legion2} // добавить стили под ваш Input, если нужно
        // добавить стили под ваш Input, если нужно
        >

          <option value="">без легиона</option>
          {values.legion2 && <option value={values.legion2}>текущий легион</option>}
          {legions.map((legion) => (
            <option key={legion._id} value={legion._id}>{legion.name}</option>
          ))}
        </select>
      </div>


    </div>
  );
};
