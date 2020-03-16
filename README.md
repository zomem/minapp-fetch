
### 知晓云常用接口封装（js跨平台）    
   
知晓云让后台开发变得更简单，我们让知晓云开发变得更简单。  
  
`npm install minapp-fetch`   
  
适合：  
**运营后台**、**云函数**、**小程序**、**Web**、**RN**、**Taro**、**uni-app**等js开发的  
  
使用：  
```js
const minapp = require('minapp-fetch').init('weapp')
minapp.find().then(res => {}, err => {})
```  
  
### 文档  
最新接口文档，可在[minapp-fetch文档](https://wefishbone.com/detail/5d4135320bc9f3134de37fa6)里查看  
  
### 优点  
1. **跨平台性**：js平台写法一致，一处写，处处用（个别接口除外） 
2. **调用简单**：简化官方复杂的概念，查错、修改更加方便  
3. **方法丰富**：除官方的方法外，还增加了许多其他实用方法  
4. **语法提示**：支持语法提示  
  
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


/** minapp-fetch 各个平台写法都如下 **/
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
  
  
#### v2.0.1  
- 新增获取异步任务结果的方法`getAsyncJobResult`。  
- 更新官方sdk到3.8.0  
  

  
#### v2.0.0  
- 用`typescript`重写`minapp-fetch`包，现在支持**语法提示**，让开发更高效。  
- `upload`方法参数统一命名，`pay`方法优化  
- 修改部分用户操作相关方法的bug  
- 其他问题修复  
- 引入方式统一改成`const minapp = require('minapp-fetch').init('default')`，且平台必须选择，`default`为默认平台(即以前的不加任何平台)  
  


  