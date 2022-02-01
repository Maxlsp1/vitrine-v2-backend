const bcrypt = require("bcrypt");
const saltRounds = 10;
/**
 * This methode use an AES (Advanced Encryption Standard) and
 * a token to encrypt the password.
 *
 * @param {String} pass - Ad's pass 
 * @param {String} suid - Token to encrypt pass
 * @returns {String} encryptPass - password encrypted 
 */

function encrypted(pass, username, db){

  bcrypt.genSalt(saltRounds)
  .then(salt => {
    
    return bcrypt.hash(pass, salt);
  })
  .then(async hash => {

    try {
      const user = await db.User.findOne({where: {username: username}})

      user.dataValues.password = hash

      await user.save()
    } catch (error) {
      console.log('error in save secure pass : ', error)
    }
    
  })
  .catch(err => console.log("err in user secure pass (encrypt) : ", err));
}

/**
 * This methode use an AES (Advanced Encryption Standard) and
 * a token to encrypt the password.
 *
 * @param {String} encryptPass - Ad's pass who encrypting 
 * @param {String} suid - Token to decrypt pass
 * @returns {String} decryptPass - password decrypted 
 */

async function compare(pass, hash){
  
  const result = await bcrypt.compare(pass, hash)
  .then(res => {
    return res
  })
  .catch(err => console.log("err in user secure pass (compare) : ", err));
  return result
}

exports.encrypted = encrypted
exports.compare = compare