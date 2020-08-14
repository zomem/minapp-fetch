import {PLATFORM_NAME} from '../constants/constants'
import {PLATFORM_ERROR, WEBAPI_OPTIONS_ERROR} from '../constants/error'
import {IGetBaaSF, TPlatform, THeader} from '../types'

//根据平台，返回请求方式， BaaS/axios
export function getBaaSF():IGetBaaSF{
  let tempMinapp = process.env.MINAPP as TPlatform
  if(!tempMinapp){
    throw new Error(PLATFORM_ERROR)
  }
  switch (tempMinapp) {
    case PLATFORM_NAME.ALIPAY:
      return {BaaS_F: my.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.CLOUD:
      // @ts-ignore：无法找到BaaS的错误
      return {BaaS_F: BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.JD:
      return {BaaS_F: jd.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.OP:
      return {
        BaaS_F: require('axios').create({withCredentials: true}), 
        minapp: tempMinapp
      }
    case PLATFORM_NAME.QQ:
      return {BaaS_F: qq.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.RN:
      return {BaaS_F: global.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.SWAN:
      return {BaaS_F: swan.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.TT:
      return {BaaS_F: tt.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.WEAPP:
      return {BaaS_F: wx.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.WEB:
      return {BaaS_F: window.BaaS, minapp: tempMinapp}
    case PLATFORM_NAME.WEBAPI:
      let tempOptions = process.env.MINAPP_OPTIONS
      if(!tempOptions) throw new Error(WEBAPI_OPTIONS_ERROR)
      let options = JSON.parse(tempOptions)
      let Header: THeader = {
        'Content-Type': 'application/json',
        'X-Hydrogen-Client-ID': options.clientID,
      }
      if(options.accessToken) Header['Authorization'] = `Hydrogen-r1 ${options.accessToken}`
      if(options.env) Header['X-Hydrogen-Env-ID'] = options.env
      return {
        BaaS_F: require('axios').create({withCredentials: true}),
        minapp: tempMinapp,
        options: {
          RequestBase: options.host || `https://${options.clientID}.myminapp.com`,
          Header: Header
        }
      }
    default:
      throw new Error(PLATFORM_ERROR)
  }
}



export const isArray = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Array]'
}

// 目前仅支持对象或数字的拷贝
export const cloneDeep = (source: any) => {
  if (source === undefined || source === null) return Object.create(null)
  const target = isArray(source) ? [] : Object.create(Object.getPrototypeOf(source))
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        target[keys] = isArray(source[keys]) ? [] : {}
        target[keys] = cloneDeep(source[keys])
      } else {
        target[keys] = source[keys]
      }
    }
  }
  return target
}

// 返回新增的对象，geopoint化
export const changeSetParams = (params: any) => {
  let changeData = params
  for(let p in params){
    if(isArray(params[p])){
      if(params[p][0] === 'geo'){
        if(isArray(params[p][1])){
          let temp = params[p]
          temp.shift()
          if(temp.length > 1){
            changeData[p] = cloneDeep({
              type: 'Polygon',
              coordinates: [temp]
            })
          }else{
            changeData[p] = cloneDeep({
              type: 'Point',
              coordinates: temp[0]
            })
          }
        }
      }
    }
  }
  return changeData
}

export const changeSetManyParams = (params: any) => {
  let change = []
  for(let i = 0; i < params.length; i++){
    change.push(changeSetParams(params[i]))
  }
  return change
}


// 返回geojson
export const changeFindGeoJson = (lparams: any) => {  //['point', 'include', [23, 32]]
  let temp = []  
  if(lparams[1] === 'within'){
    lparams.splice(0,2)
    temp = cloneDeep({
      type: 'Polygon',
      coordinates: [lparams]
    })
  }else{
    temp = cloneDeep({
      type: 'Point',
      coordinates: lparams[2]
    })
  }
  return temp
}

