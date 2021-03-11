import React , {Component,Fragment} from 'react';
import Clock from './component/clock'

//  class式组件
class App extends Component { //React规定组件要以大写字母开头, 并将以小写字母开头的组件视为原生 DOM 标签, App组件是页面最顶层的组件
  constructor(props){
    super(props)
    this.state = {
      time: (new Date()).toLocaleString(),
      itemList:['吃饭','睡觉','打豆豆'],
      iptVal:'',
    }

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
    let old = this.state.itemList
    this.setState({
      itemList: [...old, this.state.iptVal],
      iptVal:'',
    })
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
          <input value={this.state.iptVal} onChange={this.getIptVal.bind(this)}/>
          <button  onClick={this.addItem.bind(this)}> 添加</button>
        </div>
        <ul>
          {this.state.itemList.map((item,index)=>{
            return (
              <li onClick={this.delItem.bind(this,index)} key={index}>{item}</li>
            )
          })}
        </ul>
      </Fragment>
    )
  }
}
export default App;
