import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    tasks: [],
    status: "idle",
    error: "",
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
    const response = await axios.get("/api/tasks");
    return response.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
    const response = await axios.post("/api/tasks", task);
    return response.data;
});

export const updateTask = createAsyncThunk("tasks/updateTask", async (task) => {
    console.log(task);
    const response = await axios.put(`/api/tasks/${task._id}`, task);
    return response.data;
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
    const response = await axios.delete(`/api/tasks/${id}`);
    return response.data;
});

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "pending";
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(addTask.pending, (state) => {
                state.status = "pending";
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.tasks.push(action.payload.task);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(updateTask.pending, (state) => {
                state.status = "pending";
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.tasks = state.tasks.map((task) =>
                    task._id === action.payload.task._id
                        ? { ...task, ...action.payload.task }
                        : task
                );
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            })
            .addCase(deleteTask.pending, (state) => {
                state.status = "pending";
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.tasks = state.tasks.filter(
                    (task) => task._id !== action.payload.task._id
                );
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.error.message;
            });
    },
});

export const selectAllTasks = (state) => state.tasks.tasks;
export const getTasksStatus = (state) => state.tasks.status;
export const getTasksError = (state) => state.tasks.error;

export default tasksSlice.reducer;
