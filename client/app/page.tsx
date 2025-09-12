

'use client';

import Map from "@/components/map/mapComp";
import InfoSidebar from "@/components/sidebar/infoSidebar";
import UpperMenu from "@/components/ui/upperMenu";
import { MapProvider } from "./context/mapContext";
import StoreProvider from "../components/StoreProvider";
import { useState } from "react";
import BurgerMenu from "@/components/ui/burgerMenu";

import DatabaseTablet from "@/components/search/databaseTablet";
export enum BlockChoise{
  map='map',
  dashboard='dashboard',
}
export default  function Home() {
  const [currentBlock,setCurrentBlock]=useState<BlockChoise>(BlockChoise.dashboard)

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
                          {currentBlock == BlockChoise.dashboard && <DatabaseTablet /> }
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
