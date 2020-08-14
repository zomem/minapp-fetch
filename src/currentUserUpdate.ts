/*
 * @Author: your name
 * @Date: 2020-05-11 15:59:23
 * @LastEditTime: 2020-06-06 08:48:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/user/currentUserUpdate.ts
 */

import { getBaaSF, cloneDeep, isArray } from './utils/utils'
import {UPDATE_METHORD, PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {UPDATE_ERROR,METHOD_NOT_SUPPORT} from './constants/error'
import {IUpdateParams, ICurrentUser} from './types'


//
function fetchCurrentUserUpdate(params: IUpdateParams): Promise<ICurrentUser>{
  let {BaaS_F, minapp} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    //CLOUD
    if(minapp === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise<ICurrentUser>((resolve, reject)=>{
      BaaS_F.auth.getCurrentUser().then((user: ICurrentUser) => {
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
        BaaS_F.auth.getCurrentUser().then((user: ICurrentUser) => {
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
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    throw new Error(`minapp.currentUserUpdate ${METHOD_NOT_SUPPORT}`)
  }

  return new Promise<ICurrentUser>((resolve, reject)=>{
    resolve({id: 0})
  })
}

export default fetchCurrentUserUpdate