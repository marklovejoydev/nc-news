const db = require('../db/connection')

exports.selectArticleById = (id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' })
      } 
      return rows[0]
    })
    
}

exports.selectAllArticles = () => {
let queryString = "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC;"
return db.query(queryString).then(({ rows }) => {
  
  return rows
})
}