const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bidSchema = new Schema(
  {
    bidOwner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    bid: {
      type: Number
    }
  }
)

module.exports = model("Bid", bidSchema)

