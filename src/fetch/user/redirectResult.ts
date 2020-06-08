
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  RequestBase?: string | undefined
  Header?: {
    'Content-Type'?: string
    'X-Hydrogen-Client-ID'?: string,
    'Authorization'?: string,
    'X-Hydrogen-Env-ID'?: string,
  }
}

//
function fetchRedirectResult(){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  switch(ArgsObj.Platform){
    case PLATFORM_NAME.DEFAULT:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.getRedirectResult().then((user: any) => {
          resolve(user)
        }).catch((err: any) => {
          reject(err)
        })
      })
    case PLATFORM_NAME.WEB:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.getRedirectResult().then((user: any) => {
          resolve(user)
        }).catch((err: any) => {
          reject(err)
        })
      })
    default:
      throw new Error(`minapp.redirectResult ${METHOD_NOT_SUPPORT}`)
  }
}


function initFetchRedirectResult(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchRedirectResult
}

export default initFetchRedirectResult