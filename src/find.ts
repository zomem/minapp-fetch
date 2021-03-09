
import { getBaaSF, isArray, mysqlConnect } from './utils/utils'
import {PLATFORM_NAME_BAAS, PLATFORM_NAME_MONGO_SERVER, PLATFORM_NAME, PLATFORM_NAME_MYSQL_SERVER, J_MAX, J_NAME_LIST} from './constants/constants'
import {WEBAPI_OPTIONS_ERROR, PARAM_TABLE_ERROR, FIND_J_JOIN_ERROR, FIND_NO_PJ_ERROR} from './constants/error'
import {TTable, ICheckParams, IFindRes, TSentence} from './index'
import findTrans from './utils/findTrans'
import timeHash from './utils/timeHash'


const SAME_NAME_TAG = '__as__hash__'


function fetchFind(table: TTable, params: ICheckParams): Promise<IFindRes>
function fetchFind(table: TTable, params: ICheckParams, query: TSentence): Promise<string>
function fetchFind(table: TTable, params: ICheckParams, query?: TSentence): Promise<IFindRes | string>{
  let {BaaS_F, minapp, options} = getBaaSF()
  if(!table) throw new Error(PARAM_TABLE_ERROR)
  return new Promise((resolve, reject)=>{

    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      let QQ = findTrans(params, 1, BaaS_F, minapp)
      let Product = new BaaS_F.TableObject(table)
      if(query === 'sentence'){
        resolve(QQ)
        return
      }
      if(QQ){
        Product.setQuery(QQ).limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).orderBy(params.orderBy || '-created_at').select(params.select || []).expand(params.expand || []).find({withCount: params.withCount || false}).then((res: IFindRes) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      }else{
        Product.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).orderBy(params.orderBy || '-created_at').select(params.select || []).expand(params.expand || []).find({withCount: params.withCount || false}).then((res: IFindRes) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      }
    }

    //Mongo类平台
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MONGODB){
        let QQ = findTrans(params, 1, BaaS_F, minapp) || {}
        let sortObj = {}
        if(params.orderBy){
          if(isArray(params.orderBy)){
            let temp = params.orderBy as string[]
            for(let i = 0; i < temp.length; i++){
              if(temp[i][0] === '-'){
                sortObj[temp[i].substring(1, temp[i].length)] = -1
              }else{
                sortObj[temp[i]] = 1
              }
            }
          }else{
            let temp = params.orderBy as string
            if(temp[0] === '-'){
              sortObj[temp.substring(1, temp.length)] = -1
            }else{
              sortObj[temp] = 1
            }
          }
        }
        if(query === 'sentence'){
          resolve(QQ)
          return
        }
        BaaS_F.MongoClient.connect(options.host, {useUnifiedTopology: true}, (err, client) => {
          if(err) throw new Error(err)
          let db = client.db(options.env)
          db.collection(table).find(QQ)
          .limit(params.limit || 20)
          .skip((params.limit || 20) * ((params.page || 1) - 1))
          .sort(sortObj).toArray(function(err, res) {
            if (err) reject(err)
            client.close()
            resolve({data: {objects: res || []}})
          })
        })
      }

      if(minapp === PLATFORM_NAME.WX_WEAPP 
        || minapp === PLATFORM_NAME.WX_CLOUD
        || minapp === PLATFORM_NAME.UNI_CLOUD
      ){
        //微信云
        let QQ = findTrans(params, 1, BaaS_F, minapp) || {}
        let db = BaaS_F.database()
        let tempCheck = db.collection(table)
        let tempOrder = [{field: '', method: ''}, {field: '', method: ''}]
        let tempSelect = {}

        if(params.select){
          if(isArray(params.select)){
            let temp = params.select as string[]
            for(let i = 0; i < temp.length; i++){
              if(temp[i][0] === '-'){
                tempSelect[temp[i].substring(1, temp[i].length)] = false
              }else{
                tempSelect[temp[i]] = true
              }
            }
          }else{
            let temp = params.select as string
            if(temp[0] === '-'){
              tempSelect[temp.substring(1, temp.length)] = false
            }else{
              tempSelect[temp] = true
            }
          }
        }

        if(params.orderBy){
          if(isArray(params.orderBy)){
            let temp = params.orderBy as string[]
            for(let i = 0; i < temp.length; i++){
              if(temp[i][0] === '-'){
                tempOrder[i] = {
                  field: temp[i].substring(1, temp[i].length),
                  method: 'desc'
                }
              }else{
                tempOrder[i] = {
                  field: temp[i],
                  method: 'asc'
                }
              }
            }
          }else{
            let temp = params.orderBy as string
            if(temp[0] === '-'){
              tempOrder[0] = {
                field: temp.substring(1, temp.length),
                method: 'desc'
              }
            }else{
              tempOrder[0] = {
                field: temp,
                method: 'asc'
              }
            }
          }
        }
        if(query === 'sentence'){
          resolve(QQ)
          return
        }
        if(tempOrder[1].field){
          tempCheck.limit(params.limit || 20)
          .skip((params.limit || 20) * ((params.page || 1) - 1))
          .where(QQ)
          .orderBy(tempOrder[0].field, tempOrder[0].method)
          .orderBy(tempOrder[1].field, tempOrder[1].method)
          .field(tempSelect)
          .get()
          .then(res => {
            resolve({data: {objects: res.data}})
          }, (err: any) => {
            reject(err)
          })
        }else if(tempOrder[0].field){
          tempCheck.limit(params.limit || 20)
          .skip((params.limit || 20) * ((params.page || 1) - 1))
          .where(QQ)
          .orderBy(tempOrder[0].field, tempOrder[0].method)
          .field(tempSelect)
          .get()
          .then(res => {
            resolve({data: {objects: res.data || []}})
          }, (err: any) => {
            reject(err)
          })
        }else{
          tempCheck.limit(params.limit || 20)
          .skip((params.limit || 20) * ((params.page || 1) - 1))
          .where(QQ)
          .field(tempSelect)
          .get()
          .then(res => {
            resolve({data: {objects: res.data || []}})
          }, (err: any) => {
            reject(err)
          })
        }
      }
    }

    //mysql类
    if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MYSQL){

        let tableList = table.toString().replace(/\s*/g, '').split(',')
        let tableHash = {}, tableMain = tableList[0]
        let joinList = []
        for(let j = 0; j < J_MAX; j++){
          if(params[`j${j}`]){
            let t1 = params[`j${j}`][0].split('.')
            let t2 = params[`j${j}`][2] ? params[`j${j}`][2].split('.') : ''
            if(t1.length === 1){
              t1[0] = tableMain
            }
            if(t2.length === 1){
              t2[0] = tableMain
            }
            if(t1[0] === t2[0]){
              t2[0] = t2[0] + SAME_NAME_TAG
            }
            if(tableList.indexOf(t1[0]) === -1 && tableMain !== t1[0]){
              tableList.push(t1[0])
            }
            if(params[`j${j}`][1] === 'inner'
              || params[`j${j}`][1] === 'left'
              || params[`j${j}`][1] === 'right'
              || params[`j${j}`][1] === 'full'
            ){
              if(t2[0] === SAME_NAME_TAG) throw new Error(FIND_J_JOIN_ERROR)
              if(joinList.indexOf(t2[0]) === -1 && tableMain !== t2[0]){
                joinList.push(t2[0])
              }
            }
          }
        }

        let alltable = [...tableList, ...joinList]  //使用到的table，都要列出来
        let des = []
        for(let i = 0; i < alltable.length; i++){
          if(!tableHash[alltable[i]]){
            if(tableList.indexOf(alltable[i]) > -1){
              let tempHash = timeHash()
              tableHash[alltable[i]] = tempHash
              if(joinList.indexOf(alltable[i]) === -1){
                des.push(`${alltable[i]} AS ${tempHash}`)
              }
            }else{
              tableHash[alltable[i]] = alltable[i]
            }
          }
        }

        let joinDes = '', jObj = {}, jTable = {}, jUniqueTable = []
        for(let j = 0; j < J_MAX; j++){
          if(params[`j${j}`]){
            let t1 = params[`j${j}`][0].split('.')
            if(t1.length === 1){
              t1.push(t1[0])
              t1[0] = tableMain
            }
            let isSameName = false
            let t2 = ['']
            if(params[`j${j}`][2]){
              if(params[`j${j}`][2].indexOf('SELECT') > -1){
                t2 = [`(${params[`j${j}`][2]})`]
              }else{
                t2 = params[`j${j}`][2].split('.')
              }
            }
            switch(params[`j${j}`][1]) {
              case 'uniqueTable': 
                jUniqueTable.push(params[`j${j}`][0])
                break
              case 'tableOf':
                jTable[`${params[`j${j}`][0]}`] = t2[0]
                break
              case 'inner':
                if(t2.length === 1){
                  t2.push(t2[0])
                  t2[0] = tableMain
                }
                if(t1[0] === t2[0]){
                  isSameName = true
                }
                joinDes = joinDes + ` INNER JOIN ${t2[0]} AS ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]} ON ${tableHash[t1[0]]}.${t1[1]} = ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]}.${t2[1]}`
                break
              case 'left':
                if(t2.length === 1){
                  t2.push(t2[0])
                  t2[0] = tableMain
                }
                if(t1[0] === t2[0]){
                  isSameName = true
                }
                joinDes = joinDes + ` LEFT JOIN ${t2[0]} AS ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]} ON ${tableHash[t1[0]]}.${t1[1]} = ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]}.${t2[1]}`
                break
              case 'right':
                if(t2.length === 1){
                  t2.push(t2[0])
                  t2[0] = tableMain
                }
                if(t1[0] === t2[0]){
                  isSameName = true
                }
                joinDes = joinDes + ` RIGHT JOIN ${t2[0]} AS ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]} ON ${tableHash[t1[0]]}.${t1[1]} = ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]}.${t2[1]}`
                break
              case 'full':
                if(t2.length === 1){
                  t2.push(t2[0])
                  t2[0] = tableMain
                }
                if(t1[0] === t2[0]){
                  isSameName = true
                }
                joinDes = joinDes + ` FULL JOIN ${t2[0]} AS ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]} ON ${tableHash[t1[0]]}.${t1[1]} = ${tableHash[t2[0] + (isSameName ? SAME_NAME_TAG : '')]}.${t2[1]}`
                break
              case 'count':
                if(params[`j${j}`][2] === 'distinct'){
                  jObj[`j${j}`] = t1[1] === '*' ? `COUNT(DISTINCT ${t1[1]})` : `COUNT(DISTINCT ${tableHash[t1[0]]}.${t1[1]})`
                }else{
                  jObj[`j${j}`] = t1[1] === '*' ? `COUNT(${t1[1]})` : `COUNT(${tableHash[t1[0]]}.${t1[1]})`
                }
                break
              case 'sum':
                if(params[`j${j}`][2] === 'distinct'){
                  jObj[`j${j}`] = `SUM(DISTINCT ${tableHash[t1[0]]}.${t1[1]})`
                }else{
                  jObj[`j${j}`] = `SUM(${tableHash[t1[0]]}.${t1[1]})`
                }
                break
              case 'max':
                if(params[`j${j}`][2] === 'distinct'){
                  jObj[`j${j}`] = `MAX(DISTINCT ${tableHash[t1[0]]}.${t1[1]})`
                }else{
                  jObj[`j${j}`] = `MAX(${tableHash[t1[0]]}.${t1[1]})`
                }
                break
              case 'min':
                if(params[`j${j}`][2] === 'distinct'){
                  jObj[`j${j}`] = `MIN(DISTINCT ${tableHash[t1[0]]}.${t1[1]})`
                }else{
                  jObj[`j${j}`] = `MIN(${tableHash[t1[0]]}.${t1[1]})`
                }
                break
              case 'avg':
                if(params[`j${j}`][2] === 'distinct'){
                  jObj[`j${j}`] = `AVG(DISTINCT ${tableHash[t1[0]]}.${t1[1]})`
                }else{
                  jObj[`j${j}`] = `AVG(${tableHash[t1[0]]}.${t1[1]})`
                }
                break
              case 'ucase':
                jObj[`j${j}`] = `UCASE(${tableHash[t1[0]]}.${t1[1]})`
                break
              case 'lcase':
                jObj[`j${j}`] = `LCASE(${tableHash[t1[0]]}.${t1[1]})`
                break
              case 'mid':
                if(params[`j${j}`][3]){
                  jObj[`j${j}`] = `MID(${tableHash[t1[0]]}.${t1[1]},${params[`j${j}`][2]},${params[`j${j}`][3]})`
                }else if(params[`j${j}`][2]){
                  jObj[`j${j}`] = `MID(${tableHash[t1[0]]}.${t1[1]},${params[`j${j}`][2]})`
                }else{
                  jObj[`j${j}`] = `MID(${tableHash[t1[0]]}.${t1[1]},1)`
                }
                break
              case 'len':
                jObj[`j${j}`] = `LEN(${tableHash[t1[0]]}.${t1[1]})`
                break
              case 'round':
                jObj[`j${j}`] = `ROUND(${tableHash[t1[0]]}.${t1[1]},${params[`j${j}`][2] || 0})`
                break
              case 'now':
                jObj[`j${j}`] = `NOW()`
                break
              case 'format':
                jObj[`j${j}`] = `FORMAT(${tableHash[t1[0]]}.${t1[1]},${params[`j${j}`][2]})`
                break
              default:
                break
            }
          }
        }

        let QQ = findTrans(params, 1, {tableHash: tableHash, tableMain: tableMain, table}, minapp)
        let QQ2 = findTrans(params, 2, {tableHash: tableHash, tableMain: tableMain, jObj, table}, minapp)
        let selectArr = []
        if(params.select){
          if (isArray(params.select)){
            for(let n = 0; n < params.select.length; n++){
              if(params.select[n].indexOf('SELECT') > -1){
                selectArr.push(`(${params.select[n]}) AS ${tableMain}_s${n}`)
              }else{
                if(J_NAME_LIST.indexOf(params.select[n]) > -1){
                  if(!params[params.select[n]]) throw new Error(FIND_NO_PJ_ERROR + params.select[n])
                  //let tempSe = params[params.select[n]]
                  // let tempSe1 = tempSe[0].split('.')
                  // if(tempSe1.length === 1){
                  //   tempSe1[1] = tempSe1[0]
                  // }
                  //selectArr.push(`${jObj[params.select[n]]} AS ${tempSe1[1] === '*' ? 'all' : tempSe1[1]}_${tempSe[1]}${n}`)
                  selectArr.push(`${jObj[params.select[n]]} AS ${params.select[n]}`)
                }else{
                  let tempS = params.select[n].split('.')
                  if(tempS.length === 1){
                    selectArr.push(`${tableHash[tableMain]}.${tempS}`)
                  }else{
                    selectArr.push(`${tableHash[tempS[0]]}.${tempS[1]}`)
                  }
                }
              }
            }
          }else{
            let sstring = params.select as string
            if(sstring.indexOf('SELECT') > -1){
              selectArr.push(`(${sstring}) AS ${tableMain}_s0`)
            }else{
              let tempstr = sstring as string
              if(J_NAME_LIST.indexOf(tempstr) > -1){
                if(!params[tempstr]) throw new Error(FIND_NO_PJ_ERROR + tempstr)
                // let tempSe = params[tempstr]
                // let tempSe1 = tempSe[0].split('.')
                // if(tempSe1.length === 1){
                //   tempSe1[1] = tempSe1[0]
                // }
                //selectArr.push(`${jObj[tempstr]} AS ${tempSe1[1] === '*' ? 'all' : tempSe1[1]}_${tempSe[1]}0`)
                selectArr.push(`${jObj[tempstr]} AS ${tempstr}`)
              }else{
                let tempS = tempstr.split('.')
                if(tempS.length === 1){
                  selectArr.push(`${tableHash[tableMain]}.${tempS}`)
                }else{
                  selectArr.push(`${tableHash[tempS[0]]}.${tempS[1]}`)
                }
              }
            }
          }
        }else{
          selectArr = ['*']
        }

        let groupArr = [] //长度为1，只有一个
        if(params.groupBy){
          if(isArray(params.groupBy)){
            let tempG = params.groupBy[0].split('.')
            if(tempG.length === 1){
              groupArr.push(`${tableHash[tableMain]}.${tempG[0]}`)
            }else{
              groupArr.push(`${tableHash[tempG[0]]}.${tempG[1]}`)
            }
          }else{
            let tempGstr = params.groupBy as string
            let tempG = tempGstr.split('.')
            if(tempG.length === 1){
              groupArr.push(`${tableHash[tableMain]}.${tempG[0]}`)
            }else{
              groupArr.push(`${tableHash[tempG[0]]}.${tempG[1]}`)
            }
          }
        }

        let orderArr = [] //
        if(params.orderBy){
          if(isArray(params.orderBy)){
            let temp = params.orderBy as string[]
            for(let i = 0; i < temp.length; i++){
              let tempG = temp[i].split('.')
              if(tempG.length === 1){
                if(tempG[0][0] === '-'){
                  tempG[0] = tempG[0].replace('-', '')
                  orderArr.push(`${tableHash[tableMain]}.${tempG[0]} DESC`)
                }else{
                  orderArr.push(`${tableHash[tableMain]}.${tempG[0]} ASC`)
                }
              }else{
                if(tempG[0][0] === '-'){
                  tempG[0] = tempG[0].replace('-', '')
                  orderArr.push(`${tableHash[tempG[0]]}.${tempG[1]} DESC`)
                }else{
                  orderArr.push(`${tableHash[tempG[0]]}.${tempG[1]} ASC`)
                }
              }
            }
          }else{
            let temp = params.orderBy as string
            let tempG = temp.split('.')
            if(tempG.length === 1){
              if(tempG[0][0] === '-'){
                tempG[0] = tempG[0].replace('-', '')
                orderArr.push(`${tableHash[tableMain]}.${tempG[0]} DESC`)
              }else{
                orderArr.push(`${tableHash[tableMain]}.${tempG[0]} ASC`)
              }
            }else{
              if(tempG[0][0] === '-'){
                tempG[0] = tempG[0].replace('-', '')
                orderArr.push(`${tableHash[tempG[0]]}.${tempG[1]} DESC`)
              }else{
                orderArr.push(`${tableHash[tempG[0]]}.${tempG[1]} ASC`)
              }
            }
          }
        }


        let sql = ''
        sql = `SELECT ${selectArr.length > 0 ? selectArr.toString() + ' ' : '* '}`
        + `FROM ${des.toString()} `
        + `${joinDes} `
        + (QQ ? `WHERE ${QQ} ` : ' ')
        + (groupArr.length > 0 ? `GROUP BY ${groupArr.toString()} ` : ' ')
        + (QQ2 ? `HAVING ${QQ2} ` : ' ')
        + (orderArr.length > 0 ? `ORDER BY ${orderArr.toString()} ` : ' ')
        + ((params.limit || params.page) ? `LIMIT ${params.limit || 20} ` : ' ')
        + (params.page ? `OFFSET ${(params.limit || 20) * ((params.page || 1) - 1)}` : '')
        
        if(jUniqueTable.length > 0){
          //去掉重复命令的，以父查寻命名为准
          for(let t in tableHash){
            if(jUniqueTable.indexOf(t) > -1){
              let tempOneHash = `${t} AS ${tableHash[t]}`
              let oneHash = `${tableHash[t]}`
              let reg = new RegExp(`${t} AS [a-z]{14}`, 'g')
              let tempMatch = sql.match(reg) || []
              if(tempMatch.length > 1){
                for(let j = 0; j < tempMatch.length; j++){
                  let thash = tempMatch[j].replace(`${t} AS `, '')
                  if(tempMatch[j] !== tempOneHash){
                    let reg2 = new RegExp(`,?${tempMatch[j]}`, 'g')
                    sql = sql.replace(reg2, '')
                  }
                  let reg3 = new RegExp(`${thash}`, 'g')
                  sql = sql.replace(reg3, oneHash)
                }
              }
            }
          }
        }
        //如果 jTable 有值，则，再进行替换
        for(let jt in jTable){
          let regJt = new RegExp(`${jt}`, 'g')
          sql = sql.replace(regJt, `${jTable[jt]}`)
        }
        sql = sql.replace(/\s+/ig, ' ')

        if(query === 'sentence'){
          resolve(sql)
          return
        }
        mysqlConnect({BaaS_F, options}, sql, [], (err, results, fields) => {
          if (err) {
            reject(err)
          }
          let jsonStr = JSON.stringify(results || [])
          resolve({data: {objects: JSON.parse(jsonStr)}})
        })

      }
    }
    
    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      let QQ = findTrans(params, 1, BaaS_F, minapp) || ''
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      if(query === 'sentence'){
        resolve(QQ)
        return
      }
      BaaS_F({
        method: 'get',
        url: `${options.RequestBase}/hserve/v2.2/table/${table}/record/`,
        headers: options.Header,
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          order_by: params.orderBy || '-created_at',
          expand: (params.expand || []).toString(),
          keys: (params.select || []).toString(),
          return_total_count: params.withCount ? 1 : 0,
        },
      }).then((res: IFindRes) => {
        resolve(res)
      }).catch((err: any)=>{
        reject(err)
      })
    }

    //op
    if(minapp === PLATFORM_NAME.ZX_OP){
      let QQ = findTrans(params, 1, BaaS_F, minapp) || ''
      if(query === 'sentence'){
        resolve(QQ)
        return
      }
      BaaS_F.get(`https://cloud.minapp.com/userve/v2.4/table/${table}/record/`,{
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          order_by: params.orderBy || '-created_at',
          expand: (params.expand || []).toString(),
          return_total_count: params.withCount ? 1 : 0,
        }
      }).then((res: IFindRes) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
  })
}


export default fetchFind