/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:52:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/message/getAsyncJobResult.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

/**
 * 获取
 */
function fetchGetAsyncJobResult(operationID: number): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject) => {
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      BaaS_F.getAsyncJobResult(operationID).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.getAsyncJobResult ${METHOD_NOT_SUPPORT}`)
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v1/bulk-operation/${operationID}/`,
        headers: options.Header
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.getAsyncJobResult ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchGetAsyncJobResult