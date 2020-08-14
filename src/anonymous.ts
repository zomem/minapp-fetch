/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:45:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/anonymous.ts
 */ 
import {getBaaSF} from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import {ICurrentUser} from './types'

//
function fetchAnonymous(): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD) throw new Error(`minapp.anonymous ${METHOD_NOT_SUPPORT}`)
    return new Promise<ICurrentUser>((resolve, reject)=>{
      BaaS_F.auth.anonymousLogin().then((user: ICurrentUser) => {
        resolve(user)
      }).catch((err: any) => {
        // HError
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI) throw new Error(`minapp.anonymous ${METHOD_NOT_SUPPORT}`)

  //op
  if(minapp === PLATFORM_NAME.OP) throw new Error(`minapp.anonymous ${METHOD_NOT_SUPPORT}`)


  return new Promise<ICurrentUser>((resolve, reject)=>{
    resolve({
      id: 0
    })
  })
}

export default fetchAnonymous