// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const page = event.page;
  const limit = 3;
  const db = cloud.database();
  const stage_classes = db.collection('stage_classes');
  const stage = await Promise.all([
    stage_classes
      .orderBy("order", "asc")
      .skip(page * limit)
      .limit(limit)
      .get()
      .then(res => res.data),
    stage_classes.count().then(res => res.total)
  ])
  return {classes: stage[0], count: stage[1]}
}