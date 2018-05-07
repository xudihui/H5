import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ userDetail }) => {
  const { data } = userDetail
  const content = []
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}:</div>

        <div><b>{String(data[key])}</b></div>
      </div>)
    }
  }
  console.log('content:',content)
  return (<div className="content-inner">
    <div className={styles.content}>
      {content.map(i => i)}
    </div>
  </div>)
}

Detail.propTypes = {
  help: PropTypes.object,
}

export default connect(({ help, loading }) => ({ help, loading: loading.models.help }))(Detail)
