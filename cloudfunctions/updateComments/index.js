// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: false
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const free = db.collection('free_classes');
  return await free
    .where({ show: true })
    .field({ course: true })
    .get()
    .then(res => {
      for (let list of res.data)
        axios.get('https://ke.qq.com/cgi-bin/comment_new/course_comment_list', {
          params: {
            count: 10,
            cid: list.course,
            page: 0,
            filter_rating: 0
          },
          headers: {
            referer: `https://ke.qq.com/comment.html?course_id=${list.course}`
          }
        }).then(res => {
          // res.data.result.items
          free.doc(list._id).update({
            data: {
              comments: res.data.result.items
            }
          })
        })
    });
}