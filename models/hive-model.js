const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hiveSchema = new Schema(
  {
    title: String,
    age: Number,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    race: {
      type: String,
      enum: {
        values: [
          "Buckfast",
          "Italian",
          "Russian",
          "Cordovan",
          "Caucasian",
          "Carniolan",
          "European Dark Bee",
          "Wild / Unknown",
        ],
        message:
          "Please chose from one of the following: Buckfast, Italian, Russian, Cordovan, Caucasian, Carniolan, European Dark Bee, Wild / Unknown",
      },
      required: true,
    },
    info: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Hive = mongoose.model("Hive", hiveSchema);
module.exports = Hive;
