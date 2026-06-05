export interface ImageEntry {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryItem {
  img: ImageEntry;
  cols: 1 | 2;
}

// ── All available images ────────────────────────────────────────────────────

export const images = {
  // Exterior / approach
  exterior:              { src: '/images/Krcka-kuca-1-Kuca-od-tete-Marije-i-barba-Osipa-Skrbcici-20-scaled.webp',                       alt: 'Krčka kuća — stone facade, Skrbčići',               width: 2560, height: 1709 },
  gate:                  { src: '/images/Krcka-kuca-1-eksterijer-ulazna-kapija-scaled.webp',                                             alt: 'Entry gate to Krčka kuća',                           width: 2560, height: 1709 },
  viewThroughDoor:       { src: '/images/Krcka-kuca-1-pogled-kroz-vrata-na-vrt-scaled.webp',                                             alt: 'View through door to the garden',                    width: 2560, height: 1709 },

  // Outdoor / garden / terrace
  terrace:               { src: '/images/Krcka-kuca-1-terasa-sa-portuna-bacva-vanjska-kuhinja-bicikl-scaled.webp',                       alt: 'Terrace with barrel, outdoor kitchen and bicycle',   width: 2560, height: 1709 },
  breadoven:             { src: '/images/Krcka-kuca-1-krusna-pec-iz-dvorista-scaled.webp',                                               alt: 'Stone bread oven in the courtyard',                  width: 2560, height: 1709 },
  garden:                { src: '/images/Krcka-kuca-1-povrtlarnik-Fred-i-pogled-prema-terasi-i-ulazu-u-dnevni-boravak-scaled.webp',       alt: 'Vegetable garden and view toward terrace',           width: 2560, height: 1709 },
  detail_watering:       { src: '/images/Krcka-kuca-1-detalj-mini-zalivarnik-na-gromaci-scaled.webp',                                    alt: 'Watering can on stone wall',                         width: 2560, height: 1709 },
  detail_watering_yard:  { src: '/images/Krcka-kuca-1-dvoriste-detalj-kantica-za-zalijevanje-scaled.webp',                               alt: 'Watering can in courtyard',                          width: 1536, height: 1000 },

  // Living room
  livingroomEntry:       { src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-s-ulaznih-vrata-scaled.webp',                                alt: 'Living room from entrance',                          width: 2560, height: 1709 },
  livingroomFireplace:   { src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-prema-kaminu-scaled.webp',                                   alt: 'Living room — fireplace view',                       width: 2560, height: 1709 },
  livingroom1:           { src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-prema-terasi-scaled.webp',                                   alt: 'Living room towards terrace',                        width: 2560, height: 1709 },
  livingroom2:           { src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-prema-blagovaonici-scaled.webp',                             alt: 'Living room towards dining area',                    width: 2560, height: 1709 },
  livingroomStairs:      { src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-prema-stepenicama-scaled.jpg',                               alt: 'Living room towards staircase',                      width: 3000, height: 2003 },

  // Living room details / objects
  detail_armchair:       { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj_-fotelja-scaled.webp',                                       alt: 'Armchair detail',                                    width: 2560, height: 1709 },
  detail_clock:          { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-sat-scaled.webp',                                            alt: 'Antique clock',                                      width: 2560, height: 1709 },
  detail_angel:          { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-andelic-u-zidu-scaled.webp',                                 alt: 'Stone angel in wall',                                width: 2560, height: 1709 },
  detail_bukaleta:       { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-bukaleta-Karla-scaled.webp',                                 alt: 'Traditional clay jug',                               width: 2560, height: 1709 },
  detail_shells:         { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-drvena-plitica-sa-skoljkama-scaled.webp',                    alt: 'Wooden tray with shells',                            width: 2560, height: 1709 },
  detail_scales:         { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-ribarska-vaga-scaled.webp',                                  alt: 'Antique fishing scale',                              width: 2560, height: 1709 },
  detail_iron:           { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-sumpres-scaled.webp',                                        alt: 'Antique iron',                                       width: 2560, height: 1709 },
  detail_bruncic:        { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-bruncic-na-kaminu-scaled.webp',                              alt: 'Ornament on fireplace mantel',                       width: 2560, height: 1709 },

  // Dining room
  dining:                { src: '/images/Krcka-kuca-1-blagovaonica-pogled-prema-kuhinji-scaled.jpg',                                     alt: 'Dining room towards kitchen',                        width: 3000, height: 2003 },
  dining_wardrobe:       { src: '/images/Krcka-kuca-1-blagovaonica-pogled-prema-ormaru-scaled.jpg',                                      alt: 'Dining room towards wardrobe',                       width: 3000, height: 2003 },
  dining_basket:         { src: '/images/Krcka-kuca-1-blagovaonica-detalj-ukrasi-kosarica-scaled.webp',                                  alt: 'Dining room — decorative basket',                    width: 2560, height: 1709 },
  coffee_cups:           { src: '/images/Krcka-kuca-1-blagovaonica-detalj-salice-za-kavu-na-stalku-scaled.webp',                         alt: 'Coffee cups on rack',                                width: 2560, height: 1709 },

  // Kitchen
  kitchen:               { src: '/images/Krcka-kuca-1-kuhinja-pogled-prema-napi-1-scaled.webp',                                          alt: 'Kitchen with hood',                                  width: 2560, height: 1709 },
  kitchen_pockets:       { src: '/images/Krcka-kuca-1-kuhinja-detalj-platneni-dzepovi-scaled.webp',                                      alt: 'Kitchen fabric pocket detail',                       width: 2560, height: 1709 },
  kitchen_shelf:         { src: '/images/Krcka-kuca-1-kuhinja-detalj-polica-scaled.webp',                                                alt: 'Kitchen shelf',                                      width: 2560, height: 1709 },

  // Double bedroom (bračni krevet)
  bedroom1:              { src: '/images/Krcka-kuca-1-soba-s-bracnim-krevetom-pogled-jugoistok-sjeverozapad-scaled.webp',                 alt: 'Double bedroom',                                     width: 2560, height: 1709 },
  bedroom1_linen:        { src: '/images/Krcka-kuca-1-soba-s-bracnim-krevetom-posteljina-scaled.webp',                                   alt: 'Double bedroom with linen',                          width: 2560, height: 1709 },
  bedroom1_window:       { src: '/images/Krcka-kuca-1-soba-s-bracnim-krevetom-pogled-prema-prozoru-scaled.jpg',                          alt: 'Double bedroom — window view',                       width: 3000, height: 2003 },
  bedroom1_garden:       { src: '/images/Krcka-kuca-1-soba-s-bracnim-krevetom-detalj-pogled-na-vrt-scaled.webp',                         alt: 'Double bedroom — view to garden',                    width: 2560, height: 1709 },
  bedroom1_clock:        { src: '/images/Krcka-kuca-1-soba-s-bracnim-krevetom-detalj-sat-propeler-scaled.webp',                          alt: 'Double bedroom — clock and propeller detail',        width: 2560, height: 1709 },

  // Twin bedroom (djeljivi kreveti)
  bedroom2:              { src: '/images/Krcka-kuca-1-soba-s-dijeljivim-krevetima-pogled-istok-zapad-scaled.webp',                       alt: 'Twin bedroom',                                       width: 2560, height: 1709 },
  bedroom2_linen:        { src: '/images/Krcka-kuca-1-soba-s-djeljivim-krevetima-posteljina-scaled.webp',                                alt: 'Twin bedroom with linen',                            width: 2560, height: 1709 },
  bedroom2_nightstand:   { src: '/images/Krcka-kuca-1-soba-s-djeljivim-krevetima-komodina-scaled.webp',                                  alt: 'Twin bedroom — nightstand',                          width: 2560, height: 1709 },
  bedroom2_jewelry:      { src: '/images/Krcka-kuca-1-soba-s-djeljivim-krevetima-detalj-skrinjica-za-nakit-scaled.webp',                 alt: 'Twin bedroom — jewelry box detail',                  width: 2560, height: 1709 },

  // Bathroom
  bathroom:              { src: '/images/Krcka-kuca-1-kupaonica-scaled.webp',                                                            alt: 'Bathroom',                                           width: 2560, height: 1709 },
  bathroom_shower:       { src: '/images/Krcka-kuca-1-kupaonica-s-tusom-scaled.jpg',                                                     alt: 'Bathroom with shower',                               width: 3000, height: 2003 },
  wc:                    { src: '/images/Krcka-kuca-1-WC-za-sobe-na-katu-scaled.webp',                                                   alt: 'WC for upstairs bedrooms',                           width: 2560, height: 1709 },

  // Kept as alias so lokacija page still works
  parking:               { src: '/images/Krcka-kuca-1-eksterijer-ulazna-kapija-scaled.webp',                                             alt: 'Krčka kuća — entrance',                              width: 2560, height: 1709 },
} satisfies Record<string, ImageEntry>;

// ── Curated sets for specific page sections ─────────────────────────────────

export const heroImages = [
  images.exterior,
  images.terrace,
  images.livingroom1,
  images.garden,
  images.bedroom1,
  images.detail_bukaleta,
];

// ── Thematic bento gallery layout ───────────────────────────────────────────
// 4-column grid. cols: 2 = wide feature cell, cols: 1 = detail cell.
// Each row sums to 4 columns.

export const galleryLayout: GalleryItem[] = [
  // — OUTDOOR ————————————————————————————————————————————
  // Row 1: [2] house facade  |  [1] gate  |  [1] bread oven
  { img: images.exterior,            cols: 2 },
  { img: images.gate,                cols: 1 },
  { img: images.breadoven,           cols: 1 },
  // Row 2: [2] terrace  |  [2] vegetable garden
  { img: images.terrace,             cols: 2 },
  { img: images.garden,              cols: 2 },

  // — LIVING ROOM ————————————————————————————————————————
  // Row 3: [2] from entrance  |  [2] fireplace
  { img: images.livingroomEntry,     cols: 2 },
  { img: images.livingroomFireplace, cols: 2 },
  // Row 4: [1] towards terrace  |  [1] towards dining  |  [2] armchair
  { img: images.livingroom1,         cols: 1 },
  { img: images.livingroom2,         cols: 1 },
  { img: images.detail_armchair,     cols: 2 },

  // — OBJECTS & DETAILS ——————————————————————————————————
  // Row 5: [1] clock  |  [1] angel  |  [1] jug  |  [1] shells
  { img: images.detail_clock,        cols: 1 },
  { img: images.detail_angel,        cols: 1 },
  { img: images.detail_bukaleta,     cols: 1 },
  { img: images.detail_shells,       cols: 1 },
  // Row 6: [2] fishing scale  |  [2] antique iron
  { img: images.detail_scales,       cols: 2 },
  { img: images.detail_iron,         cols: 2 },

  // — DINING + KITCHEN ———————————————————————————————————
  // Row 7: [2] dining room  |  [2] kitchen
  { img: images.dining,              cols: 2 },
  { img: images.kitchen,             cols: 2 },
  // Row 8: [1] coffee cups  |  [1] basket  |  [1] pockets  |  [1] shelf
  { img: images.coffee_cups,         cols: 1 },
  { img: images.dining_basket,       cols: 1 },
  { img: images.kitchen_pockets,     cols: 1 },
  { img: images.kitchen_shelf,       cols: 1 },

  // — BEDROOMS ————————————————————————————————————————————
  // Row 9: [2] double bedroom  |  [2] double with linen
  { img: images.bedroom1,            cols: 2 },
  { img: images.bedroom1_linen,      cols: 2 },
  // Row 10: [2] twin bedroom  |  [2] twin with linen
  { img: images.bedroom2,            cols: 2 },
  { img: images.bedroom2_linen,      cols: 2 },

  // — BATHROOM ————————————————————————————————————————————
  // Row 11: [2] bathroom  |  [2] bathroom with shower
  { img: images.bathroom,            cols: 2 },
  { img: images.bathroom_shower,     cols: 2 },
];
