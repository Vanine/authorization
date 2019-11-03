import { Table, Input, Popconfirm, Form, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import Modal1 from './modal';
import PageSelect from './pageSelect';
import { connect } from "react-redux";
import { addUser } from '../actions/adduser';
import { deleteUser } from '../actions/deleteuser';
import { updateUser } from '../actions/updateuser';
import { setUsers } from '../actions/setusers';
import { setUsersWithQuery } from '../actions/setuserswithquery';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3001');

const EditableContext = React.createContext();
var page = 1;
var limit = 10;
var searchtext = '';
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const { Option } = Select;
const { Search } = Input;
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };
  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };
  
  
  save = e => {
    const { record, handleSave } = this.props;
    
    this.form.validateFields((error, value) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      console.log('e.currentTarget.id: ', e.currentTarget.id);
      const a = e.currentTarget.id;
      console.log(record, e.currentTarget.id, value, record._id);
      socket.emit('changeUser', {oldRecord: record, inputId: e.currentTarget.id, newValue: value, _id: record._id}, function(data) {
          console.log(data);
        handleSave(record, a, value, record._id );
      });

    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => {(this.input = node); console.log(node)}} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);

    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        editable: true
      },
      {
        title: 'Number',
        dataIndex: 'number',
        editable: true
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.props.users.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record._id)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
        dataSource: [],
        pageCount: 1,
        spinning: true
    };
    
};

componentDidMount() {
  console.log('component did mount');
}

componentDidUpdate() {
  console.log('component did update');
  socket.on('changeUser', (data) => {
      console.log('dataaaaaa: ', data);
      this.handleSave(data.oldRecord, data.inputId, data.newValue, data._id)
  })
}

  handleSave = (oldRecord, inputId, newValue, _id) => {
    this.props.users.find(item => {
      if(item._id == _id) {
          console.log('mtav2');
          console.log("inputId: ", inputId);
          console.log("newVal: ", newValue);
          item[`${inputId}`] = newValue[`${inputId}`];
            fetch("/api/users/update",  {
              method: 'POST',
              body: JSON.stringify(item),
              headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
              }
          }).then(response => response.json())
          .then(response => {console.log('response: ', response)})
          .then(this.props.updateUser(item))
          .catch(error => alert("error: ", error)); 
          console.log('item: ', item);
       }
    })
  };
handleAdd = (obj) => {
  const newUser = {name: obj.name, email: obj.email, number: obj.email};
  console.log(newUser);
  this.props.addUser(newUser);
}
handleFetch = () => {
    console.log(this.props);
    fetch("/api/users",  {
      method: 'GET',
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
  }).then(response => response.json())
  .then(response => {
    this.setState({spinning: false});
    this.props.setUsers(response.users);
    this.setState({pageCount: response.users.length % limit === 0 ? response.users.length / limit : response.users.length / limit + 3})
  })
  .catch(error => console.log('error:', error)); 
  console.log(this.props)

}
a(name, page, limit) {
  console.log(name, page, limit)
}
handleFetchWithQuery(name, page, limit) {
  this.setState({spinning: true});
  console.log(name, page, limit);
   fetch(`/api/users?q=${name}&p=${page}&l=${limit}`,  {
        method: 'GET',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    }).then(response => response.json())
    .then(response => { 
      this.setState({pageCount: response.pageCount, spinning: false});
      this.props.setUsersWithQuery({users: response.users, pageCount: response.pageCount})
    })
    .catch(error => console.log('error:', error));
  }

handleDelete = (id) => {
    const data = {
        _id: id,
    };
        fetch("/api/users/delete",  {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(response => response.json())
    .then(response => {console.log('response: ', response)})
    .then(() => {
      this.props.deleteUser(id);
      
    })
    .catch(error => alert("error: ", error)); 
}

  handleSelectLimit = (value) => {
  limit = value;
  console.log(value)
  this.handleFetchWithQuery(searchtext, page, limit)
}
handleSelectPage = (value) => {
  page = value;
  console.log(value)
  this.handleFetchWithQuery(searchtext, page, limit)
}
handleSearch = debounce((value) => {
  searchtext = value;
  page = 1;
  this.handleFetchWithQuery(searchtext, page, limit)
}, 50
)

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const tableStyle = {
      marginLeft: '25%',
      marginRight: '25%',
      width: '50%',
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    
    return (
      <div >
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
        <Search
       style={{width: '400px', marginBottom: '20px', marginRight:'5%'}}
      placeholder="Search by name"
      enterButton="Search"
      size="large"
      onChange={e=>this.handleSearch(e.target.value)}
    />
        <Modal1 handleAdd={this.handleAdd} style={{marginLeft: '30px'}} size={'lg'}/>
        </div>
      <Spin spinning={this.state.spinning} size='large' style={{background: 'white'}}>
      <Table
        style={tableStyle}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.props.users}
          columns={columns}
          pagination={false}
        />
      </Spin>
        
        <span style={{display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px'}}>
        <span >
        <span>Limit: </span>
       <Select defaultValue="10" style={{ width: 60 }} onSelect={this.handleSelectLimit}>
        <Option value="5">5</Option>
        <Option value="10">10</Option>
        <Option value="15">15</Option>
        <Option value="20">20</Option>
      </Select>
        </span>
      <span style={{marginLeft: '30px'}}>
      <span>Page number: </span>{
        console.log(this.state.pageCount)
      }
        <PageSelect number={this.state.pageCount} handleSelectPage={this.handleSelectPage}/>
      </span>
        </span>
       </div>
    );
 } }

export default connect(
  state => ({
    users: state.users,
    pageCount: state.pageCount
  }),
  dispatch => ({
    addUser: (data => {
      dispatch(addUser(data))
    }),
    deleteUser: (id => {
      dispatch(deleteUser(id))
    }),
    updateUser: (data => {
      dispatch(updateUser(data))
    }),
    setUsers: ((data) => {
      dispatch(setUsers(data))
    }),
    setUsersWithQuery: ((data) => {
      dispatch(setUsersWithQuery(data))
    }),
}))(EditableTable);