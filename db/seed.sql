-- NOIR sample catalogue. Run after schema.sql.
-- Clears old demo products first so you start clean.
delete from products;

-- Images are on-brand placeholders. Swap image_url with real photos
-- (Unsplash, or your own uploaded to Supabase Storage) any time.

insert into products (name, description, price, category, image_url) values
-- Timepieces
('Eclipse Automatic', 'A self-winding automatic with an onyx dial and sapphire crystal.', 4200000, 'timepieces', 'https://placehold.co/600x600/141419/C8A35B?text=Eclipse+Automatic'),
('Onyx Chronograph', 'Triple-register chronograph in brushed black steel.', 5650000, 'timepieces', 'https://placehold.co/600x600/141419/C8A35B?text=Onyx+Chronograph'),
('Midnight Skeleton', 'Open-worked movement framed in rose gold.', 7100000, 'timepieces', 'https://placehold.co/600x600/141419/C8A35B?text=Midnight+Skeleton'),
('Gilt Moonphase', 'Moonphase complication with a guilloche face.', 8890000, 'timepieces', 'https://placehold.co/600x600/141419/C8A35B?text=Gilt+Moonphase'),
('Noir Diver 300', 'A 300m diver with a matte ceramic bezel.', 3850000, 'timepieces', 'https://placehold.co/600x600/141419/C8A35B?text=Noir+Diver+300'),

-- Fragrances
('Oud Imperial', 'Smoky oud layered over amber and warm leather.', 1890000, 'fragrances', 'https://placehold.co/600x600/141419/C8A35B?text=Oud+Imperial'),
('Velvet Saffron', 'Saffron and rose drawn through soft musk.', 1650000, 'fragrances', 'https://placehold.co/600x600/141419/C8A35B?text=Velvet+Saffron'),
('Black Cardamom', 'Spiced cardamom over cedar and vetiver.', 1420000, 'fragrances', 'https://placehold.co/600x600/141419/C8A35B?text=Black+Cardamom'),
('Amber Noir', 'A dark amber accord with vanilla and tobacco.', 1990000, 'fragrances', 'https://placehold.co/600x600/141419/C8A35B?text=Amber+Noir'),
('Smoked Iris', 'Powdery iris meeting incense and ash.', 2250000, 'fragrances', 'https://placehold.co/600x600/141419/C8A35B?text=Smoked+Iris'),

-- Audio
('Obsidian Over-Ear', 'Closed-back headphones with a warm signature.', 5490000, 'audio', 'https://placehold.co/600x600/141419/C8A35B?text=Obsidian+Over-Ear'),
('Gilt In-Ear Monitors', 'Hand-finished IEMs with brass housings.', 3290000, 'audio', 'https://placehold.co/600x600/141419/C8A35B?text=Gilt+IEMs'),
('Noir Turntable', 'Belt-driven turntable in black lacquer.', 8900000, 'audio', 'https://placehold.co/600x600/141419/C8A35B?text=Noir+Turntable'),
('Midnight Speaker', 'A single-driver desktop speaker in oak and steel.', 4150000, 'audio', 'https://placehold.co/600x600/141419/C8A35B?text=Midnight+Speaker'),

-- Eyewear
('Onyx Aviator', 'Matte black aviators with gold-flash lenses.', 1290000, 'eyewear', 'https://placehold.co/600x600/141419/C8A35B?text=Onyx+Aviator'),
('Gilt Wayfarer', 'Acetate wayfarers with a thin gold core wire.', 1190000, 'eyewear', 'https://placehold.co/600x600/141419/C8A35B?text=Gilt+Wayfarer'),
('Noir Round', 'Slim round frames in blackened titanium.', 1490000, 'eyewear', 'https://placehold.co/600x600/141419/C8A35B?text=Noir+Round'),
('Smoke Clubmaster', 'Browline frames with smoked gradient lenses.', 1390000, 'eyewear', 'https://placehold.co/600x600/141419/C8A35B?text=Smoke+Clubmaster');
