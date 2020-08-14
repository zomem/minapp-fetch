/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:47:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/file/countFile.ts
 */ 
import fetchFindFile from './findFile'
import {ICountParams, IFindRes} from './types'

function fetchCountFile(params: ICountParams): Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    params.limit = 1
    params.withCount = true
    fetchFindFile(params).then((res: IFindRes) => {
      let num = res.data.meta.total_count
      resolve(num)
    }, err=>{
      reject(err)
    })
  })
}


export default fetchCountFile