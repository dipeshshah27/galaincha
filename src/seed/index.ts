import { readFile } from 'fs/promises'
import { getPayload, type Payload } from 'payload'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import config from '../payload.config'
import { rugSVG, type Colorway } from './rug-art'

const ASSETS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets')

// Run with: npm run seed
// Idempotence: aborts if any user already exists.

const ADMIN_EMAIL = 'admin@galaincha.com'
const ADMIN_PASSWORD = 'galaincha2026'

type LexicalState = {
  root: {
    type: 'root'
    format: ''
    indent: 0
    version: 1
    direction: 'ltr'
    children: {
      type: string
      version: number
      [k: string]: unknown
    }[]
  }
}

function richText(...paragraphs: string[]): LexicalState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [{ type: 'text', text, version: 1 }],
      })),
    },
  }
}

async function uploadSVG(payload: Payload, svg: string, name: string, alt: string) {
  const data = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer()
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name: `${name}.png`, size: data.length },
  })
}

// Real photos from Wikimedia Commons (see credit for license/attribution),
// resized so the repo and uploads stay lean.
async function uploadPhoto(payload: Payload, fileName: string, alt: string, credit: string) {
  const original = await readFile(path.join(ASSETS_DIR, fileName))
  const data = await sharp(original).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer()
  return payload.create({
    collection: 'media',
    data: { alt, credit },
    file: { data, mimetype: 'image/jpeg', name: fileName, size: data.length },
  })
}

type ProductSeed = {
  slug: string
  category: string
  material: 'wool' | 'silk' | 'wool-silk' | 'hemp' | 'allo'
  knotCount: number
  size: string
  featured: boolean
  colorway: Colorway
  en: { name: string; priceRange: string; description: string[] }
  ne: { name: string; priceRange: string; description: string[] }
}

