/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:52:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/get.ts
 */ 

import {getBaaSF, isArray, mysqlConnect, isNumber} from './utils/utils'
import {IGetRes, TTable, IGetQuery, TSentence} from './index'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME, PLATFORM_NAME_MYSQL_SERVER, J_NAME_LIST} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'


function fetchGet(table: TTable, id: string | number, query?: IGetQuery): Promise<IGetRes>
function fetchGet(table: TTable, id: string | number, query: TSentence): Promise<string>
function fetchGet(table: TTable, id: string | number, query?: IGetQuery | TSentence): Promise<IGetRes | string>{
  let {BaaS_F, minapp, options} = getBaaSF()

  let tempQuery = (query === 'sentence' || !query) ? {} : query

  return new Promise((resolve, reject)=>{

    //BaaS
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let Product = new BaaS_F.TableObject(table)
      Product.select(tempQuery.select || []).expand(tempQuery.expand || []).get(id).then((res: IGetRes) => {
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
          let tempID = id as string
          let tempId = (hex.test(tempID)) ? BaaS_F.ObjectID(tempID) : tempID
          db.collection(table).findOne({_id: tempId}, (err, res) => {
            if(err) reject(err)
            client.close()
            resolve({data: res})
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        //微信云
        let db = BaaS_F.database()
        db.collection(table).doc(id).get().then(res => {
          resolve({data: {id: res.data._id, ...res.data}})
        }, (err: any) => {
          reject(err)
        })
      }
      if(minapp === PLATFORM_NAME.UNI_CLOUD){
        let db = BaaS_F.database()
        db.collection(table).doc(id).get().then(res => {
          resolve({
            data: {id: res.data[0]._id, ...res.data[0]}
          })
        }, (err: any) => {
          reject(err)
        })
      }
    }


    //mysql类
    if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MYSQL){
        let selectArr = []
        if(tempQuery.select){
          if (isArray(tempQuery.select)){
            let tempPa = tempQuery.select as string[]
            selectArr = tempPa.length > 0 ? tempPa : ['*']
          }else{
            let tempPa2 = tempQuery.select as string
            selectArr = [tempPa2]
          }
        }else{
          selectArr = ['*']
        }

        let sql = ''
        sql = `SELECT ${selectArr.length > 0 ? selectArr.toString() + ' ' : '* '}`
        + `FROM ${table} `
        + `WHERE id = ${isNumber(id) ? id : `'${id}'`}`
        if(query === 'sentence'){
          resolve(sql)
          return
        }
        mysqlConnect({BaaS_F, options}, sql, [], (err, results, fields) => {
          if (err) {
            reject({err})
          }
          let jsonStr = JSON.stringify(results || [{}])
          resolve({data: JSON.parse(jsonStr)[0]})
        })
      }
    }


    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/${id}/`,
        headers: options.Header,
        params: {
          expand: (tempQuery.expand || []).toString(),
          keys: (tempQuery.select || []).toString(),
        }
      }).then((res: IGetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

     //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/${id}/`, {
        params: {
          expand: (tempQuery.expand || []).toString(),
          keys: (tempQuery.select || []).toString(),
        }
      }).then((res: IGetRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
  })
}

export default fetchGet