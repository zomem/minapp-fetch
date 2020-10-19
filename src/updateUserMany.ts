import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'
import {IUpdateManyParams} from './types'
import updateTrans from './utils/updateTrans'
import findTrans from './utils/findTrans'



function fetchUpdateUserMany(params: IUpdateManyParams): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  return new Promise<any>((resolve, reject) => {
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let User = new BaaS_F.User()
        let QQ = findTrans(params, BaaS_F, minapp)
        let { u } = params
        let records = updateTrans(u, User.limit(params.limit || 20).offset((params.limit || 20) * ((params.page || 1) - 1)).getWithoutData(QQ), minapp)
        records.update({
          enableTrigger: params.enableTrigger === undefined ? true : params.enableTrigger,
          withCount: params.withCount || false
        }).then((res: any) => {
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

    

    //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      let QQ = findTrans(params, BaaS_F, minapp)
      let { u } = params
      let updata = updateTrans(u, {}, minapp)

      BaaS_F({
        method: 'put',
        url: 'https://cloud.minapp.com/userve/v2.2/miniapp/user_profile/',
        params: {
          where: QQ,
          limit: params.limit || 20,
          offset: (params.limit || 20) * ((params.page || 1) - 1),
          enable_trigger: params.enableTrigger === undefined ? true : params.enableTrigger,
          return_total_count: params.withCount ? 1 : 0,
        },
        data: updata
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.updateUserMany ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchUpdateUserMany