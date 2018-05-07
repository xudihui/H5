import React from 'react';
import PropTypes from 'prop-types';
import { Tabs,Modal, Popconfirm, Button ,Form,Input,message, Icon, Select, Divider,Row,Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const icons = ["lock","unlock","area-chart","pie-chart","bar-chart","dot-chart","bars","book","calendar","cloud","cloud-download","code","code-o","copy","credit-card","delete","desktop","download","edit","ellipsis","file","file-text","file-unknown","file-pdf","file-excel","file-jpg","file-ppt","file-add","folder","folder-open"];
class ProductList extends React.Component {
  constructor() {
    super();
  }
  componentWillReceiveProps(r){

  }
  doSave(){

  }
  doDelete(){

  }
  render() {
    const formItemLayout = {
      labelCol: { span: 10 }, //标签布局
      wrapperCol: { span: 14 },//输入框布局
    };
    var selectedRowKeys_ = [];
    var self = this;
    const {current,form,dispatch,activeKey} = this.props;
    const { getFieldDecorator,getFieldsValue,validateFields } = form;

    var x = getFieldsValue();
    console.log('输入框数据：',x)
    return (
      <div>
        <Form>
        <Tabs  onChange = {(activeKey) => {
          dispatch({ type: 'menu_list/updateState', payload: { activeKey } })
        }}
        activeKey={activeKey}
               animated={false}
        >
          <TabPane tab={current.label ? `编辑 ${current.label} 的目录` : '新建根目录'}  key="1">

            <div>
              <Row>
                <Col className="gutter-row" span={6}>
                  <div className="gutter-box">
                    <Popconfirm title="确定保存吗?" onConfirm={()=>{
                      validateFields((errors) => {
                        if (errors) {
                          return message.info('请确认输入内容是否正确');
                        }
                        const data = {
                          ...getFieldsValue(),
                          id:current.id
                        }

                        dispatch({ type: 'menu_list/doSave', payload: data })
                      })

                    }} onCancel={()=>{}} okText="确定" cancelText="不要！">
                      <Button type="primary">保存</Button>
                    </Popconfirm>
                  </div>
                </Col>

                <Col className="gutter-row" span={6}>
                  <Popconfirm title="确定删除吗?" onConfirm={()=>{
                    if(!current.id){
                      return message.info('请先选择要删除的菜单');
                    }
                    dispatch({ type: 'menu_list/doDelete', payload: {ids:current.id} })
                  }} onCancel={()=>{}} okText="确定" cancelText="不要！">
                    <Button type="danger">删除</Button>
                  </Popconfirm>
                </Col>
              </Row>
              <div style={{marginTop:'10px'}}></div>

              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem
                    label="父编号"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('parentId', {
                      rules: [{ required: true, message: '请输入父编号!' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="目录类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('typeName', {
                      rules: [{ required: true, message: '请输入您的目录类型!' }],
                    })(
                      <Select  >
                        <Option value="MENU">菜单</Option>
                        <Option value="SUBMENU">子菜单</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="目录代码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="中文名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('label', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="关联目录"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('linkCatalog', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="转向动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('doRedirect', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="外部目录"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('outerCatalog', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="备注"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('note', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem
                    label="是否有子"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('hasChild', {
                      rules: [{ required: true, message: '请输入是否有子!' }],
                    })(
                      <Select >
                        <Option value="Y">有</Option>
                        <Option value="N">无</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="有效性"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('isValid', {
                      rules: [{ required: true, message: '请输入有效性!' }],
                    })(
                      <Select >
                        <Option value="Y">有效</Option>
                        <Option value="N">无效</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="显示图标"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('iconName', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Select>
                        {
                          icons.map((i,index) => (
                            <Option value={i} key={index}><Icon type={i} /></Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="英文名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="排序"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dispOrder', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="调度动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('doInvoke', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="介绍动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('doIntroduce', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <div style={{display:'none'}}>
                    <FormItem hasFeedback>
                      {getFieldDecorator('catalogId', {
                        rules: [
                          {
                            required: true,

                            message:'请输入验证码'
                          },
                        ],
                      })(<Input  />)}
                    </FormItem>
                  </div>
                </div>
              </Col>


            </div>


          </TabPane>
          <TabPane tab="新增子菜单" disabled={current.id ? false : true} key="2">

            <div>
              <Row>
                <Col className="gutter-row" span={6}>
                  <div className="gutter-box">
                    <Popconfirm title="确定新增吗?" onConfirm={()=>{
                      validateFields((errors) => {
                        if (errors) {
                          return message.info('请确认输入内容是否正确');
                        }
                        const data = {
                          ...getFieldsValue()
                        }
                        dispatch({ type: 'menu_list/doSave', payload: data })
                      })

                    }} onCancel={()=>{}} okText="确定" cancelText="不要！">
                      <Button type="primary">确认新增</Button>
                    </Popconfirm>
                  </div>
                </Col>
              </Row>
              <div style={{marginTop:'10px'}}></div>

              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem
                    label="父编号"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('parentId', {
                      rules: [{ required: true, message: '请输入父编号!' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="目录类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('typeName', {
                      rules: [{ required: true, message: '请输入您的目录类型!' }],
                    })(
                      <Select  >
                        <Option value="MENU">菜单</Option>
                        <Option value="SUBMENU">子菜单</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="目录代码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('code', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="中文名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('label', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="关联目录"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('linkCatalog', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="转向动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('doRedirect', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="外部目录"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('outerCatalog', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="备注"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('note', {

                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="gutter-box">
                  <FormItem
                    label="是否有子"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('hasChild', {
                      rules: [{ required: true, message: '请输入是否有子!' }],
                    })(
                      <Select >
                        <Option value="Y">有</Option>
                        <Option value="N">无</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="有效性"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('isValid', {
                      rules: [{ required: true, message: '请输入有效性!' }],
                    })(
                      <Select >
                        <Option value="Y">有效</Option>
                        <Option value="N">无效</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="显示图标"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('iconName', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Select>
                        {
                          icons.map((i,index) => (
                            <Option value={i} key={index}><Icon type={i} /></Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="英文名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="排序"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dispOrder', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="调度动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('doInvoke', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <FormItem
                    label="介绍动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('doIntroduce', {
                      rules: [{ required: true, message: '不能为空' }],
                    })(
                      <Input  placeholder="" />
                    )}
                  </FormItem>
                  <div style={{display:'none'}}>
                    <FormItem hasFeedback>
                      {getFieldDecorator('catalogId', {
                        rules: [
                          {
                            required: true,

                            message:'请输入验证码'
                          },
                        ],
                      })(<Input  />)}
                    </FormItem>
                  </div>
                </div>
              </Col>


            </div>

          </TabPane>
        </Tabs>
        </Form>

      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const m = {...props.current};
    for(let i in m){
      m[i] = {
        value:m[i]
      }
    }
    if(props.activeKey == '2'){
      for(let i in m){
        if(i=='parentId'){
          m[i] = {
            value:m['id']['value']
          }
        }
        else if(i=='catalogId'){
          m[i] = {
            value:props.current.catalogId ? props.current.catalogId : (props.current.parentId||0)
          }
        }else if(i!= 'id'){
          m[i] = {
            value:''
          }
        }

      }
      delete m['id'];//新增操作，需要删除id
      return {
        ...m
      }
    }
    return {
      ...m,
      catalogId:{
        value:props.current.catalogId ? props.current.catalogId : (props.current.parentId||0)
      }
    };
  },
})(ProductList);
