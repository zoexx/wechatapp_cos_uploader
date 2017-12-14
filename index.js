(function() {

    var options = {
        // 地区 https://cloud.tencent.com/document/product/213/6091
        region: '',
        appid: '',
        bucketName: '',
        // 文件路径
        bucketDir: '',
        // 以下二选一即可
        // 从鉴权服务器取回的签名
        signature: '',
        // 取签名的func
        getSignatureFunc: null ,
        onProgressUpdate: null ,
    }

    module.exports = {
        config: config,
        upload: upload,
    }

    function config(opt) {
        Object.assign(options, opt)
    }

    function upload(filePath, opt = {} ) {
        if (null == filePath) {
            console.error(' uploader need filePath to upload');
            return;
        }
        opt = Object.assign({}, options , opt );

        if (opt.signature) {
            doUpload(filePath,opt);

        } else if (opt.getSignatureFunc) {
            opt.getSignatureFunc(function(signature) {
                opt.signature = signature;
                options.signature = signature;
                doUpload(filePath,opt);
            });

        } else {
            console.error(' uploader need one of [signature, getSignatureFunc]');
            return;
        }
    }

    function doUpload(filePath, opt) {
        const {
            region,
            appid,
            bucketName,
            bucketDir,
            signature,
            success,
            fail,
            complete,
            onProgressUpdate,
        } = opt

        var fileName = filePath.split('//')[1];

        if (opt.fileName) {
            fileName = opt.fileName;
        }
        // cos 上传接口文档 https://cloud.tencent.com/document/product/436/6066
        var url = `https://${region}.file.myqcloud.com/files/v2/${appid}/${bucketName}/${bucketDir}/${fileName}`;

        var uploadTask = wx.uploadFile({
            url: url,
            filePath: filePath,
            header: {
                'Authorization': signature
            },
            name: 'filecontent',
            formData: {
                op: 'upload'
            },
            success: function({
                data , statusCode
            }) {
                try{
                    data = JSON.parse(data);
                }catch(e){
                    console.log(e);
                    fail && fail(e);
                }
                console.log(statusCode,data);
                let {
                    source_url
                } = data.data
                success && success(source_url);
            },
            fail: function(error) {
                console.error(error);
                fail && fail(error);
            },
            complete: function() {
                complete && complete();
            }
        })
        // 上传进度
        uploadTask.onProgressUpdate(({progress}) => {
            onProgressUpdate && onProgressUpdate(progress)
        })
    }

})();