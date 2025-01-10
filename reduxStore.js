import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import {thunk} from "redux-thunk";  // Explicitly import thunk

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
