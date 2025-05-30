require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express(); // Create app before using app.use()

app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parse form data (urlencoded)
app.use(express.json()); // Parse JSON bodies

// Serve static image files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage });

// Connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 1 },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  description: { type: String, trim: true },
  image: String,
});

const Product = mongoose.model('Product', productSchema);

// GET all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new product
app.post('/products', upload.single('image'), async (req, res) => {
  try {
   

    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      name: name?.trim(),
      price: Number(price), // Convert to number here!
      description: description?.trim(),
      image,
    });


    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update existing product
app.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete old image if a new one is uploaded
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, product.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    // Update fields
    product.name = name?.trim();
    product.price = Number(price);
    product.description = description?.trim();

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.image) {
      const imagePath = path.join(__dirname, product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
