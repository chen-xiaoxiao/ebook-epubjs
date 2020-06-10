const env = require('./env')
let resUrl = ''
let mp3FilePath = ''
let dbHost = ''
let dbUser = ''
let dbPwd = ''

if (env === 'dev') {
  resUrl = 'http://192.168.1.102:8084'
  // const mp3FilePath = 'http://192.168.1.102:8084/mp3'
  mp3FilePath = 'G:/resource/mp3'
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = 'chen@mysql320'
} else if (env === 'prod') {
  // 线上服务器地址
  resUrl = 'http://192.168.1.110'
  mp3FilePath = '/root/nginx/upload/mp3'
  dbHost = '192.168.1.110'
  dbUser = 'root'
  dbPwd = 'chen@mysql320'
}

const category = [
  'ComputerScience',
  'SocialSciences',
  'Economics',
  'Education',
  'Engineering',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'Biomedicine',
  'BusinessandManagement',
  'EarthSciences',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'Statistics'
]

module.exports = {
  resUrl,
  category,
  mp3FilePath,
  dbHost,
  dbUser,
  dbPwd
}
