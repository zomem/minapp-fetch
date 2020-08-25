/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:54:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/message/getServerDate.ts
 */ 

import { getBaaSF } from './utils/utils'
import {IGetServerTimeRes} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

/**
 * 获取服务器时间
 * ISO 8601: 2019-11-25T15:05:19.387067+08:00
 */
function fetchGetServerDate(): Promise<IGetServerTimeRes>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<IGetServerTimeRes>((resolve, reject) => {
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      BaaS_F.getServerDate().then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.getServerDate ${METHOD_NOT_SUPPORT}`)
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/server/time/`,
        headers: options.Header
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.getServerDate ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchGetServerDate