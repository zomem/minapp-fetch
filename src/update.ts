/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:58:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/update.ts
 */ 

import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { WEBAPI_OPTIONS_ERROR } from './constants/error'
import {IUpdateParams, TTable, IUpdateSetRes, ISetQuery} from './types'
import updateTrans from './utils/updateTrans'


function fetchUpdate(table: TTable, id: string, params: IUpdateParams={}, query: ISetQuery = {}): Promise<IUpdateSetRes>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<IUpdateSetRes>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let Product = new BaaS_F.TableObject(table)
      let records = updateTrans(params, Product.getWithoutData(id), minapp)
      records.update(query).then((res: IUpdateSetRes) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    }

    //Mongo类平台
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        let hex = /^[a-fA-F0-9]{24}$/
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          if (err) reject(err)
          let records = updateTrans(params, {}, minapp)
          let tempId = (hex.test(id)) ? BaaS_F.ObjectID(id) : id
          db.collection(table).updateOne({_id: tempId}, records, function(err, res) {
            if (err) reject(err)
            client.close()
            resolve({data: res})
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        //微信云
        let db = BaaS_F.database()
        let dbCommand = db.command
        let updata: any = updateTrans(params, dbCommand, minapp)
        db.collection(table).doc(id).update({
          data: updata
        }).then(res => {
          resolve({data: {id: id, _updated: res.stats.updated}})
        }, (err: any) => {
          reject(err)
        })
      }
      if(minapp === PLATFORM_NAME.UNI_CLOUD){
        let db = BaaS_F.database()
        let dbCommand = db.command
        let updata: any = updateTrans(params, dbCommand, minapp)
        db.collection(table).doc(id).update(updata).then(res => {
          resolve({data: {id: id, _updated: res.updated}})
        }, (err: any) => {
          reject(err)
        })
      }
    }

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let updata: any = updateTrans(params, {}, minapp)
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'put',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/${id}/?enable_trigger=${query.enableTrigger || false}&expand=${(query.expand || []).toString()}`,
        headers: options.Header,
        data: updata
      }).then((res: IUpdateSetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let updata:any = updateTrans(params, {}, minapp)
      BaaS_F.put(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/${id}/?enable_trigger=${query.enableTrigger || false}&expand=${(query.expand || []).toString()}`, updata).then((res: IUpdateSetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
  })
}


export default fetchUpdate