const PRODUCTS: ProductSeed[] = [
  {
    slug: 'everest-dawn',
    category: 'tibetan',
    material: 'wool',
    knotCount: 100,
    size: '170 × 240 cm',
    featured: true,
    colorway: { ground: '#f6f0e3', field: '#2b3a64', border: '#d2941f', medallion: '#ae1a37', accent: '#e8c87a' },
    en: {
      name: 'Everest Dawn',
      priceRange: 'NPR 85,000 – 110,000',
      description: [
        'A classic Tibetan medallion knotted in deep indigo, the colour of the sky minutes before sunrise on the Khumbu trail.',
        'Hand-knotted at 100 knots per square inch from highland sheep wool, washed in spring water and sun-dried on our Narayantar rooftop.',
      ],
    },
    ne: {
      name: 'सगरमाथा बिहानी',
      priceRange: 'रू ८५,००० – १,१०,०००',
      description: [
        'खुम्बु यात्रामा सूर्योदय हुनुअघिको आकाशको रङ — गाढा नीलोमा बुनिएको परम्परागत तिब्बती बुट्टा।',
        'प्रति वर्ग इन्च १०० गाँठोमा हिमाली भेडाको ऊनबाट हातले बुनिएको, मूलको पानीले धोएर घाममा सुकाइएको।',
      ],
    },
  },
  {
    slug: 'mustang-saffron',
    category: 'traditional',
    material: 'wool-silk',
    knotCount: 150,
    size: '140 × 200 cm',
    featured: true,
    colorway: { ground: '#fdf6e3', field: '#d2941f', border: '#8c1129', medallion: '#2b3a64', accent: '#f6f0e3' },
    en: {
      name: 'Mustang Saffron',
      priceRange: 'NPR 120,000 – 150,000',
      description: [
        'Marigold-gold field with an indigo medallion — the palette of Upper Mustang cliffs at noon.',
        'A wool body with silk highlights that catch the light as you cross the room. 150 knots per square inch.',
      ],
    },
    ne: {
      name: 'मुस्ताङ केसरी',
      priceRange: 'रू १,२०,००० – १,५०,०००',
      description: [
        'सयपत्री-सुनौलो भुइँमा नीलो बुट्टा — मध्याह्नमा माथिल्लो मुस्ताङका भीरहरूकै रङ।',
        'ऊनको जीउमा रेशमका झलकहरू — कोठा काट्दा उज्यालोमा टल्किन्छन्। प्रति वर्ग इन्च १५० गाँठो।',
      ],
    },
  },
  {
    slug: 'tihar-garland',
    category: 'traditional',
    material: 'wool',
    knotCount: 80,
    size: '120 × 180 cm',
    featured: false,
    colorway: { ground: '#f6f0e3', field: '#ae1a37', border: '#d2941f', medallion: '#d2941f', accent: '#f1e9d7' },
    en: {
      name: 'Tihar Garland',
      priceRange: 'NPR 55,000 – 70,000',
      description: [
        'Crimson and marigold, the colours of the garlands strung across every doorway during Tihar.',
        'A warm, hardy everyday rug at 80 knots per square inch — made to be lived on.',
      ],
    },
    ne: {
      name: 'तिहार माला',
      priceRange: 'रू ५५,००० – ७०,०००',
      description: [
        'तिहारमा हरेक ढोकामा झुन्डिने मालाकै रङ — रातो र सयपत्री।',
        'प्रति वर्ग इन्च ८० गाँठोको न्यानो, बलियो दैनिक गलैंचा — प्रयोगकै लागि बनेको।',
      ],
    },
  },
  {
    slug: 'dolpo-night',
    category: 'tibetan',
    material: 'wool',
    knotCount: 100,
    size: '200 × 300 cm',
    featured: false,
    colorway: { ground: '#d8d4e8', field: '#131a30', border: '#94a7d9', medallion: '#1c2540', accent: '#e2ab3f' },
    en: {
      name: 'Dolpo Night',
      priceRange: 'NPR 140,000 – 175,000',
      description: [
        'The deepest indigo we dye, knotted into a near-black field scattered with a single pale medallion — a full moon over Phoksundo.',
        'Room-sized at 200 × 300 cm; our weavers spend close to four months on each one.',
      ],
    },
    ne: {
      name: 'डोल्पो रात',
      priceRange: 'रू १,४०,००० – १,७५,०००',
      description: [
        'हामीले रंगाउने सबैभन्दा गाढा नील — फोक्सुन्डोमाथिको पूर्णिमाजस्तो एउटै फिक्का बुट्टा भएको कालो-नीलो भुइँ।',
        '२०० × ३०० से.मि.को ठूलो नाप; हरेकमा हाम्रा बुनकरहरूको झन्डै चार महिना लाग्छ।',
      ],
    },
  },
  {
    slug: 'phewa-mist',
    category: 'contemporary',
    material: 'wool-silk',
    knotCount: 150,
    size: '170 × 240 cm',
    featured: true,
    colorway: { ground: '#eef1f0', field: '#7d96a8', border: '#2b3a64', medallion: '#f1e9d7', accent: '#b9cbd6' },
    en: {
      name: 'Phewa Mist',
      priceRange: 'NPR 125,000 – 155,000',
      description: [
        'Soft lake-greys and morning blues, inspired by Phewa Tal before the haze lifts off the water.',
        'A quiet, contemporary piece — silk mist drifting over a wool field at 150 knots per square inch.',
      ],
    },
    ne: {
      name: 'फेवा कुहिरो',
      priceRange: 'रू १,२५,००० – १,५५,०००',
      description: [
        'पानीबाट कुहिरो नउठ्दैको फेवा तालबाट प्रेरित — हल्का खैरो-नीला रङहरू।',
        'शान्त, आधुनिक डिजाइन — ऊनको भुइँमाथि रेशमको कुहिरो, प्रति वर्ग इन्च १५० गाँठो।',
      ],
    },
  },
  {
    slug: 'janakpur-lotus',
    category: 'traditional',
    material: 'silk',
    knotCount: 200,
    size: '90 × 150 cm',
    featured: true,
    colorway: { ground: '#fdf6e3', field: '#f1e9d7', border: '#ae1a37', medallion: '#ae1a37', accent: '#2b3a64' },
    en: {
      name: 'Janakpur Lotus',
      priceRange: 'NPR 160,000 – 195,000',
      description: [
        'Our finest weave: pure silk at 200 knots per square inch, with a lotus medallion drawn from Mithila courtyard paintings.',
        'Sized for a wall, an entryway, or the one room that deserves it.',
      ],
    },
    ne: {
      name: 'जनकपुर कमल',
      priceRange: 'रू १,६०,००० – १,९५,०००',
      description: [
        'हाम्रो सबैभन्दा मिहीन बुनाइ: प्रति वर्ग इन्च २०० गाँठोको शुद्ध रेशम, मिथिला चित्रबाट लिइएको कमल बुट्टा।',
        'भित्ता, प्रवेशद्वार, वा त्यो एउटा विशेष कोठाका लागि उपयुक्त नाप।',
      ],
    },
  },
  {
    slug: 'annapurna-terraces',
    category: 'contemporary',
    material: 'hemp',
    knotCount: 60,
    size: '160 × 230 cm',
    featured: false,
    colorway: { ground: '#f6f0e3', field: '#6b7a4f', border: '#33281c', medallion: '#d2941f', accent: '#e8dfc8' },
    en: {
      name: 'Annapurna Terraces',
      priceRange: 'NPR 48,000 – 62,000',
      description: [
        'Stepped greens and straw golds, like paddy terraces climbing a Gandaki hillside.',
        'Woven from mountain hemp — naturally durable, beautifully irregular, and fully biodegradable.',
      ],
    },
    ne: {
      name: 'अन्नपूर्ण गरा',
      priceRange: 'रू ४८,००० – ६२,०००',
      description: [
        'गण्डकीको पाखोमा उक्लिँदै गरेका धानका गराजस्ता — हरियो र परालका रङहरू।',
        'हिमाली भाङबाट बुनिएको — प्राकृतिक रूपमा बलियो, सुन्दर र पूर्ण रूपमा कुहिने।',
      ],
    },
  },
  {
    slug: 'kathmandu-twilight',
    category: 'contemporary',
    material: 'allo',
    knotCount: 60,
    size: '140 × 200 cm',
    featured: false,
    colorway: { ground: '#f1e9d7', field: '#5a4a6b', border: '#d2941f', medallion: '#e2ab3f', accent: '#cbbfd9' },
    en: {
      name: 'Kathmandu Twilight',
      priceRange: 'NPR 52,000 – 66,000',
      description: [
        'Dusky violets and lamplight gold — the valley seen from Swayambhu as the evening lights come on.',
        'Woven from allo (Himalayan nettle) gathered in the eastern hills, softened by hand over weeks.',
      ],
    },
    ne: {
      name: 'काठमाडौं गोधूलि',
      priceRange: 'रू ५२,००० – ६६,०००',
      description: [
        'साँझको बैजनी र बत्तीको सुनौलो — बेलुकी बत्ती बल्दै गर्दा स्वयम्भूबाट देखिने उपत्यका।',
        'पूर्वी पहाडमा संकलित अल्लो (हिमाली सिस्नु)बाट बुनिएको, हप्तौं लगाएर हातैले नरम पारिएको।',
      ],
    },
  },
]

