<!--
 * @Author: your name
 * @Date: 2020-01-29 11:37:27
 * @LastEditTime: 2020-06-13 10:13:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/README.md
 -->

### 统一各类[数据库]和[后台云服务]接口的 JavaScript 库    
   
官方网站：[minapp-fetch.com](https://minapp-fetch.com)  
    
目前支持的后台服务和数据库有：  
1. **知晓云**：运营后台、云函数、各平台小程序、Web/H5、RN、Taro、uni-app等js开发的   
2. **微信小程序云开发**：微信小程序、云函数   
3. **MongoDB数据库**：Nodejs   
  

  
使用：  
```js
//app.js 
import minapp from 'minapp-fetch'
...
onLaunch: function() {
  minapp.init('zx_weapp')
}


//somePage.js  使用
import minapp from 'minapp-fetch'
minapp.find('tableName', {
  p0: ['num', '=', 0],
  r: 'p0'
}).then(res => {
  
}, err => {})
```  
  
### 文档  
最新接口文档，可在[minapp-fetch官方文档](https://minapp-fetch.com)里查看  
按需加载配置：[按需加载配置文档](https://wefishbone.com/detail/5ed5ae7b899abe7b80d67a5f)
  
### 优点  
1. **跨平台性**：各服务平台写法一致，一处写，处处用  
2. **调用简单**：简化官方复杂的概念，查错、修改更加方便  
3. **易迁移性**：可以很方便的把一个平台的项目迁移到其他平台  
4. **代码提示**：支持代码提示，类型定义文件`types.d.ts`  
  
> 下面就以知晓云平台的最简单的and、or复杂组合查寻为例：
  
```js
/** 原方法 **/
let query1 = new wx.BaaS.Query()
query1.in('color', ['green', 'red', 'yellow'])
let query2 = new wx.BaaS.Query()
query2.compare('price', '>', 10)
let andQuery = wx.BaaS.Query.and(query1, query2)
let query3 = new wx.BaaS.Query()
query3.compare('amount', '>=', 3)
let orQuery = wx.BaaS.Query.or(andQuery, query3)
let Product = new wx.BaaS.TableObject(tableName)
Product.setQuery(orQuery).find().then(res => {
  // success
})


/** minapp-fetch 其他各个平台写法都如下 **/
minapp.find(tableName, {
  p1: ['color', 'in', ['green', 'red', 'yellow']],
  p2: ['price', '>', 10],
  p3: ['amount', '>=', 3],
  r: '(p1 && p2) || p3'
}).then(res => {
  // success
})
```
  
### 更新日志  

[更新日志](https://minapp-fetch.com/log/changeLog)

   
### 加入讨论    
大家可以加群，一起讨论minapp-fetch问题。欢迎加**官方微信：`Fishbone_app`**，**回复: minapp-fetch讨论**，会拉你进入讨论群。有什么问题，也可以第一时间反馈哦。  
   
   
### 案例    
[Fishbone资讯web](https://wefishbone.com)   
  
   
![Fishbone资讯](https://file.wefishbone.com/1jY4uY4sSjMv8WKO.jpeg)  
  
  