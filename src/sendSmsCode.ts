/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/message/sendSmsCode.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'


function fetchSendSmsCode(phone: string, signatureID: number, userID?: number): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        BaaS_F.sendSmsCode({
          phone: phone,
          signatureID: signatureID,
          userID: userID,
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }else{
        BaaS_F.sendSmsCode({
          phone: phone,
          signatureID: signatureID,
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.sendSmsCode ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/sms-verification-code/`,
        headers: options.Header,
        params: {
          phone: phone,
          signature_id: signatureID
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.1/sms-verification-code/`, {
        params: {
          phone: phone,
          signature_id: signatureID,
          user_id	: userID,
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.sendSmsCode ${METHOD_NOT_SUPPORT}`)
    }
  })

  

}

export default fetchSendSmsCode