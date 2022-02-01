'use strict';
const SecurePass = require('../../util/securePass')
var suid = require('rand-token').suid;
let cryptoToken = suid(16);

/**
 *  In first time this methode encrypt ad's pass and username in db.
 *  In second time them populate Settings Table.
 */

let pass = SecurePass.encrypted('xxxxxxxxxxx', cryptoToken)
let userName = SecurePass.encrypted('xxxxxxxxxxx', cryptoToken)

module.exports = {
  up: async (queryInterface, Sequelize) => {
     try {

        await queryInterface.bulkInsert('AdSettings', [{
          Ldap_url: 'xxxxxxxxxxx',
          baseDNStaffUser:'xxxxxxxxxxx',
          baseDNStaffGroup:'xxxxxxxxxxx',
          baseDNStudentUser:'xxxxxxxxxxx',
          baseDNStudentGroup:'xxxxxxxxxxx',
          Ldap_username: userName,
          Ldap_pass: pass,
          Token: cryptoToken
        }], {}); 

     } catch (error) {
      console.log(error)
     }   
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('AdSettings', null, {});
  }
};
