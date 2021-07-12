import httpService from '../providers/http-service/http-service'
/**
 * 广告列表
 */
export function list(productId: string) {
  return httpService.request( {
    url: '/pickUp/getPickUpRecord',
    data:{
      productId
    },
    method: 'GET'
  })
}

export function getProductInfo(productId:string){
  return httpService.request({
    url:'/pickUp/getProductInfo',
    data:{
      productId
    },
    method:'GET'
  })
}

export function login(data:object){
  return httpService.request({
    url:'/pickUp/scan',
    data:data,
    method:'GET'
  })
}

export function cleanOverFlow(data: any) {
  const param = {
    url: '/pickUp/cleanOverFlow?productId=' + data,
  }
  return httpService.request(param)
}