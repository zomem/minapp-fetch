/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:46:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/countContent.ts
 */ 
import fetchFindContent from './findContent'
import {ICountParams} from './types'
import {PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import { getBaaSF } from './utils/utils'


function fetchCountContent(contentGroupID: number, params: ICountParams): Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    let {minapp} = getBaaSF()
    params.limit = 1
    params.withCount = true
    fetchFindContent(contentGroupID, params).then((res: any) => {
      let num = res.data.meta.total_count
      resolve(num)
    }, (err: any) => {
      reject(err)
    })
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.addUserIntoGroup ${METHOD_NOT_SUPPORT}`)
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.countContent ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchCountContent