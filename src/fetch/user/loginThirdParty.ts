
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


function fetchLoginThirdParty(provider: 'oauth-wechat-mp' | 'oauth-wechat-web' | 'oauth-weibo', authPageUrl: string, params: {
  debug?: boolean
  mode?: 'popup-window' | 'popup-iframe' | 'redirect'
  authModalStyle?: any
  wechatIframeContentStyle?: any
  windowFeatures?: any
  createUser?: boolean
  syncUserProfile?: 'overwrite' | 'setnx' | 'false'
} = {}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  switch(ArgsObj.Platform){
    case PLATFORM_NAME.DEFAULT:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.loginWithThirdParty(provider, authPageUrl, params).then((user: any) => {
          resolve(user)
        }).catch((err: any)=>{
          reject(err)
        })
      })
    case PLATFORM_NAME.WEB:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.loginWithThirdParty(provider, authPageUrl, params).then((user: any) => {
          resolve(user)
        }).catch((err: any) => {
          reject(err)
        })
      })
    default:
      throw new Error(`minapp.loginThirdParty ${METHOD_NOT_SUPPORT}`)
  }
}


function initFetchLoginThirdParty(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchLoginThirdParty
}

export default initFetchLoginThirdParty