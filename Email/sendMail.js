const kangoo = require('../Infra/LaPoste/transporter')
const Email = require('email-templates')
const path = require('path')
const configServer = require('../config')
const env = configServer.NODE_ENV || 'development';

function sendMail(params, templateType){
  const root = path.join(__dirname, 'templates');
  const email = new Email({
    transport: kangoo,
    send: true,
    preview: false,
    juice: true,
    views: { root },
    preview: env === "development" ? { open: { app: 'chrome' }}:false,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.join(__dirname, 'templates', 'style')
      }
    }
  });

  switch (templateType) {
    case "associateService":

      email.send({
        template: 'associateService',
        message: {
          from: 'Maggy <no-reply@proms.iut-tarbes.fr>',
          to: env === "development" ? "maxime.rault@iut-tarbes.fr":params.service.mail,
          attachments: [{
            filename: 'Maggy_Happy_Rounded.png',
            path: path.join(__dirname, 'templates', 'images', 'Maggy_Happy_Rounded.png'),
            cid: 'MaggyHappy' //same cid value as in the html img src
          },
          {
            filename: 'Logo-IUTTARBES.jpg',
            path: path.join(__dirname, 'templates', 'images', 'Logo-IUTTARBES.jpg'),
            cid: 'logoIUT' //same cid value as in the html img src
          }],
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            images: true,
            relativeTo: path.join(__dirname, 'templates', 'images'),
            relativeTo: path.resolve('associateService')
          },
        },
        locals: {
          name: params.name,
          projectName: params.project.name,
          describ: params.project.describ,
          mail: params.mail,
          servicName: params.service.name
        },
      })
      .then(() => console.log('email has been sent!'));      
      break;

    case "dissociateService":

      email.send({
        template: 'dissociateService',
        message: {
          from: 'Maggy <no-reply@proms.iut-tarbes.fr>',
          to: env === "development" ? "maxime.rault@iut-tarbes.fr":params.service.mail,
          attachments: [{
            filename: 'Maggy_Happy_Rounded.png',
            path: path.join(__dirname, 'templates', 'images', 'Maggy_Happy_Rounded.png'),
            cid: 'MaggyHappy' //same cid value as in the html img src
          },
          {
            filename: 'Logo-IUTTARBES.jpg',
            path: path.join(__dirname, 'templates', 'images', 'Logo-IUTTARBES.jpg'),
            cid: 'logoIUT' //same cid value as in the html img src
          }],
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            images: true,
            relativeTo: path.join(__dirname, 'templates', 'images'),
            relativeTo: path.resolve('dissociateService')
          },
        },
        locals: {
          name: params.name,
          projectName: params.project.name,
          describ: params.project.describ,
          mail: params.mail,
          servicName: params.service.name,
          reason: params.reason
        },
      })
      .then(() => console.log('email has been sent!'));      
      break;

    case "deleteProjects":

      email.send({
        template: 'deleteProjects',
        message: {
          from: 'Maggy <no-reply@proms.iut-tarbes.fr>',
          to: env === "development" ? "maxime.rault@iut-tarbes.fr":params.service.mail,
          attachments: [{
            filename: 'Maggy_Happy_Rounded.png',
            path: path.join(__dirname, 'templates', 'images', 'Maggy_Happy_Rounded.png'),
            cid: 'MaggyHappy' //same cid value as in the html img src
          },
          {
            filename: 'Logo-IUTTARBES.jpg',
            path: path.join(__dirname, 'templates', 'images', 'Logo-IUTTARBES.jpg'),
            cid: 'logoIUT' //same cid value as in the html img src
          }],
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            images: true,
            relativeTo: path.join(__dirname, 'templates', 'images'),
            relativeTo: path.resolve('deleteProjects')
          },
        },
        locals: {
          name: params.name,
          projectsNames: params.projectsNames,
          mail: params.mail,
          servicName: params.service.name,
          reason: params.reason
        },
      })
      .then(() => console.log('email has been sent!'));      
      break;

    case "createProject":
      email.send({
        template: 'createProject',
        message: {
          from: 'Maggy <no-reply@proms.iut-tarbes.fr>',
          to: env === "development" ? "maxime.rault@iut-tarbes.fr":params.userService,
          attachments: [{
            filename: 'Maggy_Happy_Rounded.png',
            path: path.join(__dirname, 'templates', 'images', 'Maggy_Happy_Rounded.png'),
            cid: 'MaggyHappy' //same cid value as in the html img src
          },
          {
            filename: 'Logo-IUTTARBES.jpg',
            path: path.join(__dirname, 'templates', 'images', 'Logo-IUTTARBES.jpg'),
            cid: 'logoIUT' //same cid value as in the html img src
          }],
        },
        juice: true,
        juiceResources: {
          preserveImportant: true,
          webResources: {
            images: true,
            relativeTo: path.join(__dirname, 'templates', 'images'),
            relativeTo: path.resolve('createProject')
          },
        },
        locals: {
          name: params.name,
          projectName: params.project.name,
          describ: params.project.describ,
          mail: params.mail,
        },
      })
      .then(() => console.log('email has been sent!'));     
      break;
    default:
      console.log("err im in default case !!!!!")
      break;
  }
}

module.exports = sendMail