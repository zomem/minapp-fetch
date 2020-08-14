/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/request/request.ts
 */ 

import { getBaaSF } from './utils/utils'
import {IRequestParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'

function fetchRequest(params: IRequestParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    //CLOUD
    if(minapp === PLATFORM_NAME.WEB || minapp === PLATFORM_NAME.RN){
      const axios = require('axios')
      return new Promise<any>((resolve, reject)=>{
        axios(params).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      })
    }
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject) => {
        BaaS_F.request(params).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      })
    }
    return new Promise<any>((resolve, reject)=>{
      BaaS_F.request(params).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
      BaaS_F(params).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
      BaaS_F(params).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }
  
  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })
  
}


export default fetchRequest