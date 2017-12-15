## 小程序上传腾讯云COS 工具包

### 使用说明

1. cos的签名机制请参考👉[官方文档](https://cloud.tencent.com/document/product/436/7778)
1. cos简单上传[接口文档](https://cloud.tencent.com/document/product/436/6066)
1. 示意代码👇

```javascript
let cosUploader = require("./index.js")

cosUploader.config({
  region: 'tj',
  appid: '1234567890',
  bucketName: 'bucketName',
  bucketDir: 'images',
})

wx.showLoading()
cosUploader.upload( imageFilePath , 
  {
  	// signature 和 getSignatureFunc 二选一即可
  	// 需要注意的是 getSignatureFunc 取到签名之后会缓存起来 ， 这里返回的签名最好是可多次使用的
    getSignatureFunc: function( callback ){
      fetchData({
        url : apiPrefix + 'api/qcloudToken',
        success:function({ data }){
          callback( data )
        },
        error:function(res){
          alertServerErrMsg(res.msg)
        }
      })
    },
    success : function( imgurl ){
      // http 转一下https
      imgurl = imgurl.replace(/^http\:\/\//,'https://')
      that.setData({
        'imageFilePath': imgurl ,
      })
    },
    onProgressUpdate:function(progress){
      // 更新进度
    },    
    fail:function(error){
      // 处理上传失败
    },
    complete:function(){
      // 隐藏进度条
    }
  }
)
```

cosUploader 只提供了两个方法， 一个是 config 一个是 upload ， config只需要调用一次即可