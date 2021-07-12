// index.ts
import { findProductList, updateProductStockState, findUserByRole, logout } from '../../api/testEq'
import alertService from '../../providers/alert-service/alert-service'
import { getDeviceInfo } from '../../api/Adv'
Page({
  data: {
    selectFlag: false,
    welcomeText: "风清扬",
    value: '',
    searchVal: '',
    showList: false,
    searchList: [],
    scanning: "http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200730/159608103930759f62a6c49144b5090222e7d5975c7be.png",
    customTitle: "http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200730/15960888505220b5b07f55fc84c6787d698a26ab119e0.png",
    infoEqName: '',
    infoEqStatus: '',
    infoEqNo: '',
    infoProductId: '',
    infoBtnStatus: 0,
    show: false,
    show1: false,
    showOut: false,
    operation: '',
    outColumns: [],
    installPerson: [],
    showAccount: false,
  },
  onShow() {
    let params = { productId: this.getTestEqNo() };
    if (!params.productId) {
      this.setData({
        selectFlag: false,
      })
    } else {
      this.getEqData(params);
    }
  },
  showPopup() {
    let data = this.data.infoEqName;
    this.setData({ show1: true, dialogTxt: data });
  },
  onClosePopup() {
    this.setData({ show1: false });
  },
  exit() {
    this.setData({ showAccount: true });
  },
  onOkAccount() {
    logout().then((res: any) => {
      if (res) {
        wx.clearStorageSync();
        wx.redirectTo({
          url: '../login/index'
        })
      }
    })
  },
  onCloseAccount() {
    this.setData({ showAccount: false });
  },
  onOk() {
    let params = {
      id: this.getTestEqId(),
      stockState: 2,
      operation: ""
    }
    this.updataGetList(params);
  },
  updataGetList(params: object) {
    let vm = this;
    updateProductStockState(params).then((res: any) => {
      if (res) {
        let params = { productId: vm.getTestEqNo() };
        vm.getEqData(params);
      }
    })
  },
  getEqData(params: object) {
    let vm = this;
    findProductList(params).then((res: any) => {
      let resProduct = res.result[0]
      vm.setData({
        selectFlag: true,
        infoEqName: resProduct && resProduct.name ? resProduct.name : '',
        infoEqStatus: resProduct && resProduct.stockState ? resProduct.stockState : 0,
        infoEqNo: resProduct && resProduct.markKey ? resProduct.markKey : '',
        infoProductId: resProduct && resProduct.productId ? resProduct.productId : '',
        infoBtnStatus: resProduct && resProduct.stockState ? resProduct.stockState : 0,
      })
      if (resProduct && resProduct.stockState === 2) {
        vm.getInstallPerson();
      }
    })
  },
  getInstallPerson() {
    let vm = this;
    findUserByRole().then((res: any) => {
      let result = res.result;
      let newArr: any = [];
      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        newArr.push(element.nickName)
      }
      vm.setData({ outColumns: newArr, installPerson: result })
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  getUserName() {
    return wx.getStorageSync('userName') || ''
  },
  getTestEqId() {
    return wx.getStorageSync('testEqId') || ''
  },
  getTestEqNo() {
    return wx.getStorageSync('testEqNo') || ''
  },
  onLoad() {
    let getUserName = this.getUserName();
    this.setData({
      welcomeText: '欢迎您，' + getUserName + '!',
      searchVal: '',
      selectFlag: false,
    })
  },
  checkItem(item: any) {

    let result = item.currentTarget.dataset.type;
    console.log(result);
    
    this.setData({
      showList: false,
      selectFlag: true,
      searchVal: '',
      infoEqName: result && result.name ? result.name : '',
      infoEqStatus: result && result.stockState ? result.stockState : 0,
      infoEqNo: result && result.markKey ? result.markKey : '',
      infoProductId: result && result.productId ? result.productId : '',
      infoBtnStatus: result && result.stockState ? result.stockState : 0,
    })
    if (this.getTestEqId()) {
      alertService.showToast('切换成功！')
    }
    if (result && result.stockState === 2) {
      this.getInstallPerson();
    }
    if (result && result.scenario) {
      wx.setStorageSync('scenario', result.scenario)
    } else {
      wx.setStorageSync('scenario', '')
    }
    if (result && result.id) {
      wx.setStorageSync('testEqId', result.id)
    } else {
      wx.setStorageSync('testEqId', '')
    }
    if (result && result.name) {
      wx.setStorageSync('testEqName', result.name)
    } else {
      wx.setStorageSync('testEqName', '')
    }
    if (result && result.productId) {
      wx.setStorageSync('testEqNo', result.productId)
    } else {
      wx.setStorageSync('testEqNo', '')
    }
    if (result && result.markKey) {
      wx.setStorageSync('testEqMarkKey', result.markKey)
    } else {
      wx.setStorageSync('testEqMarkKey', '')
    }
  },
  searchContent(e: any) {
    this.setData({
      searchVal: e.detail.value,
    })
    let params = {
      pageSize: 20,
      productId: e.detail.value
    }
    findProductList(params).then((res: any) => {
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
  handleDeleteClick() {
    this.setData({
      searchVal: ''
    })
  },
  onClick() {
    let vm = this;
    wx.scanCode({
      success(res) {
        let result = ((res.result.split('?')[1]).split('=')[1])
        vm.setData({
          searchVal: '',
        })
        findProductList({ productId: result }).then((response: any) => {
          if (response.result.length === 0) {
            alertService.showToast('扫描设备失败！')
          }
          let resProduct = response.result[0] || false;
          if (resProduct && resProduct.id) {
            wx.setStorageSync('testEqId', resProduct.id ? resProduct.id : '')
          } else {
            wx.setStorageSync('testEqId', '')
          }
          if (resProduct && resProduct.scenario) {
            wx.setStorageSync('scenario', resProduct.scenario)
          } else {
            wx.setStorageSync('scenario', '')
          }
          if (resProduct && resProduct.name) {
            wx.setStorageSync('testEqName', resProduct.name)
          } else {
            wx.setStorageSync('testEqName', '')
          }
          if (resProduct && resProduct.productId) {
            wx.setStorageSync('testEqNo', resProduct.productId)
          } else {
            wx.setStorageSync('testEqNo', '')
          }
          if (resProduct && resProduct.markKey) {
            wx.setStorageSync('testEqMarkKey', resProduct.markKey)
          } else {
            wx.setStorageSync('testEqMarkKey', '')
          }
          console.log();

          vm.setData({
            selectFlag: resProduct ? true : false,
            infoEqName: resProduct && resProduct.name ? resProduct.name : '',
            infoEqStatus: resProduct && resProduct.stockState ? resProduct.stockState : 0,
            infoEqNo: resProduct && resProduct.markKey ? resProduct.markKey : '',
            infoProductId: resProduct && resProduct.productId ? resProduct.productId : '',
            infoBtnStatus: resProduct && resProduct.stockState ? resProduct.stockState : 0,
          })
          if (resProduct && resProduct.stockState === 2) {
            vm.getInstallPerson();
          }
        })
      }
    })
  },
  testAccomplish() {
    this.setData({ show: true, })
  },
  out() {
    this.setData({ showOut: true, })
  },
  onOutColse() {
    this.setData({ showOut: false, })
  },
  onOutConfirm(event: any) {
    let value = event.detail.value;
    for (let i = 0; i < this.data.installPerson.length; i++) {
      let ele: any = this.data.installPerson[i];
      if (ele.nickName === value) {
        this.setData({ operation: ele.id, showOut: false, })
        break;
      }
    }
    let params = {
      id: this.getTestEqId(),
      stockState: 3,
      operation: this.data.operation
    }
    this.updataGetList(params);
  },
  install() {
    getApp().globalData.switchTab = true;
    wx.switchTab({
      url: '../install/index'
    })
  },
  saomaLink() {
    this.selectFlagMethods('scanDeliver', true);
  },
  selectFlagMethods(flag: string, pageFlag: boolean) {
    if (!this.data.selectFlag) {
      alertService.showToast('请先选择设备！')
    } else {
      if (this.data.infoBtnStatus === 4 && (flag === 'devicemoney' || flag === 'equipmentClear')) {
        alertService.showToast('已安装设备不可用此功能')
        return
      }
      if (pageFlag) {
        wx.navigateTo({
          url: '/pages/' + flag + '/index',
        })
      } else {
        wx.navigateTo({
          url: '/pages/' + flag + '/' + flag,
        })
      }
    }
  },
  qubiLink() {
    this.selectFlagMethods('EquipmentGet', false);
  },
  bubiLink() {
    this.selectFlagMethods('devicemoney', false);
  },
  zhuapaiLink() {
    this.selectFlagMethods('photograph', false);
  },
  jiankongLink() {
    this.selectFlagMethods('videoList', true);
  },
  qingyunLink() {
    this.selectFlagMethods('equipmentClear', true);
  },
  adLink() {
    this.selectFlagMethods('Advertising', false);
  },
  activaActionLink() {
    // this.selectFlagMethods('activaAction', true);
    wx.scanCode({
      success(res) {
        console.log(res.result);
        getDeviceInfo({ qrcode: res.result }).then((res: any) => {
          wx.hideLoading()
          console.log(res.result)
          console.log(res.result.deviceCode);
          if ('deviceCode' in res.result) {
            setTimeout(() => {
              wx.navigateTo({
                url: `/pages/activaAction/index?deviceSerial=${res.result['deviceSerial']}&password=${res.result['password']}&name=${res.result['name']}&createTime=${res.result['createTime']}&id=${res.result['id']}&deviceCode=${res.result['deviceCode']}&productname=${res.result['product'].name}&productId=${res.result['productId']}`
              })
            }, 500)
          } else {
            setTimeout(() => {
              wx.navigateTo({
                url: `/pages/activaAction/index?deviceSerial=${res.result['deviceSerial']}&password=${res.result['password']}&name=${res.result['name']}&createTime=${res.result['createTime']}&productId=${res.result['productId']}`
              })
            }, 500)
          }
        })
      }
    })

    // let vm = this;
    // wx.scanCode({
    //   success(res) {
    //     console.log(res.result);
    // 
    // vm.setData({
    //   searchVal: '',
    // })
    // findProductList({ productId: result }).then((response: any) => {
    //   if (response.result.length === 0) {
    //     alertService.showToast('扫描设备失败！')
    //   }
    //   let resProduct = response.result[0] || false;
    //   if (resProduct && resProduct.id) {
    //     wx.setStorageSync('testEqId', resProduct.id ? resProduct.id : '')
    //   } else {
    //     wx.setStorageSync('testEqId', '')
    //   }
    //   if (resProduct && resProduct.scenario) {
    //     wx.setStorageSync('scenario', resProduct.scenario)
    //   } else {
    //     wx.setStorageSync('scenario', '')
    //   }
    //   if (resProduct && resProduct.name) {
    //     wx.setStorageSync('testEqName', resProduct.name)
    //   } else {
    //     wx.setStorageSync('testEqName', '')
    //   }
    //   if (resProduct && resProduct.productId) {
    //     wx.setStorageSync('testEqNo', resProduct.productId)
    //   } else {
    //     wx.setStorageSync('testEqNo', '')
    //   }
    //   if (resProduct && resProduct.markKey) {
    //     wx.setStorageSync('testEqMarkKey', resProduct.markKey)
    //   } else {
    //     wx.setStorageSync('testEqMarkKey', '')
    //   }
    //   vm.setData({
    //     selectFlag: resProduct ? true : false,
    //     infoEqName: resProduct && resProduct.name ? resProduct.name : '',
    //     infoEqStatus: resProduct && resProduct.stockState ? resProduct.stockState : 0,
    //     infoEqNo: resProduct && resProduct.markKey ? resProduct.markKey : '',
    //     infoProductId: resProduct && resProduct.productId ? resProduct.productId : '',
    //     infoBtnStatus: resProduct && resProduct.stockState ? resProduct.stockState : 0,
    //   })
    //   if (resProduct && resProduct.stockState === 2) {
    //     vm.getInstallPerson();
    //   }
    // })
    // }
    // })
  },
})
