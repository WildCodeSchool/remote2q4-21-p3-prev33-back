const connection = require("../db-config");

const findAll = () => {
  return connection.promise().query("SELECT * FROM training");
};

const findOne = (id) => {
  return connection
    .promise()
    .query("SELECT * FROM training WHERE id = ?", [id])
    .then(([results]) => results[0]);
};

const insertFile = ({ reference, title, training_category_id }, link) => {
  return connection
    .promise()
    .query(
      "INSERT INTO training (`reference`, `title`, `link`, `training_category_id`) VALUES (?, ?, ?,?)",
      [reference, title, link, training_category_id]
    );
};

const deleteFile = (id) => {
  return connection
    .promise()
    .query("DELETE FROM training WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findAll,
  findOne,
  insertFile,
  deleteFile,
};
