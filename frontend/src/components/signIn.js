import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Link, withRouter} from 'react-router-dom';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const data = {
          email: values.username,
          password: values.password
      };
      console.log(data);
      fetch("/api/signin",  {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
          },
      }).then(response => response.json())
      .then(response => {console.log('response: ', response);
       this.props.history.push({
         pathname: '/message',
         state: {message: response.message}
       });
       console.log(this.props.history)
    })
      .catch(error => console.log('error:', error));
      }
    });
  };

  render() {
      const style1 = {
          maxWidth: '300px',
          marginLeft: '40%',
          marginTop: '10%'
      }
      const style2 = {
          float: 'left'
      }
      const style3 = {
          width: '100%'
      }
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" style={style1}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your e-mail!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="E-mail"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
         
          <Link className="login-form-forgot" style={style2} to="forgotpassword">
            Forgot password?
          </Link>
          <Button type="primary" htmlType="submit" className="login-form-button" style={style3}>
            Sign in
          </Button>
          Not a member yet? <Link to="signup"> Sign up!</Link>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
const WrappedNormalLoginFormWithRouter = withRouter(WrappedNormalLoginForm);
export default WrappedNormalLoginFormWithRouter;

