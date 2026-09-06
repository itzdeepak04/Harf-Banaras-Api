"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const category_schema_1 = require("../src/database/schemas/category.schema");
const product_schema_1 = require("../src/database/schemas/product.schema");
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/harf-banaras';
const SAREE_TYPES = ['Katan Silk', 'Organza', 'Georgette', 'Tussar Silk', 'Kora Silk'];
const OCCASIONS = ['Bridal', 'Festive', 'Casual', 'Party Wear'];
const PLACEHOLDER_IMAGE = (seed) => `https://placehold.co/800x1000/7a1f2b/f4e9d8?text=${encodeURIComponent(seed)}`;
const PRODUCT_SEEDS = [
    { name: 'Banarasi Katan Silk — Royal Maroon', fabric: 'Katan Silk', colour: 'Maroon', workIntensity: 'heavy', price: 42000, type: 'Katan Silk', occasion: 'Bridal' },
    { name: 'Pure Zari Katan — Emerald Bridal', fabric: 'Katan Silk', colour: 'Emerald Green', workIntensity: 'heavy', price: 68000, type: 'Katan Silk', occasion: 'Bridal' },
    { name: 'Antique Zari Katan — Deep Red', fabric: 'Katan Silk', colour: 'Red', workIntensity: 'heavy', price: 95000, type: 'Katan Silk', occasion: 'Bridal' },
    { name: 'Handwoven Katan — Wine Purple', fabric: 'Katan Silk', colour: 'Wine', workIntensity: 'medium', price: 32000, type: 'Katan Silk', occasion: 'Festive' },
    { name: 'Organza Silk — Blush Pink Floral', fabric: 'Organza', colour: 'Blush Pink', workIntensity: 'light', price: 12500, type: 'Organza', occasion: 'Party Wear' },
    { name: 'Organza Tissue — Ivory Gold', fabric: 'Organza', colour: 'Ivory', workIntensity: 'medium', price: 18500, type: 'Organza', occasion: 'Festive' },
    { name: 'Organza Silk — Powder Blue', fabric: 'Organza', colour: 'Powder Blue', workIntensity: 'light', price: 9800, type: 'Organza', occasion: 'Casual' },
    { name: 'Pure Georgette — Coral Weave', fabric: 'Georgette', colour: 'Coral', workIntensity: 'light', price: 7200, type: 'Georgette', occasion: 'Casual' },
    { name: 'Georgette Silk — Mustard Yellow', fabric: 'Georgette', colour: 'Mustard', workIntensity: 'medium', price: 11000, type: 'Georgette', occasion: 'Festive' },
    { name: 'Georgette Zari Border — Sky Blue', fabric: 'Georgette', colour: 'Sky Blue', workIntensity: 'light', price: 8400, type: 'Georgette', occasion: 'Party Wear' },
    { name: 'Tussar Silk — Natural Beige', fabric: 'Tussar Silk', colour: 'Beige', workIntensity: 'medium', price: 15600, type: 'Tussar Silk', occasion: 'Casual' },
    { name: 'Tussar Silk Handloom — Rust Orange', fabric: 'Tussar Silk', colour: 'Rust', workIntensity: 'medium', price: 21000, type: 'Tussar Silk', occasion: 'Festive' },
    { name: 'Tussar Ghicha — Olive Green', fabric: 'Tussar Silk', colour: 'Olive', workIntensity: 'light', price: 13200, type: 'Tussar Silk', occasion: 'Casual' },
    { name: 'Kora Silk — Pastel Lavender', fabric: 'Kora Silk', colour: 'Lavender', workIntensity: 'light', price: 16800, type: 'Kora Silk', occasion: 'Party Wear' },
    { name: 'Kora Silk Zari — Champagne Gold', fabric: 'Kora Silk', colour: 'Champagne', workIntensity: 'medium', price: 27500, type: 'Kora Silk', occasion: 'Festive' },
    { name: 'Kora Silk Bridal — Peacock Blue', fabric: 'Kora Silk', colour: 'Peacock Blue', workIntensity: 'heavy', price: 54000, type: 'Kora Silk', occasion: 'Bridal' },
];
async function seed() {
    await mongoose_1.default.connect(MONGO_URI);
    console.log(`Connected to ${MONGO_URI}`);
    const Category = mongoose_1.default.model('Category', category_schema_1.CategorySchema);
    const Product = mongoose_1.default.model('Product', product_schema_1.ProductSchema);
    const typeMap = {};
    for (const name of SAREE_TYPES) {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const doc = await Category.findOneAndUpdate({ slug }, { name, slug, type: 'saree_type', isActive: true }, { upsert: true, new: true });
        typeMap[name] = doc._id;
    }
    const occasionMap = {};
    for (const name of OCCASIONS) {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const doc = await Category.findOneAndUpdate({ slug }, { name, slug, type: 'occasion', isActive: true }, { upsert: true, new: true });
        occasionMap[name] = doc._id;
    }
    console.log(`Upserted ${SAREE_TYPES.length} saree types and ${OCCASIONS.length} occasions.`);
    let created = 0;
    for (let i = 0; i < PRODUCT_SEEDS.length; i++) {
        const s = PRODUCT_SEEDS[i];
        const sku = `HB-SEED-${String(i + 1).padStart(3, '0')}`;
        const exists = await Product.findOne({ sku });
        if (exists)
            continue;
        const qty = 5 + (i % 8);
        await Product.create({
            sku,
            name: s.name,
            shortDescription: `Handwoven ${s.fabric} saree in ${s.colour.toLowerCase()}, ${s.workIntensity} zari work.`,
            fullDescription: `A ${s.workIntensity}-work ${s.fabric} Banarasi saree in ${s.colour.toLowerCase()}, woven by master artisans in Varanasi. Comes with an unstitched blouse piece.`,
            sareeType: typeMap[s.type],
            occasions: [occasionMap[s.occasion]],
            fabric: s.fabric,
            weave: 'Handloom',
            workType: 'Zari Brocade',
            colour: s.colour,
            pattern: 'Traditional Motif',
            zariDetails: s.workIntensity === 'heavy' ? 'Real zari, heavy border & pallu' : 'Zari accents',
            workIntensity: s.workIntensity,
            sareeLength: '6.3 metres',
            sareeWidth: '46 inches',
            blousePiece: { included: true, fabric: s.fabric, length: '0.8 metres' },
            weightGrams: 700,
            costPrice: Math.round(s.price * 0.6),
            sellingPrice: s.price,
            discountPrice: i % 4 === 0 ? Math.round(s.price * 0.9) : 0,
            availableQuantity: qty,
            lowStockThreshold: 3,
            images: [PLACEHOLDER_IMAGE(s.name), PLACEHOLDER_IMAGE(`${s.name} detail`)],
            tags: [s.fabric, s.colour, s.occasion],
            certificationInfo: 'GI-tagged Banarasi handloom',
            weaverInfo: 'Woven in Varanasi by third-generation artisans',
            careInstructions: 'Dry clean only. Store folded in muslin cloth.',
            status: 'published',
            isBestSeller: i % 5 === 0,
            isNewArrival: i % 3 === 0,
            isLimitedEdition: s.workIntensity === 'heavy',
        });
        created++;
    }
    console.log(`Seed complete. ${created} new products created (existing ones skipped).`);
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map