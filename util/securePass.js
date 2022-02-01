const CryptoJS = require("crypto-js");

/**
 * This methode use an AES (Advanced Encryption Standard) and
 * a token to encrypt the password.
 *
 * @param {String} pass - Ad's pass 
 * @param {String} suid - Token to encrypt pass
 * @returns {String} encryptPass - password encrypted 
 */

function encrypted(pass, suid){
    let encryptPass = {}
    try {
      if(suid){
        encryptPass = CryptoJS.AES.encrypt(pass, suid).toString()
      } else {
        encryptPass = CryptoJS.AES.encrypt(pass).toString()
      }
      return encryptPass 
    } catch (error) {
      console.log('error SecurePass : ', error)
    } 
}

/**
 * This methode use an AES (Advanced Encryption Standard) and
 * a token to encrypt the password.
 *
 * @param {String} encryptPass - Ad's pass who encrypting 
 * @param {String} suid - Token to decrypt pass
 * @returns {String} decryptPass - password decrypted 
 */

function decrypted(encryptPass, suid){
   try {
      var bytes = CryptoJS.AES.decrypt(encryptPass, suid)
      var decryptPass = bytes.toString(CryptoJS.enc.Utf8)
      return decryptPass
   } catch (error) {
     console.log(error)
   }
}

exports.encrypted = encrypted
exports.decrypted = decrypted