const CATEGORIES = [
  { slug: 'traditional', en: 'Traditional', ne: 'परम्परागत' },
  { slug: 'contemporary', en: 'Contemporary', ne: 'आधुनिक' },
  { slug: 'tibetan', en: 'Tibetan', ne: 'तिब्बती' },
]

async function seed() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.totalDocs > 0) {
    payload.logger.info('Users already exist — skipping seed.')
    process.exit(0)
  }

  payload.logger.info('Seeding admin user…')
  await payload.create({
    collection: 'users',
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })

  payload.logger.info('Seeding categories…')
  const categoryIds: Record<string, number> = {}
  for (const cat of CATEGORIES) {
    const doc = await payload.create({
      collection: 'categories',
      locale: 'en',
      data: { name: cat.en, slug: cat.slug },
    })
    await payload.update({
      collection: 'categories',
      id: doc.id,
      locale: 'ne',
      data: { name: cat.ne },
    })
    categoryIds[cat.slug] = doc.id
  }

  payload.logger.info('Seeding products (rendering rug art)…')
  const productIds: Record<string, number> = {}
  for (const product of PRODUCTS) {
    const media = await uploadSVG(
      payload,
      rugSVG(product.colorway),
      product.slug,
      `${product.en.name} — handwoven rug`,
    )
    const doc = await payload.create({
      collection: 'products',
      locale: 'en',
      data: {
        name: product.en.name,
        slug: product.slug,
        description: richText(...product.en.description),
        images: [media.id],
        category: categoryIds[product.category],
        size: product.size,
        material: product.material,
        knotCount: product.knotCount,
        priceRange: product.en.priceRange,
        featured: product.featured,
      },
    })
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale: 'ne',
      data: {
        name: product.ne.name,
        description: richText(...product.ne.description),
        priceRange: product.ne.priceRange,
      },
    })
    productIds[product.slug] = doc.id
  }

  payload.logger.info('Seeding services (uploading workshop photos)…')
  const showroomPhoto = await uploadPhoto(
    payload,
    'handwoven-items.jpg',
    'Showroom filled with hand-woven Nepali carpets and rugs',
    'Photo: Nabin845, CC BY-SA 4.0, via Wikimedia Commons',
  )
  const loomPhoto = await uploadPhoto(
    payload,
    'weaving-loom.jpg',
    'Three weavers working behind a carpet loom in Nepal',
    'Photo: Peter van der Sluijs, CC BY-SA 3.0, via Wikimedia Commons',
  )
  const serviceImages: Record<string, number> = {
    'ready-made-rugs': showroomPhoto.id,
    'custom-orders': loomPhoto.id,
  }

  const services = [
    {
      slug: 'ready-made-rugs',
      inquiryType: 'purchase' as const,
      order: 1,
      en: {
        title: 'Ready-Made Rugs',
        summary: 'Hand-knotted rugs in stock at our Narayantar workshop — see them, walk on them, take one home.',
        body: richText(
          'Every rug in our catalog is already woven, washed and ready to ship. What you see is the actual piece that arrives at your door.',
          'Visit the workshop to feel the wool underfoot, or send an inquiry from any rug page and we will reply with availability, exact pricing and delivery options — within Nepal and worldwide.',
        ),
        steps: [],
      },
      ne: {
        title: 'तयारी गलैंचा',
        summary: 'नारायणटार कार्यशालामा तयार रहेका हातले बुनिएका गलैंचाहरू — हेर्नुहोस्, टेक्नुहोस्, घर लैजानुहोस्।',
        body: richText(
          'हाम्रो सूचीका हरेक गलैंचा बुनिसकिएका, धोइसकिएका र पठाउन तयार छन्। तपाईंले देख्नुभएकै गलैंचा तपाईंको ढोकामा आइपुग्छ।',
          'कार्यशालामा आएर ऊन छामेर हेर्नुहोस्, वा कुनै पनि गलैंचाको पृष्ठबाट सोधपुछ पठाउनुहोस् — उपलब्धता, मूल्य र ढुवानी विकल्पसहित जवाफ दिनेछौं।',
        ),
        steps: [],
      },
    },
    {
      slug: 'carpet-washing',
      inquiryType: 'washing' as const,
      order: 2,
      en: {
        title: 'Carpet Washing & Care',
        summary: 'Professional hand-washing for handmade rugs — gentle soaps, soft brushes, Himalayan sun.',
        body: richText(
          'Machine washing destroys hand-knotted rugs. We wash the traditional way: flat on stone, with mild soap, soft brushes and a great deal of patience, then dry in full sun.',
          'We handle everything from yearly maintenance washes to reviving rugs that have spent decades in storage. Pickup and delivery available across the Kathmandu valley.',
        ),
        steps: [
          { title: 'Pickup & inspection', description: 'We collect your rug and note its dyes, age and any damage before water touches it.' },
          { title: 'Dusting & deep wash', description: 'Decades of dust are beaten out, then the rug is washed flat with mild soap and soft brushes.' },
          { title: 'Sun-drying', description: 'Dried slowly in open sun — never tumbled, never hung wet.' },
          { title: 'Finishing & delivery', description: 'Pile is groomed, fringes combed, and the rug comes home.' },
        ],
      },
      ne: {
        title: 'कार्पेट धुलाइ तथा हेरचाह',
        summary: 'हातले बुनेका गलैंचाका लागि व्यावसायिक धुलाइ — मलिलो साबुन, नरम बुरुस, हिमाली घाम।',
        body: richText(
          'मेसिनको धुलाइले हातका गलैंचा बिगार्छ। हामी परम्परागत तरिकाले धुन्छौं: ढुंगामा फिँजाएर, मलिलो साबुन, नरम बुरुस र प्रशस्त धैर्यका साथ — अनि चर्को घाममा सुकाउँछौं।',
          'वार्षिक सरसफाइदेखि दशकौं थन्किएका गलैंचा ब्युँताउनेसम्म — सबै काम गर्छौं। काठमाडौं उपत्यकाभर लिन-पुर्‍याउन उपलब्ध छ।',
        ),
        steps: [
          { title: 'सङ्कलन र निरीक्षण', description: 'पानी छुनुअघि नै रङ, उमेर र क्षति जाँचेर टिपोट गर्छौं।' },
          { title: 'धुलो झार्ने र गहिरो धुलाइ', description: 'दशकौंको धुलो झारेर, फिँजाएर मलिलो साबुन र नरम बुरुसले धुन्छौं।' },
          { title: 'घाममा सुकाउने', description: 'खुला घाममा बिस्तारै सुकाइन्छ — कहिल्यै निचोरिँदैन, भिजेकै झुन्ड्याइँदैन।' },
          { title: 'फिनिसिङ र डेलिभरी', description: 'रौं मिलाएर, झुम्का कोरेर गलैंचा घर फर्किन्छ।' },
        ],
      },
    },
    {
      slug: 'custom-orders',
      inquiryType: 'custom-order' as const,
      order: 3,
      en: {
        title: 'Custom Orders',
        summary: 'Your design, our loom. Any size, any palette, any motif — woven knot by knot.',
        body: richText(
          'Bring us a sketch, a photograph, a paint chip, or just a feeling. Our designers translate it into a weaving chart, and you approve the design and a dyed wool sample before the loom is warped.',
          'A custom rug takes between two and five months depending on size and knot count. We send photos from the loom as it grows, and ship worldwide.',
        ),
        steps: [
          { title: 'Share your idea', description: 'A sketch, a photo, room colours — anything is enough to start.' },
          { title: 'Design & sample', description: 'You approve the weaving chart and a hand-dyed wool sample.' },
          { title: 'On the loom', description: 'Two to five months of knotting, with progress photos along the way.' },
          { title: 'Wash & finish', description: 'The traditional wash brings out the lustre; pile is sheared and edges bound.' },
          { title: 'Delivered to your door', description: 'Carefully rolled and shipped — within Nepal or worldwide.' },
        ],
      },
      ne: {
        title: 'कस्टम अर्डर',
        summary: 'डिजाइन तपाईंको, तान हाम्रो। जुनसुकै नाप, रङ र बुट्टा — गाँठैगाँठाले बुनिने।',
        body: richText(
          'स्केच, फोटो, रङको नमूना — वा केवल एउटा भावना लिएर आउनुहोस्। हाम्रा डिजाइनरहरूले त्यसलाई बुनाइ नक्सामा उतार्छन्, र तान चढाउनुअघि डिजाइन र रंगाएको ऊनको नमूना तपाईंले नै स्वीकृत गर्नुहुन्छ।',
          'नाप र गाँठो घनत्व अनुसार कस्टम गलैंचा बन्न दुईदेखि पाँच महिना लाग्छ। बुनिँदै गर्दाका फोटोहरू पठाउँछौं, र विश्वभर ढुवानी गर्छौं।',
        ),
        steps: [
          { title: 'आफ्नो विचार पठाउनुहोस्', description: 'स्केच, फोटो, कोठाका रङहरू — सुरु गर्न जे पनि पुग्छ।' },
          { title: 'डिजाइन र नमूना', description: 'बुनाइ नक्सा र हातले रंगाएको ऊनको नमूना तपाईंले स्वीकृत गर्नुहुन्छ।' },
          { title: 'तानमा', description: 'दुईदेखि पाँच महिनाको बुनाइ — बीचबीचमा प्रगतिका फोटोसहित।' },
          { title: 'धुलाइ र फिनिसिङ', description: 'परम्परागत धुलाइले चमक ल्याउँछ; रौं काटेर किनारा बाँधिन्छ।' },
          { title: 'तपाईंको ढोकासम्म', description: 'जतनसाथ बेरेर पठाइन्छ — नेपालभित्र वा विश्वभर।' },
        ],
      },
    },
  ]

  for (const service of services) {
    const doc = await payload.create({
      collection: 'services',
      locale: 'en',
      data: {
        title: service.en.title,
        slug: service.slug,
        summary: service.en.summary,
        body: service.en.body,
        image: serviceImages[service.slug],
        inquiryType: service.inquiryType,
        order: service.order,
        steps: service.en.steps,
      },
    })
    await payload.update({
      collection: 'services',
      id: doc.id,
      locale: 'ne',
      data: {
        title: service.ne.title,
        summary: service.ne.summary,
        body: service.ne.body,
        // Array rows must keep their IDs so localized fields attach to them
        steps: (doc.steps ?? []).map((row, index) => ({
          ...service.ne.steps[index],
          id: row.id,
        })),
      },
    })
  }

  payload.logger.info('Seeding globals…')
  const weaversPhoto = await uploadPhoto(
    payload,
    'weavers-folklife.jpg',
    'Tibetan carpet weavers from Nepal demonstrating their craft at the loom',
    'Photo: Smithsonian Institution, no known restrictions, via Wikimedia Commons',
  )

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      tagline: 'Woven in Nepal',
      contactPerson: 'Deepak Shah',
      phone: '+977 9840153038',
      whatsapp: '+977 9840153038',
      email: 'namaste@galaincha.com',
      address: 'Narayantar, Jorpati\nKathmandu, Nepal',
      instagram: 'https://instagram.com/galaincha',
      facebook: 'https://facebook.com/galaincha',
      footerNote: 'Every rug is one of one.',
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'ne',
    data: {
      tagline: 'नेपालमा बुनिएको',
      contactPerson: 'दीपक शाह',
      address: 'नारायणटार, जोरपाटी\nकाठमाडौं, नेपाल',
      footerNote: 'हरेक गलैंचा एउटै मात्र।',
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      heroEyebrow: 'Handwoven in Kathmandu',
      heroHeading: 'Carpets that carry the Himalayas home.',
      heroSub:
        'For three generations our weavers have knotted highland wool into rugs that outlive trends — and often their owners.',
      featuredProducts: PRODUCTS.filter((p) => p.featured).map((p) => productIds[p.slug]),
      storyHeading: 'From fleece to floor, by hand',
      storyBody: richText(
        'Our wool walks down from the high pastures on the backs of sheep that live above 4,000 metres. It is carded by hand, spun by hand, and dyed in small copper pots with madder, indigo and walnut husk.',
        'Then the slow part begins: a weaver ties each knot, one by one, tens of thousands of times, until a drawing becomes a floor you can stand on. We have never found a faster way that we are proud of, so we have not changed it.',
      ),
    },
  })
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'ne',
    data: {
      heroEyebrow: 'काठमाडौंमा हातले बुनिएको',
      heroHeading: 'हिमाल बोकेर घर आउने गलैंचा।',
      heroSub:
        'तीन पुस्तादेखि हाम्रा बुनकरहरूले हिमाली ऊनलाई यस्ता गलैंचामा गाँठा पार्दै आएका छन् — जो फेसन भन्दा, कहिलेकाहीँ त धनी भन्दा पनि, लामो बाँच्छन्।',
      storyHeading: 'ऊनदेखि भुइँसम्म, हातैले',
      storyBody: richText(
        'हाम्रो ऊन ४,००० मिटरमाथि चर्ने भेडाको ढाडमा चढेर उच्च खर्कबाट झर्छ। हातैले कोरिन्छ, हातैले कातिन्छ, र मजिठो, नील र ओखरको बोक्राले साना तामाका भाँडामा रंगाइन्छ।',
        'अनि सुरु हुन्छ ढिलो काम: एक बुनकरले एक-एक गरी हजारौं-लाखौं गाँठा पार्छन्, जबसम्म एउटा चित्र टेक्न मिल्ने भुइँ बन्दैन। यसभन्दा छिटो र गर्व गर्न लायक तरिका हामीले भेटेका छैनौं — त्यसैले बदलेका पनि छैनौं।',
      ),
    },
  })

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      heading: 'Our story',
      intro:
        'Galaincha began with one loom in a Narayantar courtyard in 1974. Today thirty weavers work under the same roof — many of them children and grandchildren of the first.',
      image: weaversPhoto.id,
      body: richText(
        'The Tibetan carpet tradition arrived in Kathmandu in the early 1960s, and our family learned it the way everyone did then: by sitting beside a master until our hands knew the knots.',
        'We still card and spin by hand, dye with plants where we can, and wash every rug in the traditional way. The workshop is open to visitors six days a week — come watch a rug grow.',
        'Every Galaincha rug is signed by its weavers and numbered. We can tell you who wove yours, what the wool ate, and which pot it was dyed in.',
      ),
    },
  })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'ne',
    data: {
      heading: 'हाम्रो कथा',
      intro:
        'गलैंचाको सुरुवात सन् १९७४ मा नारायणटारको एउटा आँगनमा एउटै तानबाट भयो। आज त्यही छानामुनि तीस जना बुनकर काम गर्छन् — धेरैजसो पहिलो पुस्ताकै छोराछोरी र नातिनातिना।',
      body: richText(
        'तिब्बती गलैंचा परम्परा सन् १९६० को दशकको सुरुमा काठमाडौं आइपुग्यो, र हाम्रो परिवारले त्यतिबेला सबैले जसरी सिक्थे त्यसरी नै सिक्यो: हातले गाँठा नचिनुन्जेल गुरुको छेउमा बसेर।',
        'हामी अझै हातैले ऊन कोर्छौं र कात्छौं, सकेसम्म वनस्पतिले रंगाउँछौं, र हरेक गलैंचा परम्परागत तरिकाले धुन्छौं। कार्यशाला हप्ताको छ दिन आगन्तुकका लागि खुला छ — गलैंचा बन्दै गरेको हेर्न आउनुहोस्।',
        'हरेक गलैंचामा बुन्ने बुनकरहरूको छाप र क्रमसंख्या हुन्छ। तपाईंको गलैंचा कसले बुन्यो, ऊन कुन खर्कको हो, कुन भाँडामा रंगाइयो — सबै भन्न सक्छौं।',
      ),
    },
  })

  payload.logger.info('Seed complete.')
  payload.logger.info(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  process.exit(0)
}

try {
  await seed()
} catch (error) {
  console.error(error)
  process.exit(1)
}
