/* Content for the inner pages. Every fact here comes from the Mitsubishi Libya sites:
 *   old live  https://middleeastgrp.com/mitsubishi-libya-automotives/
 *   beta      https://dev18.intersmarthosting.in/mitsubishi/
 * or from the supplied L200 figures already used on the home page. Anything not confirmed is marked TBC (shown as "On request"). */
const TBC = 'On request';

const OFFICES = {
  libya: { name: 'Libya', lines: ['P O Box 5166, Swani Road', 'Al Fallah Street, Tripoli, Libya'], phones: [['+218 918 804 961', '+218918804961'], ['+218 925 818 264', '+218925818264']], emails: ['sales@middleeastgrp.com', 'parts@middleeastgrp.com', 'service@middleeastgrp.com'], map: 'https://www.google.com/maps/search/?api=1&query=Swani+Road+Al+Fallah+Street+Tripoli+Libya' },
};
const SOCIAL = {
  facebook: 'https://www.facebook.com/Middle-East-Group-101187085923646',
  instagram: 'https://www.instagram.com/official.middleeastgrp/',
  linkedin: 'https://www.linkedin.com/company/middle-east-grp/'
};

/* The four showcased vehicles. `variants` come from the beta site listing cards (engine / transmission / cylinders / drive). */
const V = (id, trim, o) => Object.assign({ id, trim }, o);
const MODELS = [
  {
    slug: 'destinator', name: 'Destinator', kind: 'SUV', accent: '#8fb4d9',
    tag: 'A bold, modern SUV built for the family.',
    hero: 'assets/img/story-destinator.webp', photo2: 'assets/img/web/Destinator.jpg', cut: 'assets/cars/destinator-m-line.webp', cutAr: .444,
    intro: 'A confident SUV stance with a two-tone roof and sculpted body lines, offered in P Line, M Line and H Line trims.',
    stat: { v: '3', l: 'trim levels: P, M and H Line' },
    labels: ['Two-tone roof', 'Alloy wheels', 'Sculpted body lines', 'P / M / H Line'],
    features: [
      ['Presence', 'A confident SUV stance', 'Two-tone roof and sculpted body lines give the Destinator a strong, modern profile.', 'assets/img/web/Destinator.jpg'],
      ['Choice', 'Three trim lines', 'Choose between the P Line, M Line and H Line to match how you drive.', 'assets/cars/destinator-p-line.webp'],
      ['Drive', '1.5L petrol, automatic', 'A four-cylinder 1.5L petrol engine with automatic transmission and two-wheel drive.', 'assets/img/story-destinator.webp']
    ],
    specs: { Design: [['Model', 'Destinator'], ['Trims', 'P Line, M Line, H Line'], ['Roof', 'Two-tone'], ['Wheels', 'Alloy']], Performance: [['Engine', '1.5L petrol'], ['Cylinders', '4'], ['Transmission', 'Automatic'], ['Drive', '2WD'], ['Power', TBC], ['Torque', TBC]], Safety: [['Braking', TBC], ['Stability', TBC], ['Airbags', TBC], ['Driver assist', TBC]], Comfort: [['Climate', TBC], ['Infotainment', TBC], ['Seating', TBC], ['Access', TBC]] },
    variants: [V('destinator-p', 'P Line', { img: 'assets/cars/destinator-p-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'SUV' }), V('destinator-m', 'M Line', { img: 'assets/cars/destinator-m-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'SUV' }), V('destinator-h', 'H Line', { img: 'assets/img/web/Destinator.jpg', photo: true, engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'SUV' })]
  },
  {
    slug: 'l200', name: 'L200', kind: 'Pickup', accent: '#e8902a',
    tag: 'A rugged pickup built for work and adventure.',
    hero: 'assets/img/l200-intro.webp', photo2: 'assets/img/l200-ext.webp', cut: 'assets/cars/l200-glx-diesel.webp', cutAr: .426,
    intro: 'In pursuit of the ultimate toughness, the L200 pickup was put through rigorous tests. Being tough was not enough: it had to endure the harshest conditions.',
    stat: { v: '330', u: 'Nm', l: 'diesel torque (2.4L, GLX)' },
    labels: ['Double cab', 'Alloy wheels', 'LED tail lamps', 'Hill start assist'],
    features: [
      ['Toughness', 'Beyond tough', 'Engineered for the harshest conditions, with a 2442 cc diesel tuned for load-carrying and everyday strength.', 'assets/img/l200-ext.webp'],
      ['Space', 'Class-leading cabin', 'Travel comfortably in the double cab, with generous space and ergonomically designed, high-quality seating.', 'assets/img/web/L200-SCDC.jpg'],
      ['Control', 'Active safety', 'ABS with brake assist, ESP with traction control and hill start assist come with the GLX.', 'assets/img/l200-hill.webp'],
      ['Calm', 'A quiet, comfortable ride', 'Strategically placed sound insulation and vibration damping material keep the cabin calm.', 'assets/img/l200-intro.webp']
    ],
    specs: { Design: [['Body', 'Double Cab'], ['Trim', 'GLX'], ['Wheels', 'Alloy'], ['Tail lamps', 'LED']], Performance: [['Engine', '2442 cc diesel'], ['Power', '147 hp'], ['Torque', '330 Nm'], ['Cylinders', '4'], ['Transmission', 'Manual'], ['Drive', '4WD']], Safety: [['Braking', 'ABS + BA'], ['Stability', 'ESP + TCS'], ['Assist', 'Hill start'], ['Airbags', TBC]], Comfort: [['Climate', 'Auto A/C'], ['Infotainment', 'Touchscreen'], ['Access', 'Keyless'], ['Seating', TBC]] },
    gallery: ['assets/img/l200-ext.webp', 'assets/img/l200-hill.webp', 'assets/img/about-bg.webp', 'assets/img/fleet-tailored.jpg'],
    variants: [
      V('l200-glx', '4WD GLX Diesel Double Cabin', { img: 'assets/cars/l200-glx-diesel.webp', engine: '2.4L Diesel', trans: 'Manual', cyl: '4', drive: '4WD', fuel: 'Diesel', body: 'Double Cabin', power: '147 hp', torque: '330 Nm' }),
      V('l200-gl4', '4WD GL Diesel Double Cabin', { img: 'assets/cars/l200-4wd-gl.webp', engine: '2.4L Diesel', trans: 'Manual', cyl: '4', drive: '4WD', fuel: 'Diesel', body: 'Double Cabin' }),
      V('l200-gl2', '2WD GL Diesel Double Cabin', { img: 'assets/cars/l200-2wd-gl.webp', engine: '2.4L Diesel', trans: 'Manual', cyl: '4', drive: '2WD', fuel: 'Diesel', body: 'Double Cabin', power: '147 hp', torque: '330 Nm' }),
      V('l200-gls', '4WD GL Diesel Single Cabin', { img: 'assets/cars/l200-gl-single.webp', engine: '2.4L Diesel', trans: 'Manual', cyl: '4', drive: '4WD', fuel: 'Diesel', body: 'Single Cabin', power: '147 hp', torque: '330 Nm' }),
      V('l200-gls-p', '4WD GLS Petrol Double Cabin', { img: 'assets/cars/l200-gls-petrol.webp', engine: '2.4L Petrol', trans: 'Manual', cyl: '4', drive: '4WD', fuel: 'Petrol', body: 'Double Cabin' }),
      V('l200-gl-p', '4WD GL Petrol Double Cabin', { img: 'assets/img/l200-ext.webp', photo: true, engine: '2.4L Petrol', trans: 'Manual', cyl: '4', drive: '4WD', fuel: 'Petrol', body: 'Double Cabin' }),
      V('l200-sportero', 'Sportero Diesel Double Cabin', { img: 'assets/img/web/Sportero.jpg', photo: true, engine: '2.4L Diesel', trans: 'Automatic', cyl: '4', drive: '4WD', fuel: 'Diesel', body: 'Double Cabin' })
    ]
  },
  {
    slug: 'outlander', name: 'Outlander', kind: 'SUV', accent: '#c7ccd4',
    tag: 'An agile compact SUV for the city and the weekend.',
    hero: 'assets/img/story-outlander.webp', photo2: 'assets/img/drive.webp', cut: 'assets/cars/outlander-sport-h-line-hd.webp', cutAr: .382,
    intro: 'A sleek compact SUV profile with a sporty stance, offered as the Outlander Sport in P Line, H Line and M Line trims.',
    stat: { v: '3', l: 'trim levels: P, H and M Line' },
    labels: ['Compact SUV profile', 'Alloy wheels', 'Sporty stance', 'P / H / M Line'],
    features: [
      ['Agility', 'Compact and confident', 'A sleek compact SUV profile with a sporty stance, made for city streets and weekend trips.', 'assets/img/story-outlander.webp'],
      ['Choice', 'Three trim lines', 'The Outlander Sport is offered in P Line, H Line and M Line.', 'assets/cars/outlander-sport-m-line.webp'],
      ['Drive', '1.5L petrol, automatic', 'A four-cylinder 1.5L petrol engine with automatic transmission and two-wheel drive.', 'assets/img/drive.webp']
    ],
    specs: { Design: [['Model', 'Outlander Sport'], ['Trims', 'P Line, H Line, M Line'], ['Body', 'Compact SUV'], ['Wheels', 'Alloy']], Performance: [['Engine', '1.5L petrol'], ['Cylinders', '4'], ['Transmission', 'Automatic'], ['Drive', '2WD'], ['Power', TBC], ['Torque', TBC]], Safety: [['Braking', TBC], ['Stability', TBC], ['Airbags', TBC], ['Driver assist', TBC]], Comfort: [['Climate', TBC], ['Infotainment', TBC], ['Seating', TBC], ['Access', TBC]] },
    variants: [V('outlander-p', 'Outlander Sport P Line', { img: 'assets/img/drive.webp', photo: true, engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'Compact SUV' }), V('outlander-h', 'Outlander Sport H Line', { img: 'assets/cars/outlander-sport-h-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'Compact SUV' }), V('outlander-m', 'Outlander Sport M Line', { img: 'assets/cars/outlander-sport-m-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'Compact SUV' })]
  },
  {
    slug: 'xpander', name: 'Xpander', kind: 'Family MPV', accent: '#ff4545',
    tag: 'A spacious family MPV with room for everyone.',
    hero: 'assets/img/story-xpander.webp', photo2: 'assets/img/story-xpander.webp', cut: 'assets/cars/xpander.webp', cutAr: .3505,
    intro: 'A practical, space-focused MPV with a tall roofline and a wide cabin for seven.',
    stat: { v: '7', l: 'seats for the whole family' },
    labels: ['Seven seats', 'Tall roofline', 'Wide cabin', 'Alloy wheels'],
    features: [
      ['Space', 'Room for seven', 'A practical, space-focused body with a tall roofline and wide cabin.', 'assets/img/story-xpander.webp'],
      ['Family', 'Built around everyone', 'Seven seats make the Xpander the family vehicle of the range.', 'assets/cars/xpander.webp']
    ],
    specs: { Design: [['Model', 'Xpander'], ['Body', 'MPV'], ['Seating', '7 seats'], ['Wheels', 'Alloy']], Performance: [['Engine', TBC], ['Power', TBC], ['Torque', TBC], ['Transmission', TBC], ['Drive', TBC], ['Fuel', TBC]], Safety: [['Braking', TBC], ['Stability', TBC], ['Airbags', TBC], ['Driver assist', TBC]], Comfort: [['Climate', TBC], ['Infotainment', TBC], ['Seating', '7 seats'], ['Access', TBC]] },
    variants: [V('xpander', 'Xpander', { img: 'assets/cars/xpander.webp', engine: TBC, trans: TBC, cyl: TBC, drive: TBC, fuel: TBC, body: 'MPV' })]
  }
];
const ORDER = ['destinator', 'l200', 'outlander', 'xpander'];

