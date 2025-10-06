import { ILegion } from "@/app/types/legion";
import { IPlanet } from "@/app/types/Planet";
import { PlanetData } from "@/components/admin/planet/NewPlanetTab";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// URL вашего API
const userAPI = process.env.NEXT_PUBLIC_ORIGIN_SERVER+"/planets";
const userAPI_events = process.env.NEXT_PUBLIC_ORIGIN_SERVER+"/events";

// Создание асинхронного thunk для получения данных
export const fetchPlanets = createAsyncThunk(
    "planets/fetchPlanets",
    async (): Promise<IPlanet[]> => {
        const response = await axios.get<IPlanet[]>(userAPI);
        const data = response.data;
        console.log("планеты запрошены:", data);
        return data; // Возвращаем данные для сохранения в хранилище
    }
);


export const createPlanet = createAsyncThunk(
  "planets/createPlanet",
  async (newPlanet: FormData): Promise<IPlanet> => {
    const response = await axios.post(userAPI, newPlanet)
    console.log("планета создана:", response.data);
    return response.data;
  }
);
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (newEvent: FormData): Promise<ILegion> => {
    const response = await axios.post(userAPI_events, newEvent)
    console.log("ивент создан:", response.data);
    return response.data;
  }
);
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: string): Promise<string | number> => {
    const response = await axios.delete(userAPI_events+"/"+id)
    console.log("ивент удален:", response.data);
    return response.data;
  }
);

export const updatePlanet = createAsyncThunk(
  "planets/updatePlanet",
  async (payload: { updatedPlanet: FormData; id: string }): Promise<IPlanet> => {
    const { updatedPlanet, id } = payload;
    console.log("получены данные планеты:", updatedPlanet);

    const response = await axios.put<IPlanet>(`${userAPI}/${id}`, updatedPlanet);
    console.log("планета обновлена:", response.data);
    return response.data;
  }
);




// Удаление планеты
export const deletePlanet = createAsyncThunk(
    "planets/deletePlanet",
    async (planetId: string | number): Promise<string | number> => {
        await axios.delete(`${userAPI}/${planetId}`);
        console.log("планета удалена:", planetId);
        return planetId;
    }
);

interface PlanetsState {
    planets: IPlanet[] | null;
    loading: boolean;
    error: string | null;
}
const initialState: PlanetsState = {
    planets: null,
    loading: true,
    error: null,
};
// Создание среза
const planetsSlice = createSlice({
    name: "planets",
    initialState,
    reducers: {
        // Ваши обычные редюсеры
        getPlanet(state, action) {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlanets.pending, (state) => {
                state.loading = true; // Устанавливаем состояние загрузки
                state.error = null; // Сбрасываем ошибку
            })
            .addCase(fetchPlanets.fulfilled, (state, action) => {
                state.loading = false; // Устанавливаем состояние загрузки в false
                state.planets = action.payload; // Сохраняем полученные данные
            })
            .addCase(fetchPlanets.rejected, (state, action) => {
                state.loading = false; // Устанавливаем состояние загрузки в false
                state.error = action.error.message || null; // Сохраняем сообщение об ошибке или null
            })
            .addCase(createPlanet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlanet.fulfilled, (state, action) => {
                state.loading = false;
                if (state.planets) {
                    state.planets.push(action.payload);
                } else {
                    state.planets = [action.payload];
                }
            })
            .addCase(createPlanet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при создании планеты";
            })
            
            // Обновление планеты
            .addCase(updatePlanet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlanet.fulfilled, (state, action) => {
                state.loading = false;
                if (state.planets) {
                    const index = state.planets.findIndex(planet => planet._id === action.payload._id);
                    if (index !== -1) {
                        state.planets[index] = action.payload;
                    }
                }
            })
            .addCase(updatePlanet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при обновлении планеты";
            })
            
            // Удаление планеты
            .addCase(deletePlanet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlanet.fulfilled, (state, action) => {
                state.loading = false;
                if (state.planets) {
                    state.planets = state.planets.filter(planet => planet._id !== action.payload);
                }
            })
            .addCase(deletePlanet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при удалении планеты";
            });
    },
});

// Экспортируем редюсер и действия
const { actions, reducer } = planetsSlice;
export const { getPlanet } = actions;
export default reducer;
