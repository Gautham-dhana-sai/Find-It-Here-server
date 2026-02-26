const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent_category: {type: Schema.Types.ObjectId, ref: 'category', default: null}
}, { timestamps: true });

const Category = mongoose.model("category", CategorySchema);
Category.createCollection();

module.exports = Category;
