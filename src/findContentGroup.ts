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
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'

function fetchFindContentGroup(params: IContentGroupParams): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }


  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })
}

export default fetchFindContentGroup