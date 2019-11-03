import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
import { Link, withRouter} from 'react-router-dom';

  class RegistrationForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = e => {
        e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const newUser = {
            name: values.nickname,
            email: values.email,
            number: values.phone,
            password: values.password
        };
        console.log(newUser);
        if (this.props.handleCancel) {
          this.props.handleCancel();
        }
        fetch("/api/signup", {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
        }).then(response => response.json())
        .then(response => {console.log('response: ', response);
       if(!this.props.handleRegister) { this.props.history.push({
          pathname: 'message',
          state: {message: response.message}
        })}
      else {
        this.props.handleRegister(newUser)
      }})
        .catch(error => console.log('error:', error));
        }
      });
      this.props.form.resetFields();
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    }; 
    
    render() {
      const { getFieldDecorator } = this.props.form;
      const formStyle = {
          marginLeft: '20%',
          marginTop: '10%',
          width: '50%'
      }
  
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
       return (
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className='form' style={formStyle}>
             <Form.Item label={<span>Name</span>}>
            {getFieldDecorator('nickname', {
               rules: [
               { required: true, message: 'Please input your name!', whitespace: true },
               { min: 6, message: 'Name can contain at least 6 characters!' },
               { max: 30, message: 'Name can contain up to 30 characters!' }
            ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Mobile Number">
            {getFieldDecorator('phone', {
              rules: [
              { required: true, message: 'Please input your mobile number!' },
              { min: 9, message: 'Please input correct mobile number!' },
              { max: 9, message: 'Please input correct mobile number!' }
            ],
            })(<Input type='number' style={{ width: '100%' }}/>)}
          </Form.Item>
          <Form.Item label="Password" >
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password can contain at least 6 characters!' },
                { max: 30, message: 'Password can contain up to 30 characters!' },
                { validator: this.validateToNextPassword },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: 'Please confirm your password!'},
                { validator: this.compareToFirstPassword },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
         <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            <br />
            Already have an account? <Link to=""> Sign in!</Link>
          </Form.Item>
        </Form>
      );
    }
  }
  
  const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
  const WrappedRegistrationFormWithRouter = withRouter(WrappedRegistrationForm);
  
export default WrappedRegistrationFormWithRouter;