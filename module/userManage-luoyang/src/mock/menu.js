const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    icon: 'laptop',
    name: '效果分析',
    route: '/dashboard',
  },
  {
    id: '2',
    bpid: '1',
    name: '用户',
    icon: 'user',
    route: '/user',
  },
  {
    id: '3',
    name: '帮助文档',
    icon: 'laptop',
    route: '/help',
  },
  {
    id: '8',
    name: '产品列表',
    icon: 'shopping-cart',
    route: '/products',
  },
  {
    id: '21',
    mpid: '-1',
    bpid: '2',
    name: 'User Detail',
    route: '/user/:id',
  },
  {
    id: '5',
    bpid: '1',
    name: '图表',
    icon: 'code-o',
  },
  {
    id: '52',
    bpid: '5',
    mpid: '5',
    name: 'highCharts',
    icon: 'bar-chart',
    route: '/chart/highCharts',
  },
  {
    id: '53',
    bpid: '5',
    mpid: '5',
    name: 'Rechartst',
    icon: 'area-chart',
    route: '/chart/Recharts',
  }
]


let database1 = [
  {
    id: '8',
    mpid: '7',
    name: '罗工',
    icon: 'database',
    route: '/UIElement/dataTable',
  },
  {
    id: '4',
    bpid: '1',
    name: '技术岗位',
    icon: 'camera-o',
  },
  {
    id: '5',
    bpid: '4',
    mpid: '4',
    name: '前端',
    icon: 'heart-o',
    route: '/UIElement/iconfont',
  },
  {
    id: '6',
    bpid: '4',
    mpid: '4',
    name: '后台',
    icon: 'database',
    route: '/UIElement/dataTable',
  },
  {
    id: '7',
    mpid: '6',
    name: 'java',
    icon: 'database',
    route: '/UIElement/dataTable',
  }
]




module.exports = {
  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}
