// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { title, desc, fileIDs, userInfo, userLocation, system } = event;

  const checks = fileIDs.map(fileID => 
    cloud.downloadFile({ fileID }).then(res => 
      cloud.openapi.security.imgSecCheck({
        media: {
          value: res.fileContent,
          contentType: 'image/' + fileID.split('.').pop()
        }
      })
    )
  )

  checks.push(cloud.openapi.security.msgSecCheck({ content: title + desc }))

  return await Promise.all(checks).then(res => {
    const db = cloud.database();
    const questions = db.collection('questions');
    const _openid = cloud.getWXContext().OPENID
    return questions.add({
      data: {
        userInfo,
        userLocation,
        question: {
          title,
          desc,
          fileIDs
        },
        system,
        time: db.serverDate(),
        _openid
      }
    })
  }).then(res => ({
    status: 200,
    message: '安全检测通过'
  })).catch(err => {
    const code = err.errCode;
    let message = '';
    if(code === 87014) message = '内容存在违规';
    else if (code === 45002) message = '图片文件过大';
    cloud.deleteFile({ fileList: fileIDs });
    return {
      status: 0,
      message
    }
  })
}