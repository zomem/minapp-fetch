/*
 * @Author: your name
 * @Date: 2020-01-23 17:44:21
 * @LastEditTime: 2020-04-16 17:48:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/findCategory.ts
 */

import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  RequestBase?: string | undefined
  Header?: {
    'Content-Type'?: string
    'X-Hydrogen-Client-ID'?: string,
    'Authorization'?: string,
    'X-Hydrogen-Env-ID'?: string,
  }
}

function fetchFindCategory(contentGroupID: number, params: {
  page?: number
  limit?: number
  orderBy?: '-created_at' | 'created_at' | '-updated_at' | 'updated_at'
  withCount?: boolean
} = {}){
  let BaaS_F = getBaaSF(ArgsObj)

  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }

  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      return new Promise((resolve: any, reject: any)=>{
        let MyContentCategory = new BaaS_F.ContentCategory(contentGroupID)
        MyContentCategory.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).orderBy(params.orderBy || '-created_at').find({withCount: params.withCount || false}).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      })
    }
    return new Promise((resolve: any, reject: any)=>{
      let MyContentGroup = new BaaS_F.ContentGroup(contentGroupID)
      MyContentGroup.getCategoryList({
        withCount: params.withCount || false
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
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      BaaS_F({
        method: 'get',
        url: `${ArgsObj.RequestBase}/hserve/v2.2/content/category/`,
        headers: ArgsObj.Header,
        params: {
          limit: params.limit || 100,
          return_total_count: params.withCount ? 1 : 0,
          content_group_id: contentGroupID,
        },
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject)=>{
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/category`, {
        params: {
          limit: params.limit || 100,
          return_total_count: params.withCount ? 1 : 0,
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    })
  }
  
}


function initFindCategory(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn'  | 'jd', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchFindCategory
}

export default initFindCategory