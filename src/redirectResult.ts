
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'


function fetchRedirectResult(){
  let {BaaS_F, minapp} = getBaaSF()

  switch(minapp){
    case PLATFORM_NAME.WEB:
      return new Promise((resolve, reject)=>{
        BaaS_F.auth.getRedirectResult().then((user: any) => {
          resolve(user)
        }).catch((err: any) => {
          reject(err)
        })
      })
    default:
      throw new Error(`minapp.redirectResult ${METHOD_NOT_SUPPORT}`)
  }
}

export default fetchRedirectResult