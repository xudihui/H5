import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm,Tree,Icon,Card,notification } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import {getTree } from '../../utils'

const s = {
  maxHeight:window.innerHeight-310+'px',
  overflowX:'hidden',
  overflowY:'auto'
}

class Tree01 extends React.Component {

  onError = ()=>{
    if(!this.props.current._id && !this.props.current.id){
      notification.open({
        message: '请先选择角色哦',
        description: '检测到您还没选择角色，系统无法分配权限，权限将无法保存！',
        icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
      });
    }
  }

  onExpand = (expandedKeys) => {
    console.log('expandedKeys',expandedKeys)
    this.props.dispatch({ type: 'role_power/updateState', payload: { expandedKeys: expandedKeys } })
    //this.onError();
  }
  onSelect = (selectedKeys, info) => {
    //this.onError();
  }
  onCheck = (checkedKeys, info) => {
      this.props.dispatch({ type: 'role_power/updateState', payload: { checkeds: checkedKeys } })
    this.onError();
  }
  render() {
    const {lists,checkeds,dispatch,current,expandedKeys} = this.props;
    var arr = [];
    lists.map((i) => {
      ( arr.indexOf(i.id) == -1 ) && arr.push(''+i.id)
    })
    return (
      <div >
        <div>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">
                <Popconfirm title="确定保存用户权限吗?" onConfirm={()=>{
                  //修改
                  if(current._id){
                    dispatch({ type: 'role_power/doSave', payload: { id:current._id,powerNodeIds: checkeds.join(',') } })
                  }
                  //新增
                  else{
                    dispatch({ type: 'role_power/doSave', payload: { roleId:current.id,powerNodeIds: checkeds.join(',') } })
                  }

                }} onCancel={()=>{}} okText="确定" cancelText="不要！">
                  <Button type="primary">保存</Button>
                </Popconfirm>
              </div>
            </Col>

            <Col className="gutter-row" span={6}>
              <div className="gutter-box"><Button type="dashed" onClick={()=>{
                dispatch({ type: 'role_power/updateState', payload: { expandedKeys: arr } })
              }}>展开</Button></div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box"><Button type="dashed" onClick={()=>{
                dispatch({ type: 'role_power/updateState', payload: { expandedKeys: [""] } })
              }}>收起</Button></div>
            </Col>
            <Col className="gutter-row" span={6}>

            </Col>
          </Row>




        </div>
        <div style={s}>
          <Tree
            checkable
            autoExpandParent={false}
            onSelect={this.onSelect}
            showLine={true}
            expandedKeys={expandedKeys}
            onCheck={this.onCheck}
            onExpand={this.onExpand}
            checkedKeys={checkeds}
          >
            {
              getTree(lists)
            }
          </Tree>
        </div>

      </div>

    );
  }
}


const User = ({ location, dispatch, role_power, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, isMotion,current,lists,checkeds,expandedKeys, selectedRowKeys } = role_power
  const { pageSize } = pagination

  const listProps = {
    dataSource: list,
    loading: loading.effects['role_power/query'],
    pagination,
    location,
    onClickItem(record){
      console.log('点击当前对象：',record)
      dispatch({
        type: `role_power/loadByRoleId`,
        payload: {roleId:record.id,record},
      })
    },
    onChange (page) {
      const { query, pathname } = location
      console.log('徐阿辉312321：'+pathname,{

        ...query,
        page: page.current,
        pageSize: page.pageSize,
      })
      dispatch(routerRedux.push({
        pathname:pathname,
        search: `?page=${page.current}&rows=${page.pageSize}`,
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'role_power/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      console.log('上帝啊：',item)
      dispatch({
        type: 'role_power/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
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
        pathname: '/role_power',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/role_power',
      }))
    },
    onAdd () {
      dispatch({
        type: 'role_power/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'role_power/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    console.log('id序列：',selectedRowKeys)
    dispatch({
      type: 'role_power/delete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const gridStyle = {
    width: '40%',
    textAlign: 'center',
  };
  console.log('role',current)
  return (
    <Page inner>


      <Row>
        <Col span={11}>
          <Card bordered={false} noHovering={true} title="角色列表">
            <List {...listProps} />
          </Card>
        </Col>
        <Col span={1}>
        </Col>
        <Col span={12}>
          <Card bordered={false} noHovering={true}  title={current.label ? `配置 ${current.label} 的权限` : '请先在左侧选择一个角色'} >
            <Tree01 dispatch={dispatch} current={current} lists={lists} expandedKeys={expandedKeys} checkeds={checkeds}></Tree01>
          </Card>
        </Col>
      </Row>


    </Page>
  )
}

User.propTypes = {
  role_power: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ role_power, loading }) => ({ role_power, loading }))(User)
