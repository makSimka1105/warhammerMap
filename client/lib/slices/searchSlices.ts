import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlanet } from "@/app/types/Planet";
import { ILegion } from "@/app/types/legion";
import { TabType } from "@/components/search/databaseTablet";

// Интерфейс для результатов поиска
export interface SearchResult {
    
    id: string;
    name: string;
    type: TabType;
    data: IPlanet | ILegion;
}

// Интерфейс для состояния поиска
interface SearchState {
    // Параметры поиска
    searchQuery: string;
    hasSearchQuery: boolean; // есть ли активный поиск

    // Результаты поиска
    searchResults: SearchResult[];

    // Состояние загрузки

    // Выбранный результат
    selectedResult: SearchResult | null;

    // История поиска (опционально)
    searchHistory: string[];
    // tab:TabType
}

const initialState: SearchState = {
    searchQuery: "",
    hasSearchQuery: false,
    searchResults: [],
    selectedResult: null,
    searchHistory: [],
    // tab:TabType.planets,
};

// Создание среза поиска
const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        // Установка поискового запроса
        setSearchQuery: (state, action: PayloadAction<string>) => {
            const query = action.payload.trim();
            state.searchQuery = query;
            state.hasSearchQuery = query.length > 0;

            // Добавляем в историю, если запрос не пустой и не повторяется
            if (query && !state.searchHistory.includes(query)) {
                state.searchHistory.unshift(query);
                // Ограничиваем историю 10 последними запросами
                if (state.searchHistory.length > 10) {
                    state.searchHistory = state.searchHistory.slice(0, 10);
                }
            }
        },
        // setTabType: (state, action: PayloadAction<string>) => {
        //     const tab = action.payload;
        //     if(tab==TabType.legions){state.tab=TabType.legions}
        //     if (tab == TabType.planets) {
        //         state.tab = TabType.planets;
        //     }
        // },

        // Установка результатов поиска
        setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
            state.searchResults = action.payload;
        },

        // Выбор конкретного результата
        selectSearchResult: (
            state,
            action: PayloadAction<SearchResult | null>
        ) => {
            state.selectedResult = action.payload;
        },

        // Очистка выбранного результата
        clearSelectedResult: (state) => {
            state.selectedResult = null;
        },

        // Очистка всех результатов поиска
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.selectedResult = null;
        },

        // Очистка истории поиска
        clearSearchHistory: (state) => {
            state.searchHistory = [];
        },

        // Удаление элемента из истории поиска
        removeFromSearchHistory: (state, action: PayloadAction<string>) => {
            state.searchHistory = state.searchHistory.filter(
                (item) => item !== action.payload
            );
        },

        // Сброс всего состояния поиска
        resetSearchState: (state) => {
            return initialState;
        },
    },
});

// Экспортируем действия
export const {
    setSearchQuery,
    setSearchResults,
    selectSearchResult,
    clearSelectedResult,
    clearSearchResults,
    clearSearchHistory,
    removeFromSearchHistory,
    resetSearchState,
} = searchSlice.actions;

// Экспортируем редюсер
export default searchSlice.reducer;

// Селекторы для удобного доступа к данным
export const selectSearchQuery = (state: { search: SearchState }) =>
    state.search.searchQuery;
export const selectHasSearchQuery = (state: { search: SearchState }) =>
    state.search.hasSearchQuery;
export const selectSearchResults = (state: { search: SearchState }) =>
    state.search.searchResults;

export const selectSelectedResult = (state: { search: SearchState }) =>
    state.search.selectedResult;
export const selectSearchHistory = (state: { search: SearchState }) =>
    state.search.searchHistory;
