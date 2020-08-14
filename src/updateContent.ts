/*
 * @Author: your name
 * @Date: 2020-04-16 19:18:29
 * @LastEditTime: 2020-04-16 20:00:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/updateContent.ts
 */

import {getBaaSF, isArray, cloneDeep} from './utils/utils'
import {IUpdateParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, UPDATE_METHORD} from './constants/constants'
import {UPDATE_ERROR, METHOD_NOT_SUPPORT} from './constants/error'



function fetchUpdateContent(contentGroupID: number, richTextID: number, params: IUpdateParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject)=>{
        let MyContent = new BaaS_F.Content(contentGroupID)
        let records = MyContent.getWithoutData(richTextID)
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
    throw new Error(`minapp.updateCategory ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.updateCategory ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
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
      
      BaaS_F.put(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/text/${richTextID}/`, updata).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })
  
}


export default fetchUpdateContent