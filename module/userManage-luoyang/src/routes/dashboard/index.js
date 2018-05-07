import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { color } from 'utils'
import { Page } from 'components'
import { NumberCard} from './components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function Dashboard ({ dashboard, loading }) {
  const { weather, sales, quote, numbers, recentSales, comments, completed, browser, cpu, user } = dashboard
  const numberCards = numbers.map((item, key) => (<Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>))
 var demo = [
   {icon: "pay-circle-o", color: "#64ea91", title: "城市活动收入", number: Math.floor(Math.random()*10000)},
   {icon: "team", color: "#8fc9fb", title: "APP服务人次", number: Math.floor(Math.random()*10000)},
   {icon: "message", color: "#d897eb", title: "平台消息", number: Math.floor(Math.random()*10000)},
   {icon: "shopping-cart", color: "#f69899", title: "运营广告支出", number: Math.floor(Math.random()*10000)}
 ];
  const d = demo.map((item, key) => (<Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>))


  return (
    <Page loading={loading.models.dashboard && sales.length === 0}>
      <Row gutter={24}>
        {d}
      </Row>
    </Page>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(Dashboard)
