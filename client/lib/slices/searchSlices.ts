import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlanet } from "@/app/types/planet";
import { ILegion } from "@/app/types/legion";
import { TabType } from "@/components/search/databaseTablet";

export interface SearchResult {
    id: string;
    name: string;
    type: TabType;
    data: IPlanet | ILegion;
}

interface SearchState {
    searchQuery: string;
    hasSearchQuery: boolean;
    searchResults: SearchResult[];
}

const initialState: SearchState = {
    searchQuery: "",
    hasSearchQuery: false,
    searchResults: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.hasSearchQuery = action.payload.trim().length > 0;
        },
        setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
            state.searchResults = action.payload;
        },
    },
});

export const { setSearchQuery, setSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
