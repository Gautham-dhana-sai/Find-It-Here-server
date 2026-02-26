const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const BrandSchema = new Schema({
    name: { type: String, required: true },
    category: {type: Schema.Types.ObjectId, ref: 'category', required: true}
}, { timestamps: true });

const Brand = mongoose.model("brand", BrandSchema);
Brand.createCollection();

module.exports = Brand;
