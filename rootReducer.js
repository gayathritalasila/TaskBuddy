import { combineReducers } from 'redux';
import loginReducer from "./src/components/Login/login.slice";
import taskReducer from "./src/components/Task/task.slice";

const rootReducer = combineReducers({
  login: loginReducer,
  task: taskReducer,
});

export default rootReducer;
