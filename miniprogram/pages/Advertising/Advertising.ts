import { adv } from '../../api/Adv'
import { postAdv } from '../../api/Adv'
import alertService from '../../providers/alert-service/alert-service'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prID:wx.getStorageSync('testEqNo') || '',
    name: wx.getStorageSync('testEqName') || '',
    // 列表数组
    photoArray: [{
      imageUrl:'',
      type:'',
      position:''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      prID:wx.getStorageSync('testEqNo') || '',
      name: wx.getStorageSync('testEqName') || '',
    })

    const param = {
      productId:this.data.prID,
    }
    wx.showLoading({
      title:'加载中...'
    })
    console.log(param)
    adv(param).then((res: any) => {
      wx.hideLoading()
      
      this.setData({
        photoArray:res.result
      })
      setTimeout(() => {
      },500)                                                                          
    })
  },
/**
 * 发布按钮点击 
 */
  replenishHandle:function (e:any) {
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.photoArray[e.currentTarget.dataset.index].position)
    const param = {
      imgurl: this.data.photoArray[e.currentTarget.dataset.index].imageUrl,
      type: this.data.photoArray[e.currentTarget.dataset.index].position,
      productId:this.data.prID,
    }
    wx.showLoading({
      title:'正在发布...'
    })
    postAdv(param).then((res: any) => {
      wx.hideLoading()
      console.log(res)
      setTimeout(() => {
        alertService.showToast('发布成功');
      },500)                                                                          
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})