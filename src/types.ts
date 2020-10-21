import { type } from "os"


//初始化的平台
type TWxCloudEnvInit = {
  database?: string
  storage?: string
  functions?: string
  default?: string
}
export type TPlatform = 'zx_alipay' | 'zx_cloud' | 'zx_jd' | 'zx_op' | 'zx_qq' | 'zx_rn' | 'zx_swan' | 'zx_tt' | 'zx_weapp' | 'zx_web' | 'zx_webapi' | 'wx_weapp' | 'wx_cloud' | 'mongodb'
export interface IWebApiInit {
  clientID?: string
  host?: string
  accessToken?: string
  env?: string | TWxCloudEnvInit
  traceUser?: boolean,
  timeout?: number,
  [key: string]: any
}

//getBaaSF的返回
export type THeader = {
  [key: string]: string | number | undefined | null
}
export interface IGetBaaSF {
  BaaS_F: any
  minapp: TPlatform
  options?: {
    RequestBase?: string
    Header?: THeader
    host?: string
    env?: string | TWxCloudEnvInit
  }
}


//查寻的表名或表id
export type TTable = string | number

//查寻的方法
export type TCheckMethod = '=' | '!=' | '<' | '<=' | '>' | '>=' |
'in' | 'notIn' | 'arrayContains' |
'contains' | 'matches' | 'stringLength' |
'hasKey' |
'isNull' | 'isExists' |
'include' | 'withinCircle' | 'withinRegion' | 'within'



//查寻的参数
export type TP = 'p0' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8'
| 'p9' | 'p10' | 'p11' | 'p12' | 'p13' | 'p14' | 'p15' | 'p16' | 'p17' | 'p18' | 'p19'
| 'p20' | 'p21' | 'p22' | 'p23' | 'p24' | 'p25' | 'p26' | 'p27' | 'p28' | 'p29' | 'p30'

//文件查寻时
type TField = 'id' | 'name' | 'size' | 'category_id' | 'category_name' | 'created_at'

