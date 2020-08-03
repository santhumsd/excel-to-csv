//const moment = require("moment");

function randomString(length, chars) {
  let res = "";
  for (let i = length; i > 0; --i)
    res += chars[Math.floor(Math.random() * chars.length)];
  return res;
}

//let aN = "0123456789abcdefghijklmnopqrstuvwxyz";

let updateAttributeDetails = (newjsonData, oldjsonData) => {
  if(!oldjsonData){
    return null;
  }
    let jsonArray = []
//console.log(oldjsonData)

  newjsonData.map((obj) => {
   oldjsonData.map(
      (object) =>{ if(object.emailAddress === obj.UM_USER_NAME){
       // let date = moment(object.createdDate).format()
        let date=(object.createdDate)?new Date(object.createdDate).toISOString():new Date("1900-01-01").toISOString();
        let {firstName,lastName,emailAddress}=object
       
        let modifiedObj = [
          {
            UM_ATTR_NAME: "scimId",
            UM_ATTR_VALUE: obj.UM_USER_ID,
            UM_PROFILE_ID: "default",
            UM_USER_ID: obj.UM_ID,
            UM_TENANT_ID: -1234
          },
          {
            UM_ATTR_NAME: "givenName",
            UM_ATTR_VALUE: firstName,
            UM_PROFILE_ID: "default",
            UM_USER_ID: obj.UM_ID,
            UM_TENANT_ID: -1234
          },
          {
            UM_ATTR_NAME: "sn",
            UM_ATTR_VALUE: lastName,
            UM_PROFILE_ID: "default",
            UM_USER_ID: obj.UM_ID,
            UM_TENANT_ID: -1234
          },
          {
            UM_ATTR_NAME: "mail",
            UM_ATTR_VALUE: emailAddress,
            UM_PROFILE_ID: "default",
            UM_USER_ID: obj.UM_ID,
            UM_TENANT_ID: -1234
          },
          {
            UM_ATTR_NAME: "uid",
            UM_ATTR_VALUE: emailAddress,
            UM_PROFILE_ID: "default",
            UM_USER_ID: obj.UM_ID,
            UM_TENANT_ID: -1234
          },
          {
            UM_ATTR_NAME: "createdDate",
            UM_ATTR_VALUE: date,
            UM_PROFILE_ID: "default",
            UM_USER_ID: obj.UM_ID,
            UM_TENANT_ID: -1234
          }
        ];
      
        modifiedObj.map((obc)=>{
            jsonArray.push(obc);
        })
        
      }}
    );
    //console.log(filteredOldJson)
   
  });
  return jsonArray;
};
module.exports = updateAttributeDetails;
