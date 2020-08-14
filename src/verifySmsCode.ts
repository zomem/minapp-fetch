/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:59:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/message/verifySmsCode.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'


function fetchVerifySmsCode(phone: string, code: number, userID?: number): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject)=>{
        BaaS_F.verifySmsCode({phone: phone, code: code, userID: userID}).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    }else{
      return new Promise<any>((resolve, reject)=>{
        BaaS_F.verifySmsCode({phone: phone, code: code}).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      })
    }
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v1.8/sms-verification-code/verify/`,
        headers: options.Header,
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
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
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

  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })

}

export default fetchVerifySmsCode