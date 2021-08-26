// leancloud api: https://leancloud.cn/docs/leanstorage_guide-js.html
window.DEV = false;
;((win,doc,AV)=>{
  const CONFIG = {
    appId:'XPJzs0FfufkFfuBjbJraqhbo-gzGzoHsz',
    appKey: 'QoS0zL4Y2xTDviitGOPkvCGv',
    dataBase: 'FORM',
  }

  let rawDataObj = {
    user:'缺省姓名',
    phone:0,
    apply:true,
    code:'0',
    from:'1234',  //渠道来源
  };

  let mod = {
    match:false,
    time:30,
    init(){
      this.initDataBase()
      this.bindClick()
    },
    initDataBase(){
      AV.init(CONFIG.appId, CONFIG.appKey)
    },
    postData(rawDataObj,cb){
      let av = AV.Object.extend(CONFIG.dataBase)
      let instance = new av()

      for (let i in rawDataObj) {
        if (rawDataObj.hasOwnProperty(i)) {
           let _v = rawDataObj[i];
           instance.set(i, _v)
        }
      }
      let p  = new Promise((resolve,reject)=>{
        instance.save().then((ret)=>{
          console.log('存储成功')
          resolve && resolve()
        }, (error)=>{
          console.log(error)
          reject && reject()
        })
      })

      p.then(()=>{
        cb && cb()
      })
    },
    queryData(cb){
      let query = new AV.Query(CONFIG.dataBase)
      // query.equalTo('url', value)
      query.find().then((ret)=>{
        cb && cb(ret)
      })
    },
    checkFormData(){
      let  _user = Juser,
        _phone = Jphone,
        _address = Jaddress,
        _code = Jcode;

      let  user = _user.value.trim(),
        phone = +_phone.value.trim(), // number
        address = _address.value.trim(),
        code = _code.value.trim()

      this.user = user
      this.phone = phone
      this.address = address
      this.code = code

      if (!user) {
        alert(_user.placeholder)
        return false
      }

      if(!phone){
        alert(_phone.placeholder)
        return false
      }

      if(!address){
        alert(_address.placeholder)
        return false
      }

      if(!code){
        alert(_code.placeholder)
        return false
      }

      return {
        user,
        phone,
        address,
        code,
      }
    },
    checkPhone(){
      let _phone = Jphone,
      phone = +_phone.value.trim();
      if (!!phone) {
        return phone
      }else{
        alert(_phone.placeholder);
      }
    },
    fetchFormData(cb){
      let formData = this.checkFormData()
      if(formData){
        let data =  Object.assign(rawDataObj,formData)
        cb && cb(data)
      }
    },
    clearForm(){
      Jform.reset()
    },
    fetchDataFromRemote(){
      this.queryData((ret)=>{
        this.renderAll(ret)
      })
    },
    renderAll(ret){
      let frag = doc.createDocumentFragment()
      for (var i =  0; i<ret.length; i++) {
        frag.appendChild(this.renderOne(ret[i]))
      }
      Jlist.appendChild(frag)
    },
    renderOne(data){
      let html = '',
      user = data.get('user'),
      phone = data.get('phone'),
      address = data.get('code')

      html = this.getTpl()
         .replace(/{{user}}/g,user)
         .replace(/{{phone}}/g,phone)
         .replace(/{{address}}/g,address)

      let li = doc.createElement('li')
      li.classList ='data-item';
      li.innerHTML = html;

      return li;
    },
    getTpl(){
      return `
        <span class="user">{{user}}</span>
        <span class="phone">{{phone}}</span>
        <span class="address">{{address}}</span>
      `;
    },
    getSmsCode(phone,sucess,fail){
      AV.Cloud.requestSmsCode({
          mobilePhoneNumber: phone,
          name: '产品试用小程序',
          op: '申请验证',
          ttl: 10  // 验证码有效时间为 10 分钟
      }).then(()=>{
          console.log('短信验证码获取成功')
          sucess && sucess()
      }, (err,data)=>{
          console.log('短信验证码获取失败')
          fail && fail(err)
      });
    },
    verifySmsCode(code,phone,sucess,fail){

      AV.Cloud.verifySmsCode(code, phone).then(()=>{
        console.log('验证成功, 允许提交')
        sucess && sucess()
      }, (err)=>{
        console.log('验证失败, 弹窗 "验证失败"')
        fail && fail(err)
      });
    },
    enableCodeInput(){
      let mark = localStorage.getItem('code_received');
      if (!!mark) {
        Jcode.removeAttribute('disabled')
      }
    },
    bindClick(){
      Jbody.addEventListener('click', (e)=>{
        e.preventDefault();
        let ele = e.target,
          id = ele.id;
        switch (id) {
          case 'Jsubmit':
            this.fetchFormData((data)=>{
              this.verifySmsCode(this.code,''+this.phone,()=>{
                this.postData(data,()=>{
                  this.clearForm()
                })
              },(err)=>{
                this.setTips(err.rawMessage)
              })
            })
            break;
          case 'Jcheck':
            this.fetchDataFromRemote(()=>{
              this.renderAll()
            })
            break;
          case 'Jsms':
            let phone = this.checkPhone();
            if (!phone) {
              break;
            }else{
              this.phone = phone
            }

            this.pauseSend();
            this.getSmsCode(''+this.phone,()=>{
              this.setTips('验证码已发送')
              // this.clearPause();
            },(err)=>{
              this.setTips(err.rawMessage)
              // this.clearPause();
            })

            break;
          default:
            // statements_def
            break;
        }
      }, false)
    },
    setTips(str){
      Jtips.innerText = str;
    },
    pauseSend(){
      Jsms.setAttribute('disabled','')
      let time = this.time;
      this.itv = setInterval(()=>{
        time = time - 1;
        if (time<0) {
          this.clearPause()
          return;
        }
        Jsms.innerText = time+'s'
      },1000)
    },
    clearPause(){
      clearInterval(this.itv)
      this.itv = null;
      Jsms.removeAttribute('disabled')
      Jsms.innerText = '获取验证码'
    }
  };
  mod.init()
  window.mod = mod
})(window,document,AV)