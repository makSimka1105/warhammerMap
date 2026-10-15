import React from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { NewLegionTab, LegionData } from "./NewLegionTab";

interface LegionEditDrawerProps {
    initialData: LegionData | null;
    onClose: () => void;
    onSave: (formData: FormData, id: string) => void;
}

export const LegionEditDrawer: React.FC<LegionEditDrawerProps> = ({
    initialData,
    onClose,
    onSave,
}) => (
    <Drawer open={initialData !== null} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="flex flex-col h-full max-w-xl">
            <DrawerHeader>
                <DrawerTitle>Редактировать легион</DrawerTitle>
                <DrawerDescription>Измените данные легиона и сохраните</DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-6">
                {initialData && (
                    <NewLegionTab
                        initialValues={initialData}
                        onSubmit={(formData) => onSave(formData, initialData.id ?? "")}
                    />
                )}
            </div>

            <DrawerFooter className="flex-shrink-0">
                <DrawerClose asChild>
                    <Button>Закрыть</Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
);
