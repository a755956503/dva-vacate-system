import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import {bindActionCreators} from 'redux';
import { Form, Icon, Input, Button, message } from 'antd';
import styles from './LoginPage.css';
import logo from '../../assets/logo.png';

const FormItem = Form.Item;

function mapStateToProps(state) {
  return {
    state: state.auth,
    info: state.auth.info,
  };
}
//
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(AuthActions, dispatch),
//   };
// }

export class LoginPage extends Component {
  static propTypes = {
    // actions: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // this.props.actions.login(values);
        this.props.dispatch({ type: 'auth/loginRequest', payload: values });
      }
    });
  };

  render() {
    const { form, state, dispatch, info } = this.props;
    if (info) {
      message.info(info);
      dispatch({
        type: 'auth/clearMessage',
      });
    }
    const { getFieldDecorator } = form;
    return (
      <div>
        <div className={styles.login}>
          <div className={styles.wrapper}>
            <h1 className={styles.title}><img src={logo} alt="logo" /></h1>
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('user', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input prefix={<Icon type="user" />} placeholder="Username" />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('pwd', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input
                    prefix={<Icon type="lock" />}
                    type="password"
                    placeholder="Password"
                  />,
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submit_button}
                  style={{ width: '100%', backgroundColor: '#2f7465', border: '1px solid #2b7061', color: '#fff' }}
                >
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(
  connect(mapStateToProps)(LoginPage),
);
