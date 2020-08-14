
import { getBaaSF } from './utils/utils'
import {TWxDecryptType} from './types'
import {PLATFORM_NAME} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'



function fetchWxDecryptData(encryptedData: string, iv: string, type: TWxDecryptType): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  if(minapp === PLATFORM_NAME.WEAPP){
    return new Promise<any>((resolve, reject)=>{
      BaaS_F.wxDecryptData(encryptedData, iv, type).then((decrytedData: any) =>  {
        resolve(decrytedData)
      }, (err: any) => {
        reject(err)
      })
    })
  }else{
    throw new Error(`minapp.wxDecryptData ${METHOD_NOT_SUPPORT}`)
  }
}


export default fetchWxDecryptData