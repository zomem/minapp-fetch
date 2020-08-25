
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME, PLATFORM_ALL, PLATFORM_NAME_MONGO_SERVER} from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'



function fetchGetSuperGroup(superGroupID: number): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  
  return new Promise<any>((resolve, reject) => {
    if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
      if(minapp === PLATFORM_NAME.ZX_CLOUD){
        let userSuperGroup = new BaaS_F.UserSuperGroup()
        userSuperGroup.get(superGroupID).then((res: any) => {
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
      throw new Error(`minapp.getSuperGroup ${METHOD_NOT_SUPPORT}`)
    }

    
     //op 运营后台
    if(minapp === PLATFORM_NAME.ZX_OP){
      BaaS_F.get(`https://cloud.minapp.com/userve/v1/user-supergroup/${superGroupID}/`).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    }
    if(PLATFORM_ALL.indexOf(minapp) === -1){
      throw new Error(`minapp.getSuperGroup ${METHOD_NOT_SUPPORT}`)
    }
  })
}


export default fetchGetSuperGroup