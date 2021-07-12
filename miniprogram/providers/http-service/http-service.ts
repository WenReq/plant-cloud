import alertService from '../alert-service/alert-service';

declare type HttpCallback = (result: HttpCode<any>) => void;

interface HttpCode<T> {
  code: string | number;
  result: T;
  message: string;
}

interface RequestParam {
  url: string
  data?: object | string | ArrayBuffer
  header?: object
  method?:
  | 'GET'
  | 'OPTIONS'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT'
  dataType?: 'json' | 'text'
  responseType?: 'text' | 'arraybuffer'
}

class HttpServiceProvider {
  private readonly IS_DEV: boolean = true;
  private readonly BASE_URL: string = 'https://api.mymrmao.com/bossApi/factory';
  private readonly DEV_BASE_URL: string = 'http://10.168.1.83:9093/bossApi/factory';
  /**
   * 对请求进行基本配置
   * @param {object} options 请求配置
   * @return {Promise} 返回res.data对象
   */
  public request(options: RequestParam) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.getReqUrl(options.url),
        method: options.method || 'POST',
        data: options.data,
        header: {
          'token': this.getToken()
        },
        
        success: (res: any) => {
          this.successHandler(res, resolve)
        },
        fail: (res: any) => {
          this.errorHandler(res, reject)
        }
      })
    })
  }
  /**
    * request success 回调
    */
  public successHandler(res: any, callback?: HttpCallback, errorCallback?: HttpCallback): void {
    if (res.data.code == 0) {
      callback && callback(res.data);
    } else if (res.data.code == 20002) {
      res.data.msg && alertService.showToast(res.data.msg)
      setTimeout(() => {
        wx.clearStorageSync()
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }, 500)
    } else {
      this.errorHandler(res, errorCallback);
    }
  }
  /**
   * request fail 或 success时 code != 0 时 回调
   */
  public errorHandler(res: any, errorCallback?: HttpCallback): void {
    if (errorCallback) {
      errorCallback && errorCallback(res.data);
    } else {
      res.data.msg && alertService.showToast(res.data.msg)
    }
  }
  /**
   * 获取用户token
   */
  public getToken() {
    return wx.getStorageSync('token') || ''
  }
  /**
   * 处理基础的请求地址
   */
  public getReqUrl(url: string): string {
    return `${this.IS_DEV ? this.DEV_BASE_URL : this.BASE_URL}${url}`
  }
}

export default new HttpServiceProvider();