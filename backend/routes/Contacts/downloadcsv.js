require('dotenv').config();
const useExport = require('../../models/Export');
const json2csv = require('json2csv').parse;

module.exports = async (req, res) => {

  console.log(req.body);

  const csvString = json2csv(yourDataAsArrayOfObjects);
  // res.setHeader('Content-disposition', 'attachment; filename=contacts-cloudlead.csv');
  // res.set('Content-Type', 'text/csv');
  // res.status(200).send(csvString);

}