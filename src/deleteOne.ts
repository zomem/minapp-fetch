/*
 * @Author: your name
 * @Date: 2020-01-24 11:03:54
 * @LastEditTime: 2020-06-06 08:49:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/data/delete.ts
 */

import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'
import {TTable} from './types'


function fetchDeleteOne(table: TTable, id: string): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<any>((resolve, reject)=>{
      let Product = new BaaS_F.TableObject(table)
      Product.delete(id).then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'delete',
        url: `${options.RequestBase}/hserve/v2.2/table/${table}/record/${id}/`,
        headers: options.Header
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise((resolve, reject) => {
      BaaS_F.delete(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/${id}/`).then((res: any) => {
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
export default fetchDeleteOne