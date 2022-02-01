// Generate mostly sequential tokens:
var suid = require('rand-token').suid;
const bcrypt = require("bcrypt");
const saltRounds = 10;
var userToken = suid(16);
const SecurePass = require('../../util/UserSecurePass')

const db = require("../../db/models/index")

/**
 * This methode authenticate users using passport and 
 * ad-promise lib.
 * If user exist in Active Directory they find them in db and returns
 * all user information (name, mail .... )
 * 
 * @param {Object} app - Router. 
 * @param {Object} passport - Using to authenticate users with ad-promise.
 */

module.exports = function  (app, passport, adStaff, adStudent) {

  app.post('/auth', async (req, res, next) =>{
    let passISValid = null
  
    try {


      const user = await db.User.findOne({where: {username: req.body.username}})

      if(user !== null && user.dataValues.password !== null){
        passISValid = await SecurePass.compare(req.body.password, user.dataValues.password)
      }

      if(user === null || passISValid === null) {

        passport.authenticate('ldapauth', {session: false}, async (err, userLDAP, info) => {

          try {
            
            if (userLDAP === false  || passISValid === false) {
              return res.status(401).send({
                success: false, 
                message: {
                  message: "Echec de l'authentification",
                  desc: "mauvais mots de passe/login",
                  type: "error"
                } 
              });
            } else {

              let name = ''
              let chars = ''
              let firstLeterFname = ''
              let firstLeterLname = ''
              let avatarName = ''
              let accountType = 'user'
              let isAdmin = false

              const isStaffUser = await adStaff.findUser(userLDAP.sAMAccountName, (err, staff) =>{
                if (err) {
                  console.log(err)
                  return false                
                }
              
                if (!staff){
                  return false
                }
                else return true
              })

              if(isStaffUser === true){
              
                isAdmin =  await adStaff.isUserMemberOf(userLDAP.sAMAccountName, "Groupe_Informatique", () => (err, isMember) =>{
                  if (err) {
                    console.log('ERROR: ',err);
                    return false;
                  }   
                  console.log(userLDAP.sAMAccountName + ' isMemberOf Groupe_Informatique' + ': ' + isMember);
                  return isMember
                })

                if(isAdmin === true){

                  accountType = 'admin'

                } else {

                  accountType = 'iut_staff'

                }

              }

              var words = userLDAP.cn.split(' ')
              var firstName = words[1]
              var lastName = words[0]
          

              if(firstName){
                name = `${firstName} ${lastName}`

                chars = firstName.split('')
                firstLeterFname = chars[0]

                chars = lastName.split('')
                firstLeterLname = chars[0]

                avatarName = `${firstLeterFname} ${firstLeterLname}`
              } else {
                name = `${lastName}`

                chars = lastName.split('')
                firstLeterLname = chars[0]

                avatarName = `${firstLeterLname}`
              }

              var randomColor = Math.floor(Math.random()*16777215).toString(16);

              const hash = await bcrypt.genSalt(saltRounds)
              .then(salt => {
                return bcrypt.hash(req.body.password, salt);
              })
              .catch(err => console.log("err in user secure pass (encrypt) : ", err));

              const [newUser, created] = await db.User.findOrCreate(
                {where: 
                  {username: req.body.username}, 
                  defaults:{
                    name: name,
                    notiffication: "granted",
                    username: userLDAP.sAMAccountName,
                    password: hash,
                    mail: userLDAP.mail,
                    firstUse: true,
                    theme: "light",
                    accountType: accountType,
                    avatarName: avatarName,
                    avatarColor: randomColor,
                  }
                }
              )
              
              if(created === false){

                var saveUser = await db.User.findOne({where: {username: req.body.username}})

                saveUser.password = hash

                await saveUser.save()

              }

              delete newUser.dataValues.password
              delete newUser.dataValues.username

              return res.status(200).send({
                success: true, 
                session: {
                  token: userToken,
                  timesession: new Date().getTime()
                },
                user: {
                  data: newUser.dataValues,
                },
              })
            }
          } catch (error) {

            console.log('err in auth : ', error)

            return res.status(500).send({
              message: {
                message: "Oups ! Il y à eu un problème lors de l'authentification",
                desc: "Impossible de trouver l'utilisateur dans l'AD",                  
                type: 'error'
              }
            });            
          }
        })(req, res, next)
      } else if(user !== null && passISValid === true){

        delete user.dataValues.password
        delete user.dataValues.username        
        return res.status(200).send({
          success: true, 
          session: {
            token: userToken,
            timesession: new Date().getTime()
          },
          user: {
            data: user.dataValues,
          },
        })
      } else if(user !== null && user.dataValues.password !== null && passISValid === false){

        return res.status(401).send({
          success: false, 
          message: {
            message: "Echec de l'authentification",
            desc: "mauvais mots de passe/login",
            type: "error"
          } 
        });
        
      }
    } catch (error) {

      console.log('err in auth : ', error)

      return res.status(500).send({
        success: false, 
        message: {
          message: "Oups ! Il y à eu un problème lors de l'authentification",
          desc: "Impossible de trouver ou créer l'utilisateur en BDD",
          type: "error"
        } 
      });
    }
  })
}