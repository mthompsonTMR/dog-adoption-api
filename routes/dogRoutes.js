const express = require("express");
const router = express.Router();

const {
  getAllDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
  adoptDog,
  getMyDogs,
  getMyAdoptedDogs,
} = require("../controllers/dogController");

const protect = require("../middlewares/authMiddleware");
console.log("PROTECT TYPE:", typeof protect);


// Public routes
router.get("/", getAllDogs);
router.get("/my-dogs", protect, getMyDogs);
router.get("/my-adopted", protect, getMyAdoptedDogs);
router.get("/:id", getDogById);

// Protected routes (require login)
router.post("/", protect, createDog);
router.put("/:id", protect, updateDog);
router.delete("/:id", protect, deleteDog);
router.post("/:id/adopt", protect, adoptDog);


module.exports = router;
