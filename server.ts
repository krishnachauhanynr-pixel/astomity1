import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { products } from "./src/db/schema.ts";
import { desc, eq, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";

async function seedProducts() {
  try {
    const existingCount = await db.select({ count: sql<number>`count(*)` }).from(products);
    if (existingCount[0].count < 412) {
      console.log('Seeding products...');
      await db.delete(products);
      const productsData = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));
      const chunkSize = 50;
      for (let i = 0; i < productsData.length; i += chunkSize) {
        await db.insert(products).values(productsData.slice(i, i + chunkSize));
      }
      console.log(`Seeded ${productsData.length} products!`);
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // Seed database
  await seedProducts();

  // --- API ROUTES ---
  
  // Auth Endpoint
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user) {
        const user = await getOrCreateUser(req.user.uid, req.user.email || '');
        res.json({ success: true, role: user.role });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      const mapped = allProducts.map(p => ({
        ...p,
        price: Number(p.price),
        mrp: Number(p.mrp),
        rating: Number(p.rating),
      }));
      res.json(mapped);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/deals", async (req, res) => {
    try {
      const deals = await db.select().from(products).where(sql`discount > 0`).orderBy(desc(products.discount)).limit(5);
      const mapped = deals.map(p => ({
        ...p,
        price: Number(p.price),
        mrp: Number(p.mrp),
        rating: Number(p.rating),
      }));
      res.json(mapped);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const result = await db.select().from(products).where(eq(products.id, parseInt(req.params.id)));
      if (result.length > 0) {
        const p = result[0];
        res.json({
          ...p,
          price: Number(p.price),
          mrp: Number(p.mrp),
          rating: Number(p.rating),
        });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/checkout", requireAuth, (req: AuthRequest, res) => {
    // Mock checkout response
    res.json({ success: true, orderId: "ORD-" + Math.floor(Math.random() * 1000000) });
  });

  
  app.post('/api/products', requireAuth, async (req, res) => {
    try {
      const { name, brand, price, mrp, category, image } = req.body;
      if (!name || !price || !category || !image) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      
      const newProduct = await db.insert(products).values({
        name,
        brand: brand || 'Generic',
        price: price.toString(),
        mrp: (mrp || price).toString(),
        category,
        image,
        sellerId: user.id
      }).returning();
      
      res.json(newProduct[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });

  app.get('/api/seller/products', requireAuth, async (req, res) => {
    try {
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      const sellerProducts = await db.select().from(products).where(eq(products.sellerId, user.id));
      const mapped = sellerProducts.map(p => ({
        ...p,
        price: Number(p.price),
        mrp: Number(p.mrp),
        rating: Number(p.rating),
      }));
      res.json(mapped);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch seller products' });
    }
  });

  // --- SITEMAP ---
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const allProducts = await db.select({ id: products.id }).from(products);
      
      const host = req.get('X-Forwarded-Host') || req.get('host');
      const protocol = req.get('X-Forwarded-Proto') || req.protocol || 'https';
      const baseUrl = `${protocol}://${host}`;

      const staticRoutes = ['', '/search', '/cart', '/checkout'];
      const staticUrls = staticRoutes.map(route => `
        <url>
          <loc>${baseUrl}${route}</loc>
          <changefreq>daily</changefreq>
          <priority>${route === '' ? '1.0' : '0.8'}</priority>
        </url>
      `).join('');

      const productUrls = allProducts.map(p => `
        <url>
          <loc>${baseUrl}/product/${p.id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${productUrls}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap.trim());
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  });

  // --- Vite middleware for development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
