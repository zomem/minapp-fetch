/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:55:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/login.ts
 */ 

import { getBaaSF } from './utils/utils'
import {ILoginParams, ICurrentUser} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

//
function fetchLogin(params: ILoginParams): Promise<ICurrentUser>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise<ICurrentUser>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      //webapi
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
      }
      BaaS_F.auth.login(params).then((user: any) => {
        resolve(user)
      }).catch((err: any)=>{
        // HError 对象
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let addr = null
      if(params.email){
        addr = 'email'
      }
      if(params.username){
        addr = 'username'
      }
      if(params.phone){
        addr = 'phone'
      }
      // if(params.sms){
      //   addr = 'sms'
      // }
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.1/login/${addr}/`,
        headers: options.Header,
        data: params,
      }).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchLogin