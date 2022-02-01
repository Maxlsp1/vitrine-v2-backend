'use strict';
const db = require("../models/index")
const activeDirectory = require("../../Infra/Ad/initAd");
const user = require("../models/user");

/**
 * This Methode populate Users table, using ad's users config.
 */
  process
  .on('unhandledRejection', (reason, p) => {
    console.log(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.log(err, 'Uncaught Exception thrown');
  })

module.exports = {
  up: async (queryInterface, Sequelize) => {

    try {
      const studentUsers = await activeDirectory.studentAd(db).catch((err) => {
        console.log(err)
        throw err
      })
      const iutStaffUSers = await activeDirectory.iutStaffAd(db).catch((err) =>{
        console.log(err)
        throw err
      })
      var query='(&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))'
      let students
      let staffUsers
      let isAdmin

      staffUsers = await iutStaffUSers.findUsers(query, true).catch((err) =>{
        console.log(err)
        throw err
      })

      students = await studentUsers.findUsers(query, true).catch((err) =>{
        console.log(err)
        throw err
      })

      

      let userArray = []
      await Promise.all(staffUsers.map(async element => {
        isAdmin =  await iutStaffUSers.isUserMemberOf(element.sAMAccountName, "Groupe_Informatique", () => (err, isMember) =>{
          if (err) {
            console.log('ERROR: ',err);
            return false;
          }   
          console.log(element.sAMAccountName + ' isMemberOf Groupe_Informatique' + ': ' + isMember);
          return isMember
        })
        let accountType = 'user'
        if(isAdmin === true){
          accountType = 'admin'
        }
        else {
          accountType = 'iut_staff'
        }
        let name = ''
        let chars = ''
        let firstLeterFname = ''
        let firstLeterLname = ''
        let avatarName = ''

        var words = element.cn.split(' ')
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

        
        const color = ["#00AA55", "#009FD4", "#B381B3", "#D47500", "#DC2A2A"];
        const randomColor = Math.floor(Math.random() * color.length);

        userArray.push({
          name: name,
          username: element.sAMAccountName,
          mail: element.mail,
          firstUse: true,
          theme: "light",
          accountType: accountType,
          avatarName: avatarName.toLocaleUpperCase(),
          avatarColor: color[randomColor],
          notiffication: "granted"
        })

      }))
      .catch((err) =>{ 
        console.log('err => ', err)
        throw err
      });

      Promise.all(students.map((student) =>{
        let name = ''
        let chars = ''
        let firstLeterFname = ''
        let firstLeterLname = ''
        let avatarName = ''

        var words = student.cn.split(' ')
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

        
        const color = ["#00AA55", "#009FD4", "#B381B3", "#D47500", "#DC2A2A"];
        const randomColor = Math.floor(Math.random() * color.length);

        userArray.push({
          name: name,
          username: student.sAMAccountName,
          mail: student.mail,
          firstUse: true,
          theme: "light",
          accountType: "student",
          avatarName: avatarName.toLocaleUpperCase(),
          avatarColor: color[randomColor],
          notiffication: "granted"
        })
      }))
      .catch((err) => {
        console.log("student promise => ", err)
        throw err
      });
      await queryInterface.bulkInsert('Users', userArray)

    } catch (error) {
      console.log('error ========> ', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});

  }
};