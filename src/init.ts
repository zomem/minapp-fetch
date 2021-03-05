
import {TPlatform, IMysql, IZXWebapi, IWXWeapp, IMongodb, IWXCloud} from './index'
import {INIT_ERROR} from './constants/error'
import {PLATFORM_NAME_AXIOS, PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME, PLATFORM_NAME_MYSQL_SERVER} from './constants/constants'


function fetchInit(platform: 'zx_alipay'): void
function fetchInit(platform: 'zx_cloud'): void
function fetchInit(platform: 'zx_jd'): void
function fetchInit(platform: 'zx_op'): void
function fetchInit(platform: 'zx_qq'): void
function fetchInit(platform: 'zx_rn'): void
function fetchInit(platform: 'zx_swan'): void
function fetchInit(platform: 'zx_tt'): void
function fetchInit(platform: 'zx_weapp'): void
function fetchInit(platform: 'zx_web'): void
function fetchInit(platform: 'zx_webapi', options: IZXWebapi): void
function fetchInit(platform: 'wx_weapp', options: IWXWeapp): void
function fetchInit(platform: 'wx_cloud', options: IWXCloud): void
function fetchInit(platform: 'mongodb', options: IMongodb): void
function fetchInit(platform: 'uni_cloud'): void
function fetchInit(platform: 'mysql', options: IMysql): void
function fetchInit(platform: TPlatform, options?: IMysql | IZXWebapi | IWXWeapp | IWXCloud | IMongodb): void{
  if([...PLATFORM_NAME_AXIOS, ...PLATFORM_NAME_BAAS, ...PLATFORM_NAME_MONGO_SERVER, ...PLATFORM_NAME_MYSQL_SERVER].indexOf(platform) === -1) throw new Error(INIT_ERROR)
  if(typeof(my) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_ALIPAY){
      my.MINAPP = platform
    }
  }
  if(typeof(global) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_CLOUD 
      || platform === PLATFORM_NAME.ZX_RN 
      || platform === PLATFORM_NAME.ZX_WEBAPI
    ){
      global.MINAPP = platform
      global.MINAPP_OPTIONS = options || null
    }
    if(platform === PLATFORM_NAME.WX_CLOUD){
      global.MINAPP = platform
      global.MINAPP_OPTIONS = options || null
      global.cloud.init({
        env: options.env || global.cloud.DYNAMIC_CURRENT_ENV
      })
    }
    if(platform === PLATFORM_NAME.UNI_CLOUD){
      global.MINAPP = platform
      global.MINAPP_OPTIONS = options || null
    }
    if(platform === PLATFORM_NAME.MONGODB){
      global.MINAPP = platform
      global.MINAPP_OPTIONS = options || null
    }
    if(platform === PLATFORM_NAME.MYSQL){
      global.MINAPP = platform
      global.MINAPP_OPTIONS = options || null
    }
  }
  if(typeof(jd) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_JD){
      jd.MINAPP = platform
    }
  }
  if(typeof(window) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_WEB || platform === PLATFORM_NAME.ZX_OP || platform === PLATFORM_NAME.ZX_WEBAPI){
      window.MINAPP = platform
      window.MINAPP_OPTIONS = options || null
    }
  }
  if(typeof(qq) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_QQ){
      qq.MINAPP = platform
    }
  }
  if(typeof(swan) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_SWAN){
      swan.MINAPP = platform
    }
  }
  if(typeof(tt) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_TT){
      tt.MINAPP = platform
    }
  }
  if(typeof(wx) !== 'undefined'){
    if(platform === PLATFORM_NAME.ZX_WEAPP){
      wx.MINAPP = platform
    }
    if(platform === PLATFORM_NAME.WX_WEAPP){
      wx.MINAPP = platform
      wx.MINAPP_OPTIONS = options || null
      wx.cloud.init({
        env: options.env,
        traceUser: options.traceUser
      })
    }
  }
}

export default fetchInit