import React, { Component, Fragment } from 'react';

class TodoItem extends Component{
  constructor(props){
    super(props)
  }

  delItem(){ 
    const { delItem, index } = this.props
    delItem(index) // 子组件向父组件通信，要调用父组件传过来的方法
  }
  render(){
    return(
      <li onClick={this.delItem.bind(this)}>{ this.props.val}</li>
    )
  }
}
export default TodoItem