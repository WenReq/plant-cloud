import httpService from '../providers/http-service/http-service'

export function getTable(data: object) {
  const param = {
    url: '/product/getDeliveryByProductId',
    data
  }
  return httpService.request(param)
}
export function productScan(data: object) {
  const param = {
    url: '/product/productScan',
    data
  }
  return httpService.request(param)
}
export function qrCodeLogin(data: object) {
  const param = {
    url: '/product/qrCodeLogin',
    data
  }
  return httpService.request(param)
}
export function scanGarbageCode(data: object) {
  const param = {
    url: '/product/scanGarbageCode',
    data
  }
  return httpService.request(param)
}
export function openPregnant(data: object) {
  const param = {
    url: '/product/openPregnant',
    data
  }
  return httpService.request(param)
}
export function closePregnant(data: object) {
  const param = {
    url: '/product/closePregnant',
    data
  }
  return httpService.request(param)
}

