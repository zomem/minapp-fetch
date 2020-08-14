/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:47:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/count.ts
 */ 
import fetchFind from './find'
import {TTable, ICountParams, IFindRes} from './types'


function fetchCount(table: TTable, params: ICountParams): Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    params.limit = 1
    params.withCount = true
    fetchFind(table, params).then((res: IFindRes) => {
      let num: number = 0
      if(res.data.meta.total_count) num = res.data.meta.total_count
      resolve(num)
    }, err=>{
      reject(err)
    })
  })
}


export default fetchCount