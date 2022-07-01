import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { compose, createStore, applyMiddleware } from 'redux'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { rootReducer } from './redux/rootReducer'
// import { forbiddenWordsMiddleware } from './redux/middleWare'




const store = createStore(rootReducer, compose(
  applyMiddleware(
    thunk,
    // forbiddenWordsMiddleware
  ),
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

))

const app = (
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode>, */}
  </Provider>
)
ReactDOM.render(
  app,
  document.getElementById('root')
)
serviceWorker.unregister();

