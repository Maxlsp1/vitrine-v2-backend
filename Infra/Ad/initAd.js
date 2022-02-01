const ActiveDirectory = require('ad-promise')
const securePass = require("../../util/securePass");


async function getSettings(db){
    try {
      const res = await db.AdSettings.findOne({where: {id: 1}})

      const decryptedPass = securePass.decrypted(res.Ldap_pass, res.Token)
      const decryptedUserName = securePass.decrypted(res.Ldap_username, res.Token)

      res.Ldap_pass = decryptedPass
      res.Ldap_username = decryptedUserName

      const settings = res
      return settings      
    } catch (error) {
      console.log(error)
    }
}

async function studentAd(db){

  //Get server settings in db.
  try {
    const settings = await getSettings(db).catch((err) => {
      console.log(err) 
      throw err
    })
    var config = {
        url: settings.Ldap_url,
        baseDNs: {
          user: settings.baseDNStudentUser,
          group: settings.baseDNStudentGroup
        },
        attributes: {
          user: ["dn", "cn", "givenName", "name", "mail", "(memberOf={ou})", "sAMAccountName"], 
        }, 
        username: settings.Ldap_username,
        password: settings.Ldap_pass,
        tlsOptions :{
          rejectUnauthorized : false
        }
      }
    
    var ad2 = new ActiveDirectory(config)
    return ad2  
  } catch (error) {
    console.log(error)
  }
}

async function iutStaffAd(db){

  //Get server settings in db.
  try {
    const settings = await getSettings(db).catch((err) => {throw err})
    var config = {
        url: settings.Ldap_url,
        baseDNs: {
          user: settings.baseDNStaffUser,
          group: settings.baseDNStaffGroup
        },
        attributes: {
          user: ["dn", "cn", "givenName", "name", "mail", "(memberOf={ou})", "sAMAccountName"], 
        }, 
        username: settings.Ldap_username,
        password: settings.Ldap_pass,
        tlsOptions :{
          rejectUnauthorized : false
        }
      }
    
    var ad = new ActiveDirectory(config)
    return ad  
  } catch (error) {
    console.log(error)
  }
}

/**
 * Return the ad's config to authenticate users.
 * @param {Object} db configuration 
 * @returns {Object} ad - ad's configuration
 */

async function initAuthAd(db){
   try {
      const serverSet = await getSettings(db).catch((err) => {throw err})
      var OPTS = {
        server: {
          //Url server to connect
          url: serverSet.Ldap_url,

          //path to Admin (use to granted ldap access)
          bindDN: 'CN=roldap,OU=Autres,OU=Comptes,DC=iut-tarbes,DC=local',
          //Admin pwd
          bindCredentials: serverSet.Ldap_pass,

          //request search params
          searchBase: 'DC=iut-tarbes,DC=local',
          searchFilter: '(sAMAccountName={{username}})',

          //Display  user data
          searchAttributes: [
            "dn", "cn", "givenName", "name", "mail", "(memberOf={ou})", "sAMAccountName"
          ],

          tlsOptions :{
            rejectUnauthorized : false
          }
        },
        //set this feild for the request body (client side)
        usernameField: "username",
        passwordField: "password",
      };
    return OPTS     
   } catch (error) {
     console.log(error)
   }
}

exports.initAuthAd = initAuthAd
exports.studentAd = studentAd
exports.iutStaffAd = iutStaffAd
