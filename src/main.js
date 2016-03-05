// react
import React from 'react'
import ReactDOM from 'react-dom'

// redux
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

// react-router(-redux)
import { IndexRoute, Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// app
import App from './components/app'

const finalCreateStore = applyMiddleware(
  thunkMiddleware,
  createLogger()
)(createStore)

const store = finalCreateStore(require('./reducers').default)
const history = syncHistoryWithStore(browserHistory, store)

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = require('./reducers').default;
    store.replaceReducer(nextReducer);
  });
}

var mount = document.getElementById('mount')
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Something} />
      </Route>
    </Router>
  </Provider>
), mount)
