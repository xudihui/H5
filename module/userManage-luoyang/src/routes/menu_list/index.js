import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm,Tree,Icon,Card,notification } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import _ from 'lodash'
import {getTree } from '../../utils'
const s = {
  maxHeight:window.innerHeight-310+'px',
  overflowX:'hidden',
  overflowY:'auto'
}
class Tree01 extends React.Component {

  onError = ()=>{
    if(!this.props.current._id){
      notification.open({
        message: '请先选择角色哦',
        description: '检测到您还没选择角色，系统无法分配权限，权限将无法保存！',
        icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
      });
    }
  }

  onExpand = (expandedKeys) => {
    console.log('expandedKeys',expandedKeys)
    this.props.dispatch({ type: 'menu_list/updateState', payload: { expandedKeys: expandedKeys } })
    //this.onError();
  }
  onSelect = (selectedKeys, info) => {
    console.log(selectedKeys);
    const {lists} = this.props;
    const current = _.filter(lists, function(o) { return (o.id == selectedKeys[0]) })[0];
    console.log(current)
    this.props.dispatch({ type: 'menu_list/updateState', payload: { current } })
    console.log()
  }
  onCheck = (checkedKeys, info) => {
      this.props.dispatch({ type: 'menu_list/updateState', payload: { checkeds: checkedKeys } })
    this.onError();
  }
  render() {
    const {lists,checkeds,dispatch,current,expandedKeys} = this.props;
    var arr = [];
    lists.map((i) => {
      ( arr.indexOf(i.id) == -1 ) && arr.push(''+i.id)
    })
    return (
      <div>
        <div>
          <Row gutter={16}>

            <Col className="gutter-row" span={6}>
              <div className="gutter-box"><Button type="dashed" onClick={()=>{
                dispatch({ type: 'menu_list/updateState', payload: { expandedKeys: arr } })
              }}>展开</Button></div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box"><Button type="dashed" onClick={()=>{
                dispatch({ type: 'menu_list/updateState', payload: { expandedKeys: [""] } })
              }}>收起</Button></div>
            </Col>
            <Col className="gutter-row" span={6}>
            </Col>
          </Row>
        </div>
        <div style={s}>
          <Tree
            autoExpandParent={false}
            onSelect={this.onSelect}
            showLine={true}
            expandedKeys={expandedKeys}
            onExpand={this.onExpand}
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


const User = ({ location, dispatch, menu_list, loading }) => {
  location.query = queryString.parse(location.search)
  const { list,activeKey,current,lists,checkeds,expandedKeys, selectedRowKeys } = menu_list

  console.log('当前选中节点',current)
  return (
    <Page inner>


      <Row>
        <Col span={8}>
          <Card bordered={false} noHovering={true}>
            <Tree01 dispatch={dispatch} current={current} lists={lists} expandedKeys={expandedKeys} checkeds={checkeds}></Tree01>
          </Card>
        </Col>

        <Col span={1}>
        </Col>
        <Col span={15}>
          <Card bordered={false} noHovering={true} >
            <List  current={current} activeKey={activeKey} dispatch={dispatch} />
          </Card>
        </Col>
      </Row>


    </Page>
  )
}

User.propTypes = {
  menu_list: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ menu_list, loading }) => ({ menu_list, loading }))(User)