interface IPRList {
  p0?: [string, TCheckMethod, ...any[]]
  p1?: [string, TCheckMethod, ...any[]]
  p2?: [string, TCheckMethod, ...any[]]
  p3?: [string, TCheckMethod, ...any[]]
  p4?: [string, TCheckMethod, ...any[]]
  p5?: [string, TCheckMethod, ...any[]]
  p6?: [string, TCheckMethod, ...any[]]
  p7?: [string, TCheckMethod, ...any[]]
  p8?: [string, TCheckMethod, ...any[]]
  p9?: [string, TCheckMethod, ...any[]]
  p10?: [string, TCheckMethod, ...any[]]
  p11?: [string, TCheckMethod, ...any[]]
  p12?: [string, TCheckMethod, ...any[]]
  p13?: [string, TCheckMethod, ...any[]]
  p14?: [string, TCheckMethod, ...any[]]
  p15?: [string, TCheckMethod, ...any[]]
  p16?: [string, TCheckMethod, ...any[]]
  p17?: [string, TCheckMethod, ...any[]]
  p18?: [string, TCheckMethod, ...any[]]
  p19?: [string, TCheckMethod, ...any[]]
  p20?: [string, TCheckMethod, ...any[]]
  p21?: [string, TCheckMethod, ...any[]]
  p22?: [string, TCheckMethod, ...any[]]
  p23?: [string, TCheckMethod, ...any[]]
  p24?: [string, TCheckMethod, ...any[]]
  p25?: [string, TCheckMethod, ...any[]]
  p26?: [string, TCheckMethod, ...any[]]
  p27?: [string, TCheckMethod, ...any[]]
  p28?: [string, TCheckMethod, ...any[]]
  p29?: [string, TCheckMethod, ...any[]]
  p30?: [string, TCheckMethod, ...any[]]
  p31?: [string, TCheckMethod, ...any[]]
  p32?: [string, TCheckMethod, ...any[]]
  p33?: [string, TCheckMethod, ...any[]]
  p34?: [string, TCheckMethod, ...any[]]
  p35?: [string, TCheckMethod, ...any[]]
  p36?: [string, TCheckMethod, ...any[]]
  p37?: [string, TCheckMethod, ...any[]]
  p38?: [string, TCheckMethod, ...any[]]
  p39?: [string, TCheckMethod, ...any[]]
  p40?: [string, TCheckMethod, ...any[]]
  p41?: [string, TCheckMethod, ...any[]]
  p42?: [string, TCheckMethod, ...any[]]
  p43?: [string, TCheckMethod, ...any[]]
  p44?: [string, TCheckMethod, ...any[]]
  p45?: [string, TCheckMethod, ...any[]]
  p46?: [string, TCheckMethod, ...any[]]
  p47?: [string, TCheckMethod, ...any[]]
  p48?: [string, TCheckMethod, ...any[]]
  p49?: [string, TCheckMethod, ...any[]]
  p50?: [string, TCheckMethod, ...any[]]
  p51?: [string, TCheckMethod, ...any[]]
  p52?: [string, TCheckMethod, ...any[]]
  p53?: [string, TCheckMethod, ...any[]]
  p54?: [string, TCheckMethod, ...any[]]
  p55?: [string, TCheckMethod, ...any[]]
  p56?: [string, TCheckMethod, ...any[]]
  p57?: [string, TCheckMethod, ...any[]]
  p58?: [string, TCheckMethod, ...any[]]
  p59?: [string, TCheckMethod, ...any[]]
  p60?: [string, TCheckMethod, ...any[]]
  p61?: [string, TCheckMethod, ...any[]]
  p62?: [string, TCheckMethod, ...any[]]
  p63?: [string, TCheckMethod, ...any[]]
  p64?: [string, TCheckMethod, ...any[]]
  p65?: [string, TCheckMethod, ...any[]]
  p66?: [string, TCheckMethod, ...any[]]
  p67?: [string, TCheckMethod, ...any[]]
  p68?: [string, TCheckMethod, ...any[]]
  p69?: [string, TCheckMethod, ...any[]]
  p70?: [string, TCheckMethod, ...any[]]
  p71?: [string, TCheckMethod, ...any[]]
  p72?: [string, TCheckMethod, ...any[]]
  p73?: [string, TCheckMethod, ...any[]]
  p74?: [string, TCheckMethod, ...any[]]
  p75?: [string, TCheckMethod, ...any[]]
  p76?: [string, TCheckMethod, ...any[]]
  p77?: [string, TCheckMethod, ...any[]]
  p78?: [string, TCheckMethod, ...any[]]
  p79?: [string, TCheckMethod, ...any[]]
  p80?: [string, TCheckMethod, ...any[]]
  p81?: [string, TCheckMethod, ...any[]]
  p82?: [string, TCheckMethod, ...any[]]
  p83?: [string, TCheckMethod, ...any[]]
  p84?: [string, TCheckMethod, ...any[]]
  p85?: [string, TCheckMethod, ...any[]]
  p86?: [string, TCheckMethod, ...any[]]
  p87?: [string, TCheckMethod, ...any[]]
  p88?: [string, TCheckMethod, ...any[]]
  p89?: [string, TCheckMethod, ...any[]]
  p90?: [string, TCheckMethod, ...any[]]
  p91?: [string, TCheckMethod, ...any[]]
  p92?: [string, TCheckMethod, ...any[]]
  p93?: [string, TCheckMethod, ...any[]]
  p94?: [string, TCheckMethod, ...any[]]
  p95?: [string, TCheckMethod, ...any[]]
  p96?: [string, TCheckMethod, ...any[]]
  p97?: [string, TCheckMethod, ...any[]]
  p98?: [string, TCheckMethod, ...any[]]
  p99?: [string, TCheckMethod, ...any[]]
  r: string
}

