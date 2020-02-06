
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

//
function fetchDeleteFile(fileIDs: string | string[]){
  let BaaS_F = getBaaSF(ArgsObj)

  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }

  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    return new Promise((resolve, reject) => {
      let MyFile = new BaaS_F.File()
      MyFile.delete(fileIDs).then((res: any) => {
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
    return new Promise((resolve, reject) => {
      if(Array.isArray(fileIDs)){
        BaaS_F({
          method: 'delete',
          url: `${ArgsObj.RequestBase}/hserve/v2.2/uploaded-file/`,
          headers: {
            'X-Hydrogen-Client-ID': ArgsObj.ClientID,
            'Authorization': `Hydrogen-r1 ${ArgsObj.AccessToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            id__in: (fileIDs || []).toString()
          }
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }else{
        BaaS_F({
          method: 'delete',
          url: `${ArgsObj.RequestBase}/hserve/v2.2/uploaded-file/${fileIDs}/`,
          headers: {
            'X-Hydrogen-Client-ID': ArgsObj.ClientID,
            'Authorization': `Hydrogen-r1 ${ArgsObj.AccessToken}`,
            'Content-Type': 'application/json',
          }
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject) => {
      if(Array.isArray(fileIDs)){
        BaaS_F.delete('https://cloud.minapp.com/userve/v2.2/file/', {
          params: {
            id__in: (fileIDs || []).toString(),
          }
        }).then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }else{
        BaaS_F.delete(`https://cloud.minapp.com/userve/v2.2file/${fileIDs}/`)
        .then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }
    })
  }
}


function initFetchDeleteFile(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchDeleteFile
}

export default initFetchDeleteFile