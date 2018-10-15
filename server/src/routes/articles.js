/* eslint-disable standard/computed-property-even-spacing */
const express = require('express')
const router = express.Router()
const article = require('../models/article-model')
const AWS = require('aws-sdk')

const s3bucket = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  Bucket: 'YOUR_BUCKET_NAME'
})

router.post('/articles', async (req, res) => {
  const images = []
  const randKey = function (name, mime) {
    return name.replace(/\./g, '_'), mime + '_' + Math.random().toString(36).substr(2, 9) + '.' + mime
  }
  s3bucket.createBucket(function () {
    for (const file of req.body.images) {
      const mime = file.name.split('.').pop()

      if (['jpeg', 'jpg', 'png'].includes(mime)) {
        const base = new Buffer(file.data.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        const params = {
          Bucket: 'YOUR_BUCKET_NAME/FOLDER_NAME',
          Key: randKey(file.name),
          Body: base,
          ContentEncoding: 'base64',
          ACL: 'public-read'
        }
        s3bucket.upload(params, function (err, data) {
          if (err) {
            return res.status(413).send('cannot save image')
          } else {
            images.push('URL' + data.Key)
          }
        })
      } else {
        return res.status(413).send('wrong image format')
      }
    }
  })

  await article.create({
    date: req.body.date,
    title: req.body.title,
    content: req.body.content,
    images
  })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      unlinkImages(images).then(() => {
        res.status(422).send({
          message: err.message
        })
      })
    })
})

function unlinkImages(images) {
  return new Promise((resolve, reject) => {
    for (const image of images) {
      const params = {
        Bucket: 'YOUR_BUCKET_NAME',
        Key: image.split('/').slice(-2).join('/')
      }
      s3bucket.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err)
        } else {
          console.log('Image ' + image.split('/').pop() + ' removed!')
        }
      })
      resolve()
    }
  })
}

module.exports = router
