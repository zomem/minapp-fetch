import fetchFindContent from './findContent'


type methodList = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'



function initFetchCountContent(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){

  function fetchCountContent(contentGroupID: number, params: {
    p0?: [string, methodList, ...any[]]
    p1?: [string, methodList, ...any[]]
    p2?: [string, methodList, ...any[]]
    r: string
    [propName: string]: [string, methodList, ...any[]] | string | number | boolean | string[] | undefined
  }){
    return new Promise((resolve, reject)=>{
      params.limit = 1
      params.withCount = true
      fetchFindContent(args)(contentGroupID, params).then((res: any) => {
        let num = res.data.meta.total_count
        resolve(num)
      }, (err: any) => {
        reject(err)
      })
    })
  }
  
  return fetchCountContent
}

export default initFetchCountContent