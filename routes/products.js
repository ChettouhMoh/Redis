const pool = require("../infra/db");
const cache = require("../utils/cache");

// Function to search for products
function searchProducts(params, callback) {
  const cacheKey = `search:${JSON.stringify(params)}`;

  cache.getCache(cacheKey, (err, data) => {
    if (err) {
      callback(err);
    } else if (data) {
      console.log("Search results found in cache");
      callback(null, data);
    } else {
      console.log("Fetching search results from database");
      let sql = "SELECT * FROM products WHERE 1=1";
      const values = [];

      if (params.category) {
        sql += " AND category = ?";
        values.push(params.category);
      }
      if (params.minPrice) {
        sql += " AND price >= ?";
        values.push(params.minPrice);
      }
      if (params.maxPrice) {
        sql += " AND price <= ?";
        values.push(params.maxPrice);
      }
      if (params.page && params.limit) {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const offset = (page - 1) * limit;
        sql += " LIMIT ? OFFSET ?";
        values.push(limit, offset);
      }

      pool.query(sql, values, (err, results) => {
        if (err) {
          callback(err);
        } else {
          cache.setCache(cacheKey, results);
          callback(null, results);
        }
      });
    }
  });
}

// Add a New Product
function addProduct(product, callback) {
  const sql =
    "INSERT INTO products (name, category, price) VALUES (?, ?, ?, ?)";
  const values = [product.name, product.category, product.price];

  pool.query(sql, values, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result.insertId);
    }
  });
}

// Update an Existing Product
function updateProduct(id, product, callback) {
  const sql =
    "UPDATE products SET name = ?, category = ?, price = ?, rating = ? WHERE id = ?";
  const values = [
    product.name,
    product.category,
    product.price,
    product.rating,
    id,
  ];

  pool.query(sql, values, (err) => {
    if (err) {
      callback(err);
    } else {
      // Invalidate cache for search results
      cache.deleteCache(`search:*`, () => {});
      callback(null);
    }
  });
}

// Delete a Product
function deleteProduct(id, callback) {
  const sql = "DELETE FROM products WHERE id = ?";
  pool.query(sql, [id], (err) => {
    if (err) {
      callback(err);
    } else {
      // Invalidate cache for search results
      cache.deleteCache(`search:*`, () => {});
      callback(null);
    }
  });
}

module.exports = {
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
