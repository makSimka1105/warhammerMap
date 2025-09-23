"use client";
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
import { IPlanet } from "@/app/types/Planet";
import { ILegion } from "@/app/types/legion";
import styles from "@/app/styles/searchLine.module.scss";
import {
    SearchResult,
    setSearchQuery,
    setSearchResults,
} from "@/lib/slices/searchSlices";
import { TabType } from "./databaseTablet";
import { TabSwitcher } from "./tabSwitcher";

interface SearchLineProps {
    placeholder?: string;
    className?: string;
    setActiveTab?: Dispatch<SetStateAction<TabType>>;
    countPlanets?: number;
    activeTab:TabType;
    countLegions?: number;
}

export function SearchLine({
    placeholder = "Поиск планет и легионов...",
    className = "",
    activeTab,
    setActiveTab,
    countLegions=0,
    countPlanets=0
}: SearchLineProps) {
    const dispatch = useAppDispatch();

    // Получаем данные из store
    const { planets, loading: planetsLoading } = useAppSelector(
        (state) => state.reducerPlanets
    );
    const { legions, loading: legionsLoading } = useAppSelector(
        (state) => state.reducerLegions
    );

    // Получаем данные поиска из search slice
    const {
        searchQuery,
        hasSearchQuery,
        searchResults,
        //        selectedResult,
        //        searchHistory,
    } = useAppSelector((state) => state.search);

    // Фильтрация результатов поиска
    const filteredResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase().trim();
        const results: SearchResult[] = [];

        // Поиск по планетам
        if (planets) {
            planets.forEach((planet) => {
                if (
                    planet.name.toLowerCase().includes(query)
                    //         ||
                    //         planet.description?.toLowerCase().includes(query) ||
                    //         planet.ingamePosition?.toLowerCase().includes(query)
                ) {
                    results.push({
                        id: planet._id,
                        name: planet.name,
                        type: TabType.planets,
                        data: planet,
                    });
                }
            });
        }

        // Поиск по легионам
        if (legions) {
            legions.forEach((legion) => {
                if (
                    legion.name.toLowerCase().includes(query)
                    //         ||
                    //         legion.description?.toLowerCase().includes(query)
                ) {
                    results.push({
                        id: legion._id || "",
                        name: legion.name,
                        type: TabType.legions,
                        data: legion,
                    });
                }
            });
        }

        // Сортируем результаты по релевантности (точные совпадения в начале)
        return results.sort((a, b) => {
            const aExact = a.name.toLowerCase() === query;
            const bExact = b.name.toLowerCase() === query;

            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            return a.name.localeCompare(b.name);
        });
    }, [searchQuery, planets, legions]);

    // Обновляем результаты в store при изменении фильтрации
    useEffect(() => {
        dispatch(setSearchResults(filteredResults));
    }, [filteredResults, dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setSearchQuery(value));

        // Устанавливаем состояние поиска
        //         if (value.trim()) {
        //             dispatch(setSearching(true));
        //         } else {
        //             dispatch(setSearching(false));
        //         }
    };

    const handleSearch = () => {
        // Дополнительная логика поиска при нажатии кнопки
        console.log("Поиск выполнен:", searchQuery, filteredResults);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const isLoading = planetsLoading || legionsLoading;

    return (
        <div className={`${styles.searchContainer} ${className}`}>
            <div className={styles.searchInputWrapper}>
                {/* Поле ввода */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className={styles.searchInput}
                />
                {hasSearchQuery && !isLoading && (
                    <div className={styles.resultsCounter}>
                        Найдено: {searchResults.length}
                    </div>
                )}

                <TabSwitcher setActiveTab={setActiveTab!} countLegions={countLegions} countPlanets={countPlanets} activeTab={activeTab} />
            </div>
        </div>
    );
}
