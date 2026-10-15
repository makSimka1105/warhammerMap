"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { PlanetData, NewPlanetTab } from "./planet/NewPlanetTab";
import { useAppDispatch } from "@/hooks/useStore";
import { createPlanet } from "@/lib/slices/planetSlices";
import { LegionData, NewLegionTab } from "./legion/NewLegionTab";
import { createLegion } from "@/lib/slices/legionSlices";
import { refreshCatalog } from "@/lib/slices/refreshCatalog";
import { toast } from "sonner";
import { useState } from "react";

const emptyPlanet: PlanetData = {
    name: "",
    ingamePosition: "",
    description: "",
    left: "",
    top: "",
    size: "",
    pic: null,
    legion1: "",
    legion2: "",
};

const emptyLegion: LegionData = {
    name: "",
    description: "",
    icon: null,
};

export function DrawerWithTabsAndForm() {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const handleSavePlanets = async (formData: FormData) => {
        const result = await dispatch(createPlanet(formData));
        if (createPlanet.fulfilled.match(result)) {
            toast.success("Планета успешно создана");
            setIsOpen(false);
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при создании планеты");
        }
    };

    const handleSaveLegions = async (formData: FormData) => {
        const result = await dispatch(createLegion(formData));
        if (createLegion.fulfilled.match(result)) {
            toast.success("Легион успешно создан");
            setIsOpen(false);
            dispatch(refreshCatalog());
        } else {
            toast.error(result.payload ?? "Ошибка при создании легиона");
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger className=" bg-[url('/assets/tablet/buttons/adding_button.png')] bg-contain bg-center bg-no-repeat  w-[3.5vw] h-full custom-width"></DrawerTrigger>

            <DrawerContent className="flex flex-col h-full">
                <DrawerHeader>
                    <DrawerTitle>Создать объект</DrawerTitle>
                    <DrawerDescription>Выберите тип объекта и заполните форму</DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 min-h-0">
                    <Tabs defaultValue="planet" className="flex flex-col items-center h-full">
                        <TabsList>
                            <TabsTrigger value="planet">Планета</TabsTrigger>
                            <TabsTrigger value="legion">Легион</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 flex w-full justify-center items-start overflow-y-auto p-6 min-h-0">
                            <TabsContent value="planet" className="w-full  max-w-xl">
                                <NewPlanetTab initialValues={emptyPlanet} onSubmit={handleSavePlanets} />
                            </TabsContent>
                            <TabsContent value="legion" className="w-full max-w-xl">
                                <NewLegionTab initialValues={emptyLegion} onSubmit={handleSaveLegions} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                <DrawerFooter className="flex-shrink-0">
                    <DrawerClose asChild>
                        <Button>Закрыть</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
