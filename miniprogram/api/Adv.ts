import httpService from '../providers/http-service/http-service'
/**
 * 广告列表
 */
export function adv(data: object) {
  const param = {
    url: '/product/getCountType',
    data
  }
  return httpService.request(param)
}
/**
 * 修改摄像头名称
 */
export function updateDeviceByProduct(data: object) {
  const param = {
    url: '/product/updateDeviceByProduct',
    data
  }
  return httpService.request(param)
}


export function getDeviceInfo(data: object) {
  const param = {
    url: '/product/getDeviceInfo',
    data
  }
  return httpService.request(param)
}


export function postAdv(data: object) {
  const param = {
    url: '/product/upAdvInfo',
    data
  }
  return httpService.request(param)
}
export function addDevice(data: object) {
    const param = {
        url: '/product/addDevice',
        data
    };
    return httpService.request(param);
}