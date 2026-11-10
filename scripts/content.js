/* Content for the inner pages. Every fact here comes from the Mitsubishi Libya sites:
 *   old live  https://middleeastgrp.com/mitsubishi-libya-automotives/
 *   beta      https://dev18.intersmarthosting.in/mitsubishi/
 * or from the supplied L200 figures already used on the home page. Anything not confirmed is marked TBC (shown as "On request"). */
const TBC = 'On request';

const OFFICES = {
  libya: { name: 'Libya', lines: ['P O Box 5166, Swani Road', 'Al Fallah Street, Tripoli, Libya'], phones: [['+218 918 804 961', '+218918804961'], ['+218 925 818 264', '+218925818264']], emails: ['sales@middleeastgrp.com'], map: 'https://www.google.com/maps/search/?api=1&query=Swani+Road+Al+Fallah+Street+Tripoli+Libya' },
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
    slug: 'destinator', name: 'Destinator', kind: 'SUV',
    views: { Interior: ['assets/img/interior/destinator-1.webp', 'assets/img/interior/destinator-2.webp', 'assets/img/interior/destinator-banner.webp'], Exterior: ['assets/img/destinator-stance.webp', 'assets/img/destinator-choice.webp', 'assets/img/story-destinator.webp'] }, accent: '#8fb4d9',
    tag: 'A bold, modern SUV built for the family.',
    hero: 'assets/img/story-destinator.webp', photo2: 'assets/img/web/Destinator.jpg', cut: 'assets/cars/destinator-m-line.webp', cutAr: .444,
    intro: 'A confident SUV stance with a two-tone roof and sculpted body lines, offered in P Line, M Line and H Line trims.',
    stat: { v: '3', l: 'trim levels: P, M and H Line' },
    labels: ['Two-tone roof', 'Alloy wheels', 'Sculpted body lines', 'P / M / H Line'],
    features: [
      ['Presence', 'A confident SUV stance', 'Two-tone roof and sculpted body lines give the Destinator a strong, modern profile.', 'assets/img/destinator-stance.webp'],
      ['Choice', 'Three trim lines', 'Choose between the P Line, M Line and H Line to match how you drive.', 'assets/img/destinator-choice.webp'],
      ['Drive', '1.5L petrol, automatic', 'A four-cylinder 1.5L petrol engine with automatic transmission and two-wheel drive.', 'assets/img/destinator-rear.webp']
    ],
    specs: { Design: [['Model', 'Destinator'], ['Trims', 'P Line, M Line, H Line'], ['Roof', 'Two-tone'], ['Wheels', 'Alloy']], Performance: [['Engine', '1.5L petrol'], ['Cylinders', '4'], ['Transmission', 'Automatic'], ['Drive', '2WD'], ['Power', TBC], ['Torque', TBC]], Safety: [['Braking', TBC], ['Stability', TBC], ['Airbags', TBC], ['Driver assist', TBC]], Comfort: [['Climate', TBC], ['Infotainment', TBC], ['Seating', TBC], ['Access', TBC]] },
    variants: [V('destinator-p', 'P Line', { img: 'assets/cars/destinator-p-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'SUV' }), V('destinator-m', 'M Line', { img: 'assets/cars/destinator-m-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'SUV' }), V('destinator-h', 'H Line', { img: 'assets/cars/destinator-m-line-red.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'SUV' })]
  },
  {
    slug: 'l200',
    views: { Interior: ['assets/img/interior/l200-1.webp', 'assets/img/interior/l200-2.webp'], Exterior: [{ src: 'assets/img/l200-ext.webp', pos: '89% 50%' }, 'assets/img/l200-hill.webp', 'assets/img/l200-intro.webp'] }, name: 'L200', kind: 'Pickup', accent: '#e8902a',
    tag: 'A rugged pickup built for work and adventure.',
    hero: 'assets/img/l200-intro.webp', photo2: 'assets/img/l200-ext.webp', cut: 'assets/cars/l200-glx-diesel.webp', cutAr: .426,
    intro: 'In pursuit of the ultimate toughness, the L200 pickup was put through rigorous tests. Being tough was not enough: it had to endure the harshest conditions.',
    stat: { v: '330', u: 'Nm', l: 'diesel torque (2.4L, GLX)' },
    labels: ['Double cab', 'Alloy wheels', 'LED tail lamps', 'Hill start assist'],
    features: [
      ['Toughness', 'Beyond tough', 'Engineered for the harshest conditions, with a 2442 cc diesel tuned for load-carrying and everyday strength.', 'assets/img/l200-beyond-tough.webp'],
      ['Space', 'Class-leading cabin', 'Travel comfortably in the double cab, with generous space and ergonomically designed, high-quality seating.', 'assets/img/web/L200-SCDC.jpg'],
      ['Control', 'Active safety', 'ABS with brake assist, ESP with traction control and hill start assist come with the GLX.', 'assets/img/l200-active-safety.webp'],
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
      V('l200-gl-p', '4WD GL Petrol Double Cabin', { img: 'assets/cars/l200-4wd-gl-petrol.webp', engine: '2.4L Petrol', trans: 'Manual', cyl: '4', drive: '4WD', fuel: 'Petrol', body: 'Double Cabin' }),
      V('l200-sportero', 'Sportero Diesel Double Cabin', { img: 'assets/cars/l200-sportero.png', engine: '2.4L Diesel', trans: 'Automatic', cyl: '4', drive: '4WD', fuel: 'Diesel', body: 'Double Cabin' })
    ]
  },
  {
    slug: 'outlander',
    views: { Interior: ['assets/img/interior/outlander-1.webp', 'assets/img/interior/outlander-2.webp', 'assets/img/outlander-choice.webp'], Exterior: ['assets/img/story-outlander.webp', 'assets/img/outlander-drive.webp', 'assets/img/drive.webp'] }, name: 'Outlander', kind: 'SUV', accent: '#c7ccd4',
    tag: 'An agile compact SUV for the city and the weekend.',
    hero: 'assets/img/story-outlander.webp', photo2: 'assets/img/drive.webp', cut: 'assets/cars/outlander-sport-h-line-hd.webp', cutAr: .382,
    intro: 'A sleek compact SUV profile with a sporty stance, offered as the Outlander Sport in P Line, H Line and M Line trims.',
    stat: { v: '3', l: 'trim levels: P, H and M Line' },
    labels: ['Compact SUV profile', 'Alloy wheels', 'Sporty stance', 'P / H / M Line'],
    features: [
      ['Agility', 'Compact and confident', 'A sleek compact SUV profile with a sporty stance, made for city streets and weekend trips.', 'assets/img/outlander-drive.webp'],
      ['Choice', 'Three trim lines', 'The Outlander Sport is offered in P Line, H Line and M Line.', 'assets/img/outlander-choice.webp'],
      ['Drive', '1.5L petrol, automatic', 'A four-cylinder 1.5L petrol engine with automatic transmission and two-wheel drive.', 'assets/img/drive.webp']
    ],
    specs: { Design: [['Model', 'Outlander Sport'], ['Trims', 'P Line, H Line, M Line'], ['Body', 'Compact SUV'], ['Wheels', 'Alloy']], Performance: [['Engine', '1.5L petrol'], ['Cylinders', '4'], ['Transmission', 'Automatic'], ['Drive', '2WD'], ['Power', TBC], ['Torque', TBC]], Safety: [['Braking', TBC], ['Stability', TBC], ['Airbags', TBC], ['Driver assist', TBC]], Comfort: [['Climate', TBC], ['Infotainment', TBC], ['Seating', TBC], ['Access', TBC]] },
    variants: [V('outlander-p', 'Outlander Sport P Line', { img: 'assets/cars/outlander-sport-p-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'Compact SUV' }), V('outlander-h', 'Outlander Sport H Line', { img: 'assets/cars/outlander-sport-h-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'Compact SUV' }), V('outlander-m', 'Outlander Sport M Line', { img: 'assets/cars/outlander-sport-m-line.webp', engine: '1.5L Petrol', trans: 'Automatic', cyl: '4', drive: '2WD', fuel: 'Petrol', body: 'Compact SUV' })]
  },
  {
    slug: 'xpander',
    views: { Interior: ['assets/img/interior/xpander-1.webp', 'assets/img/interior/xpander-2.webp'], Exterior: ['assets/img/xpander-drive.webp', 'assets/img/xpander-family.webp', 'assets/img/story-xpander.webp'] }, name: 'Xpander', kind: 'Family MPV', accent: '#ff4545',
    tag: 'A spacious family MPV with room for everyone.',
    hero: 'assets/img/story-xpander.webp', photo2: 'assets/img/story-xpander.webp', cut: 'assets/cars/xpander.webp', cutAr: .3505,
    intro: 'A practical, space-focused MPV with a tall roofline and a wide cabin for seven.',
    stat: { v: '7', l: 'seats for the whole family' },
    labels: ['Seven seats', 'Tall roofline', 'Wide cabin', 'Alloy wheels'],
    features: [
      ['Space', 'Room for seven', 'A practical, space-focused body with a tall roofline and wide cabin.', 'assets/img/xpander-drive.webp'],
      ['Family', 'Built around everyone', 'Seven seats make the Xpander the family vehicle of the range.', 'assets/img/xpander-family.webp']
    ],
    specs: { Design: [['Model', 'Xpander'], ['Body', 'MPV'], ['Seating', '7 seats'], ['Wheels', 'Alloy']], Performance: [['Engine', TBC], ['Power', TBC], ['Torque', TBC], ['Transmission', TBC], ['Drive', TBC], ['Fuel', TBC]], Safety: [['Braking', TBC], ['Stability', TBC], ['Airbags', TBC], ['Driver assist', TBC]], Comfort: [['Climate', TBC], ['Infotainment', TBC], ['Seating', '7 seats'], ['Access', TBC]] },
    variants: [V('xpander', 'Xpander', { img: 'assets/cars/xpander.webp', engine: TBC, trans: TBC, cyl: TBC, drive: TBC, fuel: TBC, body: 'MPV' })]
  },
  {
    slug: 'pajero-sport',
    views: { Interior: ['assets/img/interior/pajero-sport-1.webp', 'assets/img/interior/pajero-sport-2.webp'], Exterior: ['assets/img/pajero-banner.webp', 'assets/img/pajero-drive.webp', 'assets/img/pajero-turbo.webp'] }, name: 'Pajero Sport', kind: 'SUV', accent: '#3a7bd5',
    tag: 'A refined, powerful mid-size SUV built for the journey.',
    hero: 'assets/img/pajero-banner.webp', photo2: 'assets/img/pajero-drive.webp', cut: 'assets/cars/pajero-sport.webp', cutAr: .3925,
    intro: 'A mid-size SUV with a refined, powerful look, a 2.4L MIVEC turbo diesel and Super-Select 4WD-II.',
    stat: { v: '8', l: 'speed automatic transmission' },
    labels: ['Mid-size SUV', '2.4L turbo diesel', 'Super-Select 4WD-II', 'Alloy wheels'],
    features: [
      ['Presence', 'Elevate your journey', 'An updated front design with a higher bonnet line and chrome detailing gives the Pajero Sport a refined, powerful look.', 'assets/img/pajero-elevate.webp'],
      ['Drive', '2.4L turbo diesel, 8-speed automatic', 'A 2.4L MIVEC turbo diesel with an 8-speed automatic transmission. 4WD models add Super-Select 4WD-II with an off-road mode.', 'assets/img/pajero-turbo.webp']
    ],
    specs: { Design: [['Model', 'Pajero Sport'], ['Body', 'Mid-size SUV'], ['Theme', 'Elevate your Journey'], ['Wheels', 'Alloy']], Performance: [['Engine', '2.4L MIVEC turbo diesel'], ['Transmission', '8-speed automatic'], ['Drive', 'Super-Select 4WD-II (4WD models)'], ['Power', TBC], ['Torque', TBC]], Safety: [['Lane Change Assist', 'Yes'], ['Rear Cross Traffic Alert', 'Yes'], ['Braking', TBC], ['Airbags', TBC]], Comfort: [['Display audio', '8-inch Smartphone-Link'], ['Meter', '8-inch colour LCD'], ['Tailgate', 'Power, hands-free'], ['Climate', TBC]] },
    variants: [V('pajero-sport', 'Pajero Sport', { img: 'assets/cars/pajero-sport.webp', engine: '2.4L Turbo Diesel', trans: 'Automatic', cyl: TBC, drive: 'Super-Select 4WD-II', fuel: 'Diesel', body: 'Mid-size SUV' })]
  }
];
const ORDER = ['destinator', 'l200', 'outlander', 'xpander', 'pajero-sport'];

/* News & events (old live site) and the beta blog/news posts. Full article bodies were not available. */
const NEWS = [
  { id: 'l200-sportero', cat: 'News', title: 'Now Available: The New Mitsubishi L200 Sportero', date: '', img: 'assets/img/web/sportero-blog.jpg', ex: 'The new Sportero comes with several significant enhancements and is created on a whole new platform and chassis. This vehicle is therefore larger, more powerful, and better equipped, but is still more fuel efficient than the current model.', cta: 'Call us to find out more.' },
  { id: 'aria-week', cat: 'Event', title: 'Hot Off The Press! ARIA Week 2019 presented by Mitsubishi', date: 'November 14, 2019', img: 'assets/img/web/cq5dam.web_.1280.1280.jpeg', ex: 'The 2019 ARIA Week in Australia, the seventh edition, was presented by Mitsubishi ASX and ran from 14 November 2019 in the lead-up to the ARIA Awards.', body: ["ARIA Week is held every year in Australia in the lead-up to the ARIA Awards, run by the Australian Recording Industry Association. The 2019 edition, the seventh, was presented by Mitsubishi ASX and began on Thursday 14 November 2019, with support from the NSW Government.","## What was on","Most events took place in Sydney, with some in Newcastle, Byron Bay, Wagga Wagga and Griffith. Industry events included the ARIA Masterclass on 26 November, the Women In Music Breakfast on 19 November, the U2 Conference on 21 November, and a Producers BBQ.","Special events included Liquid Lunch Live on 22 November. Nova&rsquo;s Red Room series also ran live shows through the week, finishing with Tones and I on 29 November.","## About the sponsorship","This event was held in Australia and is not a Middle East Group event. It is listed here as part of Mitsubishi&rsquo;s worldwide brand activity."] },
  { id: 'pajero-sport', cat: 'News', title: 'Mitsubishi Motors Globally Debuts New Pajero Sport', date: 'July 25, 2019', img: 'assets/img/web/p_190725_m_1206_img_01.png', ex: 'Tokyo, July 25, 2019. Mitsubishi Motors Corporation today globally debuted the New Pajero Sport, mid-size SUV, in Thailand, and began its sales there. New Pajero Sport adopts a more refined, powerful appearance, complemented with a refreshed interior.', body: ["Mitsubishi Motors Corporation unveiled the new Pajero Sport, its mid-size SUV, on 25 July 2019 in Thailand, where sales began the same day. In some markets the model is sold as the Montero Sport.","## Where it is built and sold","The new Pajero Sport is built at the Laem Chabang plant of Mitsubishi Motors (Thailand). Mitsubishi planned to sell it in around 90 countries, including the Philippines and Australia. Sales of the previous model came to about 77,000 units worldwide in the 2018 fiscal year.","## Design","Under the theme &ldquo;Elevate your Journey&rdquo;, the new model has a more refined, powerful look. The front design is updated, with a higher bonnet line and chrome detailing.","## Powertrain","The Pajero Sport uses a 2.4L MIVEC turbo diesel engine with an 8-speed automatic transmission. 4WD models have the Super-Select 4WD-II system with an off-road mode.","## Technology and convenience","An 8-inch colour LCD meter and an 8-inch Smartphone-Link Display Audio unit come with the new model. A power tailgate with hands-free operation can also be controlled from a smartphone, and remote door-lock notifications are available. Inside, the floor console has been refreshed, there is a storage tray reachable from both sides, and a new AC power outlet has been added.","## Safety","Lane Change Assist and Rear Cross Traffic Alert are new additions to the model&rsquo;s safety equipment.","## More information","To see the Pajero Sport and other Mitsubishi models, or to ask about availability in Libya, contact the Middle East Group team on +218 918 804 961."] },
  { id: 'over-25-years', cat: 'News', title: 'Middle East Group: More Than 25 Years with Mitsubishi in Libya', date: '', img: 'assets/img/dev-desert.webp', pos: '85% 50%', ex: 'Middle East Group is one of Libya&rsquo;s leading automobile distributors, associated with Mitsubishi Motors Corporation for more than 25 years.' }
];
const BLOG = [
  { id: 'suv-lineup-2026', cat: 'Blog', title: 'Mitsubishi Expands Its SUV Lineup for 2026', date: 'July 2, 2026', img: 'assets/img/web/news1.jpg', ex: 'The latest from Mitsubishi on the expanding SUV lineup for 2026.' },
  { id: 'sedan-or-suv', cat: 'Blog', title: 'Choosing Between Mitsubishi Sedan and SUV: What Fits You Best?', date: 'June 25, 2026', img: 'assets/img/web/news2.jpg', ex: 'A guide to choosing the right model for your lifestyle.', body: ["Both body styles have strengths. The best choice depends on how and where you drive.","## When a sedan fits","A sedan suits mostly urban and highway driving. It is generally easier to park and comfortable on long, smooth roads, with a separate luggage compartment.","## When an SUV fits","An SUV gives a higher seating position and more space for passengers and cargo. It suits families, mixed road surfaces and anyone who wants more flexibility.","## Questions to ask yourself","How many people ride with you regularly? What do you carry? How rough are the roads you use? How important is the size when parking? Your answers usually point clearly to one style.","## See them for yourself","The best way to decide is to sit in both and take a test drive. Visit us or send an enquiry, and our team will help you compare the models in our range."] },
  { id: 'ownership-libya', cat: 'Blog', title: 'Why Mitsubishi Ownership Is a Smart Choice in Libya', date: 'June 8, 2026', img: 'assets/img/web/news3.jpg', ex: 'Why owning a Mitsubishi makes sense in Libya.' },
  { id: 'buying-tips', cat: 'Blog', title: 'Essential Tips Before Buying a New Mitsubishi', date: 'May 11, 2026', img: 'assets/img/web/news4.jpg', ex: 'What to check before you buy a new Mitsubishi.', body: ["Buying a new car is a big decision. A little preparation before you visit the showroom helps you choose the right model and avoid surprises later.","## Start with how you will use it","List your daily needs first: the length of your commute, how many people you carry, how much luggage or equipment you move, and whether you drive on rough roads. A compact SUV, a family model and a pickup each suit a different life.","## Set a realistic budget","Look beyond the price on the sticker. Fuel use, insurance, servicing and registration all add to the cost of owning a car, so decide what you can comfortably spend each month as well as at purchase.","## Compare the variants","Most models come in more than one trim. Compare the variants side by side, and check which features you will actually use against those you would be paying extra for. Our compare page shows the variants together.","## Take a test drive","Drive the car on roads you use every day. Check the seating position, visibility, boot or load space, and how it feels in traffic. Bring the people who will travel with you.","## Ask about the details","Ask about warranty cover, service intervals, the availability of genuine parts and what after-sales support is included. A clear answer to each of these tells you how well the car will be looked after.","Ready to start? Book a test drive or send us an enquiry, and our team will help you find the right Mitsubishi."] },
  { id: 'service-checklist', cat: 'Blog', title: 'A Simple Service Checklist to Keep Your Mitsubishi Running Well', date: '', img: 'assets/img/web/Mistubishi2-1.jpg', ex: 'Quick checks you can do between services to keep your vehicle reliable.', body: ["Regular servicing keeps a car safe and reliable, but a few simple checks between services help you spot problems early. None of these replaces a scheduled service at an authorised garage.","## Every week","Look at your tyres for uneven wear, cuts or bulges, and check the pressures when they are cold. Walk around the car and make sure all lights and indicators work.","## Every month","With the engine off and the car on level ground, check the engine oil and coolant levels. Top up the washer fluid and look at the wiper blades for splits or streaks.","## Listen and feel","New noises, a pull to one side, a soft brake pedal or a warning light on the dashboard are all signs to have the car checked. Do not wait for the next service when something changes.","## Keep the service record","Follow the service intervals in your owner&rsquo;s manual, and keep every service record. A complete history helps with warranty cover and is useful when you sell the car.","To book a service or ask about parts, contact our team."] },
  { id: 'genuine-parts', cat: 'Blog', title: 'Why Genuine Parts Matter for Your Mitsubishi', date: '', img: 'assets/img/web/facility4.jpeg', ex: 'What genuine parts mean for fit, performance and peace of mind.', body: ["When a car needs repair or routine maintenance, the parts you choose affect how it drives, how safe it is and how long it lasts.","## Made for your vehicle","Genuine Mitsubishi parts are designed for the vehicle they go into. That means a precise fit and the performance the car was engineered for, without the need for adjustment.","## Quality you can rely on","Genuine parts are made to the manufacturer&rsquo;s quality standards. For parts such as filters, brakes and electrical components, this matters for both safety and long-term reliability.","## Backed by a warranty","Parts bought through our counters and fitted at authorised service garages are covered by the manufacturer&rsquo;s warranty for material defects. Please ask our team for the full terms.","## Get expert advice","Not sure which part you need? Our parts team can help you identify the right one for your model. Use the parts page to send a request."] },
  { id: 'long-drive-prep', cat: 'Blog', title: 'Getting Your Pickup Ready for a Long Drive', date: '', img: 'assets/img/web/happy-jurney.jpg', ex: 'A short checklist to run through before a long journey.', body: ["A little preparation before a long journey makes the drive safer and more comfortable, especially in a pickup that may also be carrying a load.","## Check the vehicle","Check the tyre pressures, including the spare, and look at the tyre condition. Check the oil and coolant levels, the brakes and all lights. If a service is due, do it before you go.","## Pack carefully","Secure heavy items low and near the centre of the load area, and stay within the vehicle&rsquo;s stated load limit. Keep a first aid kit, a warning triangle, a torch, water and a phone charger within reach.","## Plan the route","Plan your fuel stops, and rest stops roughly every two hours. Tell someone your route and expected arrival time, and take a paper or offline map in case the signal drops.","## Drive for the conditions","Leave extra space for braking when loaded, keep a steady speed, and take a break if you feel tired. Reaching your destination safely matters more than the time you arrive."] }
];

const PARTS = [
  { n: 'Cabin air filter', d: 'Mitsubishi Motors Genuine Parts', img: 'assets/img/parts/cabin-air-filter.png' },
  { n: 'Evaporator cleaner', d: 'Mitsubishi Motors Genuine Chemicals', img: 'assets/img/parts/evaporator-cleaner.png' },
  { n: 'Engine parts', d: 'Genuine Mitsubishi engine parts', img: 'assets/img/parts/engine-parts.png' },
  { n: 'Electrical parts', d: 'Genuine Mitsubishi electrical parts', img: 'assets/img/parts/electrical-parts.png' },
  { n: 'Body parts', d: 'Genuine Mitsubishi body parts', img: 'assets/img/parts/body-parts.png' }
];

module.exports = { TBC, OFFICES, SOCIAL, MODELS, ORDER, NEWS, BLOG, PARTS };
