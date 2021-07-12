class AlertServiceProvider {
  private defaultTip: string = '提示信息';

  /**
   * 显示Toast提示
   */
  public showToast(message: string = this.defaultTip, duration: number = 2000) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration
    })
  }
}

export default new AlertServiceProvider()