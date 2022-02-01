'use strict';
const fs = require('fs')
const path = require('path')
const db = require('../models/index')

module.exports = {
  up: async (queryInterface, Sequelize) => {
     try {

      await db.appSettings.create({
            defaultBackground: fs.readFileSync(
              path.join(process.cwd(), "/db/seeders/default_Images/linux_good_side.jpg")
            ),
            default_background_name: "linux_good_side.jpg",
            default_background_mimeType: "image/jpg",
  
            defaultLogo: fs.readFileSync(
              path.join(process.cwd(), "/db/seeders/default_Images/servinfo.png"),
            ),
            default_logo_name: "servinfo.png",
            default_logo_mimeType: "image/png",
            dbStorageLimit: 152.375,
            storageLimitServer: 457.126,
          })
          .then((image) => {
            fs.writeFileSync(
              path.join(process.cwd(), "/db/seeders/default_Images/linux_good_side.jpg"),
              image.defaultBackground
            );
            fs.writeFileSync(
              path.join(process.cwd(), "/db/seeders/default_Images/servinfo.png"),
              image.defaultLogo
            );
          })

     } catch (error) {
      console.log(error)
     }   
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('appSettings', null, {});
  }
};
