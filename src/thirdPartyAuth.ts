
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME, PLATFORM_ALL } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'



function fetchThirdPartyAuth(){
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise((resolve, reject)=>{
    switch(minapp){
      case PLATFORM_NAME.ZX_WEB:
        BaaS_F.auth.thirdPartyAuth().then((res: any) => {
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
        break
      default:
        if(PLATFORM_ALL.indexOf(minapp) === -1){
          throw new Error(`minapp.thirdPartyAuth ${METHOD_NOT_SUPPORT}`)
        }
    }
  })
}


export default fetchThirdPartyAuth