const express = require("express");
const bodyParser = require("body-parser");
const productService = require("./routes/products");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/search", (req, res) => {
  const { category, minPrice, maxPrice, page, limit } = req.query;
  const params = { category, minPrice, maxPrice, page, limit };

  productService.searchProducts(params, (err, products) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch products", details: err });
    }
    res.json(products);
  });
});

app.post("/product", (req, res) => {
  const { name, category, price } = req.body;
  const newProduct = { name, category, price };

  productService.addProduct(newProduct, (err, productId) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to add product", details: err });
    }
    res.status(201).json({ productId });
  });
});

app.put("/product/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, price, rating } = req.body;
  const updatedProduct = { name, category, price, rating };

  productService.updateProduct(id, updatedProduct, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to update product", details: err });
    }
    res.status(200).json({ message: "Product updated successfully" });
  });
});

app.delete("/product/:id", (req, res) => {
  const { id } = req.params;

  productService.deleteProduct(id, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to delete product", details: err });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
