


import { asyncHandler } from "../noController/utils/asyncHandler.js";
import { ApiError } from "../noController/utils/ApiError.js";
import { ApiResponse } from "../noController/utils/ApiResponse.js";
import { Report } from "../noController/models/report.model.js";
import { getCityFromCoordinates } from "../noController/utils/geoCode.js";
import { uploadOnCloudinary } from "../noController/utils/cloudinary.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { json } from "stream/consumers";

const createReport = asyncHandler(async (req, res, next) => {
    const { type, description, city } = req.body;

    // Parse location from form-data string (e.g. "77.4126,23.2599")
    let locationData;
    if (typeof req.body.location === "string") {
        locationData = req.body.location.split(",").map(Number);
    }

    // Validate fields
    if (!type || !description || !city || !locationData) {
        throw new ApiError(400, "All fields are required");
    }

    // Verify city matches coordinates
    const detectedCity = await getCityFromCoordinates(locationData[0], locationData[1]);
    if (!detectedCity || detectedCity.toLowerCase() !== city.toLowerCase()) {
        throw new ApiError(400, `Selected city ${city} does not match the given location : ${detectedCity}`);
    }

    // Handle photo uploadw
    const photoLocalPath = req.files?.photo?.[0]?.path;
    if (!photoLocalPath) {
        throw new ApiError(400, "Photo is required");
    }

    const uploadedPhoto = await uploadOnCloudinary(photoLocalPath);
    if (!uploadedPhoto) {
        throw new ApiError(500, "Failed to upload photo");
    }

    let aiPrediction = null;
    try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(photoLocalPath));

        const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
            headers: formData.getHeaders(),
        });

        aiPrediction = response.data; 
    } catch (error) {
        console.error("AI service error:", error.message);
    }

   
    const report = await Report.create({
        createdBy: req.user._id,
        photo: uploadedPhoto.url,
        type,                              
        aiType: aiPrediction?.label || "",  
        aiConfidence: aiPrediction?.confidence || null,
        location: { type: "Point", coordinates: locationData },
        description,
        city,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, report, "Report created successfully with AI classification"));
        
});





const getAllReports = asyncHandler(async (req, res) => {
    const reports = await Report.find().populate("createdBy", "username email")

    return res
        .status(200)
        .json(new ApiResponse(200, reports, "Reports fetched successfully"))
})

const getMyReports = asyncHandler(async (req, res) => {
    const reports = await Report.find({ createdBy: req.user._id })

    return res
        .status(200)
        .json(new ApiResponse(200, reports, "User reports fetched successfully"))
})

const updateReportStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    )

    if (!report) {
        throw new ApiError(404, "Report not found")
    }

    await report.save()

    return res
        .status(200)
        .json(new ApiResponse(200, report, "Report status updated"))

})

export { createReport, getAllReports, getMyReports, updateReportStatus };