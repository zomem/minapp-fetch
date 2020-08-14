/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/set.ts
 */ 

import { getBaaSF, changeSetParams } from './utils/utils'
import {TTable, ISetParams, IUpdateSetRes} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'



function fetchSet(table: TTable, params: ISetParams): Promise<IUpdateSetRes>{
  let {BaaS_F, minapp, options} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<IUpdateSetRes>((resolve, reject)=>{
      let Product = new BaaS_F.TableObject(table)
      let product = Product.create()
      product.set(changeSetParams(params)).save().then((res: IUpdateSetRes) => {
        // success
        resolve(res)
      }, (err: any) => {
        //err 为 HError 对象
        reject(err)
      })
    })
  }
  

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<IUpdateSetRes>((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.2/table/${table}/record/`,
        headers: options.Header,
        data: changeSetParams(params)
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
      BaaS_F.post(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/`, changeSetParams(params)).then((res: IUpdateSetRes) => {
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


export default fetchSet