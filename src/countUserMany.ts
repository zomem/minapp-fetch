/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:48:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/userGroup/countUserMany.ts
 */ 
import fetchFindUser from './findUser'
import {ICountParams} from './types'
import { FIND_MANY_L_ERROR } from './constants/error'
const pLimit = require('p-limit')



function fetchCountUserMany(findArray: ICountParams[], plimit: number = 10): Promise<number[]>{
  return new Promise<number[]>((resolve, reject)=>{
    let limit = pLimit(plimit)
    let input = []
    if(findArray.length === 0){
      throw new Error(FIND_MANY_L_ERROR)
    }
    for(let i = 0; i < findArray.length; i++){
      findArray[i].limit = 1
      findArray[i].withCount = true
      input.push(limit(() => fetchFindUser(findArray[i])))
    }
    Promise.all(input).then(res=>{
      let numList = []
      for(let j = 0; j < res.length; j++){
        numList.push(res[j].data.meta.total_count)
      }
      resolve(numList)
    }, err=>{
      reject(err)
    })
  })
}


export default fetchCountUserMany