
export const PLATFORM_ERROR = '未调用minapp.init()进行初始化。'
export const INIT_ERROR = 'minapp.init()参数不正确'
export const WEBAPI_OPTIONS_ERROR = '初始化时，options参数有误'
export const METHOD_NOT_SUPPORT = '当前平台暂不支持此方法'
export const FIND_R_ERROR = '规则r未定义。'
export const FIND_CHECKR_ERROR = '规则r里的括号未对应（成对）。'

export const UPDATE_ERROR = '参数(params)格式不对。'
export const FIND_MANY_L_ERROR = '参数数组(params array)错误。'


export const CLIENT_ID_ERROR = '未输入clientID。'


export const FIND_P_ERROR = 'p参数(p0~p99)错误。'
export const FIND_NO_PJ_ERROR = '未定义参数：'
export const FIND_J_ERROR = 'j参数(j0~j9)错误。'



export const PAY_WAY_ERROR = '支付方式(way)必须为 alipay, weapp, qq, swan 中的一种。'
export const PAY_WAY_PLATFORM_ERROR = '支付平台错误。'

//geo
export const GEO_POLYGON_ERROR = 'Polygon类型，点的个数至少3个，且首尾点要相同。所以传入的参数长度至少为4'

export const PARAM_TABLE_ERROR = 'table参数不能为空'




//between参数个数
export const FIND_P_BETWEEN_ERROR = 'between方法，需要两个参数'

//join
export const FIND_J_JOIN_ERROR = 'join方法，需要写明两个字段'

//setMany
export const SET_MANY_PARAMS_ARR_ERROR = 'params方法的参数应该为数组对象'

//事务错误
export const TRAN_P_ERROR = '事务参数列表为数组，且不能为空'