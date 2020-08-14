
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {ISendEmailParams} from './types'


function fetchSendEmail(params: ISendEmailParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  if(minapp === PLATFORM_NAME.CLOUD){
    return new Promise<any>((resolve, reject) => {
      BaaS_F.sendEmail(params).then((res: any) => {
        // 发送成功
        resolve(res)
      }, (err: any) => {
        // 发送失败
        reject(err)
      })
    })
  }else{
    throw new Error(`minapp.sendEmail ${METHOD_NOT_SUPPORT}`)
  }
  
}


export default fetchSendEmail