
import { getBaaSF } from './utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from './constants/constants'
import { METHOD_NOT_SUPPORT } from './constants/error'


//
function fetchAddUserIntoGroup(users: number[], groups: number[]): Promise<any>{
  let {BaaS_F, minapp} = getBaaSF()

  if(PLATFORM_NAME_BAAS.indexOf(minapp) > -1){
    if(minapp === PLATFORM_NAME.CLOUD){
      return new Promise<any>((resolve, reject) => {
        let userGroup = new BaaS_F.UserGroup()
        userGroup.addUserIntoGroup(users, groups).then((res: any) => {
          // success
          resolve(res)
        }, (err: any) => {
          // err
          reject(err)
        })
      })
    }
    throw new Error(`minapp.addUserIntoGroup ${METHOD_NOT_SUPPORT}`)
  }

  //webapi
  if(minapp === PLATFORM_NAME.WEBAPI){
    throw new Error(`minapp.addUserIntoGroup ${METHOD_NOT_SUPPORT}`)
  }
  
  //op 运营后台
  if(minapp === PLATFORM_NAME.OP){
    return new Promise<any>((resolve, reject) => {
      BaaS_F.patch('https://cloud.minapp.com/userve/v1/miniapp/group/membership/',
      [{
        op: 'add',
        path: '/membership',
        users: users,
        groups: groups
      }]).then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
  return new Promise<any>((resolve, reject)=>{
    resolve({
      data: {
        created_by: 0,
        created_at: 0,
        updated_at: 0,
        id: ''
      }
    })
  })
  
}



export default fetchAddUserIntoGroup