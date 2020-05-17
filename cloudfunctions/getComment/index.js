// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const comments = db.collection('comments');
  const { page, publishID } = event;
  const limit = 9;
  const result = await Promise.all([
    comments.where({ publishID }).orderBy("time", "desc").skip(page * limit).limit(limit).get().then(res => res.data),
    comments.where({ publishID }).count().then(res => res.total)
  ]).then(res => res);
  return { comments: result[0], total: result[1] };
}