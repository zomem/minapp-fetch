/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:47:25
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/countMany.ts
 */ 
import fetchFind from './find'
import { FIND_MANY_L_ERROR } from './constants/error'
import {ICountParams} from './types'
const pLimit = require('./utils/p-limit')




function fetchCountMany(findArray: [string | number, ICountParams][], plimit: number = 10): Promise<number[]>{
  return new Promise<number[]>((resolve, reject)=>{
    let limit = pLimit(plimit)
    let input = []
    if(findArray.length === 0){
      throw new Error(FIND_MANY_L_ERROR)
    }
    for(let i = 0; i < findArray.length; i++){
      findArray[i][1].limit = 1
      findArray[i][1].withCount = true
      input.push(limit(() => fetchFind(findArray[i][0], findArray[i][1])))
    }
    Promise.all(input).then((res: any) => {
      let numList = []
      for(let j = 0; j < res.length; j++){
        numList.push(res[j].data.meta.total_count)
      }
      resolve(numList)
    }, (err: any) => {
      reject(err)
    })
  })
}


export default fetchCountMany