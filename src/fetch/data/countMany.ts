import fetchFind from './find'
import { FIND_MANY_L_ERROR } from '../../constants/error'
const pLimit = require('p-limit')


type methodList = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'stringLength' |
'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'




function initFetchCountMany(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchCountMany(findArray: {
    [index: number]: [string | number, {
      p0?: [string, methodList, ...any[]]
      p1?: [string, methodList, ...any[]]
      p2?: [string, methodList, ...any[]]
      p3?: [string, methodList, ...any[]]
      p4?: [string, methodList, ...any[]]
      p5?: [string, methodList, ...any[]]
      p6?: [string, methodList, ...any[]]
      p7?: [string, methodList, ...any[]]
      p8?: [string, methodList, ...any[]]
      p9?: [string, methodList, ...any[]]
      r: string
      [propName: string]: [string, methodList, ...any[]] | string | number | boolean | string[] | undefined
    }]
  }, plimit: number = 10){
    return new Promise((resolve, reject)=>{
      let limit = pLimit(plimit)
      let input = []
      if(findArray.length === 0){
        throw new Error(FIND_MANY_L_ERROR)
      }
      for(let i = 0; i < findArray.length; i++){
        findArray[i][1].limit = 1
        findArray[i][1].withCount = true
        input.push(limit(() => fetchFind(args)(findArray[i][0], findArray[i][1])))
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
  
  return fetchCountMany
}

export default initFetchCountMany