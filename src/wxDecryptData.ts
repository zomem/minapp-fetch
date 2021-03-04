
import { getBaaSF } from './utils/utils'
import {TWxDecryptType} from './index'
import {PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'



function fetchWxDecryptData(encryptedData: string, iv: string, type: TWxDecryptType): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise((resolve, reject)=>{
    if(minapp === PLATFORM_NAME.ZX_WEAPP){
      BaaS_F.wxDecryptData(encryptedData, iv, type).then((decrytedData: any) =>  {
        resolve(decrytedData)
      }, (err: any) => {
        reject(err)
      })
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.wxDecryptData ${METHOD_NOT_SUPPORT}`)
    }

    
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.wxDecryptData ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchWxDecryptData