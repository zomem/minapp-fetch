/*
 * @Author: your name
 * @Date: 2020-01-23 17:44:21
 * @LastEditTime: 2020-06-06 08:50:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/findCategory.ts
 */

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'
import {ICategoryParams} from './types'


function fetchFindCategory(contentGroupID: number, params: ICategoryParams): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<any>((resolve: any, reject: any)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let MyContentCategory = new BaaS_F.ContentCategory(contentGroupID)
        MyContentCategory.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).orderBy(params.orderBy || '-created_at').find({withCount: params.withCount || false}).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      }

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
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.findCategory ${METHOD_NOT_SUPPORT}`)
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/content/category/`,
        headers: options.Header,
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
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
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
    }
    
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.findCategory ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchFindCategory