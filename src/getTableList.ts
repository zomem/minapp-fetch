
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {IGetTableListParams} from './index'

function fetchGetTableList(params: IGetTableListParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let tableSchema = new BaaS_F.TableSchema()
        tableSchema.getSchemaList({
          ...params,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1)
        }).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // HError 对象
          reject(err)
        })
      }
    }
    


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.getTableList ${METHOD_NOT_SUPPORT}`)
    }

    
    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get('https://cloud.minapp.com/userve/v1.8/table/', {
        params: {
          ...params,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1)
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.getTableList ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchGetTableList