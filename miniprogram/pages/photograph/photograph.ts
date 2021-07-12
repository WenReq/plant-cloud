import { getPhotos_list } from '../../api/equipmentCurrency'
import { nPerformed } from '../../api/equipmentCurrency'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    devid:wx.getStorageSync('testEqId') || '',
    noDataIsNull : false,        // 是否有数据

    dataListArray : [{
      id:'',
      path:''
    }],
    testEqName: wx.getStorageSync('testEqName'),
    showModal: false,
    errorConcent_list: [{
      state:1,
      msg:''
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      testEqName: wx.getStorageSync('testEqName'),
      devid:wx.getStorageSync('testEqId') || '',

    })

    console.log(wx.getStorageSync('testEqName'))
    this.getEquipmentPriceList()
  },
/**
 * 抓拍按钮点击
 */
  takeCandidHandle:function () {
    //入参
    const param = {
      id:this.data.devid
      // page: this.data.pagenum,
      // pageSize: 10,
    }
    console.log(param)
    wx.showLoading({
      title:'抓拍中...'
    })
    nPerformed(param).then((res: any) => {
      wx.hideLoading()
      console.log(res.result)
      var arr = res.result;        //获取最新数据
      var a = 0
      this.getEquipmentPriceList()
      for(var i = 0; i < arr.length; i++) {
        console.log(arr[i].state)
        if(arr[i].state == a) {
          this.setData({
            showModal: false,
          })
        } else {
          this.setData({
          showModal: true,
          errorConcent_list: arr
        })
        return
        }
      }
    })
  },

  /**
   * 刷新按钮点击
   */
  replenishHandle:function () {
    this.getEquipmentPriceList()
  },

  preImageBigHandle: function (e:any) {
    var index=e.currentTarget.dataset.index
    console.log(index)
    var imageUrl = this.data.dataListArray[index].path
   
    var imgUrl = imageUrl
    wx.previewImage({
    urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
    current: '', // 当前显示图片的http链接，默认是第一个
  })
  },

/**
   * 获取列表数据
   */
  getEquipmentPriceList: function () {
    //入参
    const param = {
      id:this.data.devid
      // page: this.data.pagenum,
      // pageSize: 10,
    }
    console.log(param)
    wx.showLoading({
      title:'加载中...'
    })
    getPhotos_list(param).then((res: any) => {
      wx.hideLoading()
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
        console.log(res.result)
        console.log(res.result.list)
        console.log(res.result.length)
      if(res.result.length == 0) {
        this.setData({
          dataListArray:res.result,
          noDataIsNull: true
        })
      }else{
        this.setData({
          dataListArray:res.result,
          noDataIsNull: false
        })
      }
    })
  },
/**
* 弹窗
*/
showDialogBtn: function () {
  this.setData({
  showModal: true
  })
  },
  
  
  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
  this.setData({
  showModal: false
  });
  },
  
  /**
  * 对话框取消按钮点击事件
  */
  onCancel: function () {
    this.hideModal();
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

  }
})