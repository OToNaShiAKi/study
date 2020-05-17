// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const _openid = cloud.getWXContext().OPENID
  const type = event.type;
  const db = cloud.database();
  const questions = db.collection('questions')
  const comments = db.collection('comments')
  if(type === 'publish') 
    return await questions.where({ _openid }).orderBy("time", "desc").get().then(res => res.data)
  else if(type === 'comment') {
    const publishIDs = await comments.where({ _openid }).field({ publishID: true, _id: false}).get().then(res => {
      let ids = [];
      for (let item of res.data) {
        if (!ids.includes(item.publishID))
          ids.push(item.publishID)
      }
      return ids;
    })
    return await questions.where({
      _id: db.command.in(publishIDs)
    }).orderBy("time", "desc").get().then(res => res.data)
  }
  
}