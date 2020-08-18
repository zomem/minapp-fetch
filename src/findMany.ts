/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:51:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/findMany.ts
 */ 

import fetchFind from './find'
import { FIND_MANY_L_ERROR } from './constants/error'
import {TCheckManyItem, IFindRes} from './types'
const pLimit = require('./utils/p-limit')



function fetchFindMany(findArray: TCheckManyItem[], plimit: number = 10): Promise<IFindRes[]>{
  return new Promise<IFindRes[]>((resolve, reject)=>{
    let limit = pLimit(plimit)
    let input = []
    if(findArray.length === 0){
      throw new Error(FIND_MANY_L_ERROR)
    }
    for(let i = 0; i < findArray.length; i++){
      input.push(limit(() => fetchFind(findArray[i][0], findArray[i][1])))
    }
    Promise.all(input).then((res: IFindRes[]) => {
      resolve(res)
    }, (err: any) => {
      reject(err)
    })
  })
}


export default fetchFindMany