/* News & events (old live site) and the beta blog/news posts. Full article bodies were not available. */
const NEWS = [
  { id: 'l200-sportero', cat: 'News', title: 'Now Available: The New Mitsubishi L200 Sportero', date: '', img: 'assets/img/web/sportero-blog.jpg', ex: 'The new Sportero comes with several significant enhancements and is created on a whole new platform and chassis. This vehicle is therefore larger, more powerful, and better equipped, but is still more fuel efficient than the current model.', cta: 'Call us to find out more.' },
  { id: 'aria-week', cat: 'Event', title: 'Hot Off The Press! ARIA Week 2019 presented by Mitsubishi', date: 'November 14, 2019', img: 'assets/img/web/p_190725_m_1206_img_01.png', ex: 'The 2019 ARIA Week in Australia, the seventh edition, was presented by Mitsubishi ASX and ran from 14 November 2019 in the lead-up to the ARIA Awards.', body: ["ARIA Week is held every year in Australia in the lead-up to the ARIA Awards, run by the Australian Recording Industry Association. The 2019 edition, the seventh, was presented by Mitsubishi ASX and began on Thursday 14 November 2019, with support from the NSW Government.","## What was on","Most events took place in Sydney, with some in Newcastle, Byron Bay, Wagga Wagga and Griffith. Industry events included the ARIA Masterclass on 26 November, the Women In Music Breakfast on 19 November, the U2 Conference on 21 November, and a Producers BBQ.","Special events included Liquid Lunch Live on 22 November. Nova&rsquo;s Red Room series also ran live shows through the week, finishing with Tones and I on 29 November.","## About the sponsorship","This event was held in Australia and is not a Middle East Group event. It is listed here as part of Mitsubishi&rsquo;s worldwide brand activity."] },
  { id: 'pajero-sport', cat: 'News', title: 'Mitsubishi Motors Globally Debuts New Pajero Sport', date: 'July 25, 2019', img: 'assets/img/web/cq5dam.web_.1280.1280.jpeg', ex: 'Tokyo, July 25, 2019. Mitsubishi Motors Corporation today globally debuted the New Pajero Sport, mid-size SUV, in Thailand, and began its sales there. New Pajero Sport adopts a more refined, powerful appearance, complemented with a refreshed interior.', body: ["Mitsubishi Motors Corporation unveiled the new Pajero Sport, its mid-size SUV, on 25 July 2019 in Thailand, where sales began the same day. In some markets the model is sold as the Montero Sport.","## Where it is built and sold","The new Pajero Sport is built at the Laem Chabang plant of Mitsubishi Motors (Thailand). Mitsubishi planned to sell it in around 90 countries, including the Philippines and Australia. Sales of the previous model came to about 77,000 units worldwide in the 2018 fiscal year.","## Design","Under the theme &ldquo;Elevate your Journey&rdquo;, the new model has a more refined, powerful look. The front design is updated, with a higher bonnet line and chrome detailing.","## Powertrain","The Pajero Sport uses a 2.4L MIVEC turbo diesel engine with an 8-speed automatic transmission. 4WD models have the Super-Select 4WD-II system with an off-road mode.","## Technology and convenience","An 8-inch colour LCD meter and an 8-inch Smartphone-Link Display Audio unit come with the new model. A power tailgate with hands-free operation can also be controlled from a smartphone, and remote door-lock notifications are available. Inside, the floor console has been refreshed, there is a storage tray reachable from both sides, and a new AC power outlet has been added.","## Safety","Lane Change Assist and Rear Cross Traffic Alert are new additions to the model&rsquo;s safety equipment.","## More information","To see the Pajero Sport and other Mitsubishi models, or to ask about availability in Libya, contact the Middle East Group team on +218 918 804 961."] },
  { id: 'over-25-years', cat: 'News', title: 'Middle East Group: More Than 25 Years with Mitsubishi in Libya', date: '', img: 'assets/img/dev-desert.webp', ex: 'Middle East Group is one of Libya&rsquo;s leading automobile distributors, associated with Mitsubishi Motors Corporation for more than 25 years.' }
];
const BLOG = [
  { id: 'suv-lineup-2026', cat: 'Blog', title: 'Mitsubishi Expands Its SUV Lineup for 2026', date: 'July 2, 2026', img: 'assets/img/web/news1.jpg', ex: 'The latest from Mitsubishi on the expanding SUV lineup for 2026.' },
  { id: 'sedan-or-suv', cat: 'Blog', title: 'Choosing Between Mitsubishi Sedan and SUV: What Fits You Best?', date: 'June 25, 2026', img: 'assets/img/web/news2.jpg', ex: 'A guide to choosing the right model for your lifestyle.' },
  { id: 'ownership-libya', cat: 'Blog', title: 'Why Mitsubishi Ownership Is a Smart Choice in Libya', date: 'June 8, 2026', img: 'assets/img/web/news3.jpg', ex: 'Why owning a Mitsubishi makes sense in Libya.' },
  { id: 'buying-tips', cat: 'Blog', title: 'Essential Tips Before Buying a New Mitsubishi', date: 'May 11, 2026', img: 'assets/img/web/news4.jpg', ex: 'What to check before you buy a new Mitsubishi.' },
  { id: 'service-checklist', cat: 'Blog', title: 'A Simple Service Checklist to Keep Your Mitsubishi Running Well', date: '', img: 'assets/img/web/Mistubishi2-1.jpg', ex: 'Quick checks you can do between services to keep your vehicle reliable.' },
  { id: 'genuine-parts', cat: 'Blog', title: 'Why Genuine Parts Matter for Your Mitsubishi', date: '', img: 'assets/img/web/facility4.jpeg', ex: 'What genuine parts mean for fit, performance and peace of mind.' },
  { id: 'long-drive-prep', cat: 'Blog', title: 'Getting Your Pickup Ready for a Long Drive', date: '', img: 'assets/img/web/happy-jurney.jpg', ex: 'A short checklist to run through before a long journey.' }
];

const PARTS = [
  { n: 'Cabin air filter', d: 'Mitsubishi Motors Genuine Parts', img: 'assets/img/parts/cabin-air-filter.png' },
  { n: 'Evaporator cleaner', d: 'Mitsubishi Motors Genuine Chemicals', img: 'assets/img/parts/evaporator-cleaner.png' },
  { n: 'Engine parts', d: 'Genuine Mitsubishi engine parts', img: 'assets/img/parts/engine-parts.png' },
  { n: 'Electrical parts', d: 'Genuine Mitsubishi electrical parts', img: 'assets/img/parts/electrical-parts.png' },
  { n: 'Body parts', d: 'Genuine Mitsubishi body parts', img: 'assets/img/parts/body-parts.png' }
];

module.exports = { TBC, OFFICES, SOCIAL, MODELS, ORDER, NEWS, BLOG, PARTS };
