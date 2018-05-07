import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
const { ConnectedRouter } = routerRedux
const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routesConfig = ['dashboard','user_list','role_list','role_power','menu_list','login','smkApp'];

  const routes = [];
  routesConfig.map((i)=>{
    routes.push({
      path: `/${i}`,
      models: () => [import(`./models/${i}`)],
      component: () => import(`./routes/${i}`),
    })
  })

  routes.push( {
    path: '/role_list/:id',
    models: () => [import(`./models/role_user_list`)],
    component: () => import('./routes/role_user_list'),
})
  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
