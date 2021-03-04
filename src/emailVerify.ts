
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'


//
function fetchEmailVerify(): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject)=>{
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'post',
        url: `${options.RequestBase}/hserve/v2.0/user/email-verify/`,
        headers: options.Header
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }



    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.emailVerify ${METHOD_NOT_SUPPORT}`)
    }

    
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.emailVerify ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchEmailVerify