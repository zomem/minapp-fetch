
import { getBaaSF } from './utils/utils'
import {PLATFORM_NAME} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'
import {ISubMessage} from './types'


function fetchSubscribeMessage(subscription: ISubMessage[]){
  let {BaaS_F, minapp} = getBaaSF()

  if(minapp === PLATFORM_NAME.WEAPP){
    return new Promise((resolve, reject)=>{
      BaaS_F.subscribeMessage(subscription).then((res: any) => {
        // success
        resolve(res)
      }, (err: any) => {
        //err 为 HError 对象
        reject(err)
      })
    })
  }else{
    throw new Error(`minapp.subscribeMessage ${METHOD_NOT_SUPPORT}`)
  }
}


export default fetchSubscribeMessage