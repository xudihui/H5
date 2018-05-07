import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row,Form, Col, Button, Popconfirm,Tree,Icon,Card,notification } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './Filter'
import { Layout } from 'components'
const {Add,Edit,View,List} = Layout;
const Main = ({ location, dispatch, target, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, dataFormat, modalVisible, modalType, isMotion,current,lists,checkeds,expandedKeys, selectedRowKeys } = target
  const { pageSize } = pagination

  //添加
  const addProps = {

    dataFormat,
    dispatch,
    visible:target.v.add,
  }

  //修改
  const editProps = {
    item:target.selectedRows[0],
    dispatch,
    dataFormat,
    visible:target.v.edit,
    onOk(data){
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{edit:false}},//隐藏弹窗
      })
      dispatch({
        type: `${dataFormat.nameSpace}/doSave`,
        payload: data,//隐藏弹窗
      })
    }
  }

  //查看
  const viewProps = {
    item:target.selectedRows[0],
    dispatch,
    dataFormat,
    visible:target.v.view,
    onOk(){
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{view:false}},//隐藏弹窗
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects[`${dataFormat.nameSpace}/query`],
    pagination,
    dataFormat,
    location,
    dispatch,
    onClickItem(record){
      console.log('点击当前对象：',record)
      dispatch({
        type: `${dataFormat.nameSpace}/loadByRoleId`,
        payload: {roleId:record.id,record},
      })
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.replace({ //使用push并且在hashHistory的时候会被警告，push的主要作用是支持返回，暂时删除push
        pathname: `/${dataFormat.nameSpace}`,
        query: {
          page:page.current,
          rows:page.pageSize
        }
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: `${dataFormat.nameSpace}/delete`,
        payload: id,
      })
    }
  }

  const filterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    dispatch,
    onRoleUser(){
	   if(target.selectedRows.length != 1){
        return notification.open({
          message: '您需要先选中一条内容！',
          description: '当前操作必须要选，并且还只能选择一条哦！',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      dispatch(routerRedux.push({ //使用push并且在hashHistory的时候会被警告，push的主要作用是支持返回，暂时删除push
        pathname: `/role_list/${target.selectedRows[0]['id']}`,
        query: {
          page:1,
          rows:10
        }
      }))
	},
    onFilterChange (value) {
      console.log('onFilterChange:',value)
      dispatch(routerRedux.replace({ //使用push并且在hashHistory的时候会被警告，push的主要作用是支持返回，暂时删除push
        pathname: `/${dataFormat.nameSpace}`,
        query: {
          ...value,
          page:1,
          rows:10
        }
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
          pathname: `/${dataFormat.nameSpace}`,
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        })) : dispatch(routerRedux.push({
          pathname: `/${dataFormat.nameSpace}`,
        }))
    },
    onAdd () {
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{add:true}},//隐藏弹窗
      })
    },
    onEdit () {
      if(target.selectedRows.length != 1){
        return notification.open({
          message: '您需要先选中一条内容！',
          description: '一条都不选，或者选择了很多条，我们不知道修改哪条信息，我也很无奈啊',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{edit:true}},//隐藏弹窗
      })
    },
    onView () {
      if(target.selectedRows.length != 1){
        return notification.open({
          message: '您需要先选中一条内容！',
          description: '一条都不选，或者选择了很多条，我们不知道展开哪条信息给你看啊',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{view:true}},//隐藏弹窗
      })
    },

    onDelete () {
      if(target.selectedRows.length < 1){
        return notification.open({
          message: '您需要至少选中一条内容！',
          description: '一条都不选,我们不知道删除哪条消息哦',
          icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });
      }
      var ids = [];
      target.selectedRows.map((i,index) => {
        ids.push(i.id);
      })
      dispatch({
        type: `${dataFormat.nameSpace}/doDelete`,
        payload: {ids},//隐藏弹窗
      })
    }


  }


  const gridStyle = {
    width: '40%',
    textAlign: 'center',
  };
  console.log('role',current)
  return (
    <Page inner>
      <Filter {...filterProps}></Filter>
      <List {...listProps} />
      <Add {...addProps} />
      <Edit {...editProps} />
      <View {...viewProps} />
    </Page>
  )
}

Main.propTypes = {
  target: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect((opt) => ({ target:opt['role_list'], loading:opt['loading'] }))(Main)
