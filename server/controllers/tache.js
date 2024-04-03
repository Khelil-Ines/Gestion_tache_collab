const Tache = require("../models/tache");
const moment = require('moment-timezone');


const addTache = (req, res) => {
    try {
      const tacheData = req.body;
  
      tacheData.createdAt = moment().tz('Europe/Paris').toDate();
  
      const newTache= new Tache(tacheData);
  
      newTache.save()
        .then(tache => {
          res.json(tache);
        })
        .catch(err => {
          console.error('Erreur lors de la création du tache :', err);
          res.status(400).json({ erreur: 'Échec de la création du tache', message: err.message });
        });
    } catch (error) {
      console.error('Erreur lors de la création du tache :', error);
      res.status(500).json({ erreur: 'Erreur lors de la création du tache', message: error.message });
    }
  };

  const fetchTache = (req, res) => {
    Tache.findOne({ _id: req.params.id })
    .then((tache) => {
      if (!tache) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: tache,
          message: "objet trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
}

  const getTache = (req, res) => {
    Tache.find().then((taches) => {
      res.status(200).json({
        model: taches,
        message: "success"
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "problème d'extraction"
      });
    });
  };

  const updateTache = (req, res) => {
    Tache.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
        (tache) => {
          if (!tache) {
            res.status(404).json({
              message: "objet non trouvé!",
            });
          } else {
            res.status(200).json({
              model: tache,
              message: "objet modifié!",
            });
          }
        }
      )
}
const deleteTache = (req, res) => {
    Tache.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result.deletedCount === 0) {
          res.status(404).json({
            message: "Tache non trouvé !",
          });
        } else {
          res.status(200).json({
            model: result,
            message: "Tache supprimé!",
          });
        }
      })
      .catch((error) => {
        res.status(400).json({
          error: error.message,
          message: "Données invalides!",
        });
      });
  };

  module.exports = {
    addTache,
    getTache,
    fetchTache,
    updateTache,
    deleteTache
    }