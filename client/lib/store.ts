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

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
