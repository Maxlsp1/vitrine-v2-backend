'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     try {

        await queryInterface.bulkInsert('Cron_tasks_Settings', [{
          name: 'delete image in public folder',
          scheduled_time: '0 23 * * *',
          is_active: false
        },
        {
          name: 'check orphans files',
          scheduled_time: '* * * * Sunday',
          is_active: false
        },
        {
          name: 'synchronize db with ad',
          scheduled_time: '* * * * Sunday',
          is_active: false
        }], {}); 

     } catch (error) {
      console.log(error)
     }   
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Cron_tasks_Settings', null, {});
  }
};
