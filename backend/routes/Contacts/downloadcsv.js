require('dotenv').config();
const useExport = require('../../models/Export');

module.exports = async (req, res) => {

  console.log(req.body);

  res.status(200).send('Ok')

}