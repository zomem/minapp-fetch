/*
 * @Author: your name
 * @Date: 2020-01-24 11:03:54
 * @LastEditTime: 2020-06-06 08:49:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/fetch/data/delete.ts
 */

import { getBaaSF, mysqlConnect } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME_MYSQL_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'
import {TTable, IDeleteQuery, IDeleteRes} from './types'


function fetchDeleteOne(table: TTable, id: string, query: IDeleteQuery = {}): Promise<IDeleteRes | string>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let Product = new BaaS_F.TableObject(table)
      Product.delete(id).then((res: any) => {
        // success
        resolve({data: res})
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
          let tempId = (hex.test(id)) ? BaaS_F.ObjectID(id) : id
          db.collection(table).deleteOne({_id: tempId}, (err, res) => {
            if(err) reject(err)
            client.close()
            resolve({data: res})
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        //微信云
        let db = BaaS_F.database()
        db.collection(table).doc(id).remove().then(res => {
          resolve({data: res})
        }, (err: any) => {
          reject(err)
        })
      }
    }



    //mysql类
    if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MYSQL){
        let sql = ''
        sql = `DELETE `
        + `FROM ${table} `
        + `WHERE id = ${id}`
        if(query.getSentence){
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
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'delete',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/${id}/`,
        headers: options.Header
      }).then((res: any) => {
        resolve({data: res})
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.delete(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/${id}/`).then((res: any) => {
        resolve({data: res})
      }).catch((err: any) => {
        reject(err)
      })
    }

    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.deleteOne ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchDeleteOne