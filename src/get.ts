/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:52:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/get.ts
 */ 

import {getBaaSF} from './utils/utils'
import {IUpdateSetRes, TTable, IGetParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'

function fetchGet(table: TTable, id: string, params: IGetParams): Promise<IUpdateSetRes>{
  let {BaaS_F, minapp, options} = getBaaSF()
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<IUpdateSetRes>((resolve, reject)=>{
      let Product = new BaaS_F.TableObject(table)
      Product.select(params.select || []).expand(params.expand || []).get(id).then((res: IUpdateSetRes) => {
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
    return new Promise<IUpdateSetRes>((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/table/${table}/record/${id}/`,
        headers: options.Header,
        params: {
          expand: (params.expand || []).toString(),
          keys: (params.select || []).toString(),
        }
      }).then((res: IUpdateSetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<IUpdateSetRes>((resolve, reject)=>{
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/${id}/`, {
        params: {
          expand: (params.expand || []).toString(),
          keys: (params.select || []).toString(),
        }
      }).then((res: IUpdateSetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  return new Promise<IUpdateSetRes>((resolve, reject)=>{
    resolve({
      data: {
        created_by: 0,
        created_at: 0,
        updated_at: 0,
        id: ''
      }
    })
  })
  
}

export default fetchGet