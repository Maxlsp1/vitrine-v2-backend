# Vitrine-v2 (Server side)

This Server use Sequelize link to documentation :

- https://sequelize.org/master/index.html

And also use pm2 : 

- https://www.npmjs.com/package/pm2

To run this server you need :

  - Docker-compose
  - yarn
  - Node.js

If you work on Windows this link are utils to install yarn :

- https://www.liquidweb.com/kb/how-to-install-yarn-on-windows/
- https://sung.codes/blog/2017/12/30/yarn-global-add-command-not-work-windows/

## To deploy

Increase mysql max packet with the followin command :


## For dev
To run server use the following commands :

  - docker-compose up -d :
    create docker with database and user admin.
    phpmyadmin run on localhost:8081

  - yarn install :
    download all the necessary node mudules to run the server.

  - yarn start_dev_db:
    Create all tables and populate them.

  - yarn start:
    Run the server on localhoost:8001
