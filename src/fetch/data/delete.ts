
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

function fetchDelete(table: string | number, id: string){
  let BaaS_F = getBaaSF(ArgsObj)

  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }

  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    return new Promise((resolve, reject)=>{
      let Product = new BaaS_F.TableObject(table)
      Product.delete(id).then((res: any) => {
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
        method: 'delete',
        url: `${ArgsObj.RequestBase}/hserve/v2.2/table/${table}/record/${id}/`,
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
    })
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    return new Promise((resolve, reject) => {
      BaaS_F.delete(`https://cloud.minapp.com/userve/v2.2/table/${table}/record/${id}/`)
      .then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchDelete(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchDelete
}

export default initFetchDelete