import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import 'babel-polyfill'

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHashHistory(),
  onError (error) {
    message.error(error.data.msg)
  },
})

// 2. Model
app.model(require('./models/app'))
// 3. Router
app.router(require('./router'))


// 4. Start
app.start('#root')


