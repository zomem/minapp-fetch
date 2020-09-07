
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {ISendEmailParams} from './types'


function fetchSendEmail(params: ISendEmailParams={}): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise<any>((resolve, reject) => {
    if(minapp === PLATFORM_NAME.ZX_CLOUD){
      BaaS_F.sendEmail(params).then((res: any) => {
        // 发送成功
        resolve(res)
      }, (err: any) => {
        // 发送失败
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.sendEmail ${METHOD_NOT_SUPPORT}`)
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.sendEmail ${METHOD_NOT_SUPPORT}`)
    }

    
  })
}


export default fetchSendEmail