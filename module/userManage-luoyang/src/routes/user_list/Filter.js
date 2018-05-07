import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Select,Row,Icon, Col, DatePicker, Input, Popconfirm, Modal } from 'antd'
import city from '../../utils/city'
const ButtonGroup = Button.Group;

const Option = Select.Option;
const Search = Input.Search
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 6,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  style: {
    marginBottom: 16,
  }
}

const Filter = ({
  onAdd,
  onEdit,
  onView,
  onDelete,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const { name, address } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <div>
      <Row gutter={24}>
        <Col {...ColProps} >
          <FilterItem label="用户名">
            {getFieldDecorator('userName', { initialValue: name })(<Input placeholder="请输入关键字"  />)}
          </FilterItem>
        </Col>
        <Col {...ColProps} >
          <FilterItem label="创建时间">
            {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
              <RangePicker style={{ width: '100%' }} size="large"  />
            )}
          </FilterItem>
        </Col>
        <Col {...TwoColProps} >
          <div >
            <Button type="primary" size="large" className="margin-right" icon="search" onClick={handleSubmit}>搜索</Button>
            <Button size="large" type="ghost" onClick={handleReset}>重置</Button>
          </div>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col {...TwoColProps} >
          <div >
            <ButtonGroup>
              <Button  type="ghost" size="large" icon="plus" onClick={onAdd}>新增</Button>
              <Button  type="ghost" size="large" icon="edit" onClick={onEdit}>修改</Button>
              <Button  type="ghost" size="large" icon="eye-o" onClick={onView}>查看</Button>
              <Popconfirm title="确认删除吗?" onConfirm={onDelete}  okText="删除" cancelText="不要！">
                <Button  type="danger" size="large" icon="close" >删除</Button>
              </Popconfirm>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
