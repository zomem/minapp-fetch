/*
 * @Author: your name
 * @Date: 2020-04-16 19:18:53
 * @LastEditTime: 2020-04-16 20:12:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/deleteContent.ts
 */

import {getBaaSF} from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'


function fetchDeleteContent(contentGroupID: number, richTextID: number): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise((resolve: any, reject: any)=>{

    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let MyContent = new BaaS_F.Content(contentGroupID)
        MyContent.delete(richTextID).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      }
    }
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.deleteContent ${METHOD_NOT_SUPPORT}`)
    }
    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.delete(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/text/${richTextID}/`).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.deleteContent ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchDeleteContent