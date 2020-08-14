
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'




//
function fetchDeleteSuperGroup(superGroupIDList: number[]): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  
  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject) => {
        let userSuperGroup = new BaaS_F.UserSuperGroup()
        userSuperGroup.delete(superGroupIDList).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      })
    }
    throw new Error(`minapp.deleteSuperGroup ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.deleteSuperGroup ${METHOD_NOT_SUPPORT}`)
  }
  
  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject) => {
      BaaS_F.delete(`https://cloud.minapp.com/userve/v1/user-supergroup/`, {
        params: {
          id__in: superGroupIDList.toString()
        }
      }).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  return new Promise<any>((resolve, reject)=>{
    resolve({})
  })
  
}



export default fetchDeleteSuperGroup