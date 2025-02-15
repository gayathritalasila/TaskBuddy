import { combineReducers } from 'redux';
import loginReducer from "./src/components/Login/login.slice";
import taskReducer from "./src/components/Task/task.slice";

const rootReducer = combineReducers({
  login: loginReducer,
  tasks: taskReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
