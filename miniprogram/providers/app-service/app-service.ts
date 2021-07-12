import alertService from '../alert-service/alert-service';

class AppServiceProvider {
  /**
   * 校验用户是否登录
   */
  public checkIsAuth() {
    if (!this.getToken()) {
      wx.redirectTo({
        url: '/pages/login/index'
      })
    }
  }
  /**
   * 获取用户token
   */
  public getToken() {
    return wx.getStorageSync('token') || ''
  }
  /**
   * 检查当前网络是否正常
   */
  public checkNetWork() {
    wx.getNetworkType({
      success: (res: any) => {
        const networkType = res.networkType
        if (!networkType || networkType === 'none') {
          alertService.showToast('抱歉当前网络异常，请稍后重试')
        }
      }
    })
  }
}

export default new AppServiceProvider();