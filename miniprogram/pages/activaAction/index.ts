import { updateDeviceByProduct } from '../../api/Adv';
import alertService from '../../providers/alert-service/alert-service';
import { findProductList } from '../../api/testEq'

Page({
  data: {
    deviceSerial: '',
    password: '',
    name: '',
    createTime: '',
    id: '',
    deviceCode: '',
    productname: '',
    searchList: [],
    showList: false,
    productId: '',


  },
  onLoad: function (options) {
    console.log(options.deviceSerial);
    console.log(options.password);
    console.log(options.name);
    console.log(options.id);
    console.log(options.createTime);
    console.log(options.deviceCode);
    console.log(options.productname);
    console.log(options.productId);

    this.setData({
      deviceSerial: options.deviceSerial,
      password: options.password,
      name: options.name,
      createTime: options.createTime,
      id: options.id,
      deviceCode: options.deviceCode,
      productname: options.productname,
      productId: options.productId,
    })



  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  /**
     * 输入序列号，获取value
     */
  formMac: function (e: any) {

    let params = {
      pageSize: 20,
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
      deviceCode: result.productId,
      showList: false,
      productname: result.name,
    })
    this.updateDeviceByProduct()
  },
  /**
     * 绑定摄像头名称输入事件，获取value
     */
  formName: function (e: any) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 失去焦点，获取value
   */
  setToName: function (e: any) {
    this.setData({
      name: e.detail.value
    })
    this.updateDeviceByProduct()
  },

  updateDeviceByProduct: function () {
    let params = {
      id: this.data.id,
      productId: this.data.deviceCode,
      name: this.data.name,
    }
    console.log(params);
    updateDeviceByProduct(params).then((res: any) => {
      console.log(res.result);
      alertService.showToast('修改成功')
    })
  },
  bindDeviceHandle: function () {
    wx.redirectTo({
      url: `/pages/bindEquipment/index?deviceSerial=${this.data.deviceSerial}&password=${this.data.password}&name=${this.data.name}`
    })
  },
  lookVideoHandle: function () {
    console.log(this.data.productname);
    wx.setStorageSync('testEqName', this.data.productname)
    wx.setStorageSync('testEqNo', this.data.deviceCode)
    wx.setStorageSync('testEqId', this.data.productId)
      wx.navigateTo({
      url: '/pages/videoList/index',
    })
  }
});