/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:45:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/anonymous.ts
 */ 
import {getBaaSF} from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import {ICurrentUser} from './index'

//
function fetchAnonymous(): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD) throw new Error(`minapp.anonymous ${METHOD_NOT_SUPPORT}`)
      BaaS_F.auth.anonymousLogin().then((user: ICurrentUser) => {
        resolve(user)
      }).catch((err: any) => {
        // HError
        reject(err)
      })
    }
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.anonymous ${METHOD_NOT_SUPPORT}`)
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.anonymous ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchAnonymous