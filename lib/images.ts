// Image manifest — maps semantic keys to actual filenames in /public/images/
// For mobile, use shorter/portrait crops; for desktop, use wider/landscape.

export interface ImageEntry {
  src: string;
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;

}

export const images = {
  exterior:           {  src: '/images/Krcka-kuca-1-Kuca-od-tete-Marije-i-barba-Osipa-Skrbcici-20-scaled.webp', alt: 'Krcka kuća — exterior stone facade, Skrbčići', width: 1200, height: 800 },
  parking:            {  src: '/images/Krcka-kuca-1-pogled-s-parkiralista1-scaled.webp', alt: 'View from the parking area', width: 1200, height: 800 },
  terrace:            {  src: '/images/Krcka-kuca-1-terasa-sa-portuna-bacva-vanjska-kuhinja-bicikl-scaled.webp', alt: 'Terrace with barrel, outdoor kitchen and bicycle', width: 1200, height: 800 },
  livingroom1:        {  src: '/images/4.webp', alt: 'Living room towards terrace', width: 1200, height: 900 },
  livingroom2:        {  src: '/images/5.jpg', alt: 'Living room towards dining area', width: 1200, height: 900 },
  livingroomFireplace:{  src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-prema-kaminu-scaled.webp', alt: 'Living room fireplace', width: 1200, height: 900 },
  livingroomEntry:    {  src: '/images/Krcka-kuca-1-dnevni-boravak-pogled-s-ulaznih-vrata-scaled.webp', alt: 'Living room from entrance', width: 1200, height: 900 },
  dining:             {  src: '/images/8.jpg', alt: 'Dining room detail', width: 1200, height: 900 },
  kitchen:            {  src: '/images/Krcka-kuca-1-kuhinja-pogled-prema-napi-1-scaled.webp', alt: 'Kitchen with hood', width: 1200, height: 900 },
  breadoven:          { src: '/images/Krcka-kuca-1-krusna-pec-iz-dvorista-scaled.webp', alt: 'Stone bread oven in the courtyard', width: 1200, height: 900 },
  garden:             { src: '/images/11.webp', alt: 'Garden and terrace view', width: 1200, height: 900 },
  bedroom1:           { src: '/images/12.webp', alt: 'Double bedroom', width: 1200, height: 900 },
  bedroom2:           { src: '/images/13.jpg', alt: 'Twin bedroom', width: 1200, height: 900 },
  bathroom:           { src: '/images/14.jpg', alt: 'Bathroom', width: 900, height: 1200 },
  detail_clock:       { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-sat-scaled.webp', alt: 'Antique clock detail', width: 800, height: 1000 },
  detail_angel:       { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-andelic-u-zidu-scaled.webp', alt: 'Stone angel detail in wall', width: 800, height: 1000 },
  detail_bukaleta:    { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-bukaleta-Karla-scaled.webp', alt: 'Traditional clay jug detail', width: 800, height: 1000 },
  detail_shells:      { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-drvena-plitica-sa-skoljkama-scaled.webp', alt: 'Wooden tray with shells', width: 800, height: 1000 },
  detail_scales:      { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-ribarska-vaga-scaled.webp', alt: 'Antique fishing scale detail', width: 800, height: 1000 },
  detail_iron:        { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj-sumpres-scaled.webp', alt: 'Antique iron detail', width: 800, height: 1000 },
  detail_armchair:    { src: '/images/Krcka-kuca-1-dnevni-boravak-detalj_-fotelja-scaled.webp', alt: 'Armchair detail', width: 800, height: 1000 },
  detail_watering:    { src: '/images/Krcka-kuca-1-detalj-mini-zalivarnik-na-gromaci-scaled.webp', alt: 'Watering can on stone wall', width: 800, height: 1000 },
  kitchen_pockets:    { src: '/images/Krcka-kuca-1-kuhinja-detalj-platneni-dzepovi-scaled.webp', alt: 'Kitchen fabric pocket detail', width: 800, height: 1000 },
  kitchen_shelf:      { src: '/images/Krcka-kuca-1-kuhinja-detalj-polica-scaled.webp', alt: 'Kitchen shelf detail', width: 800, height: 1000 },
  coffee_cups:        { src: '/images/25.jpg', alt: 'Coffee cups on rack', width: 800, height: 1000 },
  bedroom1_linen:     { src: '/images/26.jpg', alt: 'Double bedroom with linen', width: 1200, height: 900 },
  bedroom2_linen:     { src: '/images/Krcka-kuca-1-soba-s-djeljivim-krevetima-posteljina-scaled.webp', alt: 'Twin bedroom with linen', width: 1200, height: 900 },
} satisfies Record<string, ImageEntry>;

// Curated sets for specific page sections
export const heroImages = [
  images.exterior,
  images.terrace,
  images.livingroom1,
  images.garden,
  images.bedroom1,
  images.detail_bukaleta,
];

export const atmosphereStrip = [
  images.detail_clock,
  images.detail_shells,
  images.detail_angel,
  images.detail_iron,
  images.breadoven,
  images.detail_watering,
  images.coffee_cups,
];

export const houseDetailStrip = [
  images.detail_armchair,
  images.kitchen_pockets,
  images.kitchen_shelf,
  images.detail_bukaleta,
  images.detail_scales,
  images.bedroom1_linen,
];

export const galleryImages = [
  images.exterior,
  images.terrace,
  images.livingroom1,
  images.livingroom2,
  images.livingroomFireplace,
  images.livingroomEntry,
  images.kitchen,
  images.breadoven,
  images.garden,
  images.bedroom1,
  images.bedroom2,
  images.bathroom,
  images.detail_clock,
  images.detail_angel,
  images.detail_bukaleta,
  images.detail_shells,
  images.detail_scales,
  images.detail_iron,
  images.detail_armchair,
  images.detail_watering,
  images.kitchen_pockets,
  images.kitchen_shelf,
  images.coffee_cups,
  images.bedroom1_linen,
  images.bedroom2_linen,
  images.dining,
];
