// leancloud api: https://leancloud.cn/docs/leanstorage_guide-js.html
;((win,doc)=>{
  const CONFIG = {
    appId:'2NEs9BW5Bfr80oTaW12eHyj9-MdYXbMMI',
    appKey: 'oFiQ3eDR88ebgxaNgpFPUCX1',
    dataBase: 'FORM',
  }

  let rawDataObj = {
    user:'缺省姓名',
    phone:0,
    apply:false,
    code:'0',
  };

  let mod = {
    init(){
      this.initDataBase();
    },
    initDataBase(){
      AV.init(CONFIG.appId, CONFIG.appKey);
    },
    saveData(rawDataObj,cb){
      let av = AV.Object.extend(CONFIG.dataBase);
      let instance = new av();

      for (let i in rawDataObj) {
        if (rawDataObj.hasOwnProperty(i)) {
           let _v = rawDataObj[i];
           instance.set(i, _v);
        }
      }
      let p  = new Promise((resolve,reject)=>{
        instance.save().then((ret)=>{
          console.log('存储成功')
          resolve && resolve()
        }, (error)=>{
          console.log(error)
          reject && reject()
        });
      })

      p.then(()=>{
        cb && cb()
      })
    },
    queryData(){
      let query = new AV.Query(CONFIG.dataBase);
      query.find().then((ret)=>{
        console.log(ret)
      })
    },
    checkFormData(){
      let  _user = Juser,
        _phone = Jphone,
        _code = Jcode,
        user = _user.value.trim(),
        phone = +_phone.value.trim(), // number
        code = _code.value.trim();

      if (!user) {
        alert(_user.placeholder)
        return false
      }

      if(!phone){
        alert(_phone.placeholder)
        return false
      }

      if(!code){
        alert(_code.placeholder)
        return false
      }

      return {
        user,
        phone,
        code,
      }
    },
    fetchFormData(cb){
      let formData = this.checkFormData();
      if(formData){
        let data =  Object.assign(rawDataObj,formData)
        cb && cb(data);
      }
    },
    clearForm(){
      Jform.reset();
    }
  };

  mod.init()

  Jbody.addEventListener('click', (e)=>{
    let ele = e.target, id = ele.id;
    switch (id) {
      case 'Jcheck':
        mod.fetchFormData((data)=>{
          mod.saveData(data,()=>{
            mod.clearForm()
          });
        })
        break;
      default:
        // statements_def
        break;
    }
  }, false)
})(window,document);