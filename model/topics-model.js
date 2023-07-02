const db = require("../db/connection");

exports.selectAllTopics = () => {
    let queryString = "SELECT * FROM topics "; 
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  };

  exports.selectArticlesByTopic = (topic, sort_by = "created_at", order = "DESC") => {
    const validSortBy = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"];
    if (!validSortBy.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  
    const validOrder = ["ASC", "DESC"];
    if (!validOrder.includes(order.toUpperCase())) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  
    let queryString = `SELECT * FROM articles WHERE topic = $1`;
  
    if (sort_by === "created_at") {
      queryString += ` ORDER BY created_at ${order}`;
    } else {
      queryString += ` ORDER BY ${sort_by} ${order}`;
    }
  
    return db.query(queryString, [topic]).then(({ rows }) => {
      return rows;
    });
  };