import { deviceList } from '../../api/video'
import alertService from '../../providers/alert-service/alert-service'
import { Weapp } from '../../providers/definitions/weapp';
import { addDevice } from '../../api/Adv';
import { getDeviceInfo } from '../../api/Adv'
import appService from '../../providers/app-service/app-service';
let livePlayerContext: any;
Page({
  data: {
    deviceId: 'MXS1907038BK',
    items: [],
    eqName: '',
    playVideo: false,
    id: '',
    name: '',
    videoSrc: '',
    videoid: '',
  },
  onLoad() {
    console.log(wx.getStorageSync('testEqName'));
    this.load()
    this.setData({
      eqName:wx.getStorageSync('testEqName'), 
    })
  },
  load() {
    this.handleQuery()
    this.getList()
  },
  /**
   * 获取列表数据
   */
  getList() {
    console.log(this.data.deviceId + 'this.data.deviceId');
    
    deviceList(this.data.deviceId).then((res: any) => {
      console.log(res.result);
      this.setData({
        items: res.result
      })
      for (const key in this.data.items) {
        var isSelected = "items[" + key + "].isSelected";
        this.setData({
          [isSelected]: false
        })
      }
      console.log(this.data.items);
    })
  },
  handlePlay(e: any) {
    const index: any = e.currentTarget.dataset.index
    this.setData({
      name: this.data.items[index]['map']['name'] || '',
      videoSrc: this.data.items[index]['map']['url'] || ''
    })
    if (this.data.videoSrc) {
      livePlayerContext = wx.createLivePlayerContext(this.data.items[index]['id']);
    } else {
      alertService.showToast('播放地址为空')
    }
    livePlayerContext.play({
      success: () => {
        var that = this;
        var isSelected = "items[" + index + "].isSelected";//先用一个变量，
        that.setData({
          [isSelected]: true
        });
      },
      fail: (error: any) => {
        console.log(error, "开始播放失败");
      }
    })
  },
  tagg(e: any) {
    console.log(e);
    livePlayerContext.exitFullScreen({
      success: () => {
        console.log(11111);
      },
      fail: (error: any) => {
        console.log(error, "开始播放失败");
      }
    })
  },




  handleStop(e: any) {
    const index: any = e.currentTarget.dataset.index
    livePlayerContext.stop({
      success: () => {
        var that = this;
        var isSelected = "items[" + index + "].isSelected";//先用一个变量，
        that.setData({
          [isSelected]: false
        });
      },
      fail: (error: any) => {
        console.log(error, "停止播放失败")
      }
    })
  },
  handleStateChange(e: Weapp.Event) {
    console.log('live-player code:', e.detail.code, e.detail);
    const { code } = e.detail;
    switch (code) {
      case 3001:
      case 3002:
      case 3003:
      case 3005: // 播放失败
        appService.checkNetWork();
        break;
    }
  },
  bindDeviceHandle: function (e: Weapp.Event) {
    const id: any = e.currentTarget.dataset.id
    wx.redirectTo({
      url: `/pages/BindDevices/index?id=${id}`
    })
  },
  /**
   * 扫描二维码
   */
  activactionhandle: function (e: any) {
    const index = e.currentTarget.dataset.index
    let item = this.data.items[index]
    if (item['isEzviz'] == 0) {
      wx.scanCode({
        success(res1) {
          getDeviceInfo({ qrcode: res1.result }).then((res: any) => {
            wx.hideLoading()
            console.log(res);
              setTimeout(() => {
                wx.navigateTo({
                  url: `/pages/BindDevices/index?deviceSerialValue=${res.result['deviceSerial']}&passwordValue=${res.result['password']}&name=${ item['name']}&pushStr=${1}&id=${item['id']}`
                })
              }, 500)
          })
        }
      })

    } else {
      const param = {
        qrcode: '',
        name: item['name'],
        type: '1',
        ip: item['ip'],
        remark: item['remark'],
        deviceSerial: item['deviceSerial'],
        password: item['password'],
        isEzviz: '1',
        productId: wx.getStorageSync('testEqNo'),
        id: item['id'],
      }
      console.log(param);
      wx.showLoading({
        title: '请稍等...'
      })
      addDevice(param).then((res: any) => {
        wx.hideLoading()
        console.log(res);
        this.getList()
        setTimeout(() => {
          alertService.showToast('激活成功');
        }, 500)
      })
    }
  },
  handleQuery() {
    
      this.setData({
        deviceId: wx.getStorageSync('testEqId') || ''
      })
  },
})