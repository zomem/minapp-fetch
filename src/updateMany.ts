
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME, PLATFORM_NAME_BAAS, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'
import {TTable, IUpdateManyParams} from './index'
import updateTrans from './utils/updateTrans'
import findTrans from './utils/findTrans'


function fetchUpdateMany(table: TTable, params: IUpdateManyParams): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let MyTableObject = new BaaS_F.TableObject(table)
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      let { u } = params
      let records = updateTrans(u, MyTableObject.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).getWithoutData(QQ), minapp)
      records.update({
        expand: (params.expand || []).toString(),
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


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.updateMany ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      let { u } = params
      let updata = updateTrans(u, {}, minapp)
      
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'put',
        url: `${options.RequestBase}/hserve/v2.4/table/${table}/record/`,
        headers: options.Header,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          expand: (params.expand || []).toString(),
          enable_trigger: params.enableTrigger === undefined ? true : params.enableTrigger,
          return_total_count: params.withCount ? 1 : 0,
        },
        data: updata
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      let { u } = params
      let updata = updateTrans(u, {}, minapp)
      
      BaaS_F({
        method: 'put',
        url: `https://cloud.minapp.com/userve/v2.4/table/${table}/record/`,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          expand: (params.expand || []).toString(),
          enable_trigger: params.enableTrigger === undefined ? true : params.enableTrigger,
          return_total_count: params.withCount ? 1 : 0,
        },
        data: updata
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.updateMany ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchUpdateMany