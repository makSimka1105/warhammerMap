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
import { createPlanet, fetchPlanets } from "@/lib/slices/planetSlices";
import { LegionData, NewLegionTab } from "./legion/NewLegionTab";
import { createLegion, fetchLegions } from "@/lib/slices/legionSlices";

const initialPlanetData: PlanetData = {
    name: "планета",
    ingamePosition: "в-0000",
    description: "алипов, пере .ю ю .,пщкенгукшцуп.щывсбчпи,ьсмтиттмьсд",
    left:"1000",
    top: "1000",
    size: "100",
    pic: null,
};
const initialLegionData:LegionData={
    name:"легион",
    description:"апапрвпа цукенгшщ мпирто мить дж ыва ывакеп вапе мит ю",
    icon:null,
};

export function DrawerWithTabsAndForm() {
    const dispatch = useAppDispatch();

    const handleSavePlanets = (formData: FormData) => {
        console.log("Данные формы в формате form-data:", formData);
        dispatch(createPlanet(formData));
        dispatch(fetchPlanets())

    };
const handleSaveLegions = (formData: FormData) => {
        console.log("Данные формы в формате form-data:", formData);
        dispatch(createLegion(formData));
        dispatch(fetchLegions())
    };



    return (
        <Drawer>
            <DrawerTrigger className=" bg-[url('/assets/tablet/buttons/adding_button.png')] bg-cover  w-[4.5vw] h-[4.5vw]"></DrawerTrigger>

            <DrawerContent className="flex flex-col h-full">
                <DrawerHeader>
                    <DrawerTitle>Создать объект</DrawerTitle>
                    <DrawerDescription>Выберите тип объекта и заполните форму</DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 min-h-0">
                    <Tabs defaultValue="legion" className="flex h-full">
                        <TabsList className="flex flex-col ">
                            <TabsTrigger value="planet" className="text-left">Планета</TabsTrigger>
                            <TabsTrigger value="legion" className="text-left">Легион</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 flex justify-center items-start overflow-y-auto p-6 min-h-0">
                            <TabsContent value="planet" className="w-full  max-w-xl">
                                <NewPlanetTab initialValues={initialPlanetData} onSubmit={handleSavePlanets} />
                            </TabsContent>
                            <TabsContent value="legion" className="w-full max-w-xl">
                                <NewLegionTab initialValues={initialLegionData} onSubmit={handleSaveLegions} />

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
