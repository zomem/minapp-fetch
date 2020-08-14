/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:48:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/currentUser.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import {ICurrentUser} from './types'


//
function fetchCurrentUser(): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    //CLOUD
    if(minapp === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise<ICurrentUser>((resolve, reject)=>{
      BaaS_F.auth.getCurrentUser().then((user: ICurrentUser) => {
        // user 为 currentUser 对象
        resolve(user)
      }).catch((err: any) => {
        // HError  
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
  }

  return new Promise<ICurrentUser>((resolve, reject)=>{
    resolve({id: 0})
  })
  
}


export default fetchCurrentUser