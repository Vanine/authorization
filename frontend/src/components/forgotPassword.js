import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, Spin } from 'antd';
import 'antd/dist/antd.css';
import './styles/esiminchstyle.css';

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({spinning: true});
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const data = {
          email: values.username,
      };
      console.log(data);
      fetch("/api/forgotPassword",  {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
          },
      }).then(response => response.json())
      .then(response => {console.log('response: ', response);
      this.props.history.push({
        pathname: '/message',
       state:{message: response.message} 
      }); console.log(this.props.history)})
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
      const style3 = {
          width: '100%'
      }
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.state.spinning}>
        <Form onSubmit={this.handleSubmit} className="login-form" style={style1}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
            { required: true, message: 'Please input your e-mail!' },
            { type: 'email', message: 'The input is not valid E-mail!' }
          ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="E-mail"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={style3}>
            Send
          </Button>
        </Form.Item>
      </Form>
      </Spin>
      
    );
  }
}
const ForgotPassword = Form.create({ name: 'normal_login' })(NormalLoginForm);
const WrappedForgotPasswordWithRouter = withRouter(ForgotPassword);
export default WrappedForgotPasswordWithRouter;

