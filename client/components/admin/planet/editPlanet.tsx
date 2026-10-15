import React from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { NewPlanetTab, PlanetData } from "./NewPlanetTab";

interface PlanetEditDrawerProps {
    initialData: PlanetData | null;
    onClose: () => void;
    onSave: (formData: FormData, id: string) => void;
}

export const PlanetEditDrawer: React.FC<PlanetEditDrawerProps> = ({
    initialData,
    onClose,
    onSave,
}) => (
    <Drawer open={initialData !== null} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="flex flex-col h-full max-w-xl">
            <DrawerHeader>
                <DrawerTitle>Редактировать планету</DrawerTitle>
                <DrawerDescription>Измените данные планеты и сохраните</DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-6">
                {initialData && (
                    <NewPlanetTab
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
