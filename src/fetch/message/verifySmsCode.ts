
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}


function fetchVerifySmsCode(phone: string, code: number, userID?: number){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      return new Promise((resolve, reject)=>{
        BaaS_F.verifySmsCode({phone: phone, code: code, userID: userID}).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    }else{
      return new Promise((resolve, reject)=>{
        BaaS_F.verifySmsCode({phone: phone, code: code}).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    }
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      BaaS_F({
        method: 'get',
        url: `${ArgsObj.RequestBase}/hserve/v1.8/sms-verification-code/verify/`,
        headers: {
          'X-Hydrogen-Client-ID': ArgsObj.ClientID,
          'Authorization': `Hydrogen-r1 ${ArgsObj.AccessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          phone: phone,
          code: code
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject)=>{
      BaaS_F.get(`https://cloud.minapp.com/userve/v1.8/sms-verification-code/verify/`, {
        params: {
          phone: phone,
          code: code,
          user_id: userID
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchVerifySmsCode(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchVerifySmsCode
}

export default initFetchVerifySmsCode