/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:47:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/count.ts
 */ 
import fetchFind from './find'
import {TTable, ICountParams, IFindRes} from './types'
import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME, PLATFORM_ALL} from './constants/constants'
import findTrans from './utils/findTrans'

function fetchCount(table: TTable, params: ICountParams): Promise<number>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<number>((resolve, reject)=>{

    //Mongo类平台
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        let QQ = findTrans(params, BaaS_F, minapp)
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          db.collection(table).find(QQ).count((err, res) => {
            if (err) reject(err)
            client.close()
            resolve(res)
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP 
        || minapp === PLATFORM_NAME.WX_CLOUD
        || minapp === PLATFORM_NAME.UNI_CLOUD
      ){
        //微信云
        let QQ = findTrans(params, BaaS_F, minapp)
        let db = BaaS_F.database()
        db.collection(table).where(QQ).count().then(res => {
          resolve(res.total)
        }, (err: any) => {
          reject(err)
        })
      }
    }else{
      params.limit = 1
      params.withCount = true
      fetchFind(table, params).then((res: IFindRes) => {
        let num: number = 0
        if(res.data.meta.total_count) num = res.data.meta.total_count
        resolve(num)
      }, err=>{
        reject(err)
      })
    }
  })
}


export default fetchCount