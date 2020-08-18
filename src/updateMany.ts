/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:58:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/updateMany.ts
 */ 
import fetchUpdate from './update'
import { FIND_MANY_L_ERROR } from './constants/error'
import {TUpdateItem, IUpdateSetRes} from './types'
const pLimit = require('./utils/p-limit')

function fetchUpdateMany(updateArray: TUpdateItem[], plimit: number = 10): Promise<IUpdateSetRes[]>{
  return new Promise<IUpdateSetRes[]>((resolve, reject)=>{
    let limit = pLimit(plimit)
    let input = []
    if(updateArray.length === 0){
      throw new Error(FIND_MANY_L_ERROR)
    }
    for(let i = 0; i < updateArray.length; i++){
      input.push(limit(() => fetchUpdate(updateArray[i][0], updateArray[i][1], updateArray[i][2])))
    }
    Promise.all(input).then((res: IUpdateSetRes[]) => {
      resolve(res)
    }, (err: any) => {
      reject(err)
    })
  })
}


export default fetchUpdateMany