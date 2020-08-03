//const moment = require("moment");
let jsonArray = [];

function randomString(length, chars) {
  let res = "";
  for (let i = length; i > 0; --i)
    res += chars[Math.floor(Math.random() * chars.length)];
  return res;
}

let aN = "0123456789abcdefghijklmnopqrstuvwxyz";

let updateUserDetails = (result) => {
 // console.log(result)
  result.map((obj) => {
   // let date = moment(obj.modifiedDate).format("YYYY-MM-DD hh:mm:ss");
    let date=new Date(obj.modifiedDate).toISOString();
    let rString8 = randomString(8, aN);
    let rString4 = randomString(4, aN);
    let rString4_1 = randomString(4, aN);
    let rString4_2 = randomString(4, aN);
    let rString12 = randomString(12, aN);
    let modifiedObj = {
      UM_USER_ID: `${rString8}-${rString4}-${rString4_1}-${rString4_2}-${rString12}`,
      UM_USER_NAME: obj.emailAddress,
      UM_USER_PASSWORD: obj.password_crypt,
      UM_SALT_VALUE: obj.password_crypt,
      UM_REQUIRE_CHANGE: 0,
      UM_CHANGED_TIME: date,
      UM_TENANT_ID: -1234,
    };
    jsonArray.push(modifiedObj);
  });
  return jsonArray;
};
module.exports=updateUserDetails;