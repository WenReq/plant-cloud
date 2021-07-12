// index.ts
// 获取应用实例
//const app = getApp<IAppOption>()
import { getTable, productScan, qrCodeLogin, scanGarbageCode, openPregnant, closePregnant } from '../../api/scanDeliver'
import alertService from '../../providers/alert-service/alert-service'
const mqtt = require('../../utils/mqtt.min.js');
let client: any = null
Page({
  data: {
    value: '',
    eqName: '',
    tableList: [],
    show: false,
    dialogTxt: '',
    showScanLogin: true,
    roundFlag: false,
    showOpen210: false,
    showClose210: false,
    qrcode: '',
    titleTxt: '',
    showTitle: false,
    client: null,
  },
  showPopupTitle() {
    let data = this.data.eqName;
    this.setData({ showTitle: true, titleTxt: data });
  },
  titleOnClose() {
    this.setData({ showTitle: false });
  },
  showPopup(item: any) {
    let result = item.currentTarget.dataset.type;
    this.setData({ show: true, dialogTxt: result.deliveryType });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 获取设备id
  getTestEqId() {
    return wx.getStorageSync('testEqId') || ''
  },
  onLoad() {
    const code = wx.getStorageSync('testEqNo') || '';
    let testEqName = wx.getStorageSync('testEqName') || '';
    let markKey = wx.getStorageSync('testEqMarkKey') || '';
    let eqFullName = testEqName + ' ' + markKey;
    this.setData({
      eqName: eqFullName
    })
    this.getDataList('false');
    code && this.initMQTT(code)
  },
  onUnload() {
    this.closeClient()
  },
  getDataList(msgFlag: string) {
    let vm = this;
    const param = {
      id: vm.getTestEqId(),
    }
    getTable(param).then((res: any) => {
      let dataList = JSON.parse(JSON.stringify(res.result))
      dataList.forEach(function (item: any) {
        let ymd = ((item.deliveryTime).split(' '))[0];
        let hms = ((item.deliveryTime).split(' '))[1];
        let formatyd = ymd.split('-');
        item.deliveryTime = formatyd[1] + '/' + formatyd[2] + ' ' + hms;
      })
      vm.setData({
        tableList: dataList
      })
      if (msgFlag === 'true') {
        wx.showToast({
          title: '刷新成功！',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  scanLogin() {
    let vm = this;
    wx.scanCode({
      success(res) {
        let result = res.result
        productScan({ id: vm.getTestEqId(), qrcode: result }).then((response: any) => {
          let type = response.result.type;
          let qrcode = response.result.qrCode;
          vm.setData({
            qrcode: qrcode
          })
          if (type === 'H600') {
            qrCodeLogin({ qrcode: qrcode }).then((res: any) => {
              if (res && res.result.state === '0') {
                console.log(res);
                console.log('H600登录成功');
                vm.setData({ showScanLogin: false });
                vm.getDataList('false');
              } else if (res && res.result.state !== '0') {
                vm.alertMsg(res.result.state);
              }
            })
          } else if (type === 'H210') {
            vm.setData({
              showScanLogin: false,
              roundFlag: true,
              showOpen210: true,
              showClose210: false,
            })
          } else {
            scanGarbageCode({ id: vm.getTestEqId(), qrcode: qrcode }).then((res1: any) => {
              if (res1 && res1.result.state === '0') {
                console.log(res1);
                console.log('垃圾房亭登录成功');
                vm.setData({ showScanLogin: false });
                vm.getDataList('false');
              } else if (res1 && res1.result.state !== '0') {
                vm.alertMsg(res1.result.state);
              }
            })
          }
        })
      }
    })
  },
  alertMsg(state: string) {
    var msg: string = '';
    switch (state) {
      case '2001':
        msg = '投口满溢'
        break;
      case '2002':
        msg = '设备被占用'
        break;
      case '2003':
        msg = '设备休息中'
        break;
      case '2004':
        msg = '设备离线中'
        break;
      case '2005':
        msg = '设备故障'
        break;
      case '2006':
        msg = '设备离线中'
        break;
    }
    alertService.showToast(msg)
  },
  open210() {
    let vm = this;
    openPregnant({ id: vm.getTestEqId(), qrcode: this.data.qrcode }).then((result: any) => {
      if (result && result.result.state === '0') {
        console.log(result);
        console.log('H210开门成功');
        vm.setData({
          roundFlag: true,
          showOpen210: false,
          showClose210: true,
          showScanLogin: false
        })
      } else if (result && result.result.state !== '0') {
        vm.alertMsg(result.result.state);
      }
    })
  },
  close210() {
    let vm = this;
    closePregnant({ id: vm.getTestEqId(), qrcode: this.data.qrcode }).then((result: any) => {
      if (result) {
        console.log(result);
        console.log('H210关门成功');
        vm.setData({
          roundFlag: false,
          showOpen210: false,
          showClose210: false,
          showScanLogin: true
        })
        vm.getDataList('false');
      }
    })
  },
  refresh() {
    wx.showLoading({
      title: '加载中...'
    })
    this.getDataList('true');
  },
  initMQTT(code: string) {
    const mqttConfig = {
      subTopic: `xcx_${code}`,
      host: 'wxs://api.mymrmao.com/mqtt',
      options: {
        connectTimeout: 4000,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        port: 443,
        username: 'maosir',
        password: '1234@qwer',
      }
    }
    client = mqtt.connect(mqttConfig.host, mqttConfig.options)
    // MQTT链接
    client.on('connect', () => {
      client.subscribe(mqttConfig.subTopic, { qos: 1 }, (error: any) => {
        if (error) {
          console.log(error, '订阅失败')
        } else {
          console.log('MQTT订阅成功')
        }
      })
    })
    // 接收消息处理
    client.on('message', (topic: any, message: any) => {
      console.log(message.toString(), '返回结果')
      console.log(`收到来自${topic}的消息`)
      this.getDataList('true')
    })
    // 断开发起重连
    client.on('reconnect', () => {
      console.log('正在重连')
    })
    //事件 'close'，断开连接后发出。
    client.on('close', () => {
      console.log('连接断开')
    })
    // 链接异常处理
    client.on('error', (error: any) => {
      console.log(error, '连接失败')
    })
    // 关闭链接
    client.on('end', () => {
      console.log('mqtt关闭')
    })
  },
  closeClient() {
    client && client.end()
  }
})
