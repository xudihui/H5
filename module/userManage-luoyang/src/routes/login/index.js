import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input ,Col} from 'antd'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  loading,
  dispatch,
  login,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }
  console.log('HELP:',login)
  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
              message:'请输入用户名'
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message:'请输入密码'
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="密码" />)}
        </FormItem>
        <Row type="flex" justify="space-between">
          <Col span={14}>
            <FormItem hasFeedback>
              {getFieldDecorator('imgCode', {
                rules: [
                  {
                    required: true,
                    pattern:/\d{4}/,
                    message:'请输入四位验证码'
                  },
                ],
              })(<Input maxLength="4" size="large" type="password" onPressEnter={handleOk} placeholder="请输入验证码" />)}
            </FormItem>
            <div style={{display:'none'}}>
              <FormItem hasFeedback>
                {getFieldDecorator('imgToken', {
                  initialValue: login.yzm.imgToken,
                  rules: [
                    {
                      required: true,

                      message:'请输入验证码'
                    },
                  ],
                })(<Input  />)}
              </FormItem>
            </div>
          </Col>
          <Col span={2}>

          </Col>
          <Col span={8}>
            <img style={{width:'100%',height:'32px'}} src={'data:image/png;base64,' + login.yzm.img} />
          </Col>
        </Row>


        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
            登录
          </Button>
        </Row>

      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ login,loading }) => ({login, loading }))(Form.create()(Login))
