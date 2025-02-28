import mongoose from "mongoose";

const categoryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

const CategoryItem = mongoose.model("categoryItems", categoryItemSchema);

export default CategoryItem;
