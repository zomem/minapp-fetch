
import { getBaaSF } from './utils/utils'
import {TTable, TSubEvent, TSubUnionID, ISubRes, ISubCallBack} from './index'
import {PLATFORM_NAME, PLATFORM_ALL} from './constants/constants'
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
    case PLATFORM_NAME.ZX_ALIPAY:
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
    case PLATFORM_NAME.ZX_JD:
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
    case PLATFORM_NAME.ZX_QQ:
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
    case PLATFORM_NAME.ZX_RN:
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
    case PLATFORM_NAME.ZX_SWAN:
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
    case PLATFORM_NAME.ZX_TT:
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
    case PLATFORM_NAME.ZX_WEAPP:
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
    case PLATFORM_NAME.ZX_WEB:
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
      if(PLATFORM_ALL.indexOf(minapp) === -1){
        throw new Error(`minapp.subscribe ${METHOD_NOT_SUPPORT}`)
      }
  }
}

export default fetchSubscribe