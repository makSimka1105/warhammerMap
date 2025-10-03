import React, { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LegionData, NewLegionTab } from "./NewLegionTab";

interface LegionEditDrawerProps {
  initialData: LegionData | null; // Данные планеты для редактирования
  isOpen: boolean;                // Флаг открытия дровера
  onClose: () => void;            // Коллбек закрытия
  onSave: (formData: FormData,id:string) => void; // Коллбек сохранения
}

export const LegionEditDrawer: React.FC<LegionEditDrawerProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
}) => {
  // Локальное состояние для передачи в форму
  const [legionData, setLegionData] = useState<LegionData | null>(initialData);

  // При изменении initialData обновлять planetData
  useEffect(() => {
    setLegionData(initialData);
  }, [initialData]);

  if (!legionData) return null; // если данных нет, ничего не показываем

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="flex flex-col h-full max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Редактировать планету</DrawerTitle>
          <DrawerDescription>Измените данные планеты и сохраните</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <NewLegionTab
            initialValues={legionData}
            onSubmit={(formData:FormData) => {
              onSave(formData,legionData.id||"");
              onClose();
            }}
          />
        </div>

        <DrawerFooter className="flex-shrink-0">
          <DrawerClose asChild>
            <Button onClick={onClose}>Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
