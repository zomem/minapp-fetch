/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:56:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/register.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'
import {ICurrentUser, ILoginParams} from './types'

function fetchRegister(params: ILoginParams): Promise<ICurrentUser>{
  let {BaaS_F, minapp, options} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    //webapi
    if(minapp === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.register ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.auth.register(params).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        // HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<ICurrentUser>((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
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
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.1/register/${addr}/`,
        headers: options.Header,
        data: params
      }).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    throw new Error(`minapp.register ${METHOD_NOT_SUPPORT}`)
  }

  return new Promise<ICurrentUser>((resolve, reject)=>{
    resolve({
      id: 0
    })
  })

}

export default fetchRegister