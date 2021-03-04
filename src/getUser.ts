/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:54:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/userGroup/getUser.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT } from './constants/error'
import {IGetQuery} from './index'

function fetchGetUser(uid: number, params: IGetQuery={}): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let MyUser = new BaaS_F.User()
      MyUser.expand(params?.expand || []).select(params?.select || []).get(uid).then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    }

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/user/info/${uid}/`,
        headers: options.Header,
        params: {
          expand: (params?.expand || []).toString(),
          keys: (params?.select || []).toString(),
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.getUser ${METHOD_NOT_SUPPORT}`)
    }

    
    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/miniapp/user_profile/${uid}/`)
      .then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.getUser ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchGetUser