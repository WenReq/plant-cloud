// import { submit } from '../../api/video'
// import alertService from '../../providers/alert-service/alert-service'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    success:true,
    productId:'12345444444444444',
    show: false,
    name: ''
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(opts): WechatMiniprogram.Page.ICustomShareContent {
    console.log(opts.target)
    return {}
  },

  onClose() {
    this.setData({ close: false });
  },

  handleInput(e: any){
    this.setData({
      name: e.detail.value
     })
  },

  onSubmit(){
    // const param = {
    //   name : this.data.name,
    // }
    // wx.showLoading({
    //   title:'提交中...'
    // })
    // submit(param).then(() => {
    //   wx.hideLoading()
    //   alertService.showToast('修改成功')
    //   setTimeout(() => {
    //     wx.navigateTo({
    //       url: '/pages/video/index'
    //     })
    //   },500)
    // })
  },

  onClick(){
    this.setData({show:true});
  }
})