interface IPRFileList {
  p0?: [TField, TCheckMethod, ...any[]]
  p1?: [TField, TCheckMethod, ...any[]]
  p2?: [TField, TCheckMethod, ...any[]]
  p3?: [TField, TCheckMethod, ...any[]]
  p4?: [TField, TCheckMethod, ...any[]]
  p5?: [TField, TCheckMethod, ...any[]]
  p6?: [TField, TCheckMethod, ...any[]]
  p7?: [TField, TCheckMethod, ...any[]]
  p8?: [TField, TCheckMethod, ...any[]]
  p9?: [TField, TCheckMethod, ...any[]]
  p10?: [TField, TCheckMethod, ...any[]]
  p11?: [TField, TCheckMethod, ...any[]]
  p12?: [TField, TCheckMethod, ...any[]]
  p13?: [TField, TCheckMethod, ...any[]]
  p14?: [TField, TCheckMethod, ...any[]]
  p15?: [TField, TCheckMethod, ...any[]]
  p16?: [TField, TCheckMethod, ...any[]]
  p17?: [TField, TCheckMethod, ...any[]]
  p18?: [TField, TCheckMethod, ...any[]]
  p19?: [TField, TCheckMethod, ...any[]]
  p20?: [TField, TCheckMethod, ...any[]]
  p21?: [TField, TCheckMethod, ...any[]]
  p22?: [TField, TCheckMethod, ...any[]]
  p23?: [TField, TCheckMethod, ...any[]]
  p24?: [TField, TCheckMethod, ...any[]]
  p25?: [TField, TCheckMethod, ...any[]]
  p26?: [TField, TCheckMethod, ...any[]]
  p27?: [TField, TCheckMethod, ...any[]]
  p28?: [TField, TCheckMethod, ...any[]]
  p29?: [TField, TCheckMethod, ...any[]]
  p30?: [TField, TCheckMethod, ...any[]]
  p31?: [TField, TCheckMethod, ...any[]]
  p32?: [TField, TCheckMethod, ...any[]]
  p33?: [TField, TCheckMethod, ...any[]]
  p34?: [TField, TCheckMethod, ...any[]]
  p35?: [TField, TCheckMethod, ...any[]]
  p36?: [TField, TCheckMethod, ...any[]]
  p37?: [TField, TCheckMethod, ...any[]]
  p38?: [TField, TCheckMethod, ...any[]]
  p39?: [TField, TCheckMethod, ...any[]]
  p40?: [TField, TCheckMethod, ...any[]]
  p41?: [TField, TCheckMethod, ...any[]]
  p42?: [TField, TCheckMethod, ...any[]]
  p43?: [TField, TCheckMethod, ...any[]]
  p44?: [TField, TCheckMethod, ...any[]]
  p45?: [TField, TCheckMethod, ...any[]]
  p46?: [TField, TCheckMethod, ...any[]]
  p47?: [TField, TCheckMethod, ...any[]]
  p48?: [TField, TCheckMethod, ...any[]]
  p49?: [TField, TCheckMethod, ...any[]]
  p50?: [TField, TCheckMethod, ...any[]]
  p51?: [TField, TCheckMethod, ...any[]]
  p52?: [TField, TCheckMethod, ...any[]]
  p53?: [TField, TCheckMethod, ...any[]]
  p54?: [TField, TCheckMethod, ...any[]]
  p55?: [TField, TCheckMethod, ...any[]]
  p56?: [TField, TCheckMethod, ...any[]]
  p57?: [TField, TCheckMethod, ...any[]]
  p58?: [TField, TCheckMethod, ...any[]]
  p59?: [TField, TCheckMethod, ...any[]]
  p60?: [TField, TCheckMethod, ...any[]]
  p61?: [TField, TCheckMethod, ...any[]]
  p62?: [TField, TCheckMethod, ...any[]]
  p63?: [TField, TCheckMethod, ...any[]]
  p64?: [TField, TCheckMethod, ...any[]]
  p65?: [TField, TCheckMethod, ...any[]]
  p66?: [TField, TCheckMethod, ...any[]]
  p67?: [TField, TCheckMethod, ...any[]]
  p68?: [TField, TCheckMethod, ...any[]]
  p69?: [TField, TCheckMethod, ...any[]]
  p70?: [TField, TCheckMethod, ...any[]]
  p71?: [TField, TCheckMethod, ...any[]]
  p72?: [TField, TCheckMethod, ...any[]]
  p73?: [TField, TCheckMethod, ...any[]]
  p74?: [TField, TCheckMethod, ...any[]]
  p75?: [TField, TCheckMethod, ...any[]]
  p76?: [TField, TCheckMethod, ...any[]]
  p77?: [TField, TCheckMethod, ...any[]]
  p78?: [TField, TCheckMethod, ...any[]]
  p79?: [TField, TCheckMethod, ...any[]]
  p80?: [TField, TCheckMethod, ...any[]]
  p81?: [TField, TCheckMethod, ...any[]]
  p82?: [TField, TCheckMethod, ...any[]]
  p83?: [TField, TCheckMethod, ...any[]]
  p84?: [TField, TCheckMethod, ...any[]]
  p85?: [TField, TCheckMethod, ...any[]]
  p86?: [TField, TCheckMethod, ...any[]]
  p87?: [TField, TCheckMethod, ...any[]]
  p88?: [TField, TCheckMethod, ...any[]]
  p89?: [TField, TCheckMethod, ...any[]]
  p90?: [TField, TCheckMethod, ...any[]]
  p91?: [TField, TCheckMethod, ...any[]]
  p92?: [TField, TCheckMethod, ...any[]]
  p93?: [TField, TCheckMethod, ...any[]]
  p94?: [TField, TCheckMethod, ...any[]]
  p95?: [TField, TCheckMethod, ...any[]]
  p96?: [TField, TCheckMethod, ...any[]]
  p97?: [TField, TCheckMethod, ...any[]]
  p98?: [TField, TCheckMethod, ...any[]]
  p99?: [TField, TCheckMethod, ...any[]]
  r: string
}

