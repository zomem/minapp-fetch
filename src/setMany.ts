/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/setOneMany.ts
 */ 

import { getBaaSF, changeSetManyParams } from './utils/utils'
import {TTable, ISetParams, ISetManyQuery} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'


function fetchSetMany(table: TTable, params: ISetParams, query: ISetManyQuery = {}): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  
  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let MyTableObject = new BaaS_F.TableObject(table)
      MyTableObject.createMany(changeSetManyParams(params), {enableTrigger: query.enableTrigger === undefined ? true : query.enableTrigger}).then((res: any) => {
        resolve(res.data.succeed)
      }, (err: any) => {
        //err 为 HError 对象
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.setMany ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/?enable_trigger=${query.enableTrigger === undefined ? true : query.enableTrigger}`,
        headers: options.Header,
        data: changeSetManyParams(params)
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.post(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/?enable_trigger=${query.enableTrigger === undefined ? true : query.enableTrigger}`, changeSetManyParams(params)).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.setMany ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchSetMany