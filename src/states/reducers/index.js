import { combineReducers } from "redux";
import setLoadingProgress from "./setLoadingProgress";
import setUserData from "./userData";
import initialWatchlist from "./initialWatchlist";
import peopleSearchResults from "./peopleSearchResults";
import sequenceReducer from "./Sequences";

const reducers = combineReducers({
  setLoadingProgress, setUserData, initialWatchlist, peopleSearchResults, sequences: sequenceReducer
})

export default reducers