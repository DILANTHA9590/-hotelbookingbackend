import mongoose from "mongoose";

const categoryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  price: {
    type: Number,
    required: true,
  },
  feature: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
});

const CategoryItem = mongoose.model("categoryItems", categoryItemSchema);

export default CategoryItem;
