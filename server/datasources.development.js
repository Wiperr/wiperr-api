/*
 * HP Enterprise | TSRnD Bengaluru, India
 * @author: Akshay Kr Singh
 * @date:   1/28/2017
 * @email: akshay.singh@hpe.com
 */
module.exports = {
  "db": {
    "name": "db",
    "url": "mongodb://wiperr-development-admin:wiperr-development-admin@ds129344.mlab.com:29344/wiperr-development-legacy",
    "connector": process.env.DB || "mongodb"
  },
};
