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
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

//
function fetchLogin(params: ILoginParams): Promise<ICurrentUser>{
  let {BaaS_F, minapp, options} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    //webapi
    if(minapp === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise<ICurrentUser>((resolve, reject)=>{
      BaaS_F.auth.login(params).then((user: any) => {
        resolve(user)
      }).catch((err: any)=>{
        // HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<ICurrentUser>((resolve, reject)=>{
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
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    throw new Error(`minapp.login ${METHOD_NOT_SUPPORT}`)
  }

  return new Promise<ICurrentUser>((resolve, reject)=>{
    resolve({
      id: 0
    })
  })
}

export default fetchLogin