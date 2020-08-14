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



function fetchCountContent(contentGroupID: number, params: ICountParams): Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    params.limit = 1
    params.withCount = true
    fetchFindContent(contentGroupID, params).then((res: any) => {
      let num = res.data.meta.total_count
      resolve(num)
    }, (err: any) => {
      reject(err)
    })
  })
}


export default fetchCountContent