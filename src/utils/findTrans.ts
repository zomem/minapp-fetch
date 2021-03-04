import {PLATFORM_NAME, PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME_MYSQL_SERVER, J_NAME_LIST} from '../constants/constants'
import {ICheckParams} from '../index'
import {FIND_R_ERROR, FIND_CHECKR_ERROR, FIND_P_ERROR} from '../constants/error'
import {changeFindGeoJson, isArray, isNumber} from './utils'
import {METHOD_NOT_SUPPORT, FIND_P_BETWEEN_ERROR, FIND_NO_PJ_ERROR} from '../constants/error'

export default function findTrans(params: ICheckParams, r_num: number, BaaS_F, minapp){
  let rstring = `r${r_num === 1 ? '' : r_num}`
  if(!params[rstring]){
    return false
  }
  let r = params[rstring].replace(/\s+/g,'')       //去掉空格
  let query: any  = {}

  let checkR = r.replace(/[^\(\)]/g, '')
  while(/\(\)/g.test(checkR)){
    checkR = checkR.replace(/\(\)/g,"")
  }
  //是否有多的括号，(
  if(checkR){
    throw new Error('"' + checkR + '": ' + FIND_CHECKR_ERROR)
  }

  let stack = []   //栈
  let topBrackets: string = ''     //最近的一个括号里的内容
  let stackTop: string | undefined = ''     //栈顶的内容
  let list = r.replace(/(\()|(\))/g, '#$1$2#').split(/#/g)

  //1.将所有p转换成query类型
  let ps = r.replace(/\(|\)/g, '').split(/&&|\|\|/g)

  //BaaS平台
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    for(let i = 0; i < ps.length; i++){
      query[ps[i]] = new BaaS_F.Query()
      if(!params[ps[i]]) throw new Error(FIND_NO_PJ_ERROR + ps[i])
      switch(params[ps[i]][1]){
        case 'in':
          query[ps[i]].in(params[ps[i]][0], params[ps[i]][2])
          break
        case 'notIn':
          query[ps[i]].notIn(params[ps[i]][0], params[ps[i]][2])
          break
        case 'contains':
          query[ps[i]].contains(params[ps[i]][0], params[ps[i]][2])
          break
        case 'arrayContains':
          query[ps[i]].arrayContains(params[ps[i]][0], params[ps[i]][2])
          break
        case 'matches':
          query[ps[i]].matches(params[ps[i]][0], params[ps[i]][2])
          break
        case 'stringLength':
          let reg
          if(params[ps[i]].length > 3){
            reg = new RegExp(`^.{${params[ps[i]][2]},${params[ps[i]][3]}}$`)
          }else{
            reg = new RegExp(`^.{${params[ps[i]][2]}}$`)
          }
          query[ps[i]].matches(params[ps[i]][0], reg)
          break
        case 'hasKey':
          query[ps[i]].hasKey(params[ps[i]][0], params[ps[i]][2])
          break
        case 'include':
          query[ps[i]].include(params[ps[i]][0], new BaaS_F.GeoPoint(params[ps[i]][2][0], params[ps[i]][2][1]))
          break
        case 'withinCircle':
          query[ps[i]].withinCircle(params[ps[i]][0], new BaaS_F.GeoPoint(params[ps[i]][2][0], params[ps[i]][2][1]), params[ps[i]][3])
          break
        case 'withinRegion':
          query[ps[i]].withinRegion(params[ps[i]][0], new BaaS_F.GeoPoint(params[ps[i]][2][0], params[ps[i]][2][1]), params[ps[i]][3], params[ps[i]][4] || 0)
          break
        case 'within':
          let tempGeo = params[ps[i]]
          tempGeo.splice(0,2)
          query[ps[i]].within(params[ps[i]][0], new BaaS_F.GeoPolygon(tempGeo))
          break;
        case 'isNull':
          params[ps[i]][2] ? query[ps[i]].isNull(params[ps[i]][0]) : query[ps[i]].isNotNull(params[ps[i]][0])
          break
        case 'isExists':
          params[ps[i]][2] ? query[ps[i]].exists(params[ps[i]][0]) : query[ps[i]].notExists(params[ps[i]][0])
          break
        case '=':
          query[ps[i]].compare(params[ps[i]][0], '=', params[ps[i]][2])
          break
        case '!=':
          query[ps[i]].compare(params[ps[i]][0], '!=', params[ps[i]][2])
          break
        case '<':
          query[ps[i]].compare(params[ps[i]][0], '<', params[ps[i]][2])
          break
        case '<=':
          query[ps[i]].compare(params[ps[i]][0], '<=', params[ps[i]][2])
          break
        case '>':
          query[ps[i]].compare(params[ps[i]][0], '>', params[ps[i]][2])
          break
        case '>=':
          query[ps[i]].compare(params[ps[i]][0], '>=', params[ps[i]][2])
          break
        default:
          throw new Error(FIND_P_ERROR)
      }
    }
  }
  //Mongo 类平台
  if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.MONGODB){
      let hex = /^[a-fA-F0-9]{24}$/
      for(let i = 0; i < ps.length; i++){
        query[ps[i]] = {}
        if(!params[ps[i]]) throw new Error(FIND_NO_PJ_ERROR + ps[i])
        //如果是_id，则要对数据进行转换
        if(params[ps[i]][0] === '_id'){
          if(isArray(params[ps[i]][2])){
            params[ps[i]][2] = params[ps[i]][2].map(item => {
              let tempId = (hex.test(item)) ? BaaS_F.ObjectID(item) : item
              return tempId
            })
          }else{
            let tempId = (hex.test(params[ps[i]][2])) ? BaaS_F.ObjectID(params[ps[i]][2]) : params[ps[i]][2]
            params[ps[i]][2] = tempId
          }
        }
        switch(params[ps[i]][1]){
          case 'in':
            let tm1 = {}, tm2 = {}
            tm1[params[ps[i]][0]] = {"$elemMatch": {"$in": params[ps[i]][2]}}
            tm2[params[ps[i]][0]] = {"$in": params[ps[i]][2]}
            query[ps[i]] = {
              "$or": [tm1, tm2]
            }
            break
          case 'notIn':
            query[ps[i]][params[ps[i]][0]] = {"$nin": params[ps[i]][2]}
            break
          case 'contains':
            //query[ps[i]][params[ps[i]][0]] = {"$contains": params[ps[i]][2]}
            //break
            throw new Error(`contains查寻：${METHOD_NOT_SUPPORT}`)
          case 'arrayContains':
            query[ps[i]][params[ps[i]][0]] = {"$all": params[ps[i]][2]}
            break
          case 'matches':
            query[ps[i]][params[ps[i]][0]] = {"$regex": params[ps[i]][2]}
            break
          case 'stringLength':
            let reg: any
            if(params[ps[i]].length > 3){
              reg = new RegExp(`^.{${params[ps[i]][2]},${params[ps[i]][3]}}$`)
            }else{
              reg = new RegExp(`^.{${params[ps[i]][2]}}$`)
            }
            query[ps[i]][params[ps[i]][0]] = {"$regex": reg}
            break
          case 'hasKey':
            // query[ps[i]][params[ps[i]][0]] = {"$has_key": params[ps[i]][2]}
            // break
            throw new Error(`hasKey查寻：${METHOD_NOT_SUPPORT}，你可以直接使用对象查寻，如：'user.name'查寻name`)
          case 'include':
            query[ps[i]][params[ps[i]][0]] = {
              "$geoIntersects": {
                "$geometry": changeFindGeoJson(params[ps[i]])
              }
            }
            break
          case 'withinCircle':
            query[ps[i]][params[ps[i]][0]] = {
              "$geoWithin": {
                "$center": [[params[ps[i]][2][0], params[ps[i]][2][1]], (params[ps[i]][3] || 1) / 6378.1]
              }
            }
            break
          case 'withinRegion':
            query[ps[i]][params[ps[i]][0]] = {
              "$nearSphere": {
                "$geometry": changeFindGeoJson(params[ps[i]]),
                "$minDistance": params[ps[i]][4] || 0,
                "$maxDistance": params[ps[i]][3],
              }
            }
            break
          case 'within':
            query[ps[i]][params[ps[i]][0]] = {
              "$geoWithin": {
                "$geometry": changeFindGeoJson(params[ps[i]])
              }
            }
            break
          case 'isNull':
            // query[ps[i]][params[ps[i]][0]] = {"$isnull": params[ps[i]][2]}
            // break
            throw new Error(`isNull查寻：${METHOD_NOT_SUPPORT}`)
          case 'isExists':
            query[ps[i]][params[ps[i]][0]] = {"$exists": params[ps[i]][2]}
            break
          case '=':
            query[ps[i]][params[ps[i]][0]] = {"$eq": params[ps[i]][2]}
            break
          case '!=':
            query[ps[i]][params[ps[i]][0]] = {"$ne": params[ps[i]][2]}
            break
          case '<':
            query[ps[i]][params[ps[i]][0]] = {"$lt": params[ps[i]][2]}
            break
          case '<=':
            query[ps[i]][params[ps[i]][0]] = {"$lte": params[ps[i]][2]}
            break
          case '>':
            query[ps[i]][params[ps[i]][0]] = {"$gt": params[ps[i]][2]}
            break
          case '>=':
            query[ps[i]][params[ps[i]][0]] = {"$gte": params[ps[i]][2]}
            break
          default:
            throw new Error(FIND_P_ERROR)
        }
      }
    }
    if(minapp === PLATFORM_NAME.WX_CLOUD 
      || minapp === PLATFORM_NAME.WX_WEAPP
      || minapp === PLATFORM_NAME.UNI_CLOUD
    ){
      let db = BaaS_F.database()
      let dbCommand = db.command
      for(let i = 0; i < ps.length; i++){
        query[ps[i]] = {}
        if(!params[ps[i]]) throw new Error(FIND_NO_PJ_ERROR + ps[i])
        switch(params[ps[i]][1]){
          case 'in':
            let tm1 = {}, tm2 = {}
            tm1[params[ps[i]][0]] = dbCommand.elemMatch(dbCommand.in(params[ps[i]][2]))
            tm2[params[ps[i]][0]] = dbCommand.in(params[ps[i]][2])
            query[ps[i]] = dbCommand.or([tm1, tm2])
            break
          case 'notIn':
            query[ps[i]][params[ps[i]][0]] = dbCommand.nin(params[ps[i]][2])
            break
          case 'contains':
            throw new Error(`contains查寻：${METHOD_NOT_SUPPORT}`)
          case 'arrayContains':
            query[ps[i]][params[ps[i]][0]] = dbCommand.all(params[ps[i]][2])
            break
          case 'matches':
            query[ps[i]][params[ps[i]][0]] = params[ps[i]][2]
            break
          case 'stringLength':
            let reg: any
            if(params[ps[i]].length > 3){
              reg = new RegExp(`^.{${params[ps[i]][2]},${params[ps[i]][3]}}$`)
            }else{
              reg = new RegExp(`^.{${params[ps[i]][2]}}$`)
            }
            query[ps[i]][params[ps[i]][0]] = reg
            break
          case 'hasKey':
            // query[ps[i]][params[ps[i]][0]] = {"$has_key": params[ps[i]][2]}
            // break
            throw new Error(`hasKey查寻：${METHOD_NOT_SUPPORT}，你可以直接使用对象查寻，如：'user.name'查寻name`)
          case 'include':
            query[ps[i]][params[ps[i]][0]] = dbCommand.geoIntersects({
              geometry: new db.Geo.Point(params[ps[i]][2][0], params[ps[i]][2][1])
            })
            break
          case 'withinCircle':
            query[ps[i]][params[ps[i]][0]] = dbCommand.geoWithin({
              centerSphere: [[params[ps[i]][2][0], params[ps[i]][2][1]], (params[ps[i]][3] || 1) / 6378.1]
            })
            break
          case 'withinRegion':
            query[ps[i]][params[ps[i]][0]] = dbCommand.geoNear({
              geometry: new db.Geo.Point(params[ps[i]][2][0], params[ps[i]][2][1]),
              minDistance: params[ps[i]][4] || 0,
              maxDistance: params[ps[i]][3]
            })
            break
          case 'within':
            let { Point, LineString, Polygon } = db.Geo
            let tempArr = [...params[ps[i]]], tempPs = []
            tempArr.splice(0,2)
            for(let i = 0; i < tempArr.length; i++){
              tempPs.push(new Point(tempArr[i][0], tempArr[i][1]))
            }
            query[ps[i]][params[ps[i]][0]] = dbCommand.geoWithin({
              geometry: new Polygon([new LineString(tempPs)])
            })
            break
          case 'isNull':
            // query[ps[i]][params[ps[i]][0]] = {"$isnull": params[ps[i]][2]}
            // break
            throw new Error(`isNull查寻：${METHOD_NOT_SUPPORT}`)
          case 'isExists':
            query[ps[i]][params[ps[i]][0]] = dbCommand.exists(params[ps[i]][2])
            break
          case '=':
            query[ps[i]][params[ps[i]][0]] = dbCommand.eq(params[ps[i]][2])
            break
          case '!=':
            query[ps[i]][params[ps[i]][0]] = dbCommand.neq(params[ps[i]][2])
            break
          case '<':
            query[ps[i]][params[ps[i]][0]] = dbCommand.lt(params[ps[i]][2])
            break
          case '<=':
            query[ps[i]][params[ps[i]][0]] = dbCommand.lte(params[ps[i]][2])
            break
          case '>':
            query[ps[i]][params[ps[i]][0]] = dbCommand.gt(params[ps[i]][2])
            break
          case '>=':
            query[ps[i]][params[ps[i]][0]] = dbCommand.gte(params[ps[i]][2])
            break
          default:
            throw new Error(FIND_P_ERROR)
        }
      }
    }
  }
  //mysql 类平台
  if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.MYSQL){
      for(let i = 0; i < ps.length; i++){
        query[ps[i]] = {}
        let tableName = '', fieldName = '', tempSelect = ''
        if(!params[ps[i]]) throw new Error(FIND_NO_PJ_ERROR + ps[i])
        if(params[ps[i]][0].toString().indexOf('SELECT') > -1){
          tempSelect = `(${params[ps[i]][0]})`
        }else{
          let tempT = params[ps[i]][0].split('.')
          if(tempT.length === 1){
            tableName = BaaS_F.tableMain
            fieldName = params[ps[i]][0]
          }else{
            tableName = tempT[0]
            fieldName = tempT[1]
          }
        }
        
        let tempParam = ''
        if(isArray(params[ps[i]][2])){
          let tempArr = []
          for(let j = 0; j < params[ps[i]][2].length; j++){
            if(isNumber(params[ps[i]][2][j])){
              tempArr.push(`${params[ps[i]][2][j]}`)
            }else{
              tempArr.push(`'${params[ps[i]][2][j]}'`)
            }
          }
          tempParam = `(${tempArr.toString()})`
        }else{
          if(params[ps[i]][2].toString().indexOf('SELECT') > -1){
            tempParam = `(${params[ps[i]][2]})`
          }else if(isNumber(params[ps[i]][2])){
            tempParam = params[ps[i]][2]
          }else if(params[ps[i]][2].toString().indexOf('.') > -1){
            let tempPl = params[ps[i]][2].split('.')
            if(BaaS_F.table.indexOf(tempPl[0]) > -1){
              tempParam = `${BaaS_F.tableHash[tempPl[0]]}.${tempPl[1]}`
            }else{
              tempParam = `'${params[ps[i]][2]}'`
            }
          }else{
            tempParam = `'${params[ps[i]][2]}'`
          }
        }

        let tempParam2 = ''
        if(params[ps[i]][3]){
          if(params[ps[i]][3].toString().indexOf('SELECT') > -1){
            tempParam2 = `(${params[ps[i]][3]})`
          }else if(isNumber(params[ps[i]][3])){
            tempParam2 = params[ps[i]][3]
          }else if(params[ps[i]][3].toString().indexOf('.') > -1){
            let tempPl = params[ps[i]][3].split('.')
            if(BaaS_F.table.indexOf(tempPl[0]) > -1){
              tempParam2 = `${BaaS_F.tableHash[tempPl[0]]}.${tempPl[1]}`
            }else{
              tempParam2 = `'${params[ps[i]][3]}'`
            }
          }else{
            tempParam2 = `'${params[ps[i]][3]}'`
          }
        }

        switch(params[ps[i]][1]){
          case '=':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} = ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} = ${tempParam}`
            }
            break
          case '!=':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} != ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} != ${tempParam}`
            }
            break
          case '<':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} < ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} < ${tempParam}`
            }
            break
          case '<=':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} <= ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} <= ${tempParam}`
            }
            break
          case '>':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} > ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} > ${tempParam}`
            }
            break
          case '>=':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} >= ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} >= ${tempParam}`
            }
            break
          case 'between':
            if(params[ps[i]].length > 3){
              if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
                if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
                query[ps[i]] = `${BaaS_F.jObj[fieldName]} BETWEEN ${tempParam} AND ${tempParam2}`
              }else{
                query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} BETWEEN ${tempParam} AND ${tempParam2}`
              }
            }else{
              throw new Error(FIND_P_BETWEEN_ERROR)
            }
            break
          case 'notBetween':
            if(params[ps[i]].length > 3){
              if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
                if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
                query[ps[i]] = `${BaaS_F.jObj[fieldName]} NOT BETWEEN ${tempParam} AND ${tempParam2}`
              }else{
                query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} NOT BETWEEN ${tempParam} AND ${tempParam2}`
              }
            }else{
              throw new Error(FIND_P_BETWEEN_ERROR)
            }
            break
          case 'like':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} LIKE ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} LIKE ${tempParam}`
            }
            break
          case 'matches':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} REGEXP ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} REGEXP ${tempParam}`
            }
            break
          case 'stringLength':
            let reg: any
            if(params[ps[i]].length > 3){
              reg = new RegExp(`^.${params[ps[i]][2]},${params[ps[i]][3]}}$`)
            }else{
              reg = new RegExp(`^.{${params[ps[i]][2]}}$`)
            }
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} REGEXP ${reg}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} REGEXP ${reg}`
            }
            break
          case 'in':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} IN ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} IN ${tempParam}`
            }
            break
          case 'notIn':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} NOT IN ${tempParam}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} NOT IN ${tempParam}`
            }
            break
          case 'isNull':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              query[ps[i]] = `${BaaS_F.jObj[fieldName]} is ${tempParam === 'true' ? 'NULL' : 'NOT NULL'}`
            }else{
              query[ps[i]] = `${BaaS_F.tableHash[tableName]}.${fieldName} is ${tempParam === 'true' ? 'NULL' : 'NOT NULL'}`
            }
            break
          case 'isExists':
            if(r_num === 2 && J_NAME_LIST.indexOf(fieldName) > -1){
              if(!params[fieldName]) throw new Error(FIND_NO_PJ_ERROR + fieldName)
              if(tempParam === 'true'){
                query[ps[i]] = `EXISTS ${tempSelect ? tempSelect : BaaS_F.jObj[fieldName]}`
              }else{
                query[ps[i]] = `NOT EXISTS ${tempSelect ? tempSelect : BaaS_F.jObj[fieldName]}`
              }
            }else{
              if(tempParam === 'true'){
                query[ps[i]] = `EXISTS ${tempSelect ? tempSelect : BaaS_F.tableHash[tableName][fieldName]}`
              }else{
                query[ps[i]] = `NOT EXISTS ${tempSelect ? tempSelect : BaaS_F.tableHash[tableName][fieldName]}`
              }
            }
            break
          default:
            throw new Error(FIND_P_ERROR)
        }
      }
    }
  }
  //webapi  op
  if(minapp === PLATFORM_NAME.ZX_WEBAPI || minapp === PLATFORM_NAME.ZX_OP){
    for(let i = 0; i < ps.length; i++){
      query[ps[i]] = {}
      if(!params[ps[i]]) throw new Error(FIND_NO_PJ_ERROR + ps[i])
      switch(params[ps[i]][1]){
        case 'in':
          query[ps[i]][params[ps[i]][0]] = {"$in": params[ps[i]][2]}
          break
        case 'notIn':
          query[ps[i]][params[ps[i]][0]] = {"$nin": params[ps[i]][2]}
          break
        case 'contains':
          query[ps[i]][params[ps[i]][0]] = {"$contains": params[ps[i]][2]}
          break
        case 'arrayContains':
          query[ps[i]][params[ps[i]][0]] = {"$all": params[ps[i]][2]}
          break
        case 'matches':
          query[ps[i]][params[ps[i]][0]] = {"$regex": params[ps[i]][2]}
          break
        case 'stringLength':
          let reg
          if(params[ps[i]].length > 3){
            reg = new RegExp(`^.{${params[ps[i]][2]},${params[ps[i]][3]}}$`)
          }else{
            reg = new RegExp(`^.{${params[ps[i]][2]}}$`)
          }
          query[ps[i]][params[ps[i]][0]] = {"$regex": reg}
          break
        case 'hasKey':
          query[ps[i]][params[ps[i]][0]] = {"$has_key": params[ps[i]][2]}
          break
        case 'include':
          query[ps[i]][params[ps[i]][0]] = {"$intersects": changeFindGeoJson(params[ps[i]])}
          break
        case 'withinCircle':
          query[ps[i]][params[ps[i]][0]] = {"$center": {
            radius: params[ps[i]][3] || 1,
            coordinates: [params[ps[i]][2][0], params[ps[i]][2][1]]
          }}
          break
        case 'withinRegion':
          query[ps[i]][params[ps[i]][0]] = {"$nearsphere": {
            geometry: changeFindGeoJson(params[ps[i]]),
            max_distance: params[ps[i]][3],
            min_distance: params[ps[i]][4] || 0
          }}
          break
        case 'within':
          query[ps[i]][params[ps[i]][0]] = {"$within": changeFindGeoJson(params[ps[i]])}
          break
        case 'isNull':
          query[ps[i]][params[ps[i]][0]] = {"$isnull": params[ps[i]][2]}
          break
        case 'isExists':
          query[ps[i]][params[ps[i]][0]] = {"$exists": params[ps[i]][2]}
          break
        case '=':
          query[ps[i]][params[ps[i]][0]] = {"$eq": params[ps[i]][2]}
          break
        case '!=':
          query[ps[i]][params[ps[i]][0]] = {"$ne": params[ps[i]][2]}
          break
        case '<':
          query[ps[i]][params[ps[i]][0]] = {"$lt": params[ps[i]][2]}
          break
        case '<=':
          query[ps[i]][params[ps[i]][0]] = {"$lte": params[ps[i]][2]}
          break
        case '>':
          query[ps[i]][params[ps[i]][0]] = {"$gt": params[ps[i]][2]}
          break
        case '>=':
          query[ps[i]][params[ps[i]][0]] = {"$gte": params[ps[i]][2]}
          break
        default:
          throw new Error(FIND_P_ERROR)
      }
    }
  }


  for(let i = 0; i < list.length; i++){
    if(list[i] === ')'){
      //出栈
      stackTop = stack.pop()
      while (stackTop !== '(') {
        topBrackets = stackTop + topBrackets
        stackTop = stack.pop()
      }
      //进行and,or
      let tempArr = topBrackets.replace(/(&&)|(\|\|)/g, '#$1$2#').split(/#/g)
      // [p9, &&, p8, ||, p32]
      let tempQQ = query[tempArr[0]], n = 0

      
      //BaaS平台
      if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
        while(n < tempArr.length - 1){
          if(tempArr[n+1] === '&&'){
            tempQQ = BaaS_F.Query.and(tempQQ, query[tempArr[n+2]])
          }
          if(tempArr[n+1] === '||'){
            tempQQ = BaaS_F.Query.or(tempQQ, query[tempArr[n+2]])
          }
          n += 2
        }
      }
      //Mongo 类平台
      if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
        if(minapp === PLATFORM_NAME.MONGODB){
          while(n < tempArr.length - 1){
            if(tempArr[n+1] === '&&'){
              tempQQ = {
                "$and": [tempQQ, query[tempArr[n+2]]]
              }
            }
            if(tempArr[n+1] === '||'){
              tempQQ = {
                "$or": [tempQQ, query[tempArr[n+2]]]
              }
            }
            n += 2
          }
        }
        if(minapp === PLATFORM_NAME.WX_CLOUD
          || minapp === PLATFORM_NAME.WX_WEAPP
          || minapp === PLATFORM_NAME.UNI_CLOUD
        ){
          let db = BaaS_F.database()
          let dbCommand = db.command
          while(n < tempArr.length - 1){
            if(tempArr[n+1] === '&&'){
              tempQQ = dbCommand.and([tempQQ, query[tempArr[n+2]]])
            }
            if(tempArr[n+1] === '||'){
              tempQQ = dbCommand.or([tempQQ, query[tempArr[n+2]]])
            }
            n += 2
          }
        }
      }
      //mysql 类平台
      if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
        if(minapp === PLATFORM_NAME.MYSQL){
          while (n < tempArr.length - 1) {
            if (tempArr[n + 1] === '&&') {
              tempQQ = `(${tempQQ} AND ${query[tempArr[n + 2]]})`
            }
            if (tempArr[n + 1] === '||') {
              tempQQ = `(${tempQQ} OR ${query[tempArr[n + 2]]})`
            }
            n += 2;
          }
        }
      }
      //webapi  op
      if(minapp === PLATFORM_NAME.ZX_WEBAPI || minapp === PLATFORM_NAME.ZX_OP){
        while(n < tempArr.length - 1){
          if(tempArr[n+1] === '&&'){
            tempQQ = {
              "$and": [tempQQ, query[tempArr[n+2]]]
            }
          }
          if(tempArr[n+1] === '||'){
            tempQQ = {
              "$or": [tempQQ, query[tempArr[n+2]]]
            }
          }
          n += 2
        }
      }

      query[`pp${i}`] = tempQQ
      topBrackets = `pp${i}`
      stack.push(topBrackets)
      topBrackets = ''
      continue
    }else{
      //入栈
      stack.push(list[i])
    }
  }
  let tempArr2 = stack.toString().replace(/,/g, '').replace(/(&&)|(\|\|)/g, '#$1$2#').split(/#/g)
  // [p9, &&, pp8, ||, p32]
  let QQ = query[tempArr2[0]], n = 0

  //BaaS平台
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    while(n < tempArr2.length - 1){
      if(tempArr2[n+1] === '&&'){
        QQ = BaaS_F.Query.and(QQ, query[tempArr2[n+2]])
      }
      if(tempArr2[n+1] === '||'){
        QQ = BaaS_F.Query.or(QQ, query[tempArr2[n+2]])
      }
      n += 2
    }
  }
  //Mongo 类平台
  if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.MONGODB){
      while(n < tempArr2.length - 1){
        if(tempArr2[n+1] === '&&'){
          QQ = {
            "$and": [QQ, query[tempArr2[n+2]]]
          }
        }
        if(tempArr2[n+1] === '||'){
          QQ = {
            "$or": [QQ, query[tempArr2[n+2]]]
          }
        }
        n += 2
      }
    }
    if(minapp === PLATFORM_NAME.WX_CLOUD 
      || minapp === PLATFORM_NAME.WX_WEAPP
      || minapp === PLATFORM_NAME.UNI_CLOUD
    ){
      let db = BaaS_F.database()
      let dbCommand = db.command
      while(n < tempArr2.length - 1){
        if(tempArr2[n+1] === '&&'){
          QQ = dbCommand.and([QQ, query[tempArr2[n+2]]])
        }
        if(tempArr2[n+1] === '||'){
          QQ = dbCommand.or([QQ, query[tempArr2[n+2]]])
        }
        n += 2
      }
    }
  }
  //mysql 类平台
  if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.MYSQL){
      while (n < tempArr2.length - 1) {
        if (tempArr2[n + 1] === '&&') {
          QQ = `(${QQ} AND ${query[tempArr2[n + 2]]})`
        }
        if (tempArr2[n + 1] === '||') {
          QQ = `(${QQ} OR ${query[tempArr2[n + 2]]})`
        }
        n += 2;
      }
    }
  }
  //webapi  op
  if(minapp === PLATFORM_NAME.ZX_WEBAPI || minapp === PLATFORM_NAME.ZX_OP){
    while(n < tempArr2.length - 1){
      if(tempArr2[n+1] === '&&'){
        QQ = {
          "$and": [QQ, query[tempArr2[n+2]]]
        }
      }
      if(tempArr2[n+1] === '||'){
        QQ = {
          "$or": [QQ, query[tempArr2[n+2]]]
        }
      }
      n += 2
    }
  }

  return QQ

}