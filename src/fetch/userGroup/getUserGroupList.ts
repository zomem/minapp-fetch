
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  RequestBase?: string | undefined
  Header?: {
    'Content-Type'?: string
    'X-Hydrogen-Client-ID'?: string,
    'Authorization'?: string,
    'X-Hydrogen-Env-ID'?: string,
  }
}


function fetchGetUserGroupList(parentID: number | boolean, params: {
  limit?: number
  page?: number
} = {}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      return new Promise((resolve, reject) => {
        let userGroup = new BaaS_F.UserGroup()
        let p = parentID ? { parentID: parentID } : {}
        userGroup.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).getUserGroupList(p).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      })
    }
    throw new Error(`minapp.getUserGroupList ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.getUserGroupList ${METHOD_NOT_SUPPORT}`)
  }
  
  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject) => {
      BaaS_F.get(`https://cloud.minapp.com/userve/v1/user-group/`, {
        params: {
          parent_id: parentID ? parentID : '',
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchGetUserGroupList(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'rn'  | 'jd', {clientID?: string, host?: string, accessToken?: string, env?: string}]){
  ArgsObj = setArgs(args)
  return fetchGetUserGroupList
}

export default initFetchGetUserGroupList