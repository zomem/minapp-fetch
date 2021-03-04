/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:55:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/invoke/invoke.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

function fetchInvoke(invokeName: string, params: any, sync: boolean): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      BaaS_F.invoke(invokeName, params, sync).then((res: any) => {
        if (res.code === 0) {
          // success
          resolve(res)
        } else {
          // fail
          reject(res)
        }
      }, (err: any) => {
        // HError 对象
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        throw new Error(`minapp.invoke ${METHOD_NOT_SUPPORT}`)
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        BaaS_F.callFunction({
          name: invokeName,
          data: params,
        }).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
    }
    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v1/cloud-function/job/`,
        headers: options.Header,
        data:{
          function_name: invokeName,
          data:params,
          sync:sync
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.post(`https://cloud.minapp.com/userve/v1.3/cloud-function/${invokeName}/job/?sync=${sync}`, params).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.invoke ${METHOD_NOT_SUPPORT}`)
    }
  })
}
export default fetchInvoke