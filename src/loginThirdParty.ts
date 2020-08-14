
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {TLoginThirdProvider, ILoginParams} from './types'


function fetchLoginThirdParty(provider: TLoginThirdProvider, authPageUrl: string, params: ILoginParams){
  let {BaaS_F, minapp} = getBaaSF()

  switch(minapp){
    case PLATFORM_NAME.WEB:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.loginWithThirdParty(provider, authPageUrl, params).then((user: any) => {
          resolve(user)
        }).catch((err: any) => {
          reject(err)
        })
      })
    default:
      throw new Error(`minapp.loginThirdParty ${METHOD_NOT_SUPPORT}`)
  }
}

export default fetchLoginThirdParty