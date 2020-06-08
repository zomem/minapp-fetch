
import fetchSet from './set'
import { FIND_MANY_L_ERROR } from '../../constants/error'
const pLimit = require('p-limit')


type dataType = string | string[] | number | number[] | boolean | boolean[] | null | undefined | {
  [propName: string] : any
} | {
  [index: number]: any
}


// 同时进行多张表的查寻
function initFetchSetMany(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn', {clientID?: string, host?: string, accessToken?: string, env?: string}]){

  function fetchSetMany(setArray: {
    [index: number]: [string | number, {
      [propName: string]: ['geo', ...any[]] | dataType
    }]
  }, plimit = 10){
    return new Promise((resolve, reject) => {
      let limit = pLimit(plimit)
      let input = []
      if(setArray.length === 0){
        throw new Error(FIND_MANY_L_ERROR)
      }
      for(let i = 0; i < setArray.length; i++){
        input.push(limit(() => fetchSet(args)(setArray[i][0], setArray[i][1])))
      }
      Promise.all(input).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }

  return fetchSetMany
}

export default initFetchSetMany