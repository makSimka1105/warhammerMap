
import styles from '@/app/styles/infoSidebar.module.scss'
import React from 'react';
import { useMap } from '@/app/context/mapContext';

import ScrollableBlockColumn from './ScrollableBlockColumn.tsx';
import { UpperInfo } from './upperInfo';


interface InfoSidebarProps {
            children?: React.ReactNode;
}






const InfoSidebar: React.FC<InfoSidebarProps> = () => {
   

   const {currentPlanet}=useMap()
   
   if (!currentPlanet){
      return <div id={styles.infoSidebar}></div>   
   }
   return (
               <div id={styles.infoSidebar} >
                  <UpperInfo planet={currentPlanet}/>
                  <ScrollableBlockColumn 
                     description={currentPlanet.description?currentPlanet.description:null}
                     events={currentPlanet.events?currentPlanet.events:null}
                  />
               </div>
   );
};

export default InfoSidebar;