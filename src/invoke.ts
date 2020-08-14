/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:55:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/invoke/invoke.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'

function fetchInvoke(invokeName: string, params: any, sync: boolean): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
      BaaS_F.post(`https://cloud.minapp.com/userve/v1.3/cloud-function/${invokeName}/job/?sync=${sync}`, params).then((res: any) => {
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
export default fetchInvoke