import express from 'express';
import { createInvestor, getInvestors } from '../controllers/investorController.js';

const router = express.Router();
import Investor from "../models/Investor.js";
router.post('/', createInvestor);
router.get('/', getInvestors);
router.get("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const investor = await Investor.findOne({ userId });
  
      if (!investor) {
        return res.status(404).json({ message: "Investor preferences not found." });
      }
  
      res.status(200).json(investor);
    } catch (error) {
      console.error("Error fetching investor preferences:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;