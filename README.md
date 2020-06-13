<!--
 * @Author: your name
 * @Date: 2020-01-29 11:37:27
 * @LastEditTime: 2020-06-13 10:09:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/README.md
 -->

### 知晓云常用接口封装（js跨平台）    
   
知晓云让后台开发变得更简单，我们让知晓云开发变得更简单。  
  
> 为了减小包的体积，提高运行效率，采取了更合理的分开维护方式。各平台包在[@minappjs](https://www.npmjs.com/search?q=keywords%3Aminappjs)。推荐大家使用这种新的方式。
   
   
适合：  
**运营后台**、**云函数**、**各平台小程序**、**Web/H5**、**RN**、**Taro**、**uni-app**等js开发的  
  
使用：  
```js
const minapp = require('minapp-fetch').init('weapp')
minapp.find('tableName', {
  p0: ['num', '=', 0],
  r: 'p0'
}).then(res => {
  
}, err => {})
```  
  
### 文档  
最新接口文档，可在[minapp-fetch文档](https://wefishbone.com/detail/5d4135320bc9f3134de37fa6)里查看  
新方式推荐文档在[@minappjs文档](https://wefishbone.com/detail/5ec2781dc66ab4461293c8ea)里查看  
  
### 优点  
1. **跨平台性**：js平台写法一致，一处写，处处用（个别接口除外） 
2. **调用简单**：简化官方复杂的概念，查错、修改更加方便  
3. **方法丰富**：除官方的方法外，还增加了许多其他实用方法  
4. **代码提示**：支持代码提示，类型定义文件`index.d.ts`  
  
> 下面就以最简单的and、or复杂组合查寻为例：
  
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


/** minapp-fetch js的各个平台写法都如下 **/
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
    
#### v2.7.0  
- 加入京东小程序的支持。     
- 推荐大家用[@minappjs](https://www.npmjs.com/search?q=keywords%3Aminappjs)。  
     
    
#### v2.6.1  
- 加入react-native的支持，请确保`global.BaaS`被赋值     
- 对于API网关，大家还是可以去尝试     
- 推荐大家用新的方式。  
     
   
### 加入讨论    
大家可以加群，一起讨论@minappjs问题，或知晓云的问题。欢迎加官方微信fairy-pm，备注知晓云，会拉你进入讨论群。  
有什么问题，也可以第一时间反馈。  
  
   
### 案例    
[Fishbone资讯](https://wefishbone.com)   
![Fishbone资讯](https://file.wefishbone.com/1jY4uY4sSjMv8WKO.jpeg)
![轻絮定制](https://file.wefishbone.com/1jY4uYiTUIDtLx8p.jpeg)   
  
  