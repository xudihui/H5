import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const User = ({ location, dispatch, help, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = help
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['help/update'],
    title: `${modalType === 'create' ? '新建帮助文档' : '更新帮助文档'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `help/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'help/hideModal',
      })
    },
  }

  console.log("恶心的modalProps:",modalProps)

  const listProps = {
    dataSource: list,
    loading: loading.effects['help/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      const { query, pathname } = location
      console.log('徐阿辉：',routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'help/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      console.log('上帝啊：',item)
      dispatch({
        type: 'help/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },

    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'help/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/help',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/help',
      }))
    },
    onAdd () {
      dispatch({
        type: 'help/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'help/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    console.log('id序列：',selectedRowKeys)
    dispatch({
      type: 'help/delete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`已选中 ${selectedRowKeys.length} 个内容 `}
            <Popconfirm title={'确认删除吗?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除选中内容</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

User.propTypes = {
  help: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ help, loading }) => ({ help, loading }))(User)