export interface ICheckParams extends IPRList {
  page?: number
  limit?: number
  orderBy?: string | string[]
  expand?: string | string[]
  select?: string | string[]
  withCount?: boolean
}

export interface ICheckFileParams extends IPRFileList {
  page?: number
  limit?: number
  orderBy?: string | string[]
  expand?: string | string[]
  select?: string | string[]
  withCount?: boolean
}

export interface ICountParams extends IPRList {
  limit?: 1
  withCount?: true
}

export interface ICountFileParams extends IPRFileList {
  limit?: 1
  withCount?: true
}

export interface IUpdateManyParams extends IPRList {
  page?: number
  limit?: number
  u: IUpdateParams
  expand?: string | string[]
  enableTrigger?: boolean
  withCount?: boolean
}


export type TCheckManyItem = [string | number, ICheckParams]

type TUpdateMethod = 'incr' | 'set' | 'unset' | 'patchObject' | 'geo' | 'append' | 'remove' | 'uAppend' | 'currentDate'
type TSetMethod = 'geo'
type dataType = string | string[] | number | number[] | boolean | boolean[] | null | undefined | {
  [propName: string] : any
} | {
  [index: number]: any
}
export interface IUpdateParams {
  [key: string]: [TUpdateMethod, dataType] | dataType
}

export interface ISetParams {
  [key: string]: [TSetMethod, dataType] | dataType
}

export interface ISetQuery {
  expand?: string | string[]
  enableTrigger?: boolean
}

export interface ISetManyQuery {
  enableTrigger?: boolean
}

export interface IGetParams {
  expand?: string | string[]
  select?: string | string[]
}

export interface IFileParams {
  filePath?: string,
  fileObj?: string,
  fileType?: string,
}

export interface IDeleteParams extends IPRList {
  page?: number
  limit?: number
  enableTrigger?: boolean
  withCount?: boolean
}

export interface IMetaData {
  categoryID?: string,
  categoryName?: string,
  fileName?: string,
  filePath?: string,
  contentType?: string,
}



export type TGetItem = [TTable, string, IGetParams]

export type TSetItem = [TTable, ISetParams]

export type TUpdateItem = [TTable, string, IUpdateParams]



export interface ICategoryParams {
  page?: number
  limit?: number
  orderBy?: '-created_at' | 'created_at' | '-updated_at' | 'updated_at'
  withCount?: boolean
}

export interface IContentGroupParams{
  page?: number
  limit?: number
  withCount?: boolean
}

export interface ISetCategoryParams {
  name: string
  parent?: number
}

export interface ISetContentParams {
  title?: string
  content?: string
  cover?: any
  description?: string
  categories?: number[]
  [propName: string]: any
}


//发送邮件
export interface ISendEmailParams {
  recipient?: string
  subject?: string
  body?: string
}


//支付平台
type TGetewayType = 'weixin_tenpay_wap' | 'weixin_tenpay_native' | 'weixin_tenpay_js' | 'alipay_page' | 'alipay_wap' | 'qpay_native'
export type TPayWay = 'zx_alipay' | 'zx_weapp' | 'zx_qq' | 'zx_swan' | 'zx_tt'

export interface IPayParams {
  gatewayType?: TGetewayType
  totalCost: number
  merchandiseDescription: string
  service?: string
  merchandiseSchemaID?: number
  merchandiseRecordID?: string
  merchandiseSnapshot?: any
  profitSharing?: boolean
}


