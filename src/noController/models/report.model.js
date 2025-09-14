import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Vehicle", "Factory", "Garbage","Potholes", "Other"],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    aiType:{
    type:String
    },
    aiConfidence:{
      type:Number
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    photo: {
      type: String,
      default: "",
      required:true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    city:{
        type:String,
        default:"",
        required:true
    }
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" }); // enables geospatial queries

export const Report = mongoose.model("Report", reportSchema);
