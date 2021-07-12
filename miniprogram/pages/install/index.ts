// index.ts
// 获取应用实例
//const app = getApp<IAppOption>()
import { getProductInfo, getByProductId } from '../../api/testEq'
import { getUserByRole,getEstate,install } from '../../api/install'
import areaList from '../../assets/js/area'
import alertService from '../../providers/alert-service/alert-service'
Page({
  data: {
    value: '',
    equipmenNo: '',
    equipmenType: '',
    equipmenName: '',
    adminColumns: [],
    areaColumns:areaList,
    estateColumns: [],
    showAdmin: false,
    showArea: false,
    showEstate: false,
    userName: '',
    area: '',
    areaCode:'',
    estate: '',
    address: '',
    coordinate: '',//坐标
    scanning: "http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200730/159608103930759f62a6c49144b5090222e7d5975c7be.png",
    contentShow: false,
    showList: false,
    searchList: [],
    operation: '',
    coordinateFlag:false,
    admin:'',
    selectArea:[],
    housingEstateList:[],

    setDataFlag:false,
    productId:'',
    provinceId:'',
    provinceName:'',
    cityId:'',
    cityName:'',
    areaId:'',
    areaName:'',
    estateId:'',
    categoryNum:'',
    name:'',

    areaValue:'',
    estateDefault:0,
    adminDefault:0,
  },
  onClickButtonSubmit():any{
    console.log(this.data.equipmenNo);
    console.log(this.data.equipmenType);
    if(this.data.equipmenName == ''){
      wx.showToast({
        icon: 'none',
        title: '设备名称不能为空',
        duration: 1000
      });
      return false;
    }
    if(this.data.admin == ''){
      wx.showToast({
        icon: 'none',
        title: '设备型号不能为空',
        duration: 1000
      });
      return false;
    }
    if(this.data.area == ''){
      wx.showToast({
        icon: 'none',
        title: '绑定区域不能为空',
        duration: 1000
      });
      return false;
    }
    if(this.data.estate == ''){
      wx.showToast({
        icon: 'none',
        title: '绑定小区不能为空',
        duration: 1000
      });
      return false;
    }
    if(this.data.address == ''){
      wx.showToast({
        icon: 'none',
        title: '详细地址不能为空',
        duration: 1000
      });
      return false;
    }
    if(this.data.coordinate == ''){
      wx.showToast({
        icon: 'none',
        title: '设备坐标不能为空',
        duration: 1000
      });
      return false;
    }
    // 设备安装
    let selectArea:any = this.data.selectArea;
    let params = {
      
    }
    if(this.data.setDataFlag){
      params = {
        productId:this.data.productId,
        provinceId:this.data.provinceId,
        provinceName:this.data.provinceName,
        cityId:this.data.cityId,
        cityName:this.data.cityName,
        areaId:this.data.areaId,
        areaName:this.data.areaName,
        estateId:this.data.estateId,
        estateName:this.data.estate,
        address:this.data.address,
        lo:this.data.coordinate.split(',')[0],
        la:this.data.coordinate.split(',')[1],
        operation:this.getOperation(),
        categoryNum:this.data.categoryNum,
        name:this.data.name
      }
    }else{
      params = {
        productId:this.getTestEqNo(),
        provinceId:selectArea[0].code,
        provinceName:selectArea[0].name,
        cityId:selectArea[1].code,
        cityName:selectArea[1].name,
        areaId:selectArea[2].code,
        areaName:selectArea[2].name,
        estateId:this.getEstateId(),
        estateName:this.data.estate,
        address:this.data.address,
        lo:this.data.coordinate.split(',')[0],
        la:this.data.coordinate.split(',')[1],
        operation:this.getOperation(),
        categoryNum:wx.getStorageSync('testEqMarkKey') || '',
        name:wx.getStorageSync('testEqName') || '',
      }
    }
    install(params).then(res=>{
      console.log(res);
      wx.showToast({
        title: '安装成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        contentShow:false
      })
      getApp().globalData.switchTab = false;
      this.setData({
        showList: false,
        value: '',
        contentShow: false,
        equipmenNo: '',
        equipmenType: '',
        equipmenName: '',
        admin:'',
        userName: '',
        area: '',
        areaCode: '',
        estate:  '',
        coordinate: '',
        operation: '',
        address:'',
        coordinateFlag:false
      });
    })
  },
  getEstateId(){
    for (let i = 0; i < this.data.housingEstateList.length; i++) {
      const element:any = this.data.housingEstateList[i];
      if(element.housingEstate === this.data.estate){
        return element.id;
      }
    }
  },
  getOperation(){
    for (let i = 0; i < this.data.adminColumns.length; i++) {
      const element:any = this.data.adminColumns[i];
      if(element.text === this.data.admin){
        return element.value;
      }
    }
  },
  getProvinceId(){
    this.data.selectArea
  },
  getUserName() {
    return wx.getStorageSync('userName') || ''
  },
  getTestEqId() {
    return wx.getStorageSync('testEqId') || ''
  },
  getTestEqNo(){
    return wx.getStorageSync('testEqNo') || ''
  },
  showAdmin() {
    getUserByRole().then((res: any) => {
      this.setData({
        showAdmin: true,
        adminColumns: res.result
      })
    })
  },
  showArea() {
    this.setData({ showArea: true})
  },
  showEstate() {
    if(this.data.areaCode || this.data.setDataFlag){
      getEstate(this.data.areaCode).then((res: any) => {
        let result = res.result;
        let arr:any = [];
        for (let i = 0; i < result.length; i++) {
          const element = result[i];
          arr.push(element.housingEstate);
        }
        this.setData({
          showEstate: true,
          estateColumns: arr,
          housingEstateList:result,
        })
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '必须先选择区域',
        duration: 1000
      });
    }
  },
  onAdminColse() {
    this.setData({ showAdmin: false, })
  },
  onAreaColse() {
    this.setData({ showArea: false, })
  },
  onEstateColse() {
    this.setData({ showEstate: false, })
  },
  onAdminConfirm(event: any) {
    const value = event.detail.value;
    this.setData({
      admin: value.text,
      showAdmin: false,
      operation: value.value
    })
  },
  onAreaConfirm(event: any) {
    const value = event.detail.values;
    if(value.length >= 3){
      let str = '';
      for (let i = 0; i < value.length; i++) {
        const ele = value[i].name;
        if(i === 2){
          str += ele;
        }else{
          str += ele + '/';
        }
      }
      this.setData({ areaCode: value[2].code, showArea: false,area:str,selectArea:value })
    }else{
      wx.showToast({
        icon: 'none',
        title: '必须选择第三级',
        duration: 1000
      });
    }
  },
  onEstateConfirm(event: any) {
    const value = event.detail.value;
    this.setData({ estate: value, showEstate: false, })
  },
  showCoordinate() {
    let that = this
    wx.chooseLocation({
      success(res) {
        that.setData({
          coordinate: res.latitude + ',' + res.longitude,
          coordinateFlag:true,
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            let statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'none',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              that.setData({
                                coordinate: res.latitude + ',' + res.longitude,
                                coordinateFlag:true,
                              })
                            },
                          })
                        } else {
                          that.setData({
                            coordinateFlag:true,
                          })
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function () {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  },
  onShow() {
    let switchTab = getApp().globalData.switchTab;
    let coordinateFlag =  this.data.coordinateFlag;
    if (switchTab) {
      this.setData({
        showList: coordinateFlag,
        value: '',
        contentShow: true,
        equipmenNo: wx.getStorageSync('testEqNo') || '',
        equipmenType: wx.getStorageSync('testEqMarkKey') || '',
        equipmenName: wx.getStorageSync('testEqName') || '',
        userName: coordinateFlag ? this.data.userName : '',
        area: coordinateFlag ? this.data.area : '',
        admin:coordinateFlag ? this.data.admin : '',
        areaCode:coordinateFlag ? this.data.areaCode : '',
        estate: coordinateFlag ? this.data.estate : '',
        coordinate: coordinateFlag ? this.data.coordinate : '',
        operation: coordinateFlag ? this.data.operation : '',
        address:coordinateFlag ? this.data.address : '',
      });
    }
    else {
      this.setData({
        showList: coordinateFlag,
        value: '',
        contentShow: coordinateFlag,
        equipmenNo: coordinateFlag ? this.data.equipmenNo : '',
        equipmenType: coordinateFlag ? this.data.equipmenType : '',
        equipmenName: coordinateFlag ? this.data.equipmenName : '',
        userName: coordinateFlag ? this.data.userName : '',
        area: coordinateFlag ? this.data.area : '',
        admin:coordinateFlag ? this.data.admin : '',
        areaCode:coordinateFlag ? this.data.areaCode : '',
        estate: coordinateFlag ? this.data.estate : '',
        coordinate: coordinateFlag ? this.data.coordinate : '',
        operation: coordinateFlag ? this.data.operation : '',
        address:coordinateFlag ? this.data.address : '',
      });
    }
  },
  onLoad(){

  },
  onClick() {
    let vm = this;
    wx.scanCode({
      success(res) {
        let result = ((res.result.split('?')[1]).split('=')[1])
        vm.setData({
          value: '',
        })
        getProductInfo({ productId: result }).then((response: any) => {
          if(response.result && response.result.length === 0){
            alertService.showToast('扫描设备失败！');
            return
          }
          if(response.code === 0){
            vm.setData({
              equipmenNo: result
            })
            let resProduct = response.result[0];
            vm.setData({
              showList: false,
              contentShow: true,
            })
            if (response.state >= 1) {
              getUserByRole().then((response: any) => {
                vm.setData({
                  adminColumns: response.result
                })
                let operateId = vm.transName(resProduct.operateId)
                vm.setData({
                  admin:operateId,
                })
              })
              vm.setData({
                value: '',
                equipmenNo: resProduct.productId,
                equipmenType: resProduct.markKey,
                equipmenName: resProduct.name,
                area: resProduct.provinceName + '/' + resProduct.cityName + '/' + resProduct.areaName,
                estate: resProduct.estateName,
                address: resProduct.detailAddress,
                coordinate: resProduct.la + ',' + resProduct.lo,
                operation: resProduct.admin,

                setDataFlag:true,
                productId:resProduct.productId,
                provinceId:resProduct.provinceId,
                provinceName:resProduct.provinceName,
                cityId:resProduct.cityId,
                areaCode:resProduct.areaId,
                areaValue:resProduct.areaId,
                cityName:resProduct.cityName,
                areaId:resProduct.areaId,
                areaName:resProduct.areaName,
                estateId:resProduct.estateId,
                categoryNum:resProduct.categoryNum,
                name:resProduct.name,
              })
            }
          }
        })
      }
    })
  },
  onSearch(e: any) {
    let vm = this;
    let params = {
      productId: e.detail
    }
    getByProductId(params).then((res: any) => {
      
      if(res.result.length !== 0){
        vm.setData({showList:true})
      }else{
        vm.setData({showList:false})
        alertService.showToast('未检索到数据！')
      }
      console.log(res.result);

      vm.setData({
        searchList: res.result,
        value: e.detail,
      })
    })
  },
  checkItem(item: any) {
    let result = item.currentTarget.dataset.type;
    let params = {
      productId: result.productId
    }
    getProductInfo(params).then((res: any) => {
      let state = res.result.state;
      res = res.result.productInfo;
      this.setData({
        value: '',
        setDataFlag:false,
        showList: false,
        contentShow: true,
        equipmenNo: result.productId,
        equipmenType: result.markKey,
        equipmenName: result.name,
        userName: '',
        area: '',
        areaCode:'',
        estate: '',
        coordinate: '',
        operation: '',
        address: '',
        admin: ''
      })
      if (state >= 1) {
        getUserByRole().then((response: any) => {
          this.setData({
            adminColumns: response.result
          })
          let operateId = this.transName(res.operateId)
          this.setData({
            admin:operateId,
          })
        })
        
        this.setData({
          value: '',
          equipmenNo: res.productId,
          equipmenType: res.markKey,
          equipmenName: res.name,
          area: res.provinceName + '/' + res.cityName + '/' + res.areaName,
          estate: res.estateName,
          address: res.detailAddress,
          coordinate: res.la + ',' + res.lo,

          setDataFlag:true,
          productId:res.productId,
          provinceId:res.provinceId,
          provinceName:res.provinceName,
          cityId:res.cityId,
          areaCode:res.areaId,
          areaValue:res.areaId,
          cityName:res.cityName,
          areaId:res.areaId,
          areaName:res.areaName,
          estateId:res.estateId,
          categoryNum:res.categoryNum,
          name:res.name,
        })
      }
    })
  },
  transName(operateId:any){
    for (let i = 0; i < this.data.adminColumns.length; i++) {
      const element:any = this.data.adminColumns[i];
      if(operateId === element.value){
        return element.text
      }
    }
  },

})
