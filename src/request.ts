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
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'

function fetchRequest(params: IRequestParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      //CLOUD
      if(minapp === PLATFORM_NAME.ZX_WEB || minapp === PLATFORM_NAME.ZX_RN){
        const axios = require('axios')
        axios(params).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        BaaS_F.request(params).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
      
      BaaS_F.request(params).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.request ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      BaaS_F(params).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F(params).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.request ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchRequest