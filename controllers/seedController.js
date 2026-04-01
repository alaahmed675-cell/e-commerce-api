// controllers/seedController.js
const { seedDatabase } = require("../services/seedService.js");

const runSeed = async (req, res) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      success: true,
      message: "Database seeded successfully!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { runSeed };
