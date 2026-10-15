import axios, { isAxiosError } from "axios";

export const api = axios.create({
    baseURL: "/api/backend",
    withCredentials: true,
});

export const apiErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    const status = error.response?.status;
    if (status === 401 || status === 403) {
        return "Недостаточно прав: войдите как администратор";
    }
    const message = error.response?.data?.message;
    if (message) return `${fallback}: ${[message].flat().join(", ")}`;
    return fallback;
};
