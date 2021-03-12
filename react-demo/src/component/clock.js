import React, { Component, Fragment,useState, useEffect } from 'react';

// 1.function式组件
function Clock(props) {
  let [clockTime, setClockTime] = useState((new Date()).toLocaleString());

  useEffect(() => {
    let id = setInterval(() => {
      setClockTime(v => {
        return (new Date()).toLocaleString();
      });
    }, 1000);
    return () =>{
      return clearInterval(id);
    }
  },[]);

  return (
    <div className="block-border">
      <p>{props.title}</p>
      {clockTime}
    </div>
  )
}

// 2.class式组件
class Clock2 extends Component{
  constructor(props){
    super(props)
    this.state = {
      clockTime: (new Date()).toLocaleString(),
      id:null,
    }
  }
  componentDidMount(){
    this.setClockTime()
  }
  componentWillUnmount(){
    clearInterval(this.state.id)
    this.setState({
      id:null
    })
  }
  setClockTime(){
    let id = setInterval(() => {
      this.setState({
        clockTime: (new Date()).toLocaleString(),
      })
    }, 1000);

    this.setState({
      id
    })
  }
  render(){
    return (
      <div className="block-border">
        <p>{this.props.title}</p>
        {this.state.clockTime}
      </div>
    )
  }
}
// export default Clock
export default Clock2
