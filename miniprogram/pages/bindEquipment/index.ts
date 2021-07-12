import { addDevice } from '../../api/Adv';
import alertService from '../../providers/alert-service/alert-service';
import { findProductList } from '../../api/testEq'


Page({
 
  data: {
    display: '',
    deviceSerial: '',
    password: '',  
    name: '',
    pickViewArr:['192.168.1.5','192.168.1.6'],
    pickViewValue: '请选择IP地址',
    remarkValue: '',
    macValue: '',
    searchList:[],
    showList: false,
  },
 
  onLoad: function(options) {
    console.log(options.deviceSerial);
    console.log(options.password);
    console.log(options.name);
    this.setData({
      deviceSerial: options.deviceSerial,
      password: options.password,
      name: options.name,
  })
  },
 /**
 * 请选择IP地址点击事件
 */
IPAddressHandle: function (e:any) {
  this.setData({
    pickViewValue: this.data.pickViewArr[e.detail.value]
  })
},
/**
   * 绑定摄像头名称输入事件，获取value
   */
  formName:function(e:any){
    this.setData({
      name:e.detail.value
    })
  },
  /**
   *  remaek输入事件，获取value
   */
  bindTextAreaBlur:function(e:any){
    console.log(e.detail.value)

    this.setData({
      remarkValue:e.detail.value
    })
  },
/**
   * 输入序列号，获取value
   */
  formMac:function(e:any){
    this.setData({
      macValue: e.detail.value,
    })
    let params = {
      pageSize:20,
      productId: e.detail.value
    }
    findProductList(params).then((res: any) => {
      console.log(res.result);
      
      if (res.result.length !== 0) {
        this.setData({ showList: true })
      } else {
        this.setData({ showList: false })
        alertService.showToast('未检索到数据！')
      }
      this.setData({
        searchList: res.result
      })
    })
  },
  checkItem(item: any) {
    console.log(123);
    
    let result = item.currentTarget.dataset.type;
    this.setData({
      macValue: result.productId,
      showList: false,
    })
  },

//重新绑定
cancelBtnHandle: function() {
  console.log(123);
  this.setData({
    display: "none"
  })
},
//查看监控
resultBtnHandle: function() {
  console.log(123);
  this.setData({
    display: "none"
  })
  wx.navigateTo({
    url: '/pages/videoList/index',
  })
},













//显示
bindDeviceHandle: function () {
    // this.setData({
    //   display: "block"
    // })
    if (this.data.name == '') {
      alertService.showToast('摄像头名称不能为空')
      return
    }
    if (this.data.pickViewValue == '请选择IP地址') {
        alertService.showToast('请选择IP地址')
        return
      } 
      if (this.data.deviceSerial == '') {
        alertService.showToast('请输入摄像头序列号')
        return
      } 
      if (this.data.password == '') {
        alertService.showToast('请输入摄像头密码（验证码）')
        return
      } 
      if (this.data.macValue == '') {
        alertService.showToast('请输入MAC地址')
        return
      } 
    const param = {
      qrcode: '',
      name: this.data.name,
      type: '1',
      ip: this.data.pickViewValue,
      remark: this.data.remarkValue,
      deviceSerial: this.data.deviceSerial,
      password: this.data.password,
      isEzviz: '1',
      productId: this.data.macValue,
    }
    console.log(param);
    
    wx.showLoading({
      title:'请稍等...'
    })
    addDevice(param).then((res: any) => {
      wx.hideLoading()
        console.log(res.result);
        this.setData({
          display: "block"
        })
      setTimeout(() => {
        alertService.showToast('添加成功');
      },500)                                                                          
    })
  },
})
