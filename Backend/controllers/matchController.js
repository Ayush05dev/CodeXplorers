import Match from '../models/Match.js';
import Startup from '../models/Startup.js';
import Investor from '../models/Investor.js';

// @desc    Generate matches
// @route   POST /api/matches
export const generateMatches = async (req, res) => {
  try {
    const startups = await Startup.find();
    const investors = await Investor.find();

    const matches = [];
    startups.forEach((startup) => {
      investors.forEach((investor) => {
        if (startup.industry === investor.industryPreferences[0]) {
          const matchScore = Math.floor(Math.random() * 100); // Example scoring logic
          matches.push({
            startupId: startup._id,
            investorId: investor._id,
            matchScore,
          });
        }
      });
    });

    await Match.insertMany(matches);
    res.status(201).json(matches);
  } catch (err) {
    console.error('Error generating matches:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all matches
// @route   GET /api/matches
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('startupId', 'name')
      .populate('investorId', 'name');
    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};