import httpService from '../providers/http-service/http-service'

export function login(data: object) {
  const param = {
    url: '/user/login',
    data
  }
  return httpService.request(param)
}

export function logout() {
  const param = {
    url: '/user/logout'
  }
  return httpService.request(param)
}