//请求
type TRequestMethod = 'get' | 'delete' | 'head' | 'post' | 'put' | 'patch' | 'options' | 'trace' | 'connect'

export interface IRequestParams {
  url: string
  method: TRequestMethod
  baseURL?: string
  transformRequest?: any
  transformResponse?: any
  headers?: {
    [propName: string]: any
  }
  params?: any
  paramsSerializer?: any
  data?: any
  timeout?: number
  withCredentials?: boolean
  adapter?: any 
  auth?: any
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  responseEncoding?: string
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onUploadProgress?: any
  onDownloadProgress?: any
  maxContentLength?: number
  maxBodyLength?: number
  validateStatus?: any
  maxRedirects?: number
  socketPath?: string | null
  httpAgent?: any
  httpsAgent?: any
  proxy?: any
  cancelToken?: any
  decompress?: any
  dataType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
}

//
export interface ISubMessage {
  template_id: string | number
  subscription_type: 'once' | 'permanent'
}


//subscribe
export type TSubEvent = 'create' | 'update' | 'delete'
export type TSubUnionID = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 
'10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'


//subscribe res
export interface ISubRes {
  after: {
    [key: string]: any
  }
  before: {
    [key: string]: any
  }
  event: 'on_init' | 'on_create' | 'on_update' | 'on_delete' | 'on_error',
  schema_id: number,
  schema_name: string,
  id: string
}
export type ISubCallBack = (res: ISubRes, err?: any) => void


//gettablelist
export interface IGetTableListParams {
  limit?: number
  page?: number
  name?: string
}

//login
export interface ILoginParams {
  email?: string
  username?: string
  phone?: string
  password: string
}
//loginwith
export interface ILoginWithParams {
  createUser?: boolean
  syncUserProfile?: 'overwrite' | 'setnx' | 'false',
  withUnionID?: boolean
}

export type TWxDecryptType = 'we-run-data' | 'phone-number' | 'open-gid'


//三方登录
export type TLoginThirdProvider = 'oauth-wechat-mp' | 'oauth-wechat-web' | 'oauth-weibo'
export interface ILoginThirdParams {
  debug?: boolean
  mode?: 'popup-window' | 'popup-iframe' | 'redirect'
  authModalStyle?: any
  wechatIframeContentStyle?: any
  windowFeatures?: any
  createUser?: boolean
  syncUserProfile?: 'overwrite' | 'setnx' | 'false'
}


//当前用户的接口
export interface ICurrentUser {
  id: number
  get?: () => any
  toJSON?: () => any
  avatar?: string
  created_at?: number
  updated_at?: number
  nickname?: string
  city?: string
  country?: string
  created_by?: number
  gender?: number
  is_authorized?: boolean
  language?: string
  openid?: string
  province?: string
  session_expires_at?: string
  unionid?: string
  user_id?: number
  _anonymous?: boolean
  _email_verified?: boolean
  _provider?: {
    alipay: {
      avatar: string
      province: string
      city: string
      nick_name: string
      is_student: boolean
      user_type: string
      user_status: string
      verified: boolean
      gender: string
    },
    wechat: {
      avatar: string
      city: string
      country: string
      gender: number
      language: string
      nickname: string
      openid: string
      province: string
      unionid: string
    }
  }
  [key: string]: any
}

//find方法的返回
export interface IFindRes {
  statusCode?: number
  data: {
    meta?: {
      limit: number
      next: string | null
      offset: number
      previous: string | null
      total_count?: number
    },
    objects: any[]
  }
  [key: string]: any
}

//upload
export interface IUpdateSetRes {
  statusCode?: number
  data: {
    created_by?: number
    created_at?: number
    updated_at?: number
    id?: string
    _id?: string
  }
  [key: string]: any
}

//getFile
export interface IGetFileRes {
  statusCode?: number
  data: {
    categories?: {
      id?: string
      name?: string
    } | {
      id?: string
      name?: string
    }[]
    cdn_path?: string
    created_at: number
    id: string
    media_type?: string
    mime_type?: string
    name: string
    path: string
    size?: number
    status?: string
  }
  [key: string]: any
}

//getserverdate
export interface IGetServerTimeRes {
  data: {
    time: string
    [key: string]: any
  }
  status?: number
  [key: string]: any
}