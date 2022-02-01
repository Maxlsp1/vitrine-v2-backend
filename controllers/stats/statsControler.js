const express =  require('express');  
const db = require("../../db/models/index")
const sequelize = require('sequelize')
const { Op } = require("sequelize");
const router = express.Router();

router.post('/get_header_stats', async (req, res) =>{

  try {
    let feedBackAVG = 0
    const date = new Date()
    const year = date.getFullYear()
    const RessourcesCount = await db.Ressources.count()
    const feedbacksCount = await db.Feedback.count({
      where: {
        [Op.or]: [
          {post_date: {
            [Op.gte]: `${year}-01-01`,
            [Op.lte]: `${year}-12-31`
          }},
          {update_date: {
            [Op.gte]: `${year}-01-01`,
            [Op.lte]: `${year}-12-31`
          }}
        ]
      }
    })
    const feedbacksSum = await db.Feedback.sum('rate',{
      where: {
        [Op.or]: [
          {post_date: {
            [Op.gte]: `${year}-01-01`,
            [Op.lte]: `${year}-12-31`
          }},
          {update_date: {
            [Op.gte]: `${year}-01-01`,
            [Op.lte]: `${year}-12-31`
          }}
        ]
      }
    })

    if(feedbacksCount !== 0){

      feedBackAVG = feedbacksSum/feedbacksCount
    }

    const headerStats = {
      RessourcesCount: RessourcesCount,
      feedbacksCount: feedbacksCount,
      feedBackAVG: feedBackAVG.toFixed(2)
    }

    res.status(200).send({
      headerStats: headerStats,
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pu récupérer les stats du header !!!!! ",
      type: 'error'
    })
  }

})

router.post('/new_ressource_stat', async (req, res) =>{

  try {

    const date = new Date()
    const datetime = new Date().toJSON().slice(0, 19).replace('T', ' ')
    const time = datetime.split(' ')
    const get_date = date.toJSON().slice(0, 10)
    const get_time = time[1]
   
    const stats = await db.Ressource_Stats.create({

      get_date: get_date,
      get_time: get_time,
      RessourceId: req.body.id
    });
    res.status(201).send({response_type: "success"})
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu sauvegarder la stat !!!!! ",
      type: 'error'
    })
  }

})

