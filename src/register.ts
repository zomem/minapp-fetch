/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:56:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/register.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'
import {ICurrentUser, ILoginParams} from './types'

function fetchRegister(params: ILoginParams): Promise<ICurrentUser>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      //webapi
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        throw new Error(`minapp.register ${METHOD_NOT_SUPPORT}`)
      }
      BaaS_F.auth.register(params).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        // HError 对象
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.register ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
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
    }

    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.register ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchRegister