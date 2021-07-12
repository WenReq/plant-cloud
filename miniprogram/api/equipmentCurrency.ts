import httpService from '../providers/http-service/http-service'
/**
 * 广告列表
 */
export function equipmentCurrencyList(data: object) {
  const param = {
    url: '/product/getCoinRecordByProductId',
    data
  }
  return httpService.request(param)
}

/**
 * 设备补币
 */
export function equipmentCurrencyPost(data: object) {
  const param = {
    url: '/product/addCoin',
    data
  }
  return httpService.request(param)
}

/**
 * 设备取币列表
 */
export function EquipmentGetPrice(data: object) {
  const param = {
    url: '/product/getUserWithdrawRecordByProductId',
    data
  }
  return httpService.request(param)
}

/**
 * 摄像头抓拍列表
 */
export function getPhotos_list(data: object) {
  const param = {
    url: '/product/getPhotosByProductId',
    data
  }
  return httpService.request(param)
}

/**
 * 摄像头抓拍
 */
export function nPerformed(data: object) {
  const param = {
    url: '/product/nPerformed',
    data
  }
  return httpService.request(param)
}

