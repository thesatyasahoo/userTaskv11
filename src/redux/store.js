import { configureStore } from "@reduxjs/toolkit";
import packageSlice from "./packageSlice";

const store = configureStore({
    reducer: {
        package: packageSlice.reducer,
    }
})

export default store;