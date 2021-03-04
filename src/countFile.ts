/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:47:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/file/countFile.ts
 */ 
import fetchFindFile from './findFile'
import {ICountFileParams, IFindRes} from './index'
import {PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import { getBaaSF } from './utils/utils'

function fetchCountFile(params: ICountFileParams): Promise<number>{
  return new Promise((resolve, reject)=>{
    let {minapp} = getBaaSF()
    params.limit = 1
    params.withCount = true
    fetchFindFile(params).then((res: IFindRes) => {
      let num = res.data.meta.total_count
      resolve(num)
    }, err=>{
      reject(err)
    })
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.countFile ${METHOD_NOT_SUPPORT}`)
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.countFile ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchCountFile