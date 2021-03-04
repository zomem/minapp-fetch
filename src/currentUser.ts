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
import {ICurrentUser} from './index'


//
function fetchCurrentUser(): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  return new Promise((resolve, reject)=>{
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

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v1/user-profile/`)
      .then((res: any) => {
        let tempUser: ICurrentUser = {
          avatar: res.data.avatar_link,
          id: res.data.user_id,
          nickname: res.data.nickname,
          _email: res.data.email
        }
        resolve(tempUser)
      }).catch((err: any) => {
        reject(err)
      })
    }

    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
    }
    
  })
}


export default fetchCurrentUser