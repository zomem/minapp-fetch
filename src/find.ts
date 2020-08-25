
import { getBaaSF, isArray } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR} from './constants/error'
import {TTable, ICheckParams, IFindRes} from './types'
import findTrans from './utils/findTrans'


function fetchFind(table: TTable, params: ICheckParams): Promise<IFindRes>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise<IFindRes>((resolve, reject)=>{

    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let QQ = findTrans(params, BaaS_F, minapp)
      let Product = new BaaS_F.TableObject(table)
      Product.setQuery(QQ).limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).orderBy(params.orderBy || '-created_at').select(params.select || []).expand(params.expand || []).find({withCount: params.withCount || false}).then((res: IFindRes) => {
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
        let QQ = findTrans(params, BaaS_F, minapp)
        let sortObj = {}
        if(params.orderBy){
          if(isArray(params.orderBy)){
            let temp = params.orderBy as string[]
            for(let i = 0; i < temp.length; i++){
              if(temp[i][0] === '-'){
                sortObj[temp[i].substring(1, temp[i].length)] = -1
              }else{
                sortObj[temp[i]] = 1
              }
            }
          }else{
            let temp = params.orderBy as string
            if(temp[0] === '-'){
              sortObj[temp.substring(1, temp.length)] = -1
            }else{
              sortObj[temp] = 1
            }
          }
        }
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          db.collection(table).find(QQ)
          .limit(params.limit || 20)
          .skip((params.limit || 20) * ((params.page || 1) - 1))
          .sort(sortObj).toArray(function(err, res) {
            if (err) reject(err)
            client.close()
            resolve({data: {objects: res}})
          })
        })
      }

      if(minapp === PLATFORM_NAME.WX_WEAPP || minapp === PLATFORM_NAME.WX_CLOUD){
        //微信云
        let QQ = findTrans(params, BaaS_F, minapp)
        let tempCheck = BaaS_F.minappDB.collection(table).where(QQ)
        .limit(params.limit || 20)
        .skip((params.limit || 20) * ((params.page || 1) - 1))
        
        if(params.orderBy){
          if(isArray(params.orderBy)){
            let temp = params.orderBy as string[]
            for(let i = 0; i < temp.length; i++){
              if(temp[i][0] === '-'){
                tempCheck.orderBy(temp[i].substring(1, temp[i].length), 'desc')
              }else{
                tempCheck.orderBy(temp[i], 'asc')
              }
            }
          }else{
            let temp = params.orderBy as string
            if(temp[0] === '-'){
              tempCheck.orderBy(temp.substring(1, temp.length), 'desc')
            }else{
              tempCheck.orderBy(temp, 'asc')
            }
          }
        }
        
        tempCheck.get().then(res => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }
    }

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let QQ = findTrans(params, BaaS_F, minapp)
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/table/${table}/record/`,
        headers: options.Header,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          order_by: params.orderBy || '-created_at',
          expand: (params.expand || []).toString(),
          keys: (params.select || []).toString(),
          return_total_count: params.withCount ? 1 : 0,
        },
      }).then((res: IFindRes) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    }

    //op
    if(minapp === PLATFORM_NAME.ZX_OP){
      let QQ = findTrans(params, BaaS_F, minapp)
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/`,{
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          order_by: params.orderBy || '-created_at',
          expand: (params.expand || []).toString(),
          return_total_count: params.withCount ? 1 : 0,
        }
      }).then((res: IFindRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
  })
}


export default fetchFind