import express from "express";
import Listing from "../models/listing.model.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    return res
      .status(201)
      .json({ message: "Listing added successfully", listingData: listing });
  } catch (error) {
    return res
      .status(501)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
    console.log(listing);
  if (!listing) {
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });
  }

  if (req.user.id !== listing.userRef) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid Credential" });
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Listing Deleted Successfully" });
  } catch (error) {
    return res
      .status(501)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// API to crate a listing
router.post("/create", verifyToken, createListing);

// API to delete the listing
router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
