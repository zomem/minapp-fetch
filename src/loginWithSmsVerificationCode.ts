/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:55:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/loginWithSmsVerificationCode.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {ICurrentUser} from './types'

//
function fetchLoginWithSmsVerificationCode(phone: string, code: string, params?: {
  createUser?: boolean
}): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise<ICurrentUser>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
      }
      let isCreate = params?.createUser
      BaaS_F.auth.loginWithSmsVerificationCode(phone, code, { createUser: isCreate.toString() === 'false' ? false : true }).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
    }

    
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchLoginWithSmsVerificationCode