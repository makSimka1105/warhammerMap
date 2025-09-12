import { selectSearchQuery, selectHasSearchQuery, selectSearchResults } from "@/lib/slices/searchSlices";
import { useAppSelector } from "./useStore";

export function useSearchData() {
    const searchQuery = useAppSelector(selectSearchQuery);
    const hasSearchQuery = useAppSelector(selectHasSearchQuery);
    const searchResults = useAppSelector(selectSearchResults);

    return {
        searchQuery,
        hasSearchQuery,
        searchResults,
        // Дополнительные вычисляемые значения
        hasResults: searchResults.length > 0,
        isEmpty: hasSearchQuery && searchResults.length === 0,
    };
}
