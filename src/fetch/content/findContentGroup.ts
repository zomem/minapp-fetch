
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

function fetchFindContentGroup(params:{
  page?: number
  limit?: number
  withCount?: boolean
} = {}){
  let BaaS_F = getBaaSF(ArgsObj)

  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }

  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    return new Promise((resolve, reject)=>{
      BaaS_F.ContentGroup.find({
        withCount: params.withCount || false,
        offset: (params.limit || 20) * ((params.page || 1) - 1),
        limit: params.limit || 20
      }).then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        // err
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    return new Promise((resolve, reject)=>{
      BaaS_F({
        method: 'get',
        url: `${ArgsObj.RequestBase}/hserve/v2.2/content/group/`,
        headers: {
          'X-Hydrogen-Client-ID': ArgsObj.ClientID,
          'Authorization': `Hydrogen-r1 ${ArgsObj.AccessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          return_total_count: params.withCount ? 1 : 0,
        },
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject)=>{
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.2/content/`, {
        params: {
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          return_total_count: params.withCount ? 1 : 0,
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    })
  }
}


function initFetchFindContentGroup(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchFindContentGroup
}

export default initFetchFindContentGroup