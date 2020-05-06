// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const iclasses = db.collection('iclasses');
  const free_classes = db.collection('free_classes');
  const classes = await Promise.all([
    iclasses.where({ show: true }).get().then(res => res.data[0]),
    free_classes.where({ show: true }).get().then(res => res.data),
    cloud.callFunction({
      name: "getStageClass",
      data: { page: 0 }
    }).then(res => res.result)
  ])
  return {live: classes[0], free: classes[1], stage: classes[2]}
}