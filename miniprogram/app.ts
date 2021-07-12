import appService from './providers/app-service/app-service';

App<IAppOption>({
  globalData: {},
  onLaunch() {
    appService.checkIsAuth()
  },
})