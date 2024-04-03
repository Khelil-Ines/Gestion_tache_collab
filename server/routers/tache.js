const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/tache");

router.get("/:id",TacheController.fetchTache)

router.patch("/:id", TacheController.updateTache)

router.post("/add", TacheController.addTache);

router.delete("/:id", TacheController.deleteTache);


module.exports = router;