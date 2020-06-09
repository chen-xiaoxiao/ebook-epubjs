const express = require('express')
const mysql = require('mysql')
const app = express()
const constant = require('./const')
// const voices = require('./voices.js')
const voice = require('./voice.js')
const cors = require('cors')
app.use(cors())

// express 返回数据
app.get('/', (req, res) => {
  res.send(new Date().toLocaleDateString())
})
// 数据库链接
function connect() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chen@mysql320',
    database: 'ebook'
  })
}

// 书架首页获取地址及返回所需的数据
app.get('/book/home', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover != \'\'', (err, results) => {
    const length = results.length
    const guessYouLike = []
    const banner = constant.resUrl + '/img/banner/home_banner2.jpg'
    const recommend = []
    const featured = []
    const random = []
    // 书籍分类列表
    const categoryList = createCategoryData(results)
    // 书籍分类
    const categories = [
      {
        'category': 1,
        'num': 56,
        'img1': constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
        'img2': constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
      }, {
      'category': 2,
      'num': 51,
      'img1': constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
     }, {
      'category': 3,
      'num': 32,
      'img1': constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
    }, {
      'category': 4,
      'num': 60,
      'img1': constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
    }, {
      'category': 5,
      'num': 23,
      'img1': constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
    }, {
      'category': 6,
      'num': 42,
      'img1': constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
    }, {
      'category': 7,
      'num': 7,
      'img1': constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
    }, {
      'category': 8,
      'num': 18,
      'img1': constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
    }, {
      'category': 9,
      'num': 13,
      'img1': constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
      'img2': constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
    }, {
      'category': 10,
      'num': 24,
      'img1': constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
      'img2': constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
    }, {
      'category': 11,
      'num': 6,
      'img1': constant.resUrl + '/cover/lit/2015_humanities.jpg',
      'img2': constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
    }, {
      'category': 12,
      'num': 14,
      'img1': constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
      'img2': constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
    }, {
      'category': 13,
      'num': 16,
      'img1': constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
      'img2': constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
    }, {
      'category': 14,
      'num': 16,
      'img1': constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
      'img2': constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
    }, {
      'category': 15,
      'num': 2,
      'img1': constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
      'img2': constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
    }, {
      'category': 16,
      'num': 9,
      'img1': constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
      'img2': constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
    }, {
      'category': 17,
      'num': 20,
      'img1': constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
      'img2': constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
    }, {
      'category': 18,
      'num': 16,
      'img1': constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
      'img2': constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
    }, {
      'category': 19,
      'num': 10,
      'img1': constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
      'img2': constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
    }, {
      'category': 20,
      'num': 26,
      'img1': constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
      'img2': constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
    }, {
      'category': 21,
      'num': 3,
      'img1': constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
      'img2': constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
    }, {
      'category': 22,
      'num': 1,
      'img1': constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
      'img2': constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
    }]
    // 猜你喜欢书籍
    randomArray(9, length).forEach(key => {
      guessYouLike.push(createGuessYouLike(createData(results, key)))
    })
    // 推荐书籍
    randomArray(3, length).forEach(key => {
      recommend.push(createRecommendData(createData(results, key)))
    })
    // 特色欢书籍
    randomArray(6, length).forEach(key => {
      featured.push(createData(results, key))
    })
    // 随机选择一本书籍
    randomArray(1, length).forEach(key => {
      random.push(createData(results, key))
    })
    res.json({
      guessYouLike,
      banner,
      recommend,
      featured,
      random,
      categoryList,
      categories
    })
  })
})

// 书籍详情链接
app.get('/book/detail', (req, res) => {
  const conn = connect()
  const fileName = req.query.fileName
  const sql = `select * from book where fileName='${fileName}'`
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '电子书详情获取失败'
      })
    } else {
      if (results && results.length === 0) {
        res.json({
          error_code: 1,
          msg: '电子书详情获取失败'
        })
      } else {
        const book = handleData(results[0])
        res.json({
          error_code: 0,
          msg: '电子书详情获取成功',
          data: book
        })
      }
    }
    conn.end()
  })
})

