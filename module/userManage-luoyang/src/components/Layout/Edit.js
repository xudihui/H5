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
    validateFields,
    getFieldsValue,
    setFieldsValue
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      onOk(data);
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
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
    title:'修改内容'
  }
  const createUi = (item) => {
    var dom = null;
    switch (item.type)
    {

      case 'select':
        dom = <Select>
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
        dom = <DatePicker />;
        break;
	  case 'textarea':
		dom = <TextArea rows={item.rows || 4} />;
      default:
        dom = <Input placeholder="请输入关键字"  />;
    }
    return dom;
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        {
          dataFormat.data.map((i,index)=>{
            if(!i['noEdit']){
              return( <FormItem key={index} label={i.title} hasFeedback {...formItemLayout}>
                {getFieldDecorator(i.dataIndex, {
                  initialValue: item[i.dataIndex],
                  rules: i.rules ? i.rules : [{}]
                })(createUi(i))}
              </FormItem>);
            }
            else{
              return null
            }
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
