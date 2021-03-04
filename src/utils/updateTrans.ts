import {PLATFORM_NAME, PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, UPDATE_METHORD, PLATFORM_NAME_MYSQL_SERVER} from '../constants/constants'
import {IUpdateParams} from '../index'
import { UPDATE_ERROR, METHOD_NOT_SUPPORT } from '../constants/error'
import { cloneDeep, isArray, isNumber } from './utils'


export default function updateTrans(params: IUpdateParams, operate, minapp){
  //BaaS平台
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    for(let pa in params){
      if(!isArray(params[pa])){
        //不是数组，则直接 set
        operate.set(pa, params[pa])
        continue
      }
      if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
        switch(params[pa][0]){
          case 'set':
            operate.set(pa, params[pa][1])
            break
          case 'geo':
            let temp: any = params[pa], tempGeo = {}
            temp.shift()
            if(temp.length > 1){
              tempGeo = cloneDeep({
                type: 'Polygon',
                coordinates: [temp]
              })
            }else{
              tempGeo = cloneDeep({
                type: 'Point',
                coordinates: temp[0]
              })
            }
            operate.set(pa, tempGeo)
            break
          case 'unset':
            operate.unset(pa)
            break
          case 'incr':
            operate.incrementBy(pa, params[pa][1])
            break
          case 'append':
            operate.append(pa, isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
            break
          case 'uAppend':
            operate.uAppend(pa, isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
            break
          case 'remove':
            operate.remove(pa, isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
            break
          case 'patchObject':
            operate.patchObject(pa, params[pa][1])
            break
          case 'currentDate':
            //break
            throw new Error(`currentDate新增：${METHOD_NOT_SUPPORT}`)
          default:
            throw new Error(UPDATE_ERROR)
        }
      }else{
        //直接 set
        operate.set(pa, params[pa])
      }
    }
  }

  //Mongo 类平台
  if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.MONGODB){
      for(let pa in params){
        let temp = {}
        if(!isArray(params[pa])){
          //不是数组，则直接 set
          temp[pa] = params[pa]
          operate = {...operate, "$set": { ...operate['$set'], ...temp}}
          continue
        }
        if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
          switch(params[pa][0]){
            case 'set':
              temp[pa] = params[pa][1]
              operate = {...operate, "$set": { ...operate['$set'], ...temp}}
              break
            case 'geo':
              let temp2: any = params[pa], tempGeo = {}
              temp2.shift()
              if(temp2.length > 1){
                tempGeo = cloneDeep({
                  type: 'Polygon',
                  coordinates: [temp2]
                })
              }else{
                tempGeo = cloneDeep({
                  type: 'Point',
                  coordinates: temp2[0]
                })
              }
              temp[pa] = tempGeo
              operate = {...operate, "$set": { ...operate['$set'], ...temp}}
              break
            case 'unset':
              temp[pa] = ''
              operate = {...operate, "$unset": { ...operate['$unset'], ...temp}}
              break
            case 'incr':
              temp[pa] = params[pa][1]
              operate = {...operate, "$inc": { ...operate['$inc'], ...temp}}
              break
            case 'append':
              temp[pa] = {
                "$each": isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              }
              operate = {...operate, "$push": { ...operate['$push'], ...temp}}
              break
            case 'uAppend':
              temp[pa] = {
                "$each": isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              }
              operate = {...operate, "$addToSet": { ...operate['$addToSet'], ...temp}}
              break
            case 'remove':
              temp[pa] = {
                "$each": isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
              }
              operate = {...operate, "$pull": { ...operate['$pull'], ...temp}}
              break
            case 'patchObject':
              //break
              throw new Error(`暂不支持patchObject新增，因为你可以直接用对象的方式set如：{'user.name': ['set', 'newname']}。${METHOD_NOT_SUPPORT}`)
            case 'currentDate':
              temp[pa] = params[pa][1]
              operate = {...operate, "$currentDate": { ...operate['$currentDate'], ...temp}}
              break
            default:
              throw new Error(UPDATE_ERROR)
          }
        }else{
          //直接 set
          temp[pa] = params[pa]
          operate = {...operate, "$set": { ...operate['$set'], ...temp}}
        }
      }
    }

    if(minapp === PLATFORM_NAME.WX_WEAPP 
      || minapp === PLATFORM_NAME.WX_CLOUD
      || minapp === PLATFORM_NAME.UNI_CLOUD
    ){
      //此处的operate是操作方法
      let tempParams = {}
      for(let pa in params){
        if(!isArray(params[pa])){
          //不是数组，则直接 set
          tempParams[pa] = operate.set(params[pa])
          continue
        }
        if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
          switch(params[pa][0]){
            case 'set':
              tempParams[pa] = operate.set(params[pa][1])
              break
            case 'geo':
              let temp2: any = params[pa], tempGeo = {}
              temp2.shift()
              if(temp2.length > 1){
                tempGeo = cloneDeep({
                  type: 'Polygon',
                  coordinates: [temp2]
                })
              }else{
                tempGeo = cloneDeep({
                  type: 'Point',
                  coordinates: temp2[0]
                })
              }
              tempParams[pa] = operate.set(tempGeo)
              break
            case 'unset':
              tempParams[pa] = operate.remove()
              break
            case 'incr':
              tempParams[pa] = operate.inc(params[pa][1])
              break
            case 'append':
              tempParams[pa] = operate.push(isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]])
              break
            case 'uAppend':
              if(isArray(params[pa][1])){
                tempParams[pa] = operate.addToSet({
                  each: isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
                })
              }else{
                tempParams[pa] = operate.addToSet(params[pa][1])
              }
              break
            case 'remove':
              tempParams[pa] = operate.pull(operate.in(isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]))
              break
            case 'patchObject':
              tempParams[pa] = params[pa][1]
              break
            case 'currentDate':
              //break
              throw new Error(`currentDate新增：${METHOD_NOT_SUPPORT}`)
            default:
              throw new Error(UPDATE_ERROR)
          }
        }else{
          //直接 set
          tempParams[pa] = operate.set(params[pa])
        }
      }
      operate = tempParams
    }
  }

  //mysql类
  if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.MYSQL){
      for(let pa in params){
        if(!isArray(params[pa])){
          //不是数组，则直接 set
          operate.push(`${pa} = ${isNumber(params[pa]) ? params[pa] : `'${params[pa]}'`}`)
          continue
        }
        if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
          switch(params[pa][0]){
            case 'set':
              operate.push(`${pa} = ${isNumber(params[pa][1]) ? params[pa][1] : `'${params[pa][1]}'`}`)
              break
            case 'geo':
              throw new Error(`geo新增：${METHOD_NOT_SUPPORT}`)
            case 'unset':
              operate.push(`${pa} = NULL`)
              break
            case 'incr':
              if(params[pa][1] >= 0){
                operate.push(`${pa} = ${pa} + ${params[pa][1]}`)
              }else{
                operate.push(`${pa} = ${pa} - ${Math.abs(params[pa][1])}`)
              }
              break
            case 'append':
              throw new Error(`append新增：${METHOD_NOT_SUPPORT}`)
            case 'uAppend':
              throw new Error(`uAppend新增：${METHOD_NOT_SUPPORT}`)
            case 'remove':
              throw new Error(`remove新增：${METHOD_NOT_SUPPORT}`)
            case 'patchObject':
              throw new Error(`patchObject新增：${METHOD_NOT_SUPPORT}`)
            default:
              throw new Error(UPDATE_ERROR)
          }
        }else{
          //直接 set
          operate.set(pa, params[pa])
        }
      }
    }
  }

  //webapi  op
  if(minapp === PLATFORM_NAME.ZX_WEBAPI || minapp === PLATFORM_NAME.ZX_OP){
    for(let pa in params){
      if(!isArray(params[pa])){
        //不是数组，则直接 set
        operate[pa] = params[pa]
        continue
      }
      if(UPDATE_METHORD.indexOf(params[pa][0]) > -1 ){
        switch(params[pa][0]){
          case 'set':
            operate[pa] = params[pa][1]
            break
          case 'geo':
            let temp: any = params[pa], tempGeo = {}
            temp.shift()
            if(temp.length > 1){
              tempGeo = cloneDeep({
                type: 'Polygon',
                coordinates: [temp]
              })
            }else{
              tempGeo = cloneDeep({
                type: 'Point',
                coordinates: temp[0]
              })
            }
            operate[pa] = tempGeo
            break
          case 'unset':
            operate[pa] = {}
            operate[pa]['$unset'] = ''
            break
          case 'incr':
            operate[pa] = {}
            operate[pa]['$incr_by'] = params[pa][1]
            break
          case 'append':
            operate[pa] = {}
            operate[pa]['$append'] = isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
            break
          case 'uAppend':
            operate[pa] = {}
            operate[pa]['$append_unique'] = isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
            break
          case 'remove':
            operate[pa] = {}
            operate[pa]['$remove'] = isArray(params[pa][1]) ? params[pa][1] : [params[pa][1]]
            break
          case 'patchObject':
            operate[pa] = {}
            operate[pa]['$update'] = params[pa][1]
            break
          case 'currentDate':
            //break
            throw new Error(`currentDate新增：${METHOD_NOT_SUPPORT}`)
          default:
            throw new Error(UPDATE_ERROR)
        }
      }else{
        //直接 set
        operate[pa] = params[pa]
      }
    }
  }
  

  return operate
}