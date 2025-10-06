import { ILegion } from "@/app/types/legion";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// URL вашего API
const userAPI = process.env.NEXT_PUBLIC_ORIGIN_SERVER+"/legions";

// Создание асинхронного thunk для получения данных
export const fetchLegions = createAsyncThunk(
    "legions/fetchLegions",
    async (): Promise<ILegion[]> => {
        const response = await axios.get<ILegion[]>(userAPI);
        const data = response.data;
        console.log("легионы запрошены:", data);
        return data; // Возвращаем данные для сохранения в хранилище
    }
);

// Создание нового легиона
export const createLegion = createAsyncThunk(
    "legions/createLegion",
    async (newLegion:FormData): Promise<ILegion> => {
        const response = await axios.post(userAPI, newLegion);
        console.log("легион создан:", response.data);
        return response.data;
    }
);

// Обновление легиона
export const updateLegion = createAsyncThunk(
  "legions/updateLegion",
  async (payload: { updatedLegion: FormData; id: string }): Promise<ILegion> => {
    const { updatedLegion, id } = payload;
    console.log("получены данные лкгиона:", updatedLegion);

    const response = await axios.put<ILegion>(`${userAPI}/${id}`, updatedLegion);
    console.log("планета обновлена:", response.data);
    return response.data;
  }
);



// Удаление легиона
export const deleteLegion = createAsyncThunk(
    "legions/deleteLegion",
    async (legionId: string | number): Promise<string | number> => {
        await axios.delete(`${userAPI}/${legionId}`);
        console.log("легион удален:", legionId);
        return legionId;
    }
);

interface LegionsState {
    legions: ILegion[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: LegionsState = {
    legions: null,
    loading: false,
    error: null,
};

// Создание среза
const legionSlice = createSlice({
    name: "legions",
    initialState,
    reducers: {
        // Получение конкретного легиона по ID
        getLegion(state, action) {
                return action.payload
        },
        // Очистка ошибок
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получение всех легионов
            .addCase(fetchLegions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLegions.fulfilled, (state, action) => {
                state.loading = false;
                state.legions = action.payload;
            })
            .addCase(fetchLegions.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Ошибка при получении легионов";
            })

            // Создание легиона
            .addCase(createLegion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLegion.fulfilled, (state, action) => {
                state.loading = false;
                if (state.legions) {
                    state.legions.push(action.payload);
                } else {
                    state.legions = [action.payload];
                }
            })
            .addCase(createLegion.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Ошибка при создании легиона";
            })

            // Обновление легиона
            .addCase(updateLegion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLegion.fulfilled, (state, action) => {
                state.loading = false;
                if (state.legions) {
                    const index = state.legions.findIndex(
                        (legion) => legion._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.legions[index] = action.payload;
                    }
                }
            })
            .addCase(updateLegion.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Ошибка при обновлении легиона";
            })

            // Удаление легиона
            .addCase(deleteLegion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLegion.fulfilled, (state, action) => {
                state.loading = false;
                if (state.legions) {
                    state.legions = state.legions.filter(
                        (legion) => legion._id !== action.payload
                    );
                }
            })
            .addCase(deleteLegion.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Ошибка при удалении легиона";
            });
    },
});

// Экспортируем редюсер и действия
const { actions, reducer } = legionSlice;
export const { getLegion, clearError } = actions;
export default reducer;
