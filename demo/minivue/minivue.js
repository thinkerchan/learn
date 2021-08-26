// minivue.js
function miniVue(options) {
  this.$el = document.querySelector(options.el);
  this.$data = options.data;
  this.$methods = options.methods;
  this.bindings = {}; // data中的某个数据有可能作用到好几个地方, 所以需要存起来用于之后遍历执行更新

  this.observer(this.$data);
  this.compile(this.$el);
}

miniVue.prototype = {
  constructor:miniVue,
  observer:function(data) {
    for (var key in data) {
      this.bindings[key] = [];

      // 这个数组主要用途: 存储对应数据关联的dom节点信息
      var arr = this.bindings[key];

      // 抽离方法避免闭包问题
      this.defineReactive(data,key,data[key],arr)
    }
  },
  defineReactive:function(data,key,value,arr){
    // Object.defineProperty执行之后, configurable, enumerble为false
    Object.defineProperty(data, key, {
      get() {
        return value;
      },
      set(newVal) {
        if (newVal !== value) {
          value = newVal;
          // 同步更新视图
          arr.forEach((item)=> {
            item.updateView();
          })
        }
      }
    })
  },
  compile:function(el) {
    var nodes = ([]).slice.call(el.children);
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      // if (node.children.length > 0){
      //   this.compile(node)  //递归:防止目标元素有嵌套
      // };
      if (node.nodeType === 1 && !!node.childElementCount) {  // 换一种判断
        this.compile(node)
      }

      if (node.nodeType === 1 && !node.childElementCount && node.textContent.trim()) {
        var v = this.textToExp(node.textContent);
        this.recordRelativeDom(node,"innerText",v,this)
      }

      if (node.hasAttribute("v-model")) {
        var attrVal = node.getAttribute("v-model");
        // 方法1: 优化闭包
        node.addEventListener("input", ((i) => { // 因为闭包原因产生索引错乱,故用IIFE来优化
          this.recordRelativeDom(node,"value",attrVal,this)
          return () => {
            this.$data[attrVal] = nodes[i].value;
          }
        })(i))

        // 方法2: for循环的所有var改let
        // this.bindings[attrVal].push(new Notify(node, "value", this, attrVal));
        // node.addEventListener("input", () => {
        //   this.$data[attrVal] = node.value;
        // })
      }
      if (node.hasAttribute("v-html")) {
        var attrVal = node.getAttribute("v-html");
        this.recordRelativeDom(node,"innerHTML",attrVal,this)
      }
      if (node.hasAttribute("v-text")) {
        var attrVal = node.getAttribute("v-text");
        this.recordRelativeDom(node,"innerText",attrVal,this)
      }
      if (node.hasAttribute("v-on:click")) {
        var attrVal = node.getAttribute("v-on:click");
        node.addEventListener("click", this.$methods[attrVal].bind(this.$data));  //bind用于修正this
      }
    }
  },
  recordRelativeDom:function(node,attr,attrVal,vm){
    var curData = this.bindings[attrVal]
    if(curData){
      curData.push(new Notify(node, attr, attrVal, vm));
    }else{
      console.log('变量'+attrVal+'没有被注册!');
    }
  },
  textToExp:function(text){
    var tar,
        pieces = text.trim().split(/({{.+?}})/g);
    pieces = pieces.map(piece => {
      if (!!piece) {
        tar = piece.replace(/^{{|}}$/g, '');
      }
    });
    return tar.trim();
  }
}

function Notify(el, attr, val, vm) {
  this.el = el;
  this.attr = attr;
  this.val = val;
  this.vm = vm;
  this.updateView();
}

Notify.prototype = {
  constructor:Notify,
  updateView:function() {
    this.el[this.attr] = this.vm.$data[this.val];
  }
}