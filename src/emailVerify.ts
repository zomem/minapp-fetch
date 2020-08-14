
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'


//
function fetchEmailVerify(): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    return new Promise<any>((resolve, reject)=>{
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
    })
  }else{
    throw new Error(`minapp.emailVerify ${METHOD_NOT_SUPPORT}`)
  }
}

export default fetchEmailVerify