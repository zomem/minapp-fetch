
import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, METHOD_NOT_SUPPORT} from './constants/error'
import {ICheckParams, IFindRes} from './types'
import findTrans from './utils/findTrans'

function fetchFindContent(contentGroupID: number, params: ICheckParams): Promise<IFindRes>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise<IFindRes>((resolve, reject)=>{
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let QQ = findTrans(params, BaaS_F, minapp)
      let MyContentGroup: any = null
      MyContentGroup = new BaaS_F.ContentGroup(contentGroupID)
      // 
      MyContentGroup.setQuery(QQ).limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).orderBy(params.orderBy || '-created_at').select(params.select || []).expand(params.expand || []).find({withCount: params.withCount || false}).then((res: IFindRes) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.findContent ${METHOD_NOT_SUPPORT}`)
    }

    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let QQ = findTrans(params, BaaS_F, minapp)
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/content/detail/`,
        headers: options.Header,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          order_by: params.orderBy || '-created_at',
          expand: (params.expand || []).toString(),
          keys: (params.select || []).toString(),
          return_total_count: params.withCount ? 1 : 0,
          content_group_id: contentGroupID,
        },
      }).then((res: IFindRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let QQ = findTrans(params, BaaS_F, minapp)
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/content/${contentGroupID}/text/`,{
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
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.findContent ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchFindContent