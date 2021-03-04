/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:48:05
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/countUser.ts
 */ 
import fetchFindUser from './findUser'
import {ICountParams} from './index'
import {PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import { getBaaSF } from './utils/utils'

function fetchCountUser(params: ICountParams): Promise<number>{
  return new Promise((resolve, reject) => {
    let {minapp} = getBaaSF()
    params.limit = 1
    params.withCount = true
    fetchFindUser(params).then((res: any) => {
      let num = res.data.meta.total_count
      resolve(num)
    }, err=>{
      reject(err)
    })
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.countUser ${METHOD_NOT_SUPPORT}`)
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.countUser ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchCountUser