/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:55:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/logout.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'


//
function fetchLogout(): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      //CLOUD
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        throw new Error(`minapp.logout ${METHOD_NOT_SUPPORT}`)
      }
        // 登出 BaaS
      BaaS_F.auth.logout().then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.logout ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.0/session/destroy/`,
        headers: options.Header
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.logout ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchLogout