import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem,onClickItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '0') {
      alert('预览界面开发中')
    }
    else if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `确认删除${record.title}吗？`,
        onOk () {
          onDeleteItem(record._id)
        },
      })
    }
  }

  const columns = [
    {
      title: '角色编号',
      dataIndex: 'id',
    }, {
      title: '角色名称',
      dataIndex: 'code',

    }, {
      title: '中文名称',
      dataIndex: 'label',
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }
 console.log('tableProps:',tableProps)

  return (
    <div>
      <Table
        {...tableProps}
          /*className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
           */
        bordered
        size="small"
        onRowClick={(record) => {
          onClickItem(record)
        }}
        columns={columns}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
