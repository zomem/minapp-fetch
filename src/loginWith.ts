/*
 * @Author: your name
 * @Date: 2020-01-27 13:18:41
 * @LastEditTime: 2020-06-06 08:55:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/user/loginWith.ts
 */

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {ICurrentUser, ILoginWithParams} from './types'
//
function fetchLoginWith(...data: [any, ILoginWithParams]): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()

  switch(minapp){
    case PLATFORM_NAME.ALIPAY:
      return new Promise<ICurrentUser>((resolve, reject)=>{
        BaaS_F.auth.loginWithAlipay(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
      })
    case PLATFORM_NAME.QQ:
      return new Promise<ICurrentUser>((resolve, reject)=>{
        BaaS_F.auth.loginWithQQ(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
      })
    case PLATFORM_NAME.SWAN:
      return new Promise<ICurrentUser>((resolve, reject)=>{
        BaaS_F.auth.loginWithBaidu(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
      })
    case PLATFORM_NAME.WEAPP:
      return new Promise<ICurrentUser>((resolve, reject)=>{
        BaaS_F.auth.loginWithWechat(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
      })
    case PLATFORM_NAME.TT:
      return new Promise<ICurrentUser>((resolve, reject)=>{
        BaaS_F.auth.loginWithTt(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
      })
    case PLATFORM_NAME.JD:
      return new Promise<ICurrentUser>((resolve, reject)=>{
        BaaS_F.auth.loginWithJd(...data).then((user: any) => {
          // 登录成功
          resolve(user)
        }, (err: any) => {
          // 登录失败
          reject(err)
        })
      })
    default:
      throw new Error(`minapp.loginWith ${METHOD_NOT_SUPPORT}`)
  }
}

export default fetchLoginWith