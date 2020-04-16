
import { setArgs, getBaaSF, cloneDeep, isArray } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, UPDATE_METHORD } from '../../constants/constants'
import { UPDATE_ERROR, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  RequestBase?: string | undefined
  Header?: {
    'Content-Type'?: string
    'X-Hydrogen-Client-ID'?: string,
    'Authorization'?: string,
    'X-Hydrogen-Env-ID'?: string,
  }
}


type dataType = string | string[] | number | number[] | boolean | boolean[] | null | undefined | {
  [propName: string] : any
} | {
  [index: number]: any
}


type upMethodList = 'incr' | 'set' | 'unset' | 'patchObject' | 'geo' | 'append' | 'remove' | 'uAppend'


function fetchUpdate(table: string | number, id: string, params: {
  [propName: string]: [upMethodList, dataType] | dataType
}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    return new Promise((resolve, reject)=>{
      let Product = new BaaS_F.TableObject(table)
      let records = Product.getWithoutData(id)
      for(let pa in params){
        if(!isArray(params[pa])){
          //不是数组，则直接 set
          records.set(pa, params[pa])
          continue
        }
        if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
          switch(params[pa][0]){
            case 'set':
              records.set(pa, params[pa][1])
              break
            case 'geo':
              let temp = params[pa], tempGeo = {}
              temp.shift()
              if(temp.length > 1){
                tempGeo = cloneDeep({
                  type: 'Polygon',
                  coordinates: [temp]
                })
              }else{
                tempGeo = cloneDeep({
                  type: 'Point',
                  coordinates: temp[0]
                })
              }
              records.set(pa, tempGeo)
              break
            case 'unset':
              records.unset(pa)
              break
            case 'incr':
              records.incrementBy(pa, params[pa][1])
              break
            case 'append':
              records.append(pa, Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
              break
            case 'uAppend':
              records.uAppend(pa, Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
              break
            case 'remove':
              records.remove(pa, Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
              break
            case 'patchObject':
              records.patchObject(pa, params[pa][1])
              break
            default:
              throw new Error(UPDATE_ERROR)
          }
        }else{
          //直接 set
          records.set(pa, params[pa])
        }
      }
      records.update().then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      let updata: any = {}
      for(let pa in params){
        if(!isArray(params[pa])){
          //不是数组，则直接 set
          updata[pa] = params[pa]
          continue
        }
        if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
          switch(params[pa][0]){
            case 'set':
              updata[pa] = params[pa][1]
              break
            case 'geo':
              let temp = params[pa], tempGeo = {}
              temp.shift()
              if(temp.length > 1){
                tempGeo = cloneDeep({
                  type: 'Polygon',
                  coordinates: [temp]
                })
              }else{
                tempGeo = cloneDeep({
                  type: 'Point',
                  coordinates: temp[0]
                })
              }
              updata[pa] = tempGeo
              break
            case 'unset':
              updata[pa] = {}
              updata[pa]['$unset'] = ''
              break
            case 'incr':
              updata[pa] = {}
              updata[pa]['$incr_by'] = params[pa][1]
              break
            case 'append':
              updata[pa] = {}
              updata[pa]['$append'] = Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              break
            case 'uAppend':
              updata[pa] = {}
              updata[pa]['$append_unique'] = Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              break
            case 'remove':
              updata[pa] = {}
              updata[pa]['$remove'] = Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              break
            case 'patchObject':
              updata[pa] = {}
              updata[pa]['$update'] = params[pa][1]
              break
            default:
              throw new Error(UPDATE_ERROR)
          }
        }else{
          //直接 set
          updata[pa] = params[pa]
        }
      }
      BaaS_F({
        method: 'put',
        url: `${ArgsObj.RequestBase}/hserve/v2.2/table/${table}/record/${id}/`,
        headers: ArgsObj.Header,
        data: updata
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject)=>{
      let updata:any = {}

      for(let pa in params){
        if(!isArray(params[pa])){
          //不是数组，则直接 set
          updata[pa] = params[pa]
          continue
        }
        if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
          switch(params[pa][0]){
            case 'set':
              updata[pa] = params[pa][1]
              break
            case 'geo':
              let temp = params[pa], tempGeo = {}
              temp.shift()
              if(temp.length > 1){
                tempGeo = cloneDeep({
                  type: 'Polygon',
                  coordinates: [temp]
                })
              }else{
                tempGeo = cloneDeep({
                  type: 'Point',
                  coordinates: temp[0]
                })
              }
              updata[pa] = tempGeo
              break
            case 'unset':
              updata[pa] = {}
              updata[pa]['$unset'] = ''
              break
            case 'incr':
              updata[pa] = {}
              updata[pa]['$incr_by'] = params[pa][1]
              break
            case 'append':
              updata[pa] = {}
              updata[pa]['$append'] = Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              break
            case 'uAppend':
              updata[pa] = {}
              updata[pa]['$append_unique'] = Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              break
            case 'remove':
              updata[pa] = {}
              updata[pa]['$remove'] = Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              break
            case 'patchObject':
              updata[pa] = {}
              updata[pa]['$update'] = params[pa][1]
              break
            default:
              throw new Error(UPDATE_ERROR)
          }
        }else{
          //直接 set
          updata[pa] = params[pa]
        }
      }
      
      BaaS_F.put(`https://cloud.minapp.com/userve/v2.2/table/${table}/record/${id}/`, updata).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchUpdate(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchUpdate
}

export default initFetchUpdate