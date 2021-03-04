/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:50:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/file/deleteFile.ts
 */ 

import { getBaaSF, isArray } from './utils/utils'
import {PLATFORM_NAME, PLATFORM_NAME_BAAS, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'

//
function fetchDeleteFile(fileIDs: string | string[]): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject) => {
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let MyFile = new BaaS_F.File()
      MyFile.delete(fileIDs).then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    }

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      if(isArray(fileIDs)){
        BaaS_F({
          method: 'delete',
          url: `${options.RequestBase}/hserve/v2.2/uploaded-file/`,
          headers: options.Header,
          data: {
            id__in: (fileIDs || []).toString()
          }
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }else{
        BaaS_F({
          method: 'delete',
          url: `${options.RequestBase}/hserve/v2.2/uploaded-file/${fileIDs}/`,
          headers: options.Header
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }
    }

    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        throw new Error(`minapp.deleteFile ${METHOD_NOT_SUPPORT}`)
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        BaaS_F.deleteFile({
          fileList: isArray(fileIDs) ? fileIDs : [fileIDs]
        }).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
    }
    

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      if(isArray(fileIDs)){
        BaaS_F.delete('https://cloud.minapp.com/userve/v2.2/file/', {
          params: {
            id__in: (fileIDs || []).toString(),
          }
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }else{
        BaaS_F.delete(`https://cloud.minapp.com/userve/v2.2file/${fileIDs}/`)
        .then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.deleteFile ${METHOD_NOT_SUPPORT}`)
    }

  })
}

export default fetchDeleteFile