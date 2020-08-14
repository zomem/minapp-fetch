
import { getBaaSF } from './utils/utils'
import {TTable, TSubEvent, TSubUnionID, ISubRes, ISubCallBack} from './types'
import {PLATFORM_NAME} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'


function fetchSubscribe(table: TTable, event: TSubEvent, callback: ISubCallBack, sid?: TSubUnionID){
  let {BaaS_F, minapp} = getBaaSF()
  let Product = new BaaS_F.TableObject(table)
  
  let tempRes: ISubRes = {
    after: {},
    before: {},
    event: 'on_init',
    schema_id: 0,
    schema_name: '',
    id: ''
  }

  let tempErr: any = ''

  switch (minapp) {
    case PLATFORM_NAME.ALIPAY:
      my[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.JD:
      jd[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.QQ:
      qq[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.RN:
      global[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.SWAN:
      swan[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.TT:
      tt[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.WEAPP:
      wx[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    case PLATFORM_NAME.WEB:
      window[`${table}_${event}_${sid || '0'}`] = Product.subscribe(event, {
        oninit: () => {
          tempRes.event = 'on_init'
          callback(tempRes, tempErr)
        },
        onevent: (res: any) => {
          tempRes = res
          callback(tempRes, tempErr)
        },
        onerror: (err: any) => {
          tempErr = err
          tempRes.event = 'on_error'
          callback(tempRes, tempErr)
        },
      })
      break
    default:
      throw new Error(`minapp.subscribe ${METHOD_NOT_SUPPORT}`)
  }
}

export default fetchSubscribe