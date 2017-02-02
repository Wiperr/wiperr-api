/*
 * HP Enterprise | TSRnD Bengaluru, India
 * @author: Akshay Kr Singh
 * @date:   1/28/2017
 * @email: akshay.singh@hpe.com
 */
module.exports = {
  "db": {
    "url": "mongodb://wiperr-dev:wiperr-dev@ds155097.mlab.com:55097/wiperr-dev",
    "name": "db",
    "connector": process.env.DB || "mongodb"
  }
};
