import fetchGetUser from './getUser'

import { setArgs, getBaaSF, isArray } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, UPDATE_METHORD } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, UPDATE_ERROR, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  RequestBase?: string | undefined
  Header?: {
    'Content-Type'?: string
    'X-Hydrogen-Client-ID'?: string,
    'Authorization'?: string,
    'X-Hydrogen-Env-ID'?: string,
  }
}, Args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn'  | 'jd', {clientID?: string, host?: string, accessToken?: string, env?: string}]



type dataType = string | string[] | number | number[] | boolean | boolean[] | null | undefined | {
  [propName: string] : any
} | {
  [index: number]: any
}


type upMethodList = 'incr' | 'set' | 'unset' | 'patchObject' | 'append' | 'remove' | 'uAppend'



function fetchUpdateUser(...data: [number, {
  [propName: string]: [upMethodList, dataType] | dataType
}]){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      let [uid, params] = data
      return new Promise((resolve, reject) => {
        let MyUser = new BaaS_F.User()
        let user = MyUser.getWithoutData(uid)
        // age 为自定义字段
        for(let pa in params){
          if(!isArray(params[pa])){
            //不是数组，则直接 set
            user.set(pa, params[pa])
            continue
          }
          if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
            switch(params[pa][0]){
              case 'set':
                user.set(pa, params[pa][1])
                break
              case 'unset':
                user.unset(pa)
                break
              case 'incr':
                user.incrementBy(pa, params[pa][1])
                break
              case 'append':
                user.append(pa, Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
                break
              case 'uAppend':
                user.uAppend(pa, Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
                break
              case 'remove':
                user.remove(pa, Array.isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
                break
              case 'patchObject':
                user.patchObject(pa, params[pa][1])
                break
              default:
                throw new Error(UPDATE_ERROR)
            }
          }else{
            //直接 set
            user.set(pa, params[pa])
          }
        }
        user.update().then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      })
    }
    
    throw new Error(`minapp.updateUser ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    let [params] = data
    return new Promise((resolve, reject)=>{
      BaaS_F({
        method: 'put',
        url: `${ArgsObj.RequestBase}/hserve/v2.0/user/account/`,
        headers: ArgsObj.Header,
        data: params
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => { 
        reject(err)
      })
    })
  }
  
  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    let [uid, params] = data
    return new Promise((resolve, reject) => {
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
        url: 'https://cloud.minapp.com/userve/v2.2/miniapp/user_profile/',
        params: {
          where: {
            "id": {"$eq": uid}
          },
          limit: 1,
          offset: 0,
          return_total_count: 0,
        },
        data: updata
      }).then((res: any) => {
        fetchGetUser(Args)(uid).then(user => {
          resolve(user)
        }, err => {
          reject(err)
        })
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchUpdateUser(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn'  | 'jd', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  Args = args
  ArgsObj = setArgs(args)
  return fetchUpdateUser
}

export default initFetchUpdateUser