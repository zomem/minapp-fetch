/*
 * @Author: your name
 * @Date: 2020-05-11 15:59:23
 * @LastEditTime: 2020-06-06 08:48:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/user/currentUserUpdate.ts
 */

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import {IUpdateParams, ICurrentUser} from './types'
import updateTrans from './utils/updateTrans'

//
function fetchCurrentUserUpdate(params: IUpdateParams={}): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  return new Promise<ICurrentUser>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      //CLOUD
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
      }
      BaaS_F.auth.getCurrentUser().then((user: ICurrentUser) => {
        // user 为 currentUser 对象
        let tempUser = updateTrans(params, user, minapp)
        return tempUser.update()
      }).then((res: any) => {
        BaaS_F.auth.getCurrentUser().then((user: ICurrentUser) => {
          // user 为 currentUser 对象
          resolve(user)
        }).catch((err: any) => {
          // HError  
          reject(err)
        })
      }).catch((err: any) => {
        // HError  
        reject(err)
      })
    }
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchCurrentUserUpdate