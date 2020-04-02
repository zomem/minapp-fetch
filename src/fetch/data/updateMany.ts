import fetchUpdate from './update'
import { FIND_MANY_L_ERROR } from '../../constants/error'
const pLimit = require('p-limit')


type dataType = string | string[] | number | number[] | boolean | boolean[] | null | undefined | {
  [propName: string] : any
} | {
  [index: number]: any
}


type upMethodList = 'incr' | 'set' | 'unset' | 'patchObject' | 'geo' | 'append' | 'remove' | 'uAppend'


// 同时进行多张表的查寻
function initFetchUpdateMany(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchUpdateMany(updateArray: {
    [index: number]: [string | number, string, {
      [propName: string]: [upMethodList, dataType] | dataType
    }]
  }, plimit: number = 10){
    return new Promise((resolve, reject)=>{
      let limit = pLimit(plimit)
      let input = []
      if(updateArray.length === 0){
        throw new Error(FIND_MANY_L_ERROR)
      }
      for(let i = 0; i < updateArray.length; i++){
        input.push(limit(() => fetchUpdate(args)(updateArray[i][0], updateArray[i][1], updateArray[i][2])))
      }
      Promise.all(input).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }

  return fetchUpdateMany
}

export default initFetchUpdateMany