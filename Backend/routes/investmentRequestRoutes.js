import express from 'express';
import InvestmentRequest from '../models/InvestmentRequest.js';
import Startup from '../models/Startup.js';

const router = express.Router();

router.post('/', async (req, res) => {
    console.log("Hi10")
  try {
    console.log("Hi3")
    const { investorId, startupId } = req.body;
    if (!investorId || !startupId) {
        console.log("Hi")
      return res.status(400).json({ error: "Missing required fields" });
    }
    console.log("Hi2")
    const newRequest = new InvestmentRequest({ investorId, startupId, status: 'pending' });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating investment request: ", error);
    res.status(500).json({ error: 'Failed to create investment request' });
  }
});


router.get('/entrepreneur/:userId', async (req, res) => {
    console.log("Hi3")
    try {
        console.log("Hi2")
      const startupId = req.params.userId;
  
      // Find investment requests for the single startup
      const requests = await InvestmentRequest.find({ startupId })
        .populate('investorId', 'name'); // Populate investor name for convenience
        console.log("Hi4")
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching investment requests", error);
      res.status(500).json({ error: 'Failed to fetch investment requests' });
    }
  });

  router.get('/investor/:userId', async (req, res) => {
    try {
      const investorId = req.params.userId;
  
      // Find investment requests for the single investor
      const requests = await InvestmentRequest.find({ investorId })
        .populate('startupId', 'name'); // Populate startup name for convenience
  
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching investment requests", error);
      res.status(500).json({ error: 'Failed to fetch investment requests' });
    }
  });

export default router;
