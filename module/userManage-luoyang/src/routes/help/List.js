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

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
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
      title: '标题',
      dataIndex: 'title',
    }, {
      title: '产品经理',
      dataIndex: 'productor',
      render: (text, record) => <Link to={`help/${record.id}`}>{text}</Link>,
      filters: [{
        text: '刑利伟',
        value: '刑利伟',
      }, {
        text: '李良',
        value: '李良',
      }, {
        text: '徐阿辉',
        value: '徐阿辉',
      }],
      onFilter: (value, record) => record.productor == value,
    }, {
      title: '最新修改时间',
      dataIndex: 'meta.createAt',
      render: (text, record) => <span>{(new Date(text)).format('yyyy-MM-dd hh:mm:ss')}</span>,

    }, {
      title: '操作',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '0', name: '预览' },{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
      },
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

        columns={columns}
        rowKey={record => record._id}
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
