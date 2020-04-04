
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT } from '../../constants/error'

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
function fetchThirdPartyAuth(){
  let BaaS_F = getBaaSF(ArgsObj)

  switch(ArgsObj.Platform){
    case PLATFORM_NAME.DEFAULT:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.thirdPartyAuth().then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    case PLATFORM_NAME.WEB:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.thirdPartyAuth().then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    default:
      throw new Error(`minapp.thirdPartyAuth ${METHOD_NOT_SUPPORT}`)
  }
}


function initFetchThirdPartyAuth(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchThirdPartyAuth
}

export default initFetchThirdPartyAuth