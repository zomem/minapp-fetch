/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/setOneMany.ts
 */ 

import { getBaaSF, changeSetManyParams, mysqlConnect, isArray } from './utils/utils'
import {TTable, ISetParams, ISetManyQuery} from './types'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME_MYSQL_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT, SET_MANY_PARAMS_ARR_ERROR} from './constants/error'
import setTrans from './utils/setTrans'


function fetchSetMany(table: TTable, params: ISetParams[], query: ISetManyQuery = {}): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  if(!isArray(params)) throw new Error(SET_MANY_PARAMS_ARR_ERROR)
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
      if(minapp === PLATFORM_NAME.MONGODB){
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          db.collection(table).insertMany(changeSetManyParams(params), {ordered: false}, (err, res) => {
            if(err) reject(err)
            client.close()
            resolve({data: res})
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        throw new Error(`minapp.setMany ${METHOD_NOT_SUPPORT}`)
      }
    }



    //mysql类
    if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MYSQL){
        let fields = []
        let values = []
        for(let i = 0; i < params.length; i++){
          let tempSet: any = setTrans(params[i], {}, minapp)
          if(i === 0) fields = tempSet.fieldsArr
          values.push(`(${tempSet.valuesArr.toString()})`)
        }

        let sql = `INSERT INTO ${table}(${fields.toString()}) VALUES ${values.toString()}`
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