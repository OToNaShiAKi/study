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
  return await iclasses.where({
    show: true
  }).get().then(res => res.data[0]);
}