import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';
var token = '';

  class ResetPasswordForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            const obj = {
                password: values.password
            }
            fetch(`/api/reset/${token}`, {
             method: 'POST',
             body: JSON.stringify(obj),
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 },
         }).then(response=>response.json())
         .then(response => {console.log(response);
          this.props.history.push({
            pathname: '/message',
            state: {message: response.message}
          });
        console.log(this.props);
        })
         .catch(err=>console.log(err)); 
        }
      });
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
      token = this.props.match.params.token;
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
              Change password
            </Button>
            <br />
          </Form.Item>
        </Form>
      );
    }
  }
  
  const Reset = Form.create({ name: 'register' })(ResetPasswordForm);
  const ResetWithRouter = withRouter(Reset); 
export default ResetWithRouter;