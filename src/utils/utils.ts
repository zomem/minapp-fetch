import {PLATFORM_NAME} from '../constants/constants'
import {PLATFORM_ERROR, WEBAPI_OPTIONS_ERROR} from '../constants/error'
import {IGetBaaSF, TPlatform, THeader} from '../types'

//根据平台，返回请求方式， BaaS/axios
export function getBaaSF():IGetBaaSF{
  let tempMinapp: IGetBaaSF = {BaaS_F: '', minapp: 'cloud'}
  if(typeof(window) !== 'undefined'){
    if(window.MINAPP){
      tempMinapp.minapp = window.MINAPP
      switch(tempMinapp.minapp){
        case PLATFORM_NAME.WEB:
          tempMinapp.BaaS_F = window.BaaS
          break
        case PLATFORM_NAME.OP:
          tempMinapp.BaaS_F = require('axios').create({withCredentials: true})
          break
        case PLATFORM_NAME.WEBAPI:
          let options = window.MINAPP_OPTIONS
          if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
          let Header: THeader = {
            'Content-Type': 'application/json',
            'X-Hydrogen-Client-ID': options.clientID,
          }
          if(options.accessToken) Header['Authorization'] = `Hydrogen-r1 ${options.accessToken}`
          if(options.env) Header['X-Hydrogen-Env-ID'] = options.env
          tempMinapp.BaaS_F = require('axios').create({withCredentials: true})
          tempMinapp.options = {
            RequestBase: options.host || `https://${options.clientID}.myminapp.com`,
            Header: Header
          }
          break
        default:
          break
      }
    }
  }
  if(typeof(global) !== 'undefined'){
    if(global.MINAPP){
      tempMinapp.minapp = global.MINAPP
      switch(tempMinapp.minapp){
        case PLATFORM_NAME.CLOUD:
          // @ts-ignore：无法找到BaaS的错误
          tempMinapp.BaaS_F = BaaS
          break
        case PLATFORM_NAME.RN:
          tempMinapp.BaaS_F = global.BaaS
          break
        case PLATFORM_NAME.WEBAPI:
          let options = global.MINAPP_OPTIONS
          if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
          let Header: THeader = {
            'Content-Type': 'application/json',
            'X-Hydrogen-Client-ID': options.clientID,
          }
          if(options.accessToken) Header['Authorization'] = `Hydrogen-r1 ${options.accessToken}`
          if(options.env) Header['X-Hydrogen-Env-ID'] = options.env
          tempMinapp.BaaS_F = require('axios').create({withCredentials: true})
          tempMinapp.options = {
            RequestBase: options.host || `https://${options.clientID}.myminapp.com`,
            Header: Header
          }
          break
        default:
          break
      }
    }
  }
  if(typeof(my) !== 'undefined'){
    if(my.MINAPP){
      tempMinapp.minapp = my.MINAPP
      tempMinapp.BaaS_F = my.BaaS
    }
  }
  if(typeof(jd) !== 'undefined'){
    if(jd.MINAPP){
      tempMinapp.minapp = jd.MINAPP
      tempMinapp.BaaS_F = jd.BaaS
    }
  }
  if(typeof(qq) !== 'undefined'){
    if(qq.MINAPP){
      tempMinapp.minapp = qq.MINAPP
      tempMinapp.BaaS_F = qq.BaaS
    }
  }
  if(typeof(swan) !== 'undefined'){
    if(swan.MINAPP){
      tempMinapp.minapp = swan.MINAPP
      tempMinapp.BaaS_F = swan.BaaS
    }
  }
  if(typeof(tt) !== 'undefined'){
    if(tt.MINAPP){
      tempMinapp.minapp = tt.MINAPP
      tempMinapp.BaaS_F = tt.BaaS
    }
  }
  if(typeof(wx) !== 'undefined'){
    if(wx.MINAPP){
      tempMinapp.minapp = wx.MINAPP
      tempMinapp.BaaS_F = wx.BaaS
    }
  }
  if(!tempMinapp.BaaS_F) throw new Error(PLATFORM_ERROR)
  return tempMinapp
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

