import express from "express";
import Product from "../models/products.js";
const router = express.Router();

//creating products
export const addProduct = async (req, res) => {
  const product = new Product(req.body);

  try {
    const addProduct = await product.save();
    res.status(200).send(addProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};

//get an user product ... no authentication bcoz any user can see products
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const { title, description, image, categories, size, color, price } =
      req.body;
    const updatedProduct = {};

    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }
    if (image) {
      updatedProduct.image = image;
    }
    if (categories) {
      updatedProduct.categories = categories;
    }
    if (size) {
      updatedProduct.size = size;
    }
    if (color) {
      updatedProduct.color = color;
    }
    if (price) {
      updatedProduct.price = price;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).send(error);
    }

    await product.save();
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

//get all products
export const getAllProducts = async (req, res) => {
  //use this code for search and filtering
  try {
    const { title, categories, color, price } = req.query;
    let querySearch = {};

    if (title) {
      querySearch.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (categories) {
      querySearch.categories = {
        $regex: categories,
        $options: "i",
      };
    }
    if (color) {
      querySearch.color = {
        $regex: color,
        $options: "i",
      };
    }
    if (price) {
      querySearch.price = {
        $regex: price.toString(), //should be string
        $options: "i",
      };
    }
    const products = await Product.find(querySearch);
    res.status(201).send(products);
  } catch (error) {
    res.status(201).send(error);
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send(error);
    }
    res.status(200).send({
      success: "product has been deleted successfully",
      product: product,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default router;
