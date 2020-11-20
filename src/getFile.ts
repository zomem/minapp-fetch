/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:53:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/file/getFile.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'
import {IGetFileRes} from './types'

//
function fetchGetFile(fileID: string): Promise<IGetFileRes>{
  let { BaaS_F, minapp, options } = getBaaSF()

  return new Promise<IGetFileRes>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let MyFile = new BaaS_F.File()
      MyFile.get(fileID).then((res: IGetFileRes) => {
        // success
        resolve(res)
      }, (err: any) => {
        // HError 对象
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        throw new Error(`minapp.getFile ${METHOD_NOT_SUPPORT}`)
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        BaaS_F.downloadFile({
          fileID: fileID
        }).then((res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/uploaded-file/${fileID}/`,
        headers: options.Header
      }).then((res: IGetFileRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/file/${fileID}/`).then((res: IGetFileRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.getFile ${METHOD_NOT_SUPPORT}`)
    }

  })
}

export default fetchGetFile