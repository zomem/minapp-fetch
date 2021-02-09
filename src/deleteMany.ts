import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'
import {IDeleteParams, TTable} from './types'
import findTrans from './utils/findTrans'



function fetchDeleteMany(table: TTable, params: IDeleteParams): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise<any>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      let Product = new BaaS_F.TableObject(table)
      Product.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).delete(QQ, {
        enableTrigger: params.enableTrigger === undefined ? true : params.enableTrigger,
        withCount: params.withCount || false
      }).then((res: any) => {
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
        let QQ = findTrans(params, 1, BaaS_F, minapp)
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          db.collection(table).deleteMany(QQ, (err, res) => {
            if(err) reject(err)
            client.close()
            resolve({deletedCount: res.deletedCount})
          })
        })
      }
      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        //微信云
        let QQ = findTrans(params, 1, BaaS_F, minapp)
        let db = BaaS_F.database()
        db.collection(table).where(QQ).remove().then(res => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
    }

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'delete',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/`,
        headers: options.Header,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          enable_trigger: params.enableTrigger === undefined ? true : params.enableTrigger,
          return_total_count: params.withCount ? 1 : 0,
        },
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      BaaS_F({
        method: 'delete',
        url: `https://cloud.minapp.com/userve/v2.4/table/${table}/record/`,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          enable_trigger: params.enableTrigger === undefined ? true : params.enableTrigger,
          return_total_count: params.withCount ? 1 : 0,
        },
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.deleteMany ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchDeleteMany