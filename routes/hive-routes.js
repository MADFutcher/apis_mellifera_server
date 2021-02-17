const express    = require('express');
const hiveRoutes = express.Router();
const authController = require('../controller/authController')
const User       = require('../models/user-model');
const Hive       = require('../models/hive-model');


//Get hives for specific owner
hiveRoutes.get('/hives/:ownerId', (req,res,next) =>{
  const {owner} = req.params.ownerId
  Hive.find({owner})
      .then(theHives =>{
        return res.status(200).json(theHives);
      })
      .catch(err =>{
        return res.status(500).json(err)
      })
})

//get Specific Hive
hiveRoutes.get('/hive/:hiveId', (req,res,next) =>{
  const {hiveId} = req.params
  Hive.findById(hiveId)
      .then(theHive =>{
        return res.status(200).json(theHive);
      })
      .catch(err =>{
        return res.status(500).json(err)
      })

})


//update Specific Hive
hiveRoutes.post('/hive/:hiveId', authController.protect, (req,res,next)=>{
  const hiveId = req.body._id
  Hive.findByIdAndUpdate(hiveId, req.body ,{new:true})
      .then(updatedHive => {return res.status(200).json(updatedHive)})
      .catch(err => {return res.status(500).json({message: err})})
})



hiveRoutes.post('/hives/new', authController.protect, (req,res,next)=>{
  const {title, age, location, race, info, owner} = req.body
  console.log("hello")
  Hive.create({title,
                age,
                location,
                race,
                info,
                owner
          })
          .then(newHive =>{
            User.findByIdAndUpdate(newHive.owner,{$push: {"hives": newHive._id}},{new:true})
                .then((updatedUser)=>{return  res.status(200).json({ message: updatedUser });})
            return;
          })
          .catch(err =>{
            res.status(500).json(err);
          })

})









module.exports = hiveRoutes;