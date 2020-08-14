/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:53:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/file/getFile.ts
 */ 

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'
import {IGetFileRes} from './types'

//
function fetchGetFile(fileID: string): Promise<IGetFileRes>{
  let { BaaS_F, minapp, options } = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<IGetFileRes>((resolve, reject)=>{
      let MyFile = new BaaS_F.File()
      MyFile.get(fileID).then((res: IGetFileRes) => {
        // success
        resolve(res)
      }, (err: any) => {
        // HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<IGetFileRes>((resolve, reject)=>{
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
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<IGetFileRes>((resolve, reject)=>{
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/file/${fileID}/`).then((res: IGetFileRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  return new Promise<IGetFileRes>((resolve, reject)=>{
    resolve({
      data: {
        categories: [{
          id: '',
          name: '',
        }],
        cdn_path: '',
        created_at: 0,
        id: '',
        media_type: '',
        mime_type: '',
        name: '',
        path: '',
        size: 0,
        status: '',
      }
    })
  })
}

export default fetchGetFile