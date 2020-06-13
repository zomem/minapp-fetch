/*
 * @Author: your name
 * @Date: 2020-05-11 15:59:23
 * @LastEditTime: 2020-05-11 16:30:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/user/currentUserUpdate.ts
 */

import { setArgs, getBaaSF, cloneDeep, isArray } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, UPDATE_METHORD } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR, UPDATE_ERROR } from '../../constants/error'

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


//
function fetchCurrentUserUpdate(params: {
  [propName: string]: [upMethodList, dataType] | dataType
}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    //CLOUD
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.auth.getCurrentUser().then((user: any) => {
        // user 为 currentUser 对象
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
                user.set(pa, tempGeo)
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
        return user.update()
      }).then((res: any) => {
        BaaS_F.auth.getCurrentUser().then((user: any) => {
          // user 为 currentUser 对象
          resolve(user)
        }).catch((err: any) => {
          // HError  
          reject(err)
        })
      }).catch((err: any) => {
        // HError  
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
  }
  
}


function initFetchCurrentUserUpdate(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn'  | 'jd', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchCurrentUserUpdate
}

export default initFetchCurrentUserUpdate