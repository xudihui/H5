import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'components'
import { Form,Select, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
const Option = Select.Option;
import { Row, Col, Card,Divider } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  dispatch,
  dataFormat,
  form: {
    getFieldDecorator,
  },
  ...modalProps
}) => {

  const modalOpts = {
    ...modalProps,
    bodyStyle:{
      height:'300px',
      overflow:'auto'
    },
    onOk,
    onCancel(){
      dispatch({
        type: `${dataFormat.nameSpace}/updateState`,
        payload: {v:{
          add:false,
          edit:false,
          view:false
        }},//隐藏弹窗
      })
    },
    title:'查看内容'
  }

  const createUi = (item) => {
    var dom = null;
    switch (item.type)
    {

      case 'select':
        dom = <Select disabled >
          {
            item.options.map((i,index) => {
              return(
                <Option key={index} value={i.value}>{i.text}</Option>
              )
            })
          }
        </Select>;
        break;
      case 'date':
        dom = <DatePicker disabled  />;
        break;
	  case 'textarea':
		dom = <TextArea rows={item.rows || 4} />;
      default:
        dom = <Input disabled  placeholder="请输入关键字"  />;
    }
    return dom;
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        {
          dataFormat.data.map((i,index)=>{
            return( <FormItem key={index} label={i.title} hasFeedback {...formItemLayout}>
              {getFieldDecorator(i.dataIndex, {
                initialValue: item[i.dataIndex],
                rules: i.rules ? i.rules : [{}]
              })(createUi(i))}
            </FormItem>);
          })
        }
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
