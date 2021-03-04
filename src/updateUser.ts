import fetchGetUser from './getUser'
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT, WEBAPI_OPTIONS_ERROR } from './constants/error'
import {IUpdateParams} from './index'
import updateTrans from './utils/updateTrans'


function fetchUpdateUser(uid: number, params: IUpdateParams={}): Promise<any>{
  let {BaaS_F, minapp, options} = getBaaSF()

  return new Promise((resolve, reject) => {
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let MyUser = new BaaS_F.User()
        let user = updateTrans(params, MyUser.getWithoutData(uid), minapp)
        user.update().then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      }
    }


    //MongoDB
    if(PLATFORM_NAME_MONGO_SERVER.indexOf(minapp) > -1){
      throw new Error(`minapp.addUserIntoGroup ${METHOD_NOT_SUPPORT}`)
    }

    

    //webapi
    if(minapp === PLATFORM_NAME.ZX_WEBAPI){
      if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
      BaaS_F({
        method: 'put',
        url: `${options.RequestBase}/hserve/v2.0/user/account/`,
        headers: options.Header,
        data: params
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => { 
        reject(err)
      })
    }

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let updata: any = updateTrans(params, {}, minapp)
      BaaS_F({
        method: 'put',
        url: 'https://cloud.minapp.com/userve/v2.2/miniapp/user_profile/',
        params: {
          where: {
            "id": {"$eq": uid}
          },
          limit: 1,
          offset: 0,
          return_total_count: 0,
        },
        data: updata
      }).then((res: any) => {
        fetchGetUser(uid).then(user => {
          resolve(user)
        }, err => {
          reject(err)
        })
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.updateUser ${METHOD_NOT_SUPPORT}`)
    }
  })
}

export default fetchUpdateUser