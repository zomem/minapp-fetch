/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:57:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /@ownpack/weapp/src/fetch/data/set.ts
 */ 

import { getBaaSF, isArray } from './utils/utils'
import {PLATFORM_NAME, PLATFORM_NAME_MYSQL_SERVER} from './constants/constants'
import {METHOD_NOT_SUPPORT, TRAN_P_ERROR} from './constants/error'



const connectQuery = (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, [], (err, res) => {
      if(err) reject(err)
      resolve(res)
    })
  })
}

function fetchTransaction(sqlList: string[], checkFunc?: Function): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()
  return new Promise((resolve, reject)=>{

    if(!isArray(sqlList)){
      throw new Error(TRAN_P_ERROR)
    }else{
      if(sqlList.length === 0){
        throw new Error(TRAN_P_ERROR)
      }
    }

    //mysql类
    if(PLATFORM_NAME_MYSQL_SERVER.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.MYSQL){
        let pool = BaaS_F.createPool({
          ...options
        })
        pool.getConnection((err, connection) => {
          if(err) throw new Error(err)
          connection.beginTransaction(async err_begin => {
            if(err_begin) reject(err_begin)
            try{
              let resList = []
              for(let i = 0; i < sqlList.length; i++){
                if(sqlList[i].indexOf('SELECT') > -1){
                  let jsonStr = JSON.stringify(await connectQuery(connection, sqlList[i]) || [])
                  resList[i]['data']['objects'] = JSON.parse(jsonStr)
                }else{
                  resList[i]['data'] = await connectQuery(connection, sqlList[i])
                }
              }
              if(checkFunc){
                let backRes = checkFunc(resList)
                if(backRes !== 1){
                  connection.rollback()
                  resolve(backRes)
                }
              }
              connection.commit(err_commit => {
                if(err_commit) {
                  connection.rollback()
                  reject(err_commit)
                }
                resolve(1)
              })
            }catch(err_catch){
              connection.rollback()
              reject(err_catch)
            }
          })
          connection.release()
        })
      }
    }else{
      throw new Error(`minapp.transaction ${METHOD_NOT_SUPPORT}`)
    }
    
  })
}


export default fetchTransaction