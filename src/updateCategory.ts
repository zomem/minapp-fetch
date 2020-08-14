/*
 * @Author: your name
 * @Date: 2020-04-16 19:20:44
 * @LastEditTime: 2020-04-16 19:53:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/content/updateCategory.ts
 */
import {getBaaSF} from './utils/utils'
import {ISetCategoryParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'


function fetchUpdateCategory(contentGroupID: number, categoryID: number, params: ISetCategoryParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve: any, reject: any)=>{
        let MyContentCategory = new BaaS_F.ContentCategory(contentGroupID)
        MyContentCategory.update(categoryID, params).then((res: any) => {
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
      BaaS_F.put(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/category/${categoryID}/`, params).then((res: any) => {
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

export default fetchUpdateCategory