import { configureStore } from "@reduxjs/toolkit";
import reducerPlanets from "./slices/planetSlices";
import reducerLegions from "./slices/legionSlices";
import searchReducer from "./slices/searchSlices";

export const makeStore = () => {
    return configureStore({
        reducer: {
            reducerPlanets,
            reducerLegions,
            search: searchReducer,
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
