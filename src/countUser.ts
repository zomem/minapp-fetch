/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:48:05
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/countUser.ts
 */ 
import fetchFindUser from './findUser'
import {ICountParams} from './types'


function fetchCountUser(params: ICountParams): Promise<number>{
  return new Promise<number>((resolve, reject) => {
    params.limit = 1
    params.withCount = true
    fetchFindUser(params).then((res: any) => {
      let num = res.data.meta.total_count
      resolve(num)
    }, err=>{
      reject(err)
    })
  })
}

export default fetchCountUser