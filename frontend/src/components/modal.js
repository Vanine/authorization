import { Modal, Button } from 'antd';
import Signup from './signUp';
import React from 'react';

export default class Modal1 extends React.Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

handleCancel = () => {
    this.setState({ visible: false, value: '' });
  };

  handleRegister = (obj) => {
      this.props.handleAdd(obj)
  }
  render() {
    const { visible, loading } = this.state;
    const modalStyle = {
        width: '50%'
    }
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add a user
        </Button>
        <Modal
        width='60%'
        style={modalStyle}
          visible={visible}
          title="Title"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
           
          ]}
        >
        <Signup handleRegister= {this.handleRegister} handleCancel={this.handleCancel} style={{marginLeft: '0px'}} />
        </Modal>
      </div>
    );
  }
}

