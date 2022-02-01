//Define modules
const express = require("express"); 
const bodyParser = require('body-parser');
const webpush = require('web-push');
const db = require('./db/models/index');
const cors = require('cors')
const activeDirectory = require('./Infra/Ad/initAd')
const app = express();
const passport = require('passport')
const https = require("https");
const http = require("http");
const fs = require('fs');
const { exec } = require('child_process');

const userControler = require("./controllers/Users/userControler");
const uploadControler = require("./controllers/upload/uploadControler");
const ressourcesControler = require("./controllers/ressources/ressourcesControler");
const feedbackControler = require("./controllers/feedback/feedbackControler");
const downloadControler = require('./controllers/download/downloadControler');
const subscriptionContrroler = require('./controllers/Subscription/subscriptionContrroler');
const settingsControler = require("./controllers/settings/settingsControler");
const statsControler = require('./controllers/stats/statsControler');

const cron = require('node-cron');
var LdapStrategy = require('passport-ldapauth');

async function init(){

    try {

    const task = await db.Cron_tasks_Settings.findAll()

    if(task.length > 0){
      
      if(task[0].is_active === true){

        cron.schedule('* * * * *', () => {
          console.log('running delete image every minute');
        });

      }


      if(task[1].is_active === true){

        cron.schedule('* * * * *', () => {
          console.log('running db sync every minute');
        });

      }
    }

    let options = {}
    //SSl Certificate
    if(process.env.NODE_ENV === "production")
        options = {
          key: fs.readFileSync('/etc/ssl/private/star.iut-tarbes.fr.key'),
          cert: fs.readFileSync('/etc/ssl/private/star.iut-tarbes.fr.crt'),
      };
      //storing the keys in variables
      const publicVapidKey = 'BAX3nx0YNmw-kBgLdDQEWaxfyf_CJd9UcpIAM6XoBn6hMM6w2FqGefBROJ1fFLpNEtvXawaODqttHb_Pv2_GAZk';
      const privateVapidKey = 'yzLZSzmufJanlJLhr_t5CRjbjTb4Y66gvNnsQnk9pbg';
      webpush.setVapidDetails('mailto:maxime.rault@iut-tarbes.fr', publicVapidKey,privateVapidKey);
      //Body Parser
      const urlencodedParser = bodyParser.urlencoded({
          extended: true,
          limit: "50mb"
      });
      console.log("process.env => ",process.env.NODE_ENV)
      app.use(urlencodedParser);
      app.use(bodyParser.json());
      db.sequelize.sync()

      //Init Ad for auth and Users (it using for populate db with user name, mail ...)
      const ad = await activeDirectory.initAuthAd(db)
      const adStudent = await activeDirectory.studentAd(db)
      const adStaff = await activeDirectory.iutStaffAd(db)
      
      passport.use(new LdapStrategy(ad));

      app.use(cors())
      app.use(express.static("public"));
      
      app.use(passport.initialize());

      //Routeur define
      const router = express.Router();

      //User route
      app.use("/Users", userControler)

      //upload route
      app.use("/upload", uploadControler)

      //ressources route
      app.use("/ressources", ressourcesControler)

      //feedback route
      app.use("/feedback", feedbackControler)

      // download route
      app.use("/download", downloadControler)

      // subscription route
      app.use("/notifications", subscriptionContrroler)

      //settings route
      app.use("/settings", settingsControler)

      //stats route
      app.use("/stats", statsControler)

      //auth route
      app.use("/", router);
      require(__dirname + "/controllers/auth/authControler")(router, passport, adStaff, adStudent);

      //Définition et mise en place du port d'écoute
      if(process.env.NODE_ENV === "production"){
        https.createServer(options, app).listen(8443, "0.0.0.0", () => console.log(`Listening on 0.0.0.0:8443`));
      } else {
        http.createServer(app).listen(8001, "127.0.0.1", () => console.log('Listening on localhost:8001'))
      }
    } catch (error) {
     console.log("init error : ", error) 
    }
}

init()