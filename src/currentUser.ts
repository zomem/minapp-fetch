/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:48:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/currentUser.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import {ICurrentUser} from './types'


//
function fetchCurrentUser(): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  return new Promise<ICurrentUser>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      //CLOUD
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
      }
      BaaS_F.auth.getCurrentUser().then((user: ICurrentUser) => {
        // user 为 currentUser 对象
        resolve(user)
      }).catch((err: any) => {
        // HError  
        reject(err)
      })
    }
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
    }
    
  })
}


export default fetchCurrentUser