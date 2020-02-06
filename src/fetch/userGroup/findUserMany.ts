
import fetchFindUser from './findUser'
import { FIND_MANY_L_ERROR } from '../../constants/error'
const pLimit = require('p-limit')


type methodList = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'


function initFetchFindUserMany(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchFindUserMany(findArray: {
    [index: number]: {
      p0?: [string, methodList, ...any[]]
      p1?: [string, methodList, ...any[]]
      p2?: [string, methodList, ...any[]]
      r: string
      page?: number
      limit?: number
      orderBy?: string
      expand?: string[]
      select?: string[]
      withCount?: false | boolean
      [propName: string]: [string, methodList, ...any[]] | string | number | boolean | string[] | undefined
    }
  }, plimit: number = 10){
    return new Promise((resolve, reject)=>{
      let limit = pLimit(plimit)
      let input = []
      if(findArray.length === 0){
        throw new Error(FIND_MANY_L_ERROR)
      }
      for(let i = 0; i < findArray.length; i++){
        input.push(limit(() => fetchFindUser(args)(findArray[i])))
      }
      Promise.all(input).then(res=>{
        resolve(res)
      }, err=>{
        reject(err)
      })
    })
  }

  return fetchFindUserMany
}

export default initFetchFindUserMany