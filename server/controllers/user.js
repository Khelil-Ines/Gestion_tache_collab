const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const path = require('path');
const upload = require('../middleware/multer');
const multer = require('multer');


exports.signup = (req, res, next) => {
  const defaultImagePath = path.join(__dirname, '../uploads/img/profile.png');

  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      lastname : req.body.lastname,
      firstname : req.body.firstname,
      role: req.body.role,
      photo: defaultImagePath
    });
    user
      .save()
      .then((response) => {
        const newUser = response.toObject();
        delete newUser.password;
        res.status(201).json({
          user: newUser,
          message: "Utilisateur créé !",
        });
      })
      .catch((error) => {
        res
          .status(400)
          .json({ error: error.message, message: "Données invalides" });
      });
  });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: "User not found",
          });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                error: "login ou mot de passe incorrecte !",
              });
            }
            const token = jwt.sign(
              { userId: user._id }, 
              "RANDOM_TOKEN_SECRET", 
              { expiresIn: "24h" }
            );
            // Include firstname and lastname in the successful response
            res.status(200).json({
              token: token,
              firstname: user.firstname, // assuming the user object has a firstname
              lastname: user.lastname    // assuming the user object has a lastname
            });
          })
          .catch((error) => res.status(500).json({ error: error.message }));
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  };

exports.getUser = (req, res) => {
    User.find()
      .then((users) => {
        res.status(200).json({
          model: users,
          message: "success",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
          message: "problème d'extraction",
        });
      });
  };
  exports.updateUserProfile = async (req, res, next) => {
    try {
      // Utilisez le middleware Multer pour gérer le téléchargement de fichiers
      upload.single('photo')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // Une erreur Multer s'est produite lors du téléchargement du fichier
          return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier', message: err.message });
        } else if (err) {
          // Une autre erreur s'est produite
          return res.status(500).json({ error: 'Erreur lors du téléchargement du fichier', message: err.message });
        }
  
        // Mettez à jour le chemin de l'image de profil de l'utilisateur
        const userId = req.auth.userId;
        const photoPath = req.file ? req.file.path : req.auth.photo; 
  
        // Enregistrez les modifications dans la base de données
        await User.findByIdAndUpdate(userId, { photo: photoPath });
  
        res.status(200).json({ message: 'Photo de profil mise à jour avec succès' });
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo de profil de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo de profil de l\'utilisateur', message: error.message });
    }
  };

  exports.fetchUser = (req, res) => {
    User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User non trouvé!",
        });
      } else {
        res.status(200).json({
          model: user,
          message: "User trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};
// exports.projectsUser  = async (req, res) => { 
//   try {
//     const userId = req.auth.userId;

//     const user = await User.findOne({ _id: userId }).populate('projects');

//     // Vérifie si l'utilisateur a été trouvé
//     if (!user) {
//         return res.status(404).json({
//             message: "Utilisateur non trouvé."
//         });
//     }

//     // Renvoie les projets de l'utilisateur
//     res.status(200).json({
//         projects: user.projects,
//         message: "Projets récupérés avec succès.",
//     });
// } catch (error) {
//     console.error("Erreur lors de la récupération des projets de l'utilisateur :", error);
//     res.status(500).json({
//         error: error.message,
//         message: "Problème lors de l'extraction des projets de l'utilisateur.",
//     });
// }
// };

exports.projectsUser = async (req, res) => {
  if (!req.auth || !req.auth.userId) {
      return res.status(400).json({
          success: false,
          message: "Invalid authentication credentials."
      });
  }

  try {
      const userId = req.auth.userId;
      const user = await User.findOne({ _id: userId }).populate('projects');

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "Utilisateur non trouvé."
          });
      }

      res.status(200).json({
          success: true,
          message: "Projets récupérés avec succès.",
          projects: user.projects
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des projets de l'utilisateur :", error);
      res.status(500).json({
          success: false,
          message: "Problème lors de l'extraction des projets de l'utilisateur.",
          error: error.message
      });
  }
};
