import { AppDispatch } from "@/lib/store";
import { fetchLegions } from "./legionSlices";
import { fetchPlanets } from "./planetSlices";

export const refreshCatalog = () => (dispatch: AppDispatch) =>
    Promise.all([dispatch(fetchPlanets()), dispatch(fetchLegions())]);
