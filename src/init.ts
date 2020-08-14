
import {TPlatform, IWebApiInit} from './types'
import {WEBAPI_OPTIONS_ERROR, INIT_ERROR} from './constants/error'
import {PLATFORM_NAME_AXIOS, PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'


function fetchInit(platform: TPlatform, options?: IWebApiInit): void{
  if([...PLATFORM_NAME_AXIOS, ...PLATFORM_NAME_BAAS].indexOf(platform) === -1) throw new Error(INIT_ERROR)
  process.env.MINAPP = platform
  if(platform === PLATFORM_NAME.WEBAPI){
    if(!options?.clientID) throw new Error(WEBAPI_OPTIONS_ERROR)
    process.env.MINAPP_OPTIONS = JSON.stringify(options)
  }
}

export default fetchInit