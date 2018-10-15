const mongoose = require('mongoose')
const Schema = mongoose.Schema
let now = new Date()

const ArticleSchema = new Schema({
  date: {
    type: String,
    default: now.getFullYear() + '-' + ('0' + (now.getMonth() + 1))
      .slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  images: {
    type: [String]
  }
})

const ArticleModel = mongoose.model('articles', ArticleSchema)

module.exports = ArticleModel
