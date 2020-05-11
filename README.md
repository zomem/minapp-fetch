<!--
 * @Author: your name
 * @Date: 2020-01-29 11:37:27
 * @LastEditTime: 2020-05-11 17:40:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/README.md
 -->

### 知晓云常用接口封装（js跨平台）    
   
知晓云让后台开发变得更简单，我们让知晓云开发变得更简单。  
  
`npm install minapp-fetch`   
  
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
  
> 还有部分官方接口没有跟进，我们会一直完善的~  
    
    
#### v2.4.0  
- 用户自定义字段的更新，`currentUserUpdate`  
- 微信小程序unionid登录，`loginWith(data, {withUnionID: true})`  
- 优化支付`pay`方法，并加入字节跳动支付功能  
        
#### v2.3.0  
- 更新部分内容操作方法，新增内容操作方法：`deleteCategory`、`deleteContent`、`setCategory`、`setContent`、`updateCategory`、`updateContent`方法
- 修复`update`类型的方法更新`undefined、null`等数据时，会报错的bug。   
   
### 应用案例    
![Fishbone资讯](https://file.wefishbone.com/1jY4uY4sSjMv8WKO.jpeg)
![轻絮定制](https://file.wefishbone.com/1jY4uYiTUIDtLx8p.jpeg)  
  
  