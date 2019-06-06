import { combineReducers } from "redux";
import NavReducer from "./NavReducer";
// import DataReducer from "./DataReducer";

export default combineReducers({
  navData: NavReducer
  //   data: DataReducer
});
