/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:55:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/user/loginWithSmsVerificationCode.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {ICurrentUser} from './types'

//
function fetchLoginWithSmsVerificationCode(phone: string, code: string, params?: {
  createUser?: boolean
}): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
    }
    let isCreate = params?.createUser
    return new Promise<ICurrentUser>((resolve, reject)=>{
      BaaS_F.auth.loginWithSmsVerificationCode(phone, code, { createUser: isCreate.toString() === 'false' ? false : true }).then((user: any) => {
        resolve(user)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    throw new Error(`minapp.loginWithSmsVerificationCode ${METHOD_NOT_SUPPORT}`)
  }


  return new Promise<ICurrentUser>((resolve, reject)=>{
    resolve({
      id: 0
    })
  })
}

export default fetchLoginWithSmsVerificationCode