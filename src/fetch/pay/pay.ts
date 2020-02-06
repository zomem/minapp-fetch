
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { PAY_WAY_ERROR, METHOD_NOT_SUPPORT, PAY_WAY_PLATFORM_ERROR, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

//
function fetchPay(way: 'alipay' | 'weapp' | 'qq' | 'swan', params: {
  gatewayType?: 'weixin_tenpay_wap' | 'weixin_tenpay_native' | 'weixin_tenpay_js' | 'alipay_page' | 'alipay_wap' | 'qpay_native'
  totalCost: number
  merchandiseDescription: string
  merchandiseSchemaID?: number
  merchandiseRecordID?: number
  merchandiseSnapshot?: any
  profitSharing?: boolean
}){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){
    if(ArgsObj.Platform === PLATFORM_NAME.WEB || ArgsObj.Platform === PLATFORM_NAME.DEFAULT){
      let platform = ''
      switch(way){
        case PLATFORM_NAME.ALIPAY:
          platform = 'payWithAlipay'
          break
        case PLATFORM_NAME.WEAPP:
          platform = 'payWithWechat'
          break
        case PLATFORM_NAME.QQ:
          platform = 'payWithQQ'
          break
        default:
          throw new Error(PAY_WAY_ERROR)
      }
      return new Promise((resolve, reject)=>{
        BaaS_F.payment[platform](params).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // HError 对象
          reject(err)
        })
      })
    }
    if(ArgsObj.Platform !== way){
      throw new Error(PAY_WAY_PLATFORM_ERROR + ArgsObj.Platform)
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.pay(params).then((res: any) => {
        // success. 支付请求成功响应，可以在 res 中拿到 transaction_no 和支付结果信息
        resolve(res)
      }, (err: any) => {
        // HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.pay ${METHOD_NOT_SUPPORT}`)
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    throw new Error(`minapp.pay ${METHOD_NOT_SUPPORT}`)
  }
  
}


function initFetchPay(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchPay
}

export default initFetchPay