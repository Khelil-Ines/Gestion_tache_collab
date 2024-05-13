const Tache = require("../models/tache");
const Column = require("../models/column");
const multer = require('multer');
const moment = require('moment-timezone');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/files') // Spécifie le dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
      // Génère un nom de fichier unique pour éviter les collisions
      cb(null, Date.now() + '-' + file.originalname)
  }
});

// Initialise l'objet upload avec les options de configuration
const upload = multer({ storage: storage });

const addTache = async (req, res) => {
  try {
      const columnId = req.params.id;
      
      const column = await Column.findById(columnId);
      if (!column) {
          console.error("Colonne non trouvée.");
          return res.status(404).json({ erreur: "Colonne non trouvée." });
      }
      
      const tacheData = req.body;
      tacheData.createdAt = moment().tz('Europe/Paris').toDate();
      
      const newTache = new Tache(tacheData);
      await newTache.populate('responsable');
      await newTache.save(); // Sauvegarde la tâche d'abord
      
      column.taches.push(newTache._id); // Ajoute l'ID de la tâche au tableau de tâches de la colonne
      await column.save(); // Sauvegarde la colonne avec la nouvelle tâche
      
      res.json(newTache); 
  } catch (error) {
      console.error('Erreur lors de la création de la tâche :', error);
      res.status(500).json({ erreur: 'Erreur lors de la création de la tâche', message: error.message });
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
};
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
  const uploadFile = async (req, res, next) => {
    try {
        // Utilisez le middleware Multer pour gérer le téléchargement de fichiers
        upload.single('file')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Une erreur Multer s'est produite lors du téléchargement du fichier
                return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier', message: err.message });
            } else if (err) {
                // Une autre erreur s'est produite
                return res.status(500).json({ error: 'Erreur lors du téléchargement du fichier', message: err.message });
            }

            // Récupère l'ID de la tâche à laquelle le fichier doit être ajouté
            const tacheId = req.params.id;

            // Vérifie si la tâche existe
            const tache = await Tache.findById(tacheId);
            if (!tache) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            // Initialise la propriété file comme un tableau vide si elle n'est pas définie
            if (!tache.file) {
                tache.file = [];
            }

            // Ajoute le fichier à la liste des fichiers de la tâche
            tache.file.push(req.file.path);

            // Enregistre les modifications dans la base de données
            await tache.save();

            res.status(200).json({ message: 'Fichier ajouté avec succès à la tâche' });
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du fichier :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du fichier', message: error.message });
    }
};

// const moveTacheToColumn = async (req, res) => {
//   try {
//       const { tacheId, targetColumnId } = req.params;

//       // Récupérer la tâche et la colonne cible
//       const tache = await Tache.findById(tacheId);
//       const targetColumn = await Column.findById(targetColumnId);

//       if (!tache || !targetColumn) {
//           return res.status(404).json({ error: 'Tâche ou colonne non trouvée' });
//       }

//       // Retirer la tâche de sa colonne actuelle
//       const sourceColumn = await Column.findOne({ taches: tacheId });
//       if (sourceColumn) {
//           sourceColumn.taches.pull(tacheId);
//           await sourceColumn.save();
//       }

//       // Ajouter la tâche à la colonne cible
//       targetColumn.taches.push(tacheId);
//       await targetColumn.save();

//       res.status(200).json({ message: 'Tâche déplacée avec succès vers la nouvelle colonne' });
//   } catch (error) {
//       console.error('Erreur lors du déplacement de la tâche :', error);
//       res.status(500).json({ error: 'Erreur lors du déplacement de la tâche', message: error.message });
//   }
// };

// const moveTacheToColumn = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { tacheId, targetColumnId } = req.params;

//     const tache = await Tache.findById(tacheId).session(session);
//     const targetColumn = await Column.findById(targetColumnId).session(session);
//     if (!tache || !targetColumn) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ error: 'Tâche ou colonne non trouvée' });
//     }

//     const sourceColumn = await Column.findOne({ taches: tacheId }).session(session);
//     if (sourceColumn) {
//       sourceColumn.taches.pull(tacheId);
//       await sourceColumn.save({ session });
//     }

//     targetColumn.taches.push(tacheId);
//     await targetColumn.save({ session });

//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({ message: 'Tâche déplacée avec succès vers la nouvelle colonne' });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Erreur lors du déplacement de la tâche :', error);
//     res.status(500).json({ error: 'Erreur lors du déplacement de la tâche', message: error.message });
//   }
// };
const mongoose = require("mongoose");

const moveTacheToColumn = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tacheId, targetColumnId } = req.params;
    
    const tache = await Tache.findById(tacheId).session(session);
    const targetColumn = await Column.findById(targetColumnId).session(session);
    if (!tache || !targetColumn) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Tâche ou colonne non trouvée' });
    }
    if (String(tache.responsable)!==  String(req.auth.userId)) {
      console.log(String(tache.responsable),  String(req.auth.userId));
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Vous n\'êtes pas autorisé à déplacer cette tâche' });
    }
    const sourceColumn = await Column.findOne({ taches: tacheId }).session(session);
    if (!sourceColumn) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Colonne source non trouvée' });
    }

    sourceColumn.taches.pull(tacheId);
    await sourceColumn.save({ session });

    targetColumn.taches.push(tacheId);
    await targetColumn.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      message: 'Tâche déplacée avec succès vers la nouvelle colonne',
      tache: tache, // Include the updated task information in the response
      sourceColumn: sourceColumn, // Include source column information in the response
      targetColumn: targetColumn // Include target column information in the response
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Erreur lors du déplacement de la tâche :', error);
    res.status(500).json({ error: 'Erreur lors du déplacement de la tâche', message: error.message });
  }
};


  module.exports = {
    addTache,
    getTache,
    fetchTache,
    updateTache,
    deleteTache,
    uploadFile,
    moveTacheToColumn,
    }