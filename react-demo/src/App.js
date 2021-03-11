import React , {Component,Fragment} from 'react';
import Clock from './component/clock'
import TodoItem from './component/todoItem'

//  class式组件
class App extends Component { //React规定组件要以大写字母开头, 并将以小写字母开头的组件视为原生 DOM 标签, App组件是页面最顶层的组件
  constructor(props){
    super(props)
    this.state = {
      time: (new Date()).toLocaleString(),
      itemList:['吃饭','睡觉','打豆豆'],
      iptVal:'',
    }

    this.enter2addItem = this.enter2addItem.bind(this)

  }
  componentDidMount() {
    // console.log('组件挂载成功');
  }
  componentDidUpdate() {
    // console.log('组件更新');
  }
  componentWillUnmount() {
    // console.log('组件即将销毁');
  }
  addItem(){
    const { itemList, iptVal} = this.state
    if (!!iptVal) {
      this.setState({
        itemList: [...itemList, iptVal],
        iptVal:'',
      })
    }else{
      alert('值不能为空')
    }
  }
  enter2addItem(e){
    if (e.keyCode === 13) {
     this.addItem()
    }
  }
  getIptVal(e){
    let iptVal = e.target.value
    this.setState({
      iptVal
    })
  }
  delItem(index){
    let old = this.state.itemList
    old.splice(index,1)

    this.setState({
      itemList: old,
    })
  }
  render(){
    return (
      <Fragment>
        <Clock title="这是一个Clock组件" time={this.state.time}/>


        <div className="ipt-wrap">
          <input 
            onKeyUp={this.enter2addItem}  // bind操作被移到了构造函数内
            onChange={this.getIptVal.bind(this)} // 如果构造函数不手动绑定，则需要显式bind(this)， 思考一下为什么
            value={this.state.iptVal} 
          /> 
          <button 
            className="btn-bgc" // 样式注入方式1, 推荐使用BEM
            style={{color:'red'}}  // 样式注入方式2,使用对象, 注意内联样式不完全支持所有css样式，如伪类，媒体查询等
            //  样式注入方式3, css-in-js, 这是一个比较混乱的方案。代码略
            onClick={this.addItem.bind(this)}
          > 添加</button>
        </div>
        <ul>
          {this.state.itemList.map((item,index)=>{
            return (
              // 1. 改写前
              // <li onClick={this.delItem.bind(this,index)} key={index}>{item}</li>
              
              // 2. 改写成组件, (无论是常规变量还是方法，都用props传递)
              <TodoItem delItem={this.delItem.bind(this)} key={index} val={item} index={index} />
            )
          })}
        </ul>
      </Fragment>
    )
  }
}
export default App;
