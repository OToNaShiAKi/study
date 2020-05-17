// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { publishID, comment, userInfo } = event;
  return await cloud.openapi.security.msgSecCheck({ content: comment }).then(res => {
    const db = cloud.database();
    const comments = db.collection('comments');
    const _openid = cloud.getWXContext().OPENID
    return comments.add({
      data: {
        comment,
        userInfo,
        publishID,
        time: db.serverDate(),
        _openid
      }
    })
  }).then(res => ({
    status: 200,
    _id: res._id,
    message: '发布成功'
  })).catch(err => ({
    status: 0,
    message: '安全校验失败或网络不稳定'
  }))
}