import fetchGetUser from './getUser'
import { getBaaSF, isArray } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, UPDATE_METHORD } from './constants/constants'
import { METHOD_NOT_SUPPORT, UPDATE_ERROR, WEBAPI_OPTIONS_ERROR } from './constants/error'
import {IUpdateParams} from './types'


function fetchUpdateUser(uid: number, params: IUpdateParams): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject) => {
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
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'put',
        url: `${options.RequestBase}/hserve/v2.0/user/account/`,
        headers: options.Header,
        data: params
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => { 
        reject(err)
      })
    })
  }
  
  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject) => {
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
        fetchGetUser(uid).then(user => {
          resolve(user)
        }, err => {
          reject(err)
        })
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
    
  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })
  
}

export default fetchUpdateUser