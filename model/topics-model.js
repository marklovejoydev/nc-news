const db = require("../db/connection");

exports.selectAllTopics = () => {
    let queryString = "SELECT * FROM topics "; 
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  };