
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

//
function fetchLoginWithSmsVerificationCode(
  phone: string, 
  code: string, 
  params?: {
  createUser?: boolean
}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.auth.loginWithSmsVerificationCode(phone, code, { createUser: params.createUser.toString() === 'false' ? false : true }).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
  }
  
}


function initFetchLoginWithSmsVerificationCode(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchLoginWithSmsVerificationCode
}

export default initFetchLoginWithSmsVerificationCode