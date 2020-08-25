
import { getBaaSF } from './utils/utils'
import {TTable, TSubEvent, TSubUnionID} from './types'
import {PLATFORM_NAME, PLATFORM_ALL} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'

function fetchUnsubscribe(table: TTable, event: TSubEvent, sid?: TSubUnionID){
  let {minapp} = getBaaSF()
  switch (minapp) {
    case PLATFORM_NAME.ZX_ALIPAY:
      if(!my[`${table}_${event}_${sid || '0'}`]) return
      if(!my[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      my[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_JD:
      if(!jd[`${table}_${event}_${sid || '0'}`]) return
      if(!jd[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      jd[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_QQ:
      if(!qq[`${table}_${event}_${sid || '0'}`]) return
      if(!qq[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      qq[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_RN:
      if(!global[`${table}_${event}_${sid || '0'}`]) return
      if(!global[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      global[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_SWAN:
      if(!swan[`${table}_${event}_${sid || '0'}`]) return
      if(!swan[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      swan[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_TT:
      if(!tt[`${table}_${event}_${sid || '0'}`]) return
      if(!tt[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      tt[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_WEAPP:
      if(!wx[`${table}_${event}_${sid || '0'}`]) return
      if(!wx[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      wx[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.ZX_WEB:
      if(!window[`${table}_${event}_${sid || '0'}`]) return
      if(!window[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      window[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    default:
      if(PLATFORM_ALL.indexOf(minapp) === -1){
        throw new Error(`minapp.unsubscribe ${METHOD_NOT_SUPPORT}`)
      }
  }

}

export default fetchUnsubscribe