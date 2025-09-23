"use client";

import { authClient } from "@/lib/auth-client";

import UpperMenu from "@/components/ui/upperMenu";
import InfoSidebar from "@/components/sidebar/infoSidebar";
import StoreProvider from "@/components/StoreProvider";
import { Role } from "@/prisma/generated/prisma";
import { MapProvider } from "@/app/context/mapContext";
import DatabaseTablet from "@/components/search/databaseTablet";
import Dashboard from "@/components/auth/dashboard";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BurgerMenu from "@/components/ui/burgerMenu";
import { useState } from "react";
import { BlockChoise } from "../page";
import Map from "@/components/map/mapComp";
import { CreateObject } from "@/components/admin/createObject";

export default function AdminDashboard() {
    const { data: session, isPending } = authClient.useSession();
    
    const [currentBlock, setCurrentBlock] = useState<BlockChoise>(
        BlockChoise.map
    );
    if (isPending) {
        return <Card className="acpect-ratio=1/1">
            <LoadingSpinner/>
        </Card>;
    }

    if (session?.user?.role === Role.USER) {
        return (
            <Dashboard/>
        );
    }
    if(session?.user?.role === Role.ADMIN){

        return (
            <div className="outer-container">
                <UpperMenu />

                <StoreProvider>
                    <MapProvider>
                        <div className="inner-container">
                            <div className="squire-area">
                                <BurgerMenu
                                    currentBlock={currentBlock}
                                    setCurrentBlock={setCurrentBlock}
                                />
                                
                                {currentBlock == BlockChoise.map && <Map />}
                                {currentBlock == BlockChoise.dashboard && (
                                    <><DatabaseTablet /><CreateObject /></>
                                )}
                            </div>
                            <div className="rectangular-area">
                                <InfoSidebar />
                            </div>
                        </div>
                    </MapProvider>
                </StoreProvider>
            </div>
        );
    }
}
