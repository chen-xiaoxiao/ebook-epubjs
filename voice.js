const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
var log = require('log4node')
var fs = require('fs')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl

function createSpeaking(req, res) {
    log.info("req!-------------", req.query)
    const text = req.query.text
    // const lang = req.query.lang
    
    const config = {
        // 请求地址
        hostUrl: "wss://tts-api.xfyun.cn/v2/tts",
        host: "tts-api.xfyun.cn",
        //在控制台-我的应用-在线语音合成（流式版）获取
        appid: "5ed84e9a",
        //在控制台-我的应用-在线语音合成（流式版）获取
        apiSecret: "4b7f7c37268e4422daad6fdad7654f83",
        //在控制台-我的应用-在线语音合成（流式版）获取
        apiKey: "14fd3989196e0f4615dc09fa4323d8f8",
        text: text ? text : "测试科大讯飞在线语音合成api的功能，比如说，我们输入一段话，科大讯飞api会在线实时生成语音返回给客户端",
        uri: "/v2/tts",
    }
    const lang = 'cn'
    let engineType = 'intp65'
    if (lang.toLocaleLowerCase() === 'en') {
        engineType = 'intp65_en'
    }

    // 获取当前时间 RFC1123格式
    let date = (new Date().toUTCString())
    // 设置当前临时状态为初始化

    let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
    let ws = new WebSocket(wssUrl)

    const fileName = new Date().getTime()
    const filePath = `${mp3FilePath}/${fileName}.mp3`
    const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`

    // 连接建立完毕，读取数据进行识别
    ws.on('open', () => {
        log.info("websocket connect!")
        send()
        // 如果之前保存过音频文件，删除之
        if (fs.existsSync(downloadUrl)) {
            fs.unlink(downloadUrl, (err) => {
                if (err) {
                    log.error('remove error: ' + err)   
                }
            })
        }
    })
    
    // 得到结果后进行处理，仅供参考，具体业务具体对待
    ws.on('message', (data, err) => {
        if (err) {
            log.error('message error: ' + err)
            return
        }

        let res = JSON.parse(data)
        if (res.code != 0) {
            log.error(`${res.code}: ${res.message}`)
            ws.close()
            return
        }
        let audio = res.data.audio
        let audioBuf = Buffer.from(audio, 'base64')
        save(audioBuf)
        if (res.code == 0 && res.data.status == 2) {
            ws.close()
        }
    })

    // 资源释放
    ws.on('close', () => {
        log.info('connect close!')
    })

    // 连接错误
    ws.on('error', (err) => {
        log.error("websocket connect err: " + err)
    })

    // 鉴权签名
    function getAuthStr(date) {
        let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
        let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
        let signature = CryptoJS.enc.Base64.stringify(signatureSha)
        let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
        let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
        return authStr
    }

    // 传输数据
    function send() {
        let frame = {
            // 填充common
            "common": {
                "app_id": config.appid
            },
            // 填充business
            "business": {
                "aue": "lame",
                "auf": "audio/L16;rate=16000",
                "vcn": "xiaoyan",
                "tte": "UTF8"
            },
            // 填充data
            "data": {
                "text": Buffer.from(config.text).toString('base64'),
                "status": 2,
                "encoding": downloadUrl,
                // "path": downloadUrl
            }
        }
        res.send(JSON.stringify(frame))
        ws.send(JSON.stringify(frame))
    }

    // 保存文件
    function save(data) {
        fs.writeFile(filePath, data, { flag: 'a' }, (err) => {
            if (err) {
                log.error('save error: ' + err)
                return 
            }
            log.info('文件保存成功')
        })
    }

}

module.exports = createSpeaking
