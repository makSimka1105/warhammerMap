

'use client';

import Map from "@/components/map/mapComp";
import InfoSidebar from "@/components/sidebar/infoSidebar";
import UpperMenu from "@/components/ui/upperMenu";
import { MapProvider } from "./context/mapContext";
import StoreProvider from "../components/StoreProvider";
import { useState } from "react";
import BurgerMenu from "@/components/ui/burgerMenu";

import DatabaseTablet from "@/components/search/databaseTablet";
export enum BlockChoise {
  map = 'map',
  dashboard = 'dashboard',
}

export default function Home() {
  const [currentBlock, setCurrentBlock] = useState<BlockChoise>(BlockChoise.map)

  return (
    <div className="outer-container">
      <UpperMenu />

      <StoreProvider>
        <MapProvider>
          <div className="inner-container">
            <div className="squire-area">
              <div className=" flex absolute top-1 left-4 z-index-10">

                <BurgerMenu
                  currentBlock={currentBlock}
                  setCurrentBlock={setCurrentBlock}
                />

              </div>
              {currentBlock == BlockChoise.map && <Map />}
              {currentBlock == BlockChoise.dashboard && <DatabaseTablet />}
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
