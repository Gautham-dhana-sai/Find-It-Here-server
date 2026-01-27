const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    itemName: { type: String, required: true },
    store: { type: String, required: true },
    description: {type: String, reqired: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    category: {type: String, nullable: true},
    brand: {type: String, nullable: true},
    imageName: {type: String, required: true},
    address: {type: String, required: true},
    pincode: {type: String, required: true},
    status: {type: Number},
    addedBy: {type: Schema.Types.ObjectId, required: true},
    likes: {type: Number}
}, { timestamps: true });

const Item = mongoose.model("item", ItemSchema);
Item.createCollection();

module.exports = Item;
