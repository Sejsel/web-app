import React from 'react';
import { render } from 'react-dom';
import { fromJS } from 'immutable';

import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import { configureStore } from './redux/store';
import createRoutes from './routes/client';

import { getToken } from './redux/middleware/accessTokenMiddleware';

// load the initial state form the server - if any
let state;
const ini = window.__INITIAL_STATE__;
if (ini) {
  state = {};
  Object.keys(ini).map(key => {
    state[key] = fromJS(ini[key]);
  });
}

const appHistory = useRouterHistory(createBrowserHistory)();
const store = configureStore(appHistory, state, getToken());
const history = syncHistoryWithStore(appHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={createRoutes(store.getState)} />
  </Provider>,
  document.getElementById('root')
);
