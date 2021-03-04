import {PLATFORM_NAME, PLATFORM_NAME_MYSQL_SERVER} from '../constants/constants'
import {ISetParams} from '../index'
import { UPDATE_ERROR } from '../constants/error'
import { isArray, isNumber } from './utils'


export default function setTrans(params: ISetParams, operate, minapp){

  //mysql 类平台
  if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
    let fieldsArr = [], valuesArr = [], valuesQue = []
    if(minapp === PLATFORM_NAME.MYSQL){
      for(let pa in params){
        if(!isArray(params[pa])){
          //不是数组
          fieldsArr.push(pa)
          valuesQue.push('?')
          //valuesArr.push(isJson(params[pa]) ? JSON.stringify(params[pa]) : params[pa])
          valuesArr.push(isNumber(params[pa]) ? params[pa] : `'${params[pa]}'`)
          //continue
        }else{
          throw new Error(UPDATE_ERROR)
        }
        // if(SET_METHORD.indexOf(params[pa][0]) > -1 ){
        //   switch(params[pa][0]){
        //     case 'geo':
        //       let temp2: any = params[pa], tempGeo = ''
        //       temp2.shift()
        //       if(temp2.length > 1){
        //         let tempPs = temp2.map(item => {
        //           return `Point(${item.toString()})`
        //         })
        //         tempGeo = `Polygon(LineString(${tempPs.toString()}))`
        //       }else{
        //         tempGeo=`Point(${temp2[0].toString()})`
        //       }
        //       fieldsArr.push(pa)
        //       valuesQue.push(tempGeo)
        //       break
        //     default:
        //       throw new Error(UPDATE_ERROR)
        //   }
        // }else{
        //   //直接 set
        //   fieldsArr.push(pa)
        //   valuesQue.push('?')
        //   valuesArr.push(isJson(params[pa]) ? JSON.stringify(params[pa]) : params[pa])
        // }
      }
    }
    operate = {fieldsArr, valuesQue, valuesArr}
  }
  

  return operate
}