/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/set.ts
 */ 

import { getBaaSF, changeSetParams } from './utils/utils'
import {TTable, ISetParams, IUpdateSetRes, ISetQuery} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'



function fetchSet(table: TTable, params: ISetParams = {}, query: ISetQuery = {}): Promise<IUpdateSetRes>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise<IUpdateSetRes>((resolve, reject)=>{

    //知晓云 BaaS端
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let Product = new BaaS_F.TableObject(table)
      let product = Product.create()
      product.set(changeSetParams(params)).save(query).then((res: IUpdateSetRes) => {
        // success
        resolve(res)
      }, (err: any) => {
        reject(err)
      })
    }

    //Mongo类平台
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          db.collection(table).insertOne(changeSetParams(params), (err, res) => {
            if(err) reject(err)
            client.close()
            resolve({data: res})
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        let db = BaaS_F.database()
        db.collection(table).add({
          data: changeSetParams(params)
        }).then(res => {
          resolve({data: {id: res._id}})
        }, (err: any) => {
          reject(err)
        })
      }
      if(minapp === PLATFORM_NAME.UNI_CLOUD){
        let db = BaaS_F.database()
        db.collection(table).add(changeSetParams(params)).then(res => {
          resolve({data: {id: res.id}})
        }, (err: any) => {
          reject(err)
        })
      }
    }
      
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/?expand=${(query.expand || []).toString()}`,
        headers: options.Header,
        data: changeSetParams(params)
      }).then((res: IUpdateSetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.post(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/?expand=${(query.expand || []).toString()}`, changeSetParams(params)).then((res: IUpdateSetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
  })
}


export default fetchSet