const express    = require('express');
const hiveRoutes = express.Router();

const User       = require('../models/user-model');
const Hive       = require('../models/hive-model');


hiveRoutes.post('/hives/new', (req,res,next)=>{
  const {title, age, location, race, info, owner} = req.body
  console.log(req.body)
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
            res.status(500).json({ message: err });
          })

})


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
        console.log(theHive)
        return res.status(200).json(theHive);
      })
      .catch(err =>{
        return res.status(500).json(err)
      })

})




module.exports = hiveRoutes;