import httpService from '../providers/http-service/http-service';
export function getUserByRole() {
  const param = {
      url: '/product/getUserByRole',
  };
  return httpService.request(param);
}
export function getEstate(code:string) {

  return httpService.request({
    url:'/product/getEstate',
    data:{
      code
    },
    method:'GET'
  })
}
export function install(data:object) {
  const param = {
      url: '/product/install',
      data
  };
  return httpService.request(param);
}