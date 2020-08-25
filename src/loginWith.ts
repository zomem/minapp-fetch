/*
 * @Author: your name
 * @Date: 2020-01-27 13:18:41
 * @LastEditTime: 2020-06-06 08:55:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/user/loginWith.ts
 */

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME, PLATFORM_ALL } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {ICurrentUser, ILoginWithParams} from './types'
//
function fetchLoginWith(...data: [any, ILoginWithParams]): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise<ICurrentUser>((resolve, reject)=>{
    switch(minapp){
      case PLATFORM_NAME.ZX_ALIPAY:
        BaaS_F.auth.loginWithAlipay(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
        break
      case PLATFORM_NAME.ZX_QQ:
        BaaS_F.auth.loginWithQQ(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
        break
      case PLATFORM_NAME.ZX_SWAN:
        BaaS_F.auth.loginWithBaidu(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
        break
      case PLATFORM_NAME.ZX_WEAPP:
        BaaS_F.auth.loginWithWechat(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
        break
      case PLATFORM_NAME.ZX_TT:
        BaaS_F.auth.loginWithTt(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
        break
      case PLATFORM_NAME.ZX_JD:
        BaaS_F.auth.loginWithJd(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
        break
      default:
        if(PLATFORM_ALL.indexOf(minapp) === -1){
          throw new Error(`minapp.loginWith ${METHOD_NOT_SUPPORT}`)
        }
    }
  })
}

export default fetchLoginWith