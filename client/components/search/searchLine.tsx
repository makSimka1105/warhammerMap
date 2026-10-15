"use client";
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useStore";
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
    setActiveTab: Dispatch<SetStateAction<TabType>>;
    countPlanets: number;
    activeTab: TabType;
    countLegions: number;
}

export function SearchLine({
    placeholder = "Поиск планет и легионов...",
    className = "",
    activeTab,
    setActiveTab,
    countLegions,
    countPlanets,
}: SearchLineProps) {
    const dispatch = useAppDispatch();

    const { planets, loading: planetsLoading } = useAppSelector(
        (state) => state.reducerPlanets
    );
    const { legions, loading: legionsLoading } = useAppSelector(
        (state) => state.reducerLegions
    );

    const { searchQuery, hasSearchQuery, searchResults } = useAppSelector(
        (state) => state.search
    );

    const filteredResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase().trim();
        const results: SearchResult[] = [];

        planets?.forEach((planet) => {
            if (planet.name.toLowerCase().includes(query)) {
                results.push({
                    id: planet._id,
                    name: planet.name,
                    type: TabType.planets,
                    data: planet,
                });
            }
        });

        legions?.forEach((legion) => {
            if (legion.name.toLowerCase().includes(query)) {
                results.push({
                    id: legion._id,
                    name: legion.name,
                    type: TabType.legions,
                    data: legion,
                });
            }
        });

        return results.sort((a, b) => {
            const aExact = a.name.toLowerCase() === query;
            const bExact = b.name.toLowerCase() === query;

            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            return a.name.localeCompare(b.name);
        });
    }, [searchQuery, planets, legions]);

    useEffect(() => {
        dispatch(setSearchResults(filteredResults));
    }, [filteredResults, dispatch]);

    const isLoading = planetsLoading || legionsLoading;

    return (
        <div className={`${styles.searchContainer} ${className}`}>
            <div className={styles.searchInputWrapper}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    placeholder={placeholder}
                    className={styles.searchInput}
                />
                {hasSearchQuery && !isLoading && (
                    <div className={styles.resultsCounter}>
                        Найдено:{searchResults.length}
                    </div>
                )}

                <TabSwitcher
                    setActiveTab={setActiveTab}
                    countLegions={countLegions}
                    countPlanets={countPlanets}
                    activeTab={activeTab}
                />
            </div>
        </div>
    );
}
