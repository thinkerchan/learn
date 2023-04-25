window.raf;

// raf
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

function log(){
  console.log.apply(null, arguments)
}

;((win,doc)=>{

  let clientH = win.innerHeight;
  let clientW = win.innerWidth;

  let canvas = doc.getElementById('Jcan');
  canvas.width = clientW;
  canvas.height = clientH;

  let ctx = canvas.getContext('2d');

  let ball = {
    x:100,
    y:100,
    vx:0, // 水平方向的速度
    vy:0, // 竖直方向的速度
    ax:0, // 水平方向的加速度
    ay:0, // 竖直方向的加速度
    dt:.5, // 单位时间
    friction: 0.8, // 模拟摩擦力, 每撞一次速度会减小为原来的80%
    radius:25,
    color:'green',
    ds(v,a,t){ // 求当前位移
      return (Math.round((v*t + (1/2)*a*t*t) *100)/100);
    },
    dv(v0,a,t){ // 求当前速度
      return (Math.round((v0 + a*t)*100)/100);
    },
    initParams(){
      this.ay = 0.5;
    },
    precise(num){
      return +((num*100/100).toFixed(0))
    },
    init(ctx){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    },
    clearBall(){
      ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); //(x,y,width ,height)
    },
    clearCan(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
    },
    move(){

      this.x = this.x + this.ds(this.vx,this.ax,this.dt);
      this.y = this.y + this.ds(this.vy,this.ay,this.dt);


      this.vx = this.dv(this.vx,this.ax,this.dt);
      this.vy = this.dv(this.vy,this.ay,this.dt);

      this.checkBorder(0, canvas.width, canvas.height, 0);
    },
    start(){
      this.clearCan();
      this.init(ctx);
      this.move();
    },
    checkBorder: function(top, right, bottom, left) {

      // 超过边界之后停止
      if(Math.abs(Math.ceil( this.vy)) == 0){
        return;
      }

      if (this.y > (bottom-this.radius)) {
        log('碰撞前:',this.vy)
        this.vy = - Math.floor(this.friction*this.vy);
        // this.vy = Math.floor(this.friction*this.vy);
        console.log('碰撞后:',this.vy);

      }

      if (this.y < (top+this.radius)) {
        this.vy = -this.vy
      }

      if (this.x > (right-this.radius)) {
        this.vx = -this.vx
      }

      if (this.x < (left+this.radius)) {
        this.vx = -this.vx
      }
    }
  }

  ball.initParams();
  ball.init(ctx);  // 首次渲染


  let startFlag = false;
  // 不断重绘
  function _draw(){
    ball.start();
    win.raf = win.requestAnimationFrame(arguments.callee);
  }

  function _stop(){
    if (win.raf) {
      startFlag = false;
      win.cancelAnimationFrame(raf);
    }
  }

  function getTarget(e, attr) {
    let target = null;
    let val = null;
    let arrayLike = e.path || e.composedPath()
    let eleArray = Array.from(arrayLike);
    console.log(eleArray);

    for (let index = 0; index < eleArray.length; index++) {
      const element = eleArray[index];
      if (element.dataset && element.dataset[attr || 'target']) {
        target = element
        val = element.dataset[attr || 'target']
        console.log('命中');
        break;
      }
    }

    return { target, val }
  }

  doc.addEventListener('click', (e)=>{
    let id = e.target.id || getTarget(e).val;

    console.log('测试异步');
    console.log(id);

    switch (id) {
      case 'Jcan':
        if(!startFlag){
          startFlag = true;
          _draw()
        }
        break;
      case 'Jinfo':
        _stop()
      default:
        // ...
        console.log('无命中');
        break;
    }
  },false )

  win.ball = ball;
})(window,document);

