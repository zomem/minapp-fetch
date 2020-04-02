import fetchFindFile from './findFile'



type methodList = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'stringLength' |
'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'

type fieldList = 'id' | 'name' | 'size' | 'category_id' | 'category_name' | 'created_at'


function initFetchCountFile(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  function fetchCountFile(params: {
    p0?: [fieldList | string, methodList, ...any[]]
    p1?: [fieldList | string, methodList, ...any[]]
    p2?: [fieldList | string, methodList, ...any[]]
    p3?: [fieldList | string, methodList, ...any[]]
    p4?: [fieldList | string, methodList, ...any[]]
    p5?: [fieldList | string, methodList, ...any[]]
    p6?: [fieldList | string, methodList, ...any[]]
    p7?: [fieldList | string, methodList, ...any[]]
    p8?: [fieldList | string, methodList, ...any[]]
    p9?: [fieldList | string, methodList, ...any[]]
    r: string
    [propName: string]: [fieldList | string, methodList, ...any[]] | string | number | boolean | string[] | undefined
  }){
    return new Promise((resolve, reject)=>{
      params.limit = 1
      params.withCount = true
      fetchFindFile(args)(params).then((res: any) => {
        let num = res.data.meta.total_count
        resolve(num)
      }, err=>{
        reject(err)
      })
    })
  }
  
  return fetchCountFile
}

export default initFetchCountFile