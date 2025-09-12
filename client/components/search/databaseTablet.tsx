"use client";
import styles from "@/app/styles/tablet.module.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";

import { LegionsList, PlanetsList } from "./itemsColumn";
import TabletControls from "./tabletControls";
import { useAppSelector } from "@/hooks/useStore";
import { IPlanet } from "@/app/types/Planet";
import { ILegion } from "@/app/types/legion";

export enum TabType {
    planets = "planets",
    legions = "legions",
}

// export default function DatabaseTablet() {
//     const dispatch = useDispatch<AppDispatch>();
//     const [activeTab, setActiveTab] = useState<TabType>("planets");
//     const [editingItem, setEditingItem] = useState<string | null>(null);

//     // Redux selectors
//     const {
//         planets,
//         loading: planetsLoading,
//         error: planetsError,
//     } = useSelector((state: RootState) => state.reducerPlanets);
//     const {
//         legions,
//         loading: legionsLoading,
//         error: legionsError,
//     } = useSelector((state: RootState) => state.reducerLegions);

//     // Load data on component mount
//     useEffect(() => {
//         dispatch(fetchPlanets());
//         dispatch(fetchLegions());
//     }, [dispatch]);

//     const handleCreatePlanet = async () => {};

//     const handleCreateLegion = async () => {};

//     const handleUpdatePlanet = async (planet: IPlanet) => {};

//     const handleUpdateLegion = async (legion: ILegion) => {};

//     const handleDeletePlanet = async (id: string) => {};

//     const handleDeleteLegion = async (id: string) => {};

//     const isLoading = planetsLoading || legionsLoading;
//     const error = planetsError || legionsError;

//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             <div className="mb-6">

//                 {/* Tab Navigation */}
//                 <div className="flex gap-4 mb-6">
//                     <Button
//                         variant={
//                             activeTab === "planets" ? "default" : "outline"
//                         }
//                         onClick={() => setActiveTab("planets")}
//                     >
//                         Planets ({planets?.length || 0})
//                     </Button>
//                     <Button
//                         variant={
//                             activeTab === "legions" ? "default" : "outline"
//                         }
//                         onClick={() => setActiveTab("legions")}
//                     >
//                         Legions ({legions?.length || 0})
//                     </Button>
//                 </div>

//                 {/* Create Button */}
//                 <Button className="mb-4">
//                     Create New {activeTab === "planets" ? "Planet" : "Legion"}
//                 </Button>
//             </div>

//             {/* Error Display */}
//             {error && (
//                 <Card className="mb-6 border-red-200 bg-red-50">
//                     <CardContent className="pt-6">
//                         <p className="text-red-600">Error: {error}</p>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Loading State */}
//             {isLoading && (
//                 <Card className="mb-6">
//                     <CardContent className="pt-6">
//                         <p className="text-center">Loading...</p>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Create Form */}

//             {/* Data List */}
//             {!isLoading && !error && (
//                 <div>
//                     {activeTab === "planets" ? (
//                         <div>
//                             {planets && planets.length > 0 ? (
//                                 planets.map(renderPlanetItem)
//                             ) : (
//                                 <Card>
//                                     <CardContent className="pt-6">
//                                         <p className="text-center text-gray-500">
//                                             No planets found. Create your first
//                                             planet!
//                                         </p>
//                                     </CardContent>
//                                 </Card>
//                             )}
//                         </div>
//                     ) : (
//                         <div></div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }
export default function DatabaseTablet() {
    const [activeTab, setActiveTab] = useState<TabType>(TabType.planets);

    const { searchQuery, hasSearchQuery, searchResults } = useAppSelector(
        (state) => state.search
    );
    const { planets } = useAppSelector((state) => state.reducerPlanets);
    const { legions } = useAppSelector((state) => state.reducerLegions);
    const [separatedSearch, setSeparatedSearch] = useState<{
        planets: IPlanet[] | null;
        legions: ILegion[] | null;
    }>({
        planets: [],
        legions: [],
    });

    useEffect(() => {
        if (hasSearchQuery && searchResults.length > 0) {
            const planets: IPlanet[] = [];
            const legions: ILegion[] = [];

            searchResults.forEach((result) => {
                if (result.type === TabType.planets && result.data) {
                    planets.push(result.data as IPlanet);
                } else if (result.type === TabType.legions && result.data) {
                    legions.push(result.data as ILegion);
                }
            });

            setSeparatedSearch({
                planets: planets.length > 0 ? planets : null,
                legions: legions.length > 0 ? legions : null,
            });
        }
    }, [searchQuery, hasSearchQuery, searchResults]);

    return (
        <div className={styles.mainTablet}>
            <div className={styles.wrapper}>
                <TabletControls
                
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    countPlanets={
                        hasSearchQuery
                            ? (separatedSearch.planets?.length ?? 0)
                            : (planets?.length ?? 0)
                    }
                    countLegions={
                        hasSearchQuery
                            ? (separatedSearch.legions?.length ?? 0)
                            : (legions?.length ?? 0)
                    }
                />
                <div className={styles.listWrapper}>
                    {/* Отображение результатов поиска */}
                    {hasSearchQuery && (
                        <>
                            
                            

                            {/* Отображаем результаты в зависимости от активной вкладки */}
                            {activeTab == TabType.planets && (
                                <>
                                    {separatedSearch.planets &&
                                    separatedSearch.planets.length > 0 ? (
                                        <PlanetsList
                                            planets={separatedSearch.planets}
                                        />
                                    ) : (
                                        <div className={styles.noResults}>
                                            <p>Планеты не найдены</p>
                                        </div>
                                    )}
                                </>
                            )}
                            {activeTab == TabType.legions && (
                                <>
                                    {separatedSearch.legions &&
                                    separatedSearch.legions.length > 0 ? (
                                        <LegionsList
                                            legions={separatedSearch.legions}
                                        />
                                    ) : (
                                        <div className={styles.noResults}>
                                            <p>Легионы не найдены</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                {activeTab == TabType.planets && !searchQuery && (
                    <PlanetsList planets={planets} />
                )}
                {activeTab == TabType.legions && !searchQuery && (
                    <LegionsList legions={legions} />
                )}
                </div>

            </div>
        </div>
    );
}
