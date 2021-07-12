// index.ts
// 获取应用实例
import { list } from '../../api/clear'
import { getProductInfo,cleanOverFlow } from '../../api/clear'
import { login } from '../../api/clear'
import alertService from '../../providers/alert-service/alert-service'
Page({
  data: {
    value: '',
    list: '',
    productId: '',
    infoList: '',
    name: '',
    titleTxt:'',
    showTitle:false,
    loginShow:false,
    fullBtnFlag:false,
  },
  showPopupTitle() {
    let data = this.data.name;
    this.setData({ showTitle: true,titleTxt:data });
  },
  titleOnClose(){
    this.setData({ showTitle: false });
  },
  onLoad() {
    this.setData({
      productId: wx.getStorageSync('testEqNo') || '',
      name: wx.getStorageSync('testEqName') || '',
      loginShow: wx.getStorageSync('scenario') && wx.getStorageSync('scenario') === '2' ? true : false
    });
    this.load();
    this.productInfo();
  },

  load() {
    wx.showLoading({
      title: '加载中...'
    })
    list(this.data.productId).then((res: any) => {
      wx.hideLoading()
      this.setData({
        list: res.result
      })
    })
  },

  productInfo() {
    let vm = this
    wx.showLoading({
      title: '加载中...'
    })
    getProductInfo(vm.data.productId).then((res: any) => {
      wx.hideLoading()
      vm.setData({
        infoList: res.result
      })
      const index = res.result.dictList.findIndex((item: { alarmState: number }) => item.alarmState === 2)
      vm.setData({
        fullBtnFlag:index !== -1
      })
    })
  },

  clearFull(){
    let data = this.data.productId
    cleanOverFlow(data).then((res:any)=>{
      if(res){
        this.productInfo()
      }
    })
  },

  onRefresh() {
    this.load();
    this.productInfo();
  },

  onScanLogin() {
    wx.scanCode({
      success(res) {
        const param = {
          qrCode: res.result
        }
        login(param).then(() => {
          alertService.showToast('登录成功')
        })
      }
    })
  }

})


