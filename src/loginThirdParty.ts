
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME, PLATFORM_ALL } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {TLoginThirdProvider, ILoginParams} from './index'


function fetchLoginThirdParty(provider: TLoginThirdProvider, authPageUrl: string, params: ILoginParams){
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise((resolve, reject)=>{
    switch(minapp){
      case PLATFORM_NAME.ZX_WEB:
        BaaS_F.auth.loginWithThirdParty(provider, authPageUrl, params).then((user: any) => {
          resolve(user)
        }).catch((err: any) => {
          reject(err)
        })
        break
      default:
        if(PLATFORM_ALL.indexOf(minapp) === -1){
          throw new Error(`minapp.loginThirdParty ${METHOD_NOT_SUPPORT}`)
        }
    }
  })
}

export default fetchLoginThirdParty