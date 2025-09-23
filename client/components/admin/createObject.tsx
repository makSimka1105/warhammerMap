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
import { Card } from "../ui/card";
import { Container } from "lucide-react";



export function CreateObject() {
 
    return (
        <Drawer>
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>

                  <Card>
                    fbjgnbkv
                  </Card>
            
                    </DrawerDescription>
                </DrawerHeader>
                



                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                        <Card>Cancel</Card>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
