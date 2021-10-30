import { combineReducers } from "redux";
import setLoadingProgress from "./setLoadingProgress";
import setUserData from "./userData";
import initialWatchlist from "./initialWatchlist";
import peopleSearchResults from "./peopleSearchResults";

const reducers = combineReducers({
  setLoadingProgress, setUserData, initialWatchlist, peopleSearchResults
})

export default reducers