import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
const List = ({ dataFormat,dispatch, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)
  const columns = [];
  dataFormat.data.map((i,index)=>{
    var {title,dataIndex,render} = i;
    if(!i['noRender']){
      columns.push({
        title,
        dataIndex,
        render
      })
    }
  })
  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {selectedRows:selectedRows},//更新选中列表
      })
    },
    getCheckboxProps: record => ({
      //disabled: record.code === 'admin', // 管理员角色选中
    }),
  };
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        rowSelection={rowSelection}
        onRowClick={(record) => {
           //onClickItem(record)
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
