/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:52:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/userGroup/findUserMany.ts
 */ 

import fetchFindUser from './findUser'
import { FIND_MANY_L_ERROR } from './constants/error'
import {ICheckParams} from './types'
const pLimit = require('p-limit')



function fetchFindUserMany(findArray: ICheckParams[], plimit: number = 10): Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    let limit = pLimit(plimit)
    let input = []
    if(findArray.length === 0){
      throw new Error(FIND_MANY_L_ERROR)
    }
    for(let i = 0; i < findArray.length; i++){
      input.push(limit(() => fetchFindUser(findArray[i])))
    }
    Promise.all(input).then(res=>{
      resolve(res)
    }, err=>{
      reject(err)
    })
  })
}


export default fetchFindUserMany