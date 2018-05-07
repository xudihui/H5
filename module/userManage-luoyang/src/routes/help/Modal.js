import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'components'
import { Form,Select, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import { convertToRaw,convertFromHTML,convertFromRaw ,EditorState} from 'draft-js'

const Option = Select.Option;
import { Row, Col, Card,Divider } from 'antd'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import city from '../../utils/city'
var co = null;
class EditorPage extends React.Component {
  constructor (props) {
    super(props);
    if(props.content){
      var content = EditorState.createWithContent(
        convertFromRaw(JSON.parse(props.content))
      );
      co = JSON.stringify(convertToRaw(content.getCurrentContent()))
    }

    this.state = {
      editorContent:props.content ? content : null
    }
  }
  onEditorStateChange = (editorContent) => {

    co = JSON.stringify(convertToRaw(editorContent.getCurrentContent()))
   this.setState({
      editorContent
    })
  }
  render () {
    const { editorContent } = this.state
    const colProps = {
      lg: 12,
      md: 24,
    }
    const textareaStyle = {
      minHeight: 496,
      width: '100%',
      background: '#f7f7f7',
      borderColor: '#F1F1F1',
      padding: '16px 8px',
    }
    return (<div className="content-inner">
      <Editor
        wrapperStyle={{
          minHeight: 500,
        }}
        editorStyle={{
          minHeight: 336,
        }}
        editorState={editorContent}
        onEditorStateChange={this.onEditorStateChange}
      />
    </div>)
  }
}
const FormItem = Form.Item

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
        key: item.key,
      }
      data['content'] = co;
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: item.title,
            rules: [
              {
                required: true,
                message:'标题不能为空'
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="产品经理" hasFeedback {...formItemLayout}>
          {getFieldDecorator('productor', {
            initialValue: item.productor,
            rules: [
              {
                required: true,
              },
            ],
          })( <Select>
                  <Option value="李良">李良</Option>
                  <Option value="刑利伟">刑利伟</Option>
                  <Option value="冒悠然" disabled>冒悠然</Option>
                  <Option value="徐阿辉">徐阿辉</Option>
             </Select> )}
        </FormItem>
        <FormItem label="详情" hasFeedback >
          <EditorPage content={item.content} />
        </FormItem>
      </Form>

    </Modal>

  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
