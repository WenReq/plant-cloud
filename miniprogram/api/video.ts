import httpService from '../providers/http-service/http-service'


/**
 * 获取摄像头
 */
export function deviceList(id: string) {
  const param: any = {
    url: '/product/getDeviceList',
    data: {
      id
    }
  }
  return httpService.request(param)
}

/**
 * 激活摄像头
 */
export function addDevice(data: object) {
  const param: any = {
    url: '/product/addDevice',
    data
  }
  return httpService.request(param)
}

/**
 * 查看视频地址
 */
export function deviceByProductId(id: string) {
  const param: any = {
    url: '/product/getDeviceByProductId',
    data: {
      id
    }
  }
  return httpService.request(param)
}