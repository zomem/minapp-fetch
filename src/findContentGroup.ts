/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:51:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/content/findContentGroup.ts
 */ 

import { getBaaSF } from './utils/utils'
import {IContentGroupParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

function fetchFindContentGroup(params: IContentGroupParams={}): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      BaaS_F.ContentGroup.find({
        withCount: params.withCount || false,
        offset: (params.limit || 20) * ((params.page || 1) - 1),
        limit: params.limit || 20
      }).then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.findContentGroup ${METHOD_NOT_SUPPORT}`)
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/content/group/`,
        headers: options.Header,
        params: {
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          return_total_count: params.withCount ? 1 : 0,
        },
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/content/`, {
        params: {
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          return_total_count: params.withCount ? 1 : 0,
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.findContentGroup ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchFindContentGroup