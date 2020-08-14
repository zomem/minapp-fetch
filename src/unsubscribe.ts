
import { getBaaSF } from './utils/utils'
import {TTable, TSubEvent, TSubUnionID} from './types'
import {PLATFORM_NAME} from './constants/constants'
import {METHOD_NOT_SUPPORT} from './constants/error'

function fetchUnsubscribe(table: TTable, event: TSubEvent, sid?: TSubUnionID){
  let {minapp} = getBaaSF()
  switch (minapp) {
    case PLATFORM_NAME.ALIPAY:
      if(!my[`${table}_${event}_${sid || '0'}`]) return
      if(!my[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      my[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.JD:
      if(!jd[`${table}_${event}_${sid || '0'}`]) return
      if(!jd[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      jd[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.QQ:
      if(!qq[`${table}_${event}_${sid || '0'}`]) return
      if(!qq[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      qq[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.RN:
      if(!global[`${table}_${event}_${sid || '0'}`]) return
      if(!global[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      global[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.SWAN:
      if(!swan[`${table}_${event}_${sid || '0'}`]) return
      if(!swan[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      swan[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.TT:
      if(!tt[`${table}_${event}_${sid || '0'}`]) return
      if(!tt[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      tt[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.WEAPP:
      if(!wx[`${table}_${event}_${sid || '0'}`]) return
      if(!wx[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      wx[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    case PLATFORM_NAME.WEB:
      if(!window[`${table}_${event}_${sid || '0'}`]) return
      if(!window[`${table}_${event}_${sid || '0'}`].unsubscribe) return
      window[`${table}_${event}_${sid || '0'}`].unsubscribe()
      break
    default:
      throw new Error(`minapp.subscribe ${METHOD_NOT_SUPPORT}`)
  }

}

export default fetchUnsubscribe