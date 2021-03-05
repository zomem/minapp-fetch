/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:58:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/update.ts
 */ 

import { getBaaSF, mysqlConnect, isNumber } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME_MYSQL_SERVER } from './constants/constants'
import { WEBAPI_OPTIONS_ERROR } from './constants/error'
import {IUpdateParams, TTable, IUpdateRes, IUpdateQuery, TSentence} from './index'
import updateTrans from './utils/updateTrans'


function fetchUpdate(table: TTable, id: string | number, params: IUpdateParams, query?: IUpdateQuery): Promise<IUpdateRes>
function fetchUpdate(table: TTable, id: string | number, params: IUpdateParams, query: TSentence): Promise<string>
function fetchUpdate(table: TTable, id: string | number, params: IUpdateParams = {}, query?: IUpdateQuery | TSentence): Promise<IUpdateRes | string>{
  let {BaaS_F, minapp, options} = getBaaSF()

  let tempQuery = (query === 'sentence' || !query) ? {} : query

  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let Product = new BaaS_F.TableObject(table)
      let records = updateTrans(params, Product.getWithoutData(id), minapp)
      records.update(query).then((res: IUpdateRes) => {
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
          let tempID = id as string
          let records = updateTrans(params, {}, minapp)
          let tempId = (hex.test(tempID)) ? BaaS_F.ObjectID(tempID) : tempID
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
        let tempID = id as string
        db.collection(table).doc(tempID).update({
          data: updata
        }).then(res => {
          resolve({data: {id: tempID, _updated: res.stats.updated}})
        }, (err: any) => {
          reject(err)
        })
      }
      if(minapp === PLATFORM_NAME.UNI_CLOUD){
        let db = BaaS_F.database()
        let dbCommand = db.command
        let tempID = id as string
        let updata: any = updateTrans(params, dbCommand, minapp)
        db.collection(table).doc(id).update(updata).then(res => {
          resolve({data: {id: tempID, _updated: res.updated}})
        }, (err: any) => {
          reject(err)
        })
      }
    }



    //mysql类
    if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MYSQL){
        let updata: any = updateTrans(params, [], minapp)
        let sql = `UPDATE ${table} SET ${updata.toString()} WHERE id = ${isNumber(id) ? id : `'${id}'`}`
        if(query === 'sentence'){
          resolve(sql)
          return
        }
        mysqlConnect({BaaS_F, options}, sql, [], (err, results, fields) => {
          if (err) {
            reject({err})
          }
          let jsonStr = JSON.stringify(results || {})
          resolve({data: JSON.parse(jsonStr)})
        })
      }
    }
      


    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let updata: any = updateTrans(params, {}, minapp)
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'put',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/${id}/?enable_trigger=${tempQuery.enableTrigger || false}&expand=${(tempQuery.expand || []).toString()}`,
        headers: options.Header,
        data: updata
      }).then((res: IUpdateRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let updata:any = updateTrans(params, {}, minapp)
      BaaS_F.put(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/${id}/?enable_trigger=${tempQuery.enableTrigger || false}&expand=${(tempQuery.expand || []).toString()}`, updata).then((res: IUpdateRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
  })
}


export default fetchUpdate