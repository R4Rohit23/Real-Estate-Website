import express from 'express';
import Listing from '../models/listing.model.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

// API to crate a listing
router.post('/create', verifyToken, async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        return res.status(501).json({ success: false, message: "Internal Server Error"});
    }
})

export default router;