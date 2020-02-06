
import { setArgs, getBaaSF } from '../../utils/utils'
import { PLATFORM_NAME_BAAS, PLATFORM_NAME } from '../../constants/constants'
import { METHOD_NOT_SUPPORT, PLATFORM_ERROR } from '../../constants/error'

let ArgsObj: {
  Platform?: string | undefined
  ClientID?: string | undefined
  RequestBase?: string | undefined
  AccessToken?: string | undefined
}

//
function fetchUpload(...data: [
  {
    filePath?: string,
    fileObj?: string,
    fileType?: string,
  },
  {
    categoryID?: string,
    categoryName?: string,
    fileName?: string,
    filePath?: string,
    contentType?: string,
  }
]){
  let BaaS_F = getBaaSF(ArgsObj)
  if(!ArgsObj.Platform){
    throw new Error(PLATFORM_ERROR)
  }
  if(PLATFORM_NAME_BAAS.indexOf(ArgsObj.Platform) > -1){

    if(ArgsObj.Platform === PLATFORM_NAME.CLOUD){
      let fileParams = data[0].fileObj
      let metaData = {
        category_id: data[1].categoryID,
        filename: data[1].fileName,
        filepath: data[1].filePath,
        contentType: data[1].contentType,
      }
      return new Promise((resolve, reject)=>{
        let MyFile = new BaaS_F.File()
        MyFile.upload(fileParams, metaData).then((res: any) => {
          // 上传成功
          resolve(res)
        }, (err: any) => {
          // HError 对象
          reject(err)
        })
      })
    }

    let [fileParams, metaData] = data
    return new Promise((resolve, reject)=>{
      let MyFile = new BaaS_F.File()
      MyFile.upload(fileParams, metaData).then((res: any) => {
        // 上传成功
        resolve(res)
      }, (err: any) => {
        // HError 对象
        reject(err)
      })
    })
  }

  //webapi
  if(ArgsObj.Platform === PLATFORM_NAME.WEBAPI){
    let fileParams: any = {
      fileObj: data[0].fileObj
    }
    let metaData: any = {
      filename: data[1].fileName,
      category_id: data[1].categoryID,
      category_name: data[1].categoryName,
    }
    return new Promise((resolve, reject) => {
      BaaS_F({
        method: 'post',
        url: `${ArgsObj.RequestBase}/hserve/v2.1/upload/`,
        headers: {
          'X-Hydrogen-Client-ID': ArgsObj.ClientID,
          'Authorization': `Hydrogen-r1 ${ArgsObj.AccessToken}`,
          'Content-Type': 'application/json',
        },
        data: metaData
      }).then((res: any) => {
        let tempA = res.data
        let formdata = new FormData()
        formdata.append('file', fileParams.fileObj)
        BaaS_F({
          method: 'post',
          url: tempA.upload_url,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            authorization: tempA.authorization,
            file: formdata,
            policy: tempA.policy
          }
        }).then((res2: any) => {
          let result = {
            data: {
              category: {
                id: metaData.category_id,
                name: metaData.category_name
              },
              created_at: res2.data.time,
              id: tempA.id,
              mime_type: res2.data.mimetype,
              name: tempA.name,
              path: tempA.path,
              size: res2.data.file_size
            }
          }
          resolve(result)
        }).catch((err: any) => {
          reject(err)
        })
      }).catch((err: any) => {
        reject(err)
      })
    })
    
  }

  //op 运营后台
  if(ArgsObj.Platform === PLATFORM_NAME.OP){
    let params: any = {
      fileObj: data[0].fileObj,
      filename: data[1].fileName,
      categoryID:  data[1].categoryID,
    }
    return new Promise((resolve, reject)=>{
      BaaS_F.post('https://cloud.minapp.com/userve/v2.1/upload/', {
        filename: params.filename,
        category_id: params.categoryID
      }).then((res: any) => {
        let temp = res.data
        let formData = new FormData()
        formData.append('file', params.fileObj)
        formData.append('policy', temp.policy)
        formData.append('authorization', temp.authorization)
        let axiosUp = require('axios')
        axiosUp.post(temp.upload_url, formData, {
          'headers': {'Content-Type': 'multipart/form-data'},
        }).then((res: any)=>{
          res.data.path = temp.path
          res.data.id = temp.id
          resolve(res)
        }).catch((err: any) => {
          reject(err)
        })
      }).catch((err: any) => {
        reject(err)
      })
    })
  }
  
}


function initFetchUpload(args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  ArgsObj = setArgs(args)
  return fetchUpload
}

export default initFetchUpload