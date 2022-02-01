'use strict';
const SecurePass = require('../../util/securePass')
var suid = require('rand-token').suid;
let cryptoToken = suid(16);

/**
 *  In first time this methode encrypt ad's pass and username in db.
 *  In second time them populate Settings Table.
 */

let pass = SecurePass.encrypted('Roldap2016', cryptoToken)
let userName = SecurePass.encrypted('roldap@iut-tarbes.local', cryptoToken)

module.exports = {
  up: async (queryInterface, Sequelize) => {
     try {

        await queryInterface.bulkInsert('AdSettings', [{
          Ldap_url: 'ldaps://ad1-peda.iut-tarbes.local:636',
          baseDNStaffUser:'OU=Personnels,DC=iut-tarbes,DC=local',
          baseDNStaffGroup:'OU=Groupes_Securite_Administration,DC=iut-tarbes,DC=local',
          baseDNStudentUser:'OU=Etudiants,DC=iut-tarbes,DC=local',
          baseDNStudentGroup:'OU=Groupes_Securite,DC=iut-tarbes,DC=local',
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
