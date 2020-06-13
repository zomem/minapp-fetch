/*
 * @Author: your name
 * @Date: 2020-04-16 19:18:53
 * @LastEditTime: 2020-04-16 20:12:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/deleteContent.ts
 */
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { PLATFORM_ERROR, METHOD_NOT_SUPPORT } from '../../constants/error'

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

function fetchDeleteContent(contentGroupID: number, richTextID: number){
  let BaaS_F = getBaaSF(ArgsObj)

  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }

  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      return new Promise((resolve: any, reject: any)=>{
        let MyContent = new BaaS_F.Content(contentGroupID)
        MyContent.delete(richTextID).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      })
    }
    throw new Error(`minapp.deleteCategory ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.deleteCategory ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject) => {
      BaaS_F.delete(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/text/${richTextID}/`).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchDeleteContent(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn'  | 'jd', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchDeleteContent
}

export default initFetchDeleteContent