
import fetchGet from './get'
import { FIND_MANY_L_ERROR } from '../../constants/error'
const pLimit = require('p-limit')

// 同时进行多张表的GET
function initFetchGetMany(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchGetMany(getArray: {
    [index: number]: [string | number, string, {
      select: string[]
      expand: string[]
    }]
  }, plimit: number = 10){
    return new Promise((resolve, reject)=>{
      let limit = pLimit(plimit)
      let input = []
      if(getArray.length === 0){
        throw new Error(FIND_MANY_L_ERROR)
      }
      for(let i = 0; i < getArray.length; i++){
        input.push(limit(() => fetchGet(args)(getArray[i][0], getArray[i][1], getArray[i][2] || {})))
      }
      Promise.all(input).then((res: any) => {
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    })
  }

  return fetchGetMany
}

export default initFetchGetMany