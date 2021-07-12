import httpService from '../providers/http-service/http-service'



export function findProductList(data: object) {
  const param = {
    url: '/product/findProductList',
    data
  }
  return httpService.request(param)
}

export function updateProductStockState(data: object) {
  const param = {
    url: '/product/updateProductStockState',
    data
  }
  return httpService.request(param)
}

export function getProductInfo(data: object) {
  const param = {
    url: '/product/getProductInfo',
    data
  }
  return httpService.request(param)
}

export function getByProductId(data: object) {
  const param = {
    url: '/product/findProductList',
    data
  }
  return httpService.request(param)
}

export function findUserByRole() {
  const param = {
    url: '/product/findUserByRole',
  }
  return httpService.request(param)
}

export function logout() {
  const param = {
    url: '/user/logout',
  }
  return httpService.request(param)
}