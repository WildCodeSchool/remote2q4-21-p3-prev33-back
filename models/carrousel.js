const connection = require("../db-config");

const findAll = () => {
  return connection.promise().query("Select * FROM carrousel");
};

const findOne = (id) => {
  return connection
    .promise()
    .query("Select * FROM carrousel WHERE id = ?", [id])
    .then(([results]) => results[0]);
};

const insertCarrousel = ({ title }, image) => {
  return connection
    .promise()
    .query("INSERT INTO carrousel (`title`, `image`) VALUES (?, ?)", [
      title,
      image,
    ]);
};

const deleteCarrousel = (id) => {
  return connection
    .promise()
    .query("DELETE FROM carrousel WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findAll,
  findOne,
  insertCarrousel,
  deleteCarrousel,
};
