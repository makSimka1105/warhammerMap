import { ILegion } from "@/app/types/legion";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "@/lib/api";

const legionsUrl = "/legions";

export const fetchLegions = createAsyncThunk(
    "legions/fetchLegions",
    async (): Promise<ILegion[]> => {
        const response = await api.get<ILegion[]>(legionsUrl);
        return response.data;
    }
);

export const createLegion = createAsyncThunk<
    void,
    FormData,
    { rejectValue: string }
>("legions/createLegion", async (newLegion, { rejectWithValue }) => {
    try {
        await api.post(legionsUrl, newLegion);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при создании легиона")
        );
    }
});

export const updateLegion = createAsyncThunk<
    void,
    { updatedLegion: FormData; id: string },
    { rejectValue: string }
>("legions/updateLegion", async ({ updatedLegion, id }, { rejectWithValue }) => {
    try {
        await api.put(`${legionsUrl}/${id}`, updatedLegion);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при обновлении легиона")
        );
    }
});

export const deleteLegion = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>("legions/deleteLegion", async (legionId, { rejectWithValue }) => {
    try {
        await api.delete(`${legionsUrl}/${legionId}`);
    } catch (error) {
        return rejectWithValue(
            apiErrorMessage(error, "Ошибка при удалении легиона")
        );
    }
});

interface LegionsState {
    legions: ILegion[] | null;
    loading: boolean;
}

const initialState: LegionsState = {
    legions: null,
    loading: true,
};

const legionSlice = createSlice({
    name: "legions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLegions.pending, (state) => {
                state.loading = state.legions === null;
            })
            .addCase(fetchLegions.fulfilled, (state, action) => {
                state.loading = false;
                state.legions = action.payload;
            })
            .addCase(fetchLegions.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default legionSlice.reducer;
