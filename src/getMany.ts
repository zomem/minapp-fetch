/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:53:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/getMany.ts
 */ 

import fetchGet from './get'
import { FIND_MANY_L_ERROR } from './constants/error'
import {TGetItem, IUpdateSetRes} from './types'
const pLimit = require('./utils/p-limit')


function fetchGetMany(getArray: TGetItem[], plimit: number = 10): Promise<IUpdateSetRes[]>{
  return new Promise<IUpdateSetRes[]>((resolve, reject)=>{
    let limit = pLimit(plimit)
    let input = []
    if(getArray.length === 0){
      throw new Error(FIND_MANY_L_ERROR)
    }
    for(let i = 0; i < getArray.length; i++){
      input.push(limit(() => fetchGet(getArray[i][0], getArray[i][1], getArray[i][2] || {})))
    }
    Promise.all(input).then((res: IUpdateSetRes[]) => {
      resolve(res)
    }, (err: any) => {
      reject(err)
    })
  })
}


export default fetchGetMany