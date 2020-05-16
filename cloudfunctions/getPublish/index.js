// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const questions = db.collection('questions');
  const {page, key} = event;
  const limit = 9;
  let filter = {}
  if(key) {
    filter = {
      'question.desc': db.RegExp({
        regexp: key,
        options: 'i'
      })
    }
  }
  const result = await Promise.all([
    questions.where(filter).orderBy("time", "desc").skip(page * limit).limit(limit).get().then(res => res.data),
    questions.where(filter).count().then(res => res.total)
  ]).then(res => res);
  return {questions: result[0], total: result[1]};
}