// 分类书籍列表链接
app.get('/book/list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'', (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '分类书籍列表获取失败'
      })
    } else {
      results.map(item => handleData(item))
      const data = {}
      constant.category.forEach(categoryText => {
        data[categoryText] = results.filter(item => item.categoryText === categoryText)
      })
      res.json({
        error_code: 0,
        msg: '分类书籍列表获取成功',
        data: data,
        total: results.length
      })
    }
    conn.end()
  })
})

// 分类书籍列表搜索链接
app.get('/book/flat-list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'', (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '获取失败'
      })
    } else {
      results.map(item => handleData(item))
      res.json({
        error_code: 0,
        msg: '获取成功',
        data: results,
        total: results.length
      })
    }
    conn.end()
  })
})

// 添加书架
app.get('/book/shelf', (req, res) => {
  res.json({
    bookList: []
  })
})

// 在线语音合成(旧版本呢)
// app.get('/voices', (req, res) => {
//   voice(req, res)
// })

// 在线语音合成
app.get('/voice', (req, res) => {
  voice(req, res)
})


// 随机获取书本(n: 随机得到的书本数， l: 书本的总数)
function randomArray(n, l) {
  let rnd = []
  for (let i = 0; i < n; i++) {
    rnd.push(Math.floor(Math.random() * l))
  }
  return rnd
}

// 获取与当前key一样的书本
function createData(results, key) {
  return handleData(results[key])
}

// 获取与当前key一样的书本并添加一些属性
function handleData(data) {
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${constant.resUrl}/img${data.cover}`
  }
  data['selected'] = false
  data['private'] = false
  data['cache'] = false
  data['haveRead'] = 0
  return data
}

// 猜你喜欢书籍中 添加type属性，并随机赋值（1，2，3）并判断值来添加模拟一些静态数据返回
function createGuessYouLike(data) {
  const n = parseInt(randomArray(1, 3)) + 1
  data['type'] = n
  switch (n) {
    case 1:
      data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements of Robotics》'
      break
    case 2:
      data['result'] = data.id % 2 === 0 ? 'Improving Psychiatric Care' : '《Programming Languages》'
      break
    case 3:
      data['result'] = '《Living with Disfigurement》'
      data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
      break   
    default:
      break
  }
  return data
}

// 推荐书籍阅读
function createRecommendData(data) {
  data['readers'] = Math.floor(data.id % 2 * randomArray(1, 100))
  return data
}

// 分类书籍
function createCategoryData(data) {
  const categoryIds = createCategoryIds(6)
  const result = []
  categoryIds.forEach(categoryId => {
    const subList = data.filter(item => item.category === categoryId).slice(0, 4)
    subList.map(item => {
      return handleData(item)
    })
    result.push({
      category: categoryId,
      list: subList
    })
  })
  // filter 返回的数据过滤，当前的item的个数小于4的不显示
  return result.filter(item => item.list.length === 4)
}

// 给分类书籍附上索引id
function createCategoryIds(n) {
  const arr = []
  constant.category.forEach((item, index) => {
    arr.push(index + 1)
  })
  const result = []
  for (let i = 0; i < n; i++) {
    // 获取的随机数不能重复
    const ran = Math.floor(Math.random() * (arr.length - i))
    // 获取分类对应的序号
    result.push(arr[ran])
    // 将已经获取的随机数取代，用最后一位数
    arr[ran] = arr[arr.length - i - 1]
  }
  return result

}

// express 监听接口3000， node app.js 启动， http://localhost:3000/ 访问地址， 显示 当前的日期 
const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port
  // console.log('server is listening at http://%s:%s', host, port)
})

// // 测试是否成功链接数据库
// const connection = mysql.createConnection({      //创建mysql实例
//   host:'127.0.0.1',
//   port:'3306',
//   user:'root',
//   password:'chen@mysql320',
//   database:'ebook'
// });
// connection.connect();
// var sql = 'select * from ebook.book';
// connection.query(sql, function (err,result) {
//   if(err){
//       console.log('[SELECT ERROR]:',err.message);
//   }
//   console.log(result);  //数据库查询结果返回到result中
// });
// 测试数据库数据
// app.get('/book/list', (req, res) => {
//   const conn = connect()
//   conn.query('select * from book', (err, results) => {
//     if (err) {
//       res.json({
//         error_code: 1,
//         msg: '数据库链接失败！',
//         data: results
//       })
//     } else {
//       res.json({
//         error_code: 0,
//         data: results,
//       })
//     }
//     conn.end()
//   })
// })