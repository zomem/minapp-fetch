
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {IGetTableListParams} from './types'

function fetchGetTableList(params: IGetTableListParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject)=>{
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
      })
    }
    throw new Error(`minapp.getTableList ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.getTableList ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }

      
  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })
  
}

export default fetchGetTableList