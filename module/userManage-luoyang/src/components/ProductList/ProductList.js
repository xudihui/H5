import React from 'react';
import PropTypes from 'prop-types';
import { Table,Modal, Popconfirm, Button ,Form,Input,message, Icon, Switch, Divider,Row,Col} from 'antd';
const FormItem = Form.Item;
const ProductList = ({ onDelete, products,onAdd,onInit,form}) => {
  var selectedRowKeys_ = [];
  const columns = [{
    title: '产品经理',
    dataIndex: 'productor',
  },{
    title: '项目名称',
    dataIndex: 'title',
  },{
    title: '操作',
    render: (text, record) => {
      const { _id } = record;

      return (
        <div className="editable-row-operations">
          <a href={`http://localhost:3000/faq/${_id}`}>预览</a>
        </div>
      );
    },
  }
  ];
  const rowSelection = {
    type:'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      var arr = [];
      selectedRows.map(i=>{
        arr.push(i['_id'])
      })
      selectedRowKeys_ = arr.join();
      console.log(selectedRowKeys_)
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
    }),
  };

  var self = this;
  const { getFieldDecorator,getFieldsValue  } = form;
  var x = getFieldsValue();
  console.log('输入框数据：',x)
  return (
  <div>
    <div style={{marginBottom:'20px'}}>
      <Form layout="inline">
          <FormItem
            label="请输入产品经理"
          >
            {getFieldDecorator('productor', {
              rules: [{ required: true, message: '请输入您的productor!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="" />
            )}
          </FormItem>
        <FormItem
          label="请输入项目名称"
        >
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入您的项目名称!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="" />
          )}
        </FormItem>
          <Popconfirm title={`确定增加【${x.title}】吗?`} onConfirm={() => onAdd({
            movie:{
              title:x.title,
              productor:x.productor
            }
        })}>
          <Button type="primary">增加</Button>
        </Popconfirm>


      </Form>

      <Row>



        <Col span={8}>
          <div style={{margin:'1.5em 0 0 0'}}>

              <Button type="primary" size="large"  className="margin-right"  onClick={onInit}>查询</Button>
              <Button type="primary" size="large"  className="margin-right"  onClick={()=>{
                if(selectedRowKeys_ == ''){
                  return message.info('请先选择要删除的数据！')
                }
                onDelete(selectedRowKeys_)
              }}>删除</Button>
              <Button type="primary" size="large"  onClick={onInit}>修改</Button>
          </div>
        </Col>
        <Col span={8}></Col>
        <Col span={8}></Col>
      </Row>
    </div>
    <Table
      dataSource={products}
      rowSelection = {rowSelection}
      columns={columns}
      bordered
      size="default"
    />
  </div>
  );
};

ProductList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};
export default Form.create()(ProductList);
