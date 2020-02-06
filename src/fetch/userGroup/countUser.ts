import fetchFindUser from './findUser'
type methodList = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'


function initFetchCountUser(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchCountUser(params: {
    p0?: [string, methodList, ...any[]]
    p1?: [string, methodList, ...any[]]
    p2?: [string, methodList, ...any[]]
    r: string
    [propName: string]: [string, methodList, ...any[]] | string | number | boolean | string[] | undefined
  }){
    return new Promise((resolve, reject) => {
      params.limit = 1
      params.withCount = true
      fetchFindUser(args)(params).then((res: any) => {
        let num = res.data.meta.total_count
        resolve(num)
      }, err=>{
        reject(err)
      })
    })
  }
  
  return fetchCountUser
}

export default initFetchCountUser