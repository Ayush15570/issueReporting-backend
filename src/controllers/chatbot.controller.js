
import { ApiError } from "../noController/utils/ApiError.js";
import { ApiResponse } from "../noController/utils/ApiResponse.js";
import { Report } from "../noController/models/report.model.js";
export const chatbotController = async(req,res,next) => {
    try {
        const {message} = req.body;
        const userId = req.user?._id;
        if(!message){
            throw new ApiError(400,"Message is required")
        }
    
        const lowerMsg = message.toLowerCase();

        if(lowerMsg.includes("my reports")){
            const reports = await Report.find({createdBy:userId})
            if(reports.length == 0){
                return res
                .status(200)
                .json(new ApiResponse(200,null,"You haven't submitted any report yet"))
            }

            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    reports,
                    `You have submitted ${reports.length} reports. Example: ${reports[0].type} in ${reports[0].city}.`
                )
            )
    
        }

        if(lowerMsg.includes("garbage") || lowerMsg.includes("road") || lowerMsg.includes("factory") || lowerMsg.includes("potholes")){
               
            let type = "";
            if(lowerMsg.includes("garbage")) type = "Garbage"
            if(lowerMsg.includes("road")) type = "Road";
            if(lowerMsg.includes("factory")) type = "Factory";
            if(lowerMsg.includes("potholes")) type="Potholes"

            const reports = await Report.find({type})

            if(reports.length == 0) {
                return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        null,
                        "No reports found of this type"
                    )
                )
            }

            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    reports,
                    `Found ${reports.length} ${type} reports. Latest: ${reports[0].description}`
                )
            )
        }

         if (lowerMsg.includes("reports in")) {
      const city = lowerMsg.split("reports in")[1].trim();
      const reports = await Report.find({ city: new RegExp(city, "i") });

      if (reports.length === 0) {
        return res
          .status(200)
          .json(new ApiResponse(200, null, `No reports found in ${city}.`));
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            reports,
            `Found ${reports.length} reports in ${city}.`
          )
        );
    }
    
    if(lowerMsg.includes("how to submit") || lowerMsg.includes("submit report")) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Go to the Report Submission page, select type, add description,upload a photo and your location will be auto-detected."
            )
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "I am not suited to answer all these question. Try asking '1) Show my reports 2)Garbage reports in Bhopal 3)How to submit 4)Report for specific type like Garbage"
        )
    )

    } catch (err) {
        next(err)
    }
}