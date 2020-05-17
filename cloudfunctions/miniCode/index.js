// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.openapi.wxacode.getUnlimited({
    scene: 'aki',
    autoColor: true
  }).then(res => cloud.uploadFile({
      cloudPath: 'qrcode.jpg',
      fileContent: res.buffer
  })).then(res => res.fileID);
}