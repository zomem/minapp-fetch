/*
 * @Author: your name
 * @Date: 2020-04-16 19:16:57
 * @LastEditTime: 2020-04-16 19:36:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/setContent.ts
 */
import {getBaaSF} from './utils/utils'
import {ISetContentParams} from './index'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'


function fetchSetContent(contentGroupID: number, params: ISetContentParams={}): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise((resolve: any, reject: any)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let MyContent = new BaaS_F.Content(contentGroupID)
        let content = MyContent.create()
        content.set(params).save().then((res: any) => {
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
      throw new Error(`minapp.setContent ${METHOD_NOT_SUPPORT}`)
    }

    

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.post(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/text/`, params).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.setContent ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchSetContent