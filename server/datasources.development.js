/*
 * HP Enterprise | TSRnD Bengaluru, India
 * @author: Akshay Kr Singh
 * @date:   1/28/2017
 * @email: akshay.singh@hpe.com
 */
module.exports = {
  "db": {
    "host": "localhost",
    "port": 27017,
    "database": "wiperr-development",
    "name": "db",
    "connector": process.env.DB || "mongodb"
  },
};
