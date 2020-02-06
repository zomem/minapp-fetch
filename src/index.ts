// args = [Platform, ClientID, RequestBase, AccessToken]


//内容库
import countContent from './fetch/content/countContent'
import findCategory from './fetch/content/findCategory'
import findContent from './fetch/content/findContent'
import findContentGroup from './fetch/content/findContentGroup'
import getCategory from './fetch/content/getCategory'
import getContent from './fetch/content/getContent'
import getContentGroup from './fetch/content/getContentGroup'

//数据表
import count from './fetch/data/count'
import countMany from './fetch/data/countMany'
import deleteData from './fetch/data/delete'
import find from './fetch/data/find'
import findMany from './fetch/data/findMany'
import get from './fetch/data/get'
import getMany from './fetch/data/getMany'
import set from './fetch/data/set'
import setMany from './fetch/data/setMany'
import setOneMany from './fetch/data/setOneMany'
import update from './fetch/data/update'
import updateMany from './fetch/data/updateMany'
import updateOneMany from './fetch/data/updateOneMany'

//文件
import countFile from './fetch/file/countFile'
import deleteFile from './fetch/file/deleteFile'
import findFile from './fetch/file/findFile'
import getFile from './fetch/file/getFile'
import upload from './fetch/file/upload'

//云函数
import invoke from './fetch/invoke/invoke'

//消息
import getServerDate from './fetch/message/getServerDate'
import sendEmail from './fetch/message/sendEmail'
import sendSmsCode from './fetch/message/sendSmsCode'
import verifySmsCode from './fetch/message/verifySmsCode'

//支付
import pay from './fetch/pay/pay'

//网络请求
import request from './fetch/request/request'

//数据表
import getTable from './fetch/table/getTable'
import getTableList from './fetch/table/getTableList'

//当前用户
import anonymous from './fetch/user/anonymous'
import currentUser from './fetch/user/currentUser'
import emailVerify from './fetch/user/emailVerify'
import login from './fetch/user/login'
import loginThirdParty from './fetch/user/loginThirdParty'
import loginWith from './fetch/user/loginWith'
import loginWithSmsVerificationCode from './fetch/user/loginWithSmsVerificationCode'
import logout from './fetch/user/logout'
import passwordReset from './fetch/user/passwordReset'
import redirectResult from './fetch/user/redirectResult'
import register from './fetch/user/register'
import thirdPartyAuth from './fetch/user/thirdPartyAuth'

//用户/用户组
import addUserIntoGroup from './fetch/userGroup/addUserIntoGroup'
import countUser from './fetch/userGroup/countUser'
import countUserMany from './fetch/userGroup/countUserMany'
import createSuperGroup from './fetch/userGroup/createSuperGroup'
import createUserGroup from './fetch/userGroup/createUserGroup'
import deleteSuperGroup from './fetch/userGroup/deleteSuperGroup'
import deleteUserGroup from './fetch/userGroup/deleteUserGroup'
import findUser from './fetch/userGroup/findUser'
import findUserMany from './fetch/userGroup/findUserMany'
import getSuperGroup from './fetch/userGroup/getSuperGroup'
import getSuperGroupList from './fetch/userGroup/getSuperGroupList'
import getUser from './fetch/userGroup/getUser'
import getUserGroup from './fetch/userGroup/getUserGroup'
import getUserGroupList from './fetch/userGroup/getUserGroupList'
import removeUserFromGroup from './fetch/userGroup/removeUserFromGroup'
import updateSuperGroup from './fetch/userGroup/updateSuperGroup'
import updateUser from './fetch/userGroup/updateUser'
import updateUserGroup from './fetch/userGroup/updateUserGroup'
import updateUserMany from './fetch/userGroup/updateUserMany'


function init(...args: ['alipay' | 'cloud' | 'op' | 'qq' | 'swan' | 'weapp' | 'web' | 'webapi' | 'default', ...string[]]){
  return {
    countContent: countContent(args),
    findCategory: findCategory(args),
    findContent: findContent(args),
    findContentGroup: findContentGroup(args),
    getCategory: getCategory(args),
    getContent: getContent(args),
    getContentGroup: getContentGroup(args),
    
    count: count(args),
    countMany: countMany(args),
    delete: deleteData(args),
    find: find(args),
    findMany: findMany(args),
    get: get(args),
    getMany: getMany(args),
    set: set(args),
    setMany: setMany(args),
    setOneMany: setOneMany(args),
    update: update(args),
    updateMany: updateMany(args),
    updateOneMany: updateOneMany(args),

    countFile: countFile(args),
    deleteFile: deleteFile(args),
    findFile: findFile(args),
    getFile: getFile(args),
    upload: upload(args),

    invoke: invoke(args),

    getServerDate: getServerDate(args),
    sendEmail: sendEmail(args),
    sendSmsCode: sendSmsCode(args),
    verifySmsCode: verifySmsCode(args),

    pay: pay(args),

    request: request(args),

    getTable: getTable(args),
    getTableList: getTableList(args),

    anonymous: anonymous(args),
    currentUser: currentUser(args),
    emailVerify: emailVerify(args),
    login: login(args),
    loginThirdParty: loginThirdParty(args),
    loginWith: loginWith(args),
    loginWithSmsVerificationCode: loginWithSmsVerificationCode(args),
    logout: logout(args),
    passwordReset: passwordReset(args),
    redirectResult: redirectResult(args),
    register: register(args),
    thirdPartyAuth: thirdPartyAuth(args),

    addUserIntoGroup: addUserIntoGroup(args),
    countUser: countUser(args),
    countUserMany: countUserMany(args),
    createSuperGroup: createSuperGroup(args),
    createUserGroup: createUserGroup(args),
    deleteSuperGroup: deleteSuperGroup(args),
    deleteUserGroup: deleteUserGroup(args),
    findUser: findUser(args),
    findUserMany: findUserMany(args),
    getSuperGroup: getSuperGroup(args),
    getSuperGroupList: getSuperGroupList(args),
    getUser: getUser(args),
    getUserGroup: getUserGroup(args),
    getUserGroupList: getUserGroupList(args),
    removeUserFromGroup: removeUserFromGroup(args),
    updateSuperGroup: updateSuperGroup(args),
    updateUser: updateUser(args),
    updateUserGroup: updateUserGroup(args),
    updateUserMany: updateUserMany(args),
  }
}


export { init }