router.post('/get_consumption_stats', async (req, res) =>{

  try {
   
    const Distribution = await Promise.all([
      db.Ressources.count({where:{type: "apps_file"}}),
      db.Ressources.count({where: {type: "apps_link"}}),
      db.Ressources.count({where: {type: "online_service"}}),
      db.Ressources.count({where: {type: "docs"}})
    ])

    const Month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const count_per_month = await Promise.all(Month.map(async (month) =>{
    
      const date = new Date()
      let lastDay = 28;

      if(month === 4 || month === 6 || month === 9 || month === 11){

        lastDay = 30

      } else if (month === 2){

        lastDay = 28

      } else {

        lastDay = 31

      }
      const queryDateMin = `${date.getFullYear()}-${month}-01`
      const queryDateMax = `${date.getFullYear()}-${month}-${lastDay}`

      const res = await db.Ressource_Stats.count({
        where: {
          get_date: {
            [Op.gte]: queryDateMin,
            [Op.lte]: queryDateMax
          },
        }
      })
      return res
    }))


    const count_per_category = await Promise.all([
      db.Ressource_Stats.count({
        where: {
          '$Ressource.type$': "apps_file" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
      db.Ressource_Stats.count({
        where: {
          '$Ressource.type$': "apps_link" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
      db.Ressource_Stats.count({
        where: {
          '$Ressource.type$': "online_service" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
      db.Ressource_Stats.count({
        where: {
          '$Ressource.type$': "docs" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
    ])

    const consumptionStats = {
      Distribution: Distribution,
      per_month: count_per_month,
      per_category: count_per_category
    }
    res.status(200).send({
      consumptionStats: consumptionStats,
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu récupérer les stats sur la consomation des Ressources !!!!! ",
      type: 'error'
    })
  }

})


router.post('/get_feedbacks_stats', async (req, res) =>{

  try {
   
    let avg_feedbacks_category = []
    let avg_feedbacks_year = []
    const Month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const count_per_month = await Promise.all(Month.map(async (month) =>{
    
      const date = new Date()
      let lastDay = 28;

      if(month === 4 || month === 6 || month === 9 || month === 11){

        lastDay = 30

      } else if (month === 2){

        lastDay = 28

      } else {

        lastDay = 31

      }
      const queryDateMin = `${date.getFullYear()}-${month}-01`
      const queryDateMax = `${date.getFullYear()}-${month}-${lastDay}`

      const res = await db.Feedback.count({
        where: {
          [Op.or]: [
            {post_date: {
              [Op.gte]: queryDateMin,
              [Op.lte]: queryDateMax
            }},
            {update_date: {
              [Op.gte]: queryDateMin,
              [Op.lte]: queryDateMax
            }}
          ]
        }
      })
      return res
    }))

    const sum_per_month = await Promise.all(Month.map(async (month) =>{
    
      const date = new Date()
      let lastDay = 28;

      if(month === 4 || month === 6 || month === 9 || month === 11){

        lastDay = 30

      } else if (month === 2){

        lastDay = 28

      } else {

        lastDay = 31

      }
      const queryDateMin = `${date.getFullYear()}-${month}-01`
      const queryDateMax = `${date.getFullYear()}-${month}-${lastDay}`

      const res = await db.Feedback.sum("rate",{
        where: {
          [Op.or]: [
            {post_date: {
              [Op.gte]: queryDateMin,
              [Op.lte]: queryDateMax
            }},
            {update_date: {
              [Op.gte]: queryDateMin,
              [Op.lte]: queryDateMax
            }}
          ]
        }
      })
      if(res === null){

        return 0

      } else {

        return res

      }
    }))

    for (let index = 0; index < 12; index++) {

     if(sum_per_month[index] === 0 || count_per_month[index] === 0){
        avg_feedbacks_year.push(0)

      } else {
        const avg = sum_per_month[index]/count_per_month[index]
        avg_feedbacks_year.push(avg)

      }
      
    }

    const count_per_category = await Promise.all([
      db.Feedback.count({
        where: {
          '$Ressource.type$': "apps_file" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
      db.Feedback.count({
        where: {
          '$Ressource.type$': "apps_link" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
      db.Feedback.count({
        where: {
          '$Ressource.type$': "online_service" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
      db.Feedback.count({
        where: {
          '$Ressource.type$': "docs" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        }
      }),
    ])

    const sum_per_category = await Promise.all([

      db.Feedback.sum('rate',{
        where: {
          '$Ressource.type$': "apps_file" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        },
      }),
      db.Feedback.sum('rate',{
        where: {
          '$Ressource.type$': "apps_link" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        },
      }),
      db.Feedback.sum('rate',{
        where: {
          '$Ressource.type$': "online_service" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        },
      }),
      db.Feedback.sum('rate',{
        where: {
          '$Ressource.type$': "docs" 
        },
        include: {
          model: db.Ressources,
          as: 'Ressource',
        },
      }),
      
    ])

    for (let index = 0; index < 4; index++) {

      if(sum_per_category[index] === 0 || count_per_category[index] === 0){

        avg_feedbacks_category.push(0)

      } else {
        const avg = sum_per_category[index]/count_per_category[index]
        avg_feedbacks_category.push(avg)      
      }
    }

    const feedbacksStats = {
      average_score_per_category: avg_feedbacks_category,
      average_score_per_month: avg_feedbacks_year
    }
    res.status(200).send({
      feedbacksStats: feedbacksStats,
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu récupérer les stats sur les retour d'éxperiences !!!!! ",
      type: 'error'
    })
  }

})

module.exports = router