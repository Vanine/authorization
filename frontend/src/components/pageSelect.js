import React from 'react';
import { Button, Select } from 'antd';
const { Option } = Select;

export default class PageSelect extends React.Component {
   
  render() {
    var buttons = [];
    for (let i = 1; i <= this.props.number; i++) {
      buttons[i] = i;
    }
  
    return (
<Select defaultValue="1" style={{ width: 50 }} onSelect={this.props.handleSelectPage}>
          {
 buttons.map(item => {
  return ( <Option value={item}>{item}</Option>)
}) }
      </Select>
    )
   
  }
}
