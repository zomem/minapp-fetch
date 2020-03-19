import fetchFind from './find'

type methodList = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'stringLength' |
'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'



function initFetchCount(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchCount(table: string | number, params: {
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
  }){
    return new Promise((resolve, reject)=>{
      params.limit = 1
      params.withCount = true
      fetchFind(args)(table, params).then((res: any) => {
        let num = res.data.meta.total_count
        resolve(num)
      }, err=>{
        reject(err)
      })
    })
  }
  
  return fetchCount
}

export default initFetchCount