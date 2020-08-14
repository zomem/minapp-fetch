/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/setOneMany.ts
 */ 

import { getBaaSF, changeSetManyParams } from './utils/utils'
import {TTable, ISetParams} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'


function fetchSetOneMany(table: TTable, params: ISetParams, isTrigger?: boolean): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    return new Promise<any>((resolve, reject)=>{
      let MyTableObject = new BaaS_F.TableObject(table)
      MyTableObject.createMany(changeSetManyParams(params), {enableTrigger: isTrigger || false}).then((res: any) => {
        resolve(res.data.succeed)
      }, (err: any) => {
        //err 为 HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.2/table/${table}/record/`,
        headers: options.Header,
        data: changeSetManyParams(params)
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    })
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
      BaaS_F.post(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/`, changeSetManyParams(params)).then((res: any) => {
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

export default fetchSetOneMany