
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
function fetchCurrentUser(){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    //CLOUD
    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.auth.getCurrentUser().then((user: any) => {
        // user 为 currentUser 对象
        resolve(user)
      }).catch((err: any) => {
        // HError  
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    throw new Error(`minapp.currentUser ${METHOD_NOT_SUPPORT}`)
  }
  
}


function initFetchCurrentUser(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'tt' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchCurrentUser
}

export default initFetchCurrentUser