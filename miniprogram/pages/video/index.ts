// index.js
import appService from '../../providers/app-service/app-service';
import alertService from '../../providers/alert-service/alert-service'
import { deviceByProductId } from '../../api/video'
import { Weapp } from '../../providers/definitions/weapp';
let livePlayerContext: any;
Page({
  data: {
    playVideo: false,
    id: '',
    name: '',
    videoSrc: ''
  },
  onLoad: function (options: any) {
    this.handleQuery(options)
    this.load()
  },

  load() {
    this.getValue()
  },
  getValue() {
    deviceByProductId(this.data.id).then((res: any) => {
      const { name, url, msg } = res.result
      this.setData({
        name: name || '',
        videoSrc: url || ''
      })
      if (url) {
        livePlayerContext = wx.createLivePlayerContext('previewPlayer');
      } else {
        alertService.showToast(msg)
      }
    })
  },
  handlePlay() {
    livePlayerContext.play({
      success: () => {
        this.setData({
          playVideo: true
        });
      },
      fail: (error: any) => {
        console.log(error, "开始播放失败");
      }
    })
  },
  handleStop() {
    livePlayerContext.stop({
      success: () => {
        this.setData({
          playVideo: false,
        })
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
  handleQuery(options: any) {
    this.setData({
      id: options.id
    })
  }
});