/*
 * @Author: your name
 * @Date: 2020-04-16 19:18:29
 * @LastEditTime: 2020-04-16 20:00:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/updateContent.ts
 */

import {getBaaSF} from './utils/utils'
import {IUpdateParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import updateTrans from './utils/updateTrans'



function fetchUpdateContent(contentGroupID: number, richTextID: number, params: IUpdateParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()
  
  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let MyContent = new BaaS_F.Content(contentGroupID)
        let records = updateTrans(params, MyContent.getWithoutData(richTextID), minapp)
        records.update().then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      }
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.updateContent ${METHOD_NOT_SUPPORT}`)
    }

    

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let updata:any = updateTrans(params, {}, minapp) 
      BaaS_F.put(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/text/${richTextID}/`, updata).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.updateContent ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchUpdateContent