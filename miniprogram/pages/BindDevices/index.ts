import { addDevice } from '../../api/Adv';
import alertService from '../../providers/alert-service/alert-service';




Page({

  data: {
    modalHidden: true,
    sNumberHidden: true,
    IPaddressHidden:false,
    pickViewArr:['192.168.1.5','192.168.1.6'],
    pickViewValue: '请选择IP地址',
    name: '',
    ipValue: '',
    remarkValue: '',
    deviceSerialValue: '',
    passwordValue: '',
    display: '',
    ischecked: false,
    id: '',
  },

  onLoad: function (options) {
    // console.log(123);
    if (options.pushStr == '1') {
      this.setData({
        name: options.name,
        deviceSerialValue: options.deviceSerialValue,
        passwordValue: options.passwordValue,
        sNumberHidden: false,
        IPaddressHidden:true,
        ischecked: true,
        id: options.id,
      })
      console.log(this.data.deviceSerialValue);
    }
  },
  /**
   * 开关点击事件
   */
  switch1Change: function (e:any){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      sNumberHidden: !e.detail.value,
      IPaddressHidden : e.detail.value,
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
//重新绑定
cancelBtnHandle: function() {
  this.onReady();
  this.setData({
    display: "none"
  })
},
//查看监控
resultBtnHandle: function() {
  wx.navigateTo({
    url: '/pages/videoList/index',
  })
  this.setData({
    display: "none"
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
   *  ip地址输入事件，获取value
   */
  formIPCity:function(e:any){
    this.setData({
      ipValue:e.detail.value
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
   *  序列号输入事件，获取value
   */
  fromdeviceSerial:function(e:any){
    console.log(e.detail.value)

    this.setData({
      deviceSerialValue:e.detail.value
    })
  },
 /**
   *  密码输入事件，获取value
   */
  frompassword:function(e:any){
    console.log(e.detail.value)
    this.setData({
      passwordValue:e.detail.value
    })
  },

  /**
   * 提交按钮点击
   */
  bindDeviceHandle: function () {
    if (this.data.name == '') {
      alertService.showToast('摄像头名称不能为空')
      return
    }
    if (this.data.IPaddressHidden) {
      if (this.data.pickViewValue == '请选择IP地址') {
        alertService.showToast('请选择IP地址')
        return
      } 
      if (this.data.deviceSerialValue == '') {
        alertService.showToast('请输入摄像头序列号')
        return
      } 
      if (this.data.passwordValue == '') {
        alertService.showToast('请输入摄像头密码（验证码）')
        return
      } 
    }else{
      if (this.data.ipValue == '') {
        alertService.showToast('请输入IP地址')
        return
      } 
    }
    const param = {
      qrcode: '',
      name: this.data.name,
      type: '1',
      ip: this.data.IPaddressHidden ? this.data.pickViewValue : this.data.ipValue,
      remark: this.data.remarkValue,
      deviceSerial: this.data.IPaddressHidden ? this.data.deviceSerialValue : '',
      password: this.data.passwordValue,
      isEzviz: this.data.IPaddressHidden ? '1' : '0',
      productId: wx.getStorageSync('testEqNo'),
      id: this.data.id,
    }
    console.log(param);
    wx.showLoading({
      title:'请稍等...'
    })
    addDevice(param).then((res: any) => {
      wx.hideLoading()
        console.log(res);
        this.setData({
          display: "block"
        })
      setTimeout(() => {
        alertService.showToast('添加成功');
      },500)                                                                          
    })
  }
})