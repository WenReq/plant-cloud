import { login } from '../../api/login'
import alertService from '../../providers/alert-service/alert-service'
const MD5 = require('md5')
Page({
  data: {
    isDisable: true,
    userName: '',
    password: '',
  },
  onLoad() {

  },
  submit() {
    console.log(123);
    
    const param = {
      userName: this.data.userName,
      password: MD5(this.data.password)
    }
    wx.showLoading({
      title:'登录中...'
    })
    login(param).then((res: any) => {
      wx.hideLoading()
      wx.setStorageSync('token', res.result.token)
      wx.setStorageSync('userName', res.result.userName)
      alertService.showToast('登录成功')
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/testReq/index'
        })
      },500)
    })
  },
  handleInput(e: any) {
    const type: string = e.currentTarget.dataset.type

    if (type === 'U') {
      this.setData({
        userName: e.detail.value
      })
    } else {
      this.setData({
        password: e.detail.value
      })
    }

    if (this.data.password && this.data.userName) {
      this.setData({
        isDisable: false
      })
    }
  }
})