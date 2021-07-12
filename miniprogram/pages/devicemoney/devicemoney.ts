import { equipmentCurrencyPost } from '../../api/equipmentCurrency'
import { equipmentCurrencyList } from '../../api/equipmentCurrency'
// import alertService from '../../providers/alert-service/alert-service'


Page({
  data: {
      showModal: false,   //补币按钮点击
      noDataIsNull : false,        // 是否有数据
      count : 0,          //补币数量
      pagenum: 1,         //初始页默认值为1
      devListArray:[],     // 列表数据数组
      name: wx.getStorageSync('testEqName') || '',
      productId: wx.getStorageSync('testEqId') || '',
  },
  onLoad: function () {
    this.setData({
      productId: wx.getStorageSync('testEqId') || '',
      name: wx.getStorageSync('testEqName') || ''
    });
    this.getDevDataList()
  },
  /**
   * 上啦加载更多
   */
  // onReachBottom: function () { //触底开始下一页
  //   var that=this;
  //   var pagenum = that.data.pagenum + 1; //获取当前页数并+1
  //   that.setData({
  //     pagenum: pagenum, //更新当前页数
  //   })
  //   console.log(that.data.pagenum)

  //   that.getDevDataList();//重新调用请求获取下一页数据
  // },
/**
 * 下拉刷新数据
 */
  // onPullDownRefresh() {
  //   var that=this;
  //   var pagenum = 1; //页数设置为1
  //   that.setData({
  //     pagenum: pagenum, //更新当前页数
  //   })
  //   that.getDevDataList();//重新调用请求获取数据
  // },

  /**
   * 获取设备补币列表数据
   */
  getDevDataList:function () { 
    //入参
    const param = {
      id: this.data.productId
      // page: this.data.pagenum,
      // pageSize: 10,
    }
    console.log(param)
    wx.showLoading({
      title:'加载中...'
    })
    equipmentCurrencyList(param).then((res: any) => {
      wx.hideLoading()
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
      // 如果当前页码为1，清空数组
      if(this.data.pagenum == 1) {
        this.data.devListArray = []
      }
      var arr1 = this.data.devListArray; //从data获取当前devListArray数组
      var arr2 = res.result;        //获取最新数据
      arr1 = arr1.concat(arr2); //合并数组
      console.log(res)
      if(arr2.length == 0) {
        this.setData({
          devListArray:arr1,
          noDataIsNull: true
        })
      }else{
        this.setData({
          devListArray:arr1,
          noDataIsNull: false
        })
      }

      
    })
  },
/**
 * 弹窗
 */
replenishHandle: function () {
  this.setData({
    showModal: true
  })
},
/**
 * 弹出框蒙层截断touchmove事件
 */
preventTouchMove: function () {
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
 * 补币对话框取消按钮点击事件
 */
onCancel: function () {
  this.hideModal();
},
/**
 * 补币对话框确认按钮点击事件
 */
onConfirm: function () {
  const param = {
    id: this.data.productId,
    coinNum: this.data.count
  }
  console.log(param)
  wx.showLoading({
    title:'正在补币...'
  })
  equipmentCurrencyPost(param).then((res:any) => {
    wx.hideLoading()
    console.log(res)
    // this.onPullDownRefresh()
    this.getDevDataList()
    this.hideModal();
  })
},
/**
 * 点击减号按钮
 */
cutHandle: function () {
  this.data.count = Number(this.data.count)
  this.data.count -= 100;
  if(this.data.count <= 0) {
    console.log('不能小与0')
    wx.showToast({
      title: '补币数量不能少于0',
      icon: 'none',
      duration: 2000
  })
    this.setData({
      count: 0,
    })
  } else {
    this.setData({
      count:this.data.count
    })
  }
},

  /**
 * 点击加号按钮
 */
addHandle: function () {
  this.data.count = Number(this.data.count)
  this.data.count+=100;
  if(this.data.count >= 400) {
      wx.showToast({
        title: '补币数量不能大于400',
        icon: 'none',
        duration: 2000
    })
    this.setData({
        count:400,
    })
  } else {
    this.setData({
      count:this.data.count
    })
    console.log(this.data.count)
  }
},
/**
* 补币数量输入框值发生改变调用
*/
inputChange : function (e:any) {
  console.log(e.detail)
  console.log(e.detail.value.toString().substr(1));
  if(e.detail.value.toString().substring(0,1) == '0') {
    e.detail.value = e.detail.value.toString().substr(1);
  }
  if(e.detail.value >= 400) {
    wx.showToast({
      title: '补币数量不能大于400',
      icon: 'none',
      duration: 2000
   })
   e.detail.value = 400
  }
  if(e.detail.value <= 0) {
    wx.showToast({
      title: '补币数量不能小于0',
      icon: 'none',
      duration: 2000
   })
   e.detail.value = 0
  }
  this.setData({
    count: e.detail.value,
  })
},
});