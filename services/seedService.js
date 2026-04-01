const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const path = require("path");
const fs = require("fs");

const seedDatabase = async () => {
  try {
    // 1️⃣ إنشاء مستخدم الأدمن (Admin)
    let admin = await User.findOne({ email: "admin@test.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin User",
        email: "admin@test.com",
        password: "123456", 
        role: "admin",
      });
    }

    const categoriesData = [
      { name: "Electronics", description: "All electronic items" },
      { name: "Clothing", description: "Men and women clothing" },
      { name: "seed", description: "Default seed category" }, // ضفت "seed" هنا عشان الكود ميقفش
    ];

    const categories = [];
    for (let cat of categoriesData) {
      let category = await Category.findOne({ name: cat.name });
      if (!category) {
        category = await Category.create(cat);
      }
      categories.push(category);
    }

    // 3️⃣ قراءة الصور من فولدر seed
    const imagesFolder = path.join(__dirname, "../uploads/seed");
    const imageFiles = fs.existsSync(imagesFolder) ? fs.readdirSync(imagesFolder) : [];
    console.log("Images found in seed folder:", imageFiles);

    await Product.deleteMany({});
    console.log(" Old products cleared.");

    const productsData = [
 {
        name: "Product Seed 1",
        description: "Seed category product",
        price: 50,
        categoryName: "seed",
        image: "Image (5).png",
        stock: 20,
      },
      {
        name: "Casual T-Shirt",
        description: "100% Cotton comfortable t-shirt",
        price: 25,
        categoryName: "seed",
        image: "Image (3).png", 
        stock: 100,
      },
    {
        name: "seed",
        description: "Apple smartphone with A16 chip",
        price: 1200,
        categoryName: "seed", // لازم يكون موجود في categoriesData
        image: "Image (2).png", // اسم الصورة بالظبط من الفولدر
        stock: 50,
      },
         {
        name: "Product Seed 1",
        description: "Seed category product",
        price: 50,
        categoryName: "seed",
        image: "Image (4).png",
        stock: 20,
      },
         {
        name: "Product Seed 1",
        description: "Seed category product",
        price: 50,
        categoryName: "seed",
        image: "Product Image2.png",
        stock: 20,
      },
         {
        name: "Product Seed 1",
        description: "Seed category product",
        price: 50,
        categoryName: "seed",
        image: "Product Image.png",
        stock: 20,
      },
         {
        name: "Product Seed 1",
        description: "Seed category product",
        price: 50,
        categoryName: "seed",
        image: "Image (3).png",
        stock: 20,
      },
         {
        name: "Product Seed 1",
        description: "Seed category product",
        price: 50,
        categoryName: "seed",
        image: "Image (2).png",
        stock: 20,
      }
    ];

    const products = [];
    for (const prod of productsData) {
      // البحث عن الكاتيجوري
      const category = categories.find((c) => c.name === prod.categoryName);
      
      if (!category) {
        console.warn(`Skipping product ${prod.name} because category ${prod.categoryName} not found.`);
        continue;
      }

      // تحديد مسار الصورة (لو مش موجودة في الفولدر هيسيبها فاضية)
      const imagePath = imageFiles.includes(prod.image)
        ? `/uploads/seed/${prod.image}`
        : "";

      const product = await Product.create({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        categoryId: category._id,
        createdBy: admin._id,
        stock: prod.stock,
        image: imagePath,
      });
      products.push(product);
    }

    console.log(` Successfully seeded ${products.length} products!`);
    
    return {
      admin: { id: admin._id, email: admin.email },
      categories: categories.map((c) => ({ id: c._id, name: c.name })),
      products: products.map((p) => ({ id: p._id, name: p.name, image: p.image })),
    };

  } catch (error) {
    console.error(" Seeding error:", error);
  }
};

module.exports = { seedDatabase };
