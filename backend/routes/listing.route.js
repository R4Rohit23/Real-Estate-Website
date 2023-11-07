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

const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

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
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    return res
      .status(501)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing Not Found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    return res.status(403).json({ message: "Internal Error" });
  }
};

const getListings = async (req, res) => {
  try {
    // limit the number of listings fetch from the database
    const limit = parseInt(req.query.limit) || 9;

    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
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

// API to update listing
router.post("/update/:id", verifyToken, updateListing);

// API to get the listings
router.get("/get/:id", getListing);

// API for search functionality
router.get("/get", getListings);

export default router;
