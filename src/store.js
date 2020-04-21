import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  blacklist: [],
  storage,
  timeout: null,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const loggerMiddleware = createLogger();
export default () => {
  let store = createStore(
    persistedReducer,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
  let persistor = persistStore(store)
  return { store, persistor }
};
