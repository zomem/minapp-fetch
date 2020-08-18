
import {TPlatform, IWebApiInit, THeader} from './types'
import {INIT_ERROR} from './constants/error'
import {PLATFORM_NAME_AXIOS, PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'


function fetchInit(platform: TPlatform, options?: IWebApiInit): void{
  if([...PLATFORM_NAME_AXIOS, ...PLATFORM_NAME_BAAS].indexOf(platform) === -1) throw new Error(INIT_ERROR)
  if(typeof(my) !== 'undefined'){
    if(platform === PLATFORM_NAME.ALIPAY){
      my.MINAPP = platform
    }
  }
  if(typeof(global) !== 'undefined'){
    if(platform === PLATFORM_NAME.CLOUD || platform === PLATFORM_NAME.RN || platform === PLATFORM_NAME.WEBAPI){
      global.MINAPP = platform
      global.MINAPP_OPTIONS = options || null
    }
  }
  if(typeof(jd) !== 'undefined'){
    if(platform === PLATFORM_NAME.JD){
      jd.MINAPP = platform
    }
  }
  if(typeof(window) !== 'undefined'){
    if(platform === PLATFORM_NAME.WEB || platform === PLATFORM_NAME.OP || platform === PLATFORM_NAME.WEBAPI){
      window.MINAPP = platform
      window.MINAPP_OPTIONS = options || null
    }
  }
  if(typeof(qq) !== 'undefined'){
    if(platform === PLATFORM_NAME.QQ){
      qq.MINAPP = platform
    }
  }
  if(typeof(swan) !== 'undefined'){
    if(platform === PLATFORM_NAME.SWAN){
      swan.MINAPP = platform
    }
  }
  if(typeof(tt) !== 'undefined'){
    if(platform === PLATFORM_NAME.TT){
      tt.MINAPP = platform
    }
  }
  if(typeof(wx) !== 'undefined'){
    if(platform === PLATFORM_NAME.WEAPP){
      wx.MINAPP = platform
    }
  }
}

export default fetchInit