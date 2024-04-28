const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/tache");

router.get("/:id",TacheController.fetchTache)

router.patch("/:id", TacheController.updateTache)

router.post("/add/:id", TacheController.addTache);

router.delete("/:id", TacheController.deleteTache);

router.post('/uploadfile/:id', TacheController.uploadFile);



module.exports = router;