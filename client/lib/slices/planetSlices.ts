import { IPlanet } from "@/app/types/planet";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "@/lib/api";

const planetsUrl = "/planets";
const eventsUrl = "/events";

export const fetchPlanets = createAsyncThunk(
    "planets/fetchPlanets",
    async (): Promise<IPlanet[]> => {
        const response = await api.get<IPlanet[]>(planetsUrl);
        return response.data;
    }
);

export const createPlanet = createAsyncThunk<
    void,
    FormData,
    { rejectValue: string }
>("planets/createPlanet", async (newPlanet, { rejectWithValue }) => {
    try {
        await api.post(planetsUrl, newPlanet);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при создании планеты")
        );
    }
});

export const updatePlanet = createAsyncThunk<
    void,
    { updatedPlanet: FormData; id: string },
    { rejectValue: string }
>("planets/updatePlanet", async ({ updatedPlanet, id }, { rejectWithValue }) => {
    try {
        await api.put(`${planetsUrl}/${id}`, updatedPlanet);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при обновлении планеты")
        );
    }
});

export const deletePlanet = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>("planets/deletePlanet", async (planetId, { rejectWithValue }) => {
    try {
        await api.delete(`${planetsUrl}/${planetId}`);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при удалении планеты")
        );
    }
});

export const createEvent = createAsyncThunk<
    void,
    FormData,
    { rejectValue: string }
>("events/createEvent", async (newEvent, { rejectWithValue }) => {
    try {
        await api.post(eventsUrl, newEvent);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при создании ивента")
        );
    }
});

export const deleteEvent = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>("events/deleteEvent", async (eventId, { rejectWithValue }) => {
    try {
        await api.delete(`${eventsUrl}/${eventId}`);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при удалении ивента")
        );
    }
});

export const updateEvent = createAsyncThunk<
    void,
    { id: string; changes: { name?: string; description?: string; link?: string; place?: string } },
    { rejectValue: string }
>("events/updateEvent", async ({ id, changes }, { rejectWithValue }) => {
    try {
        await api.put(`${eventsUrl}/${id}`, changes);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при обновлении ивента")
        );
    }
});

interface PlanetsState {
    planets: IPlanet[] | null;
    loading: boolean;
}

const initialState: PlanetsState = {
    planets: null,
    loading: true,
};

const planetsSlice = createSlice({
    name: "planets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlanets.pending, (state) => {
                state.loading = state.planets === null;
            })
            .addCase(fetchPlanets.fulfilled, (state, action) => {
                state.loading = false;
                state.planets = action.payload;
            })
            .addCase(fetchPlanets.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default planetsSlice.reducer;
