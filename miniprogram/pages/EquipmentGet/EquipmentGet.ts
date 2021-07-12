import { EquipmentGetPrice } from '../../api/equipmentCurrency'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagenum:1,
    dataArray:[],
    testEqName: wx.getStorageSync('testEqName') || '',
    productId: wx.getStorageSync('testEqId') || '',
    noDataIsNull : false,        // 是否有数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      productId: wx.getStorageSync('testEqId') || '',
      testEqName: wx.getStorageSync('testEqName') || '',
    });
    this.getEquipmentPriceList()
  },

  replenishHandle: function () {
    this.getEquipmentPriceList()
  },

  /**
   * 获取取币列表数据
   */
  getEquipmentPriceList: function () {
    //入参
    const param = {
      id: this.data.productId,
      // page: this.data.pagenum,
      // pageSize: 10,
    }
    console.log(param)
    wx.showLoading({
      title:'加载中...'
    })
    EquipmentGetPrice(param).then((res: any) => {
      wx.hideLoading()
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
      var arr1 = this.data.dataArray;    //从data获取当前devListArray数组
      var arr2 = res.result;        //获取最新数据
      arr1 = arr1.concat(arr2);          //合并数组
  
      if(arr1.length == 0) {
        this.setData({
          dataArray:arr1,
          noDataIsNull: true
        })
      }else{
        this.setData({
          dataArray:arr1,
          noDataIsNull: false
        })
      }



      console.log(this.data.dataArray)

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