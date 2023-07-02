const db = require('../db/connection')

exports.selectArticleById = (id) => {
    return db
    .query('SELECT *, CAST((SELECT COUNT(*) FROM comments WHERE article_id = $1) AS INT) AS comment_count FROM articles WHERE article_id = $1;', [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Not found' })
      } 
      return rows[0]
    })
    
}

exports.checkArticleExists = (article_id) => {
  return db
  .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status : 404, msg: "Not found"})
    }
  })
}

exports.selectAllArticles = (sort_by = "created_at", order = "DESC") => {
  const validSortBy = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const validOrder = ["ASC", "DESC"];
  if (!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;

  if (sort_by === "created_at") {
    queryString += ` ORDER BY created_at ${order}`;
  } else {
    queryString += ` ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};


exports.selectCommentsByArticleId = (article_id) => {
  let query = "SELECT * FROM comments "
  const queryValues = []

  if (article_id) {
    query += "WHERE article_id = $1 ORDER BY created_at DESC;"
    queryValues.push(article_id)
  }
  return db.query(query, queryValues).then(({rows}) => {
    return rows
  })

}
exports.insertComments = (username, body, article_id) => {
  if (!body || !username) {
    return Promise.reject({status: 400 , msg: 'Bad request'})
  }
  const queryString = `
  INSERT INTO comments
  (author, body, article_id)
  VALUES
  ($1, $2, $3)
  RETURNING*;
  `
  const queryValues = [username, body, article_id]
  return db.query(queryString, queryValues)
  .then(({rows})=> {
    return rows[0]
  })
}

  exports.updateArticle = (votes, id) => {
  return db.query(`
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `, [votes, id])
  .then(({rows})=> {
    if(!rows.length){
      return Promise.reject({status: 404, msg:"Not found"})
    }
    return rows[0]
  })
  }
