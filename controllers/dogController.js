// Import the Dog model at the top
const Dog = require("../models/Dog");

// @desc    Get all dogs
// @route   GET /api/dogs
// @access  Public
exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.status(200).json(dogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dogs" });
  }
};

// @desc    Get a single dog by ID
// @route   GET /api/dogs/:id
// @access  Public
exports.getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }
    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dog" });
  }
};

// @desc    Create a new dog
// @route   POST /api/dogs
// @access  Private
exports.createDog = async (req, res) => {
  try {
    const { name, breed, age, description, image } = req.body;

    const newDog = await Dog.create({
      name,
      breed,
      age,
      description,
      image,
      owner: req.user._id
    });

    console.log(" Dog created with owner:", req.user._id);
    res.status(201).json(newDog);
  } catch (err) {
    console.error("Dog creation error:", err.message);
    res.status(500).json({ error: "Failed to create dog", detail: err.message });
  }
};

// @desc    Update a dog
// @route   PUT /api/dogs/:id
// @access  Private
exports.updateDog = async (req, res) => {
  try {
    const updatedDog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json(updatedDog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update dog" });
  }
};

// @desc    Delete a dog (only owner, and only if not adopted)
// @route   DELETE /api/dogs/:id
// @access  Private
exports.deleteDog = async (req, res) => {
  const dogId = req.params.id;
  const userId = req.user._id;

  try {
    const dog = await Dog.findById(dogId); // Proper variable name here

    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }

    if (dog.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only delete dogs you registered" });
    }

    if (dog.adoptedBy) {
      return res.status(400).json({ error: "Cannot delete a dog that has already been adopted" });
    }

    await dog.deleteOne();
    res.status(200).json({ message: "Dog successfully deleted" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Server error during deletion" });
  }
};

// @desc    Adopt a dog
// @route   POST /api/dogs/:id/adopt
// @access  Private
exports.adoptDog = async (req, res) => {
  const dogId = req.params.id;
  const userId = req.user._id;
  const { thankYouMessage } = req.body;

  try {
    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }

    if (dog.owner.toString() === userId.toString()) {
      return res.status(403).json({ error: "You cannot adopt your own dog" });
    }

    if (dog.adoptedBy) {
      return res.status(400).json({ error: "Dog has already been adopted" });
    }

    dog.adopted = true;
    dog.adoptedBy = userId;
    dog.thankYouMessage = thankYouMessage || "";

    await dog.save();

    res.status(200).json({
      message: "Dog successfully adopted!",
      dog,
    });
  } catch (err) {
    console.error("Adoption error:", err.message);
    res.status(500).json({ error: "Server error during adoption" });
  }
};

// @desc    List dogs registered by the logged-in user (with optional filter + pagination)
// @route   GET /api/dogs/my-dogs
// @access  Private
exports.getMyDogs = async (req, res) => {
  const userId = req.user._id;
  const { adopted, page = 1, limit = 5 } = req.query;

  const query = { owner: userId };

  if (adopted === "true") {
    query.adopted = true;
  } else if (adopted === "false") {
    query.adopted = false;
  }

  try {
    const dogs = await Dog.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json(dogs);
  } catch (err) {
    console.error("Fetch my dogs error:", err.message);
    res.status(500).json({ error: "Failed to fetch user's dogs" });
  }
};
// @desc    List all dogs adopted by the logged-in user (with pagination)
// @route   GET /api/dogs/my-adopted
// @access  Private
exports.getMyAdoptedDogs = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 5 } = req.query;

  try {
    const dogs = await Dog.find({ adoptedBy: userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json(dogs);
  } catch (err) {
    console.error("Fetch adopted dogs error:", err.message);
    res.status(500).json({ error: "Failed to fetch adopted dogs" });
  }
};
