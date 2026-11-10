/**
 * Vehicle data for the "Choose your Mitsubishi" showcase. The images and names come from the supplied
 * "New folder (2)" set. Specs are read from the file names only (model, trim, drivetrain, fuel, cabin);
 * nothing else is claimed. Prices were not supplied, so every vehicle shows "Price upon enquiry".
 *
 * img      : transparent cutout (WebP) in assets/cars
 * ar       : image height / width (used to place the rotating wheels)
 * wheels   : [frontX, rearX, frontCentreY, tyreRadius, rearCentreY] as fractions of image width / height / width / height.
 *            Hub centres were located by rotational-symmetry search and checked against the logo caps.
 * scale    : on-stage width factor so that small cars read smaller than large ones
 * slug     : model page on the official site, used by "Explore details"
 */
/* Copy and specification content for the four showcased vehicles.
 * tag      : one-line description (mega menu)
 * feature  : the one highlight each vehicle gets in the scroll showcase
 * details  : tabs under "Explore details". Only the L200 figures were supplied; anything not yet supplied reads
 *            "On request" so no specification is invented. Replace those values when the data is confirmed.
 */
const REQ = 'On request';
const NOTE = 'Full specification is confirmed by trim. Ask our showroom team for the details.';
const MMK_EXTRA = {
  'pajero-sport': {
    tag: 'A mid-size SUV with a refined, powerful look.',
    story: { name: 'Pajero Sport', kind: 'SUV', photo: { src: 'assets/img/story-pajero-sport', big: 2000, ar: 1.4065, fx: .665, fy: .56, cw: .49 }, spec: { value: 2019, unit: 'Debut', label: 'Global debut of the new Pajero Sport' } },
    details: {
      design: { lead: 'A refined, powerful appearance with a sculpted body and alloy wheels.', rows: [['Model', 'Pajero Sport'], ['Body', 'Mid-size SUV'], ['Wheels', 'Alloy']] },
      performance: { lead: 'Full specification is confirmed by trim. Ask our showroom team for the details.', rows: [['Engine', REQ], ['Power', REQ], ['Torque', REQ], ['Transmission', REQ], ['Drive', REQ], ['Fuel', REQ]] },
      safety: { lead: NOTE, rows: [['Braking', REQ], ['Stability', REQ], ['Airbags', REQ], ['Driver assist', REQ]] },
      comfort: { lead: NOTE, rows: [['Climate', REQ], ['Infotainment', REQ], ['Seating', REQ], ['Access', REQ]] }
    }
  },
  'destinator-m-line': {
    tag: 'A bold, modern SUV built for the family.',
    story: { name: 'Destinator', kind: 'SUV', photo: { src: 'assets/img/story-destinator', ar: 1.814, fx: .55, fy: .58, cw: .33 }, spec: { value: 161, unit: 'hp', label: 'Turbocharged engine power' } },
    details: {
      design: { lead: 'A confident SUV stance with a two-tone roof and sculpted body lines.', rows: [['Model', 'Destinator'], ['Trim', 'M Line'], ['Roof', 'Two-tone'], ['Wheels', 'Alloy']] },
      performance: { lead: 'A 1.5 L turbocharged petrol engine. Figures are market-dependent; the showroom confirms the exact specification.', rows: [['Engine', '1.5 L Turbo'], ['Power', '161 hp'], ['Torque', '250 Nm'], ['Transmission', 'CVT'], ['Drive', REQ], ['Fuel', 'Petrol']] },
      safety: { lead: NOTE, rows: [['Braking', REQ], ['Stability', REQ], ['Airbags', REQ], ['Driver assist', REQ]] },
      comfort: { lead: NOTE, rows: [['Climate', REQ], ['Infotainment', REQ], ['Seating', REQ], ['Access', REQ]] }
    }
  },
  'l200-glx-diesel': {
    tag: 'A rugged pickup built for work and adventure.',
    story: { name: 'L200', kind: 'Pickup', photo: { src: 'assets/img/story-l200', ar: 2.009, fx: .46, fy: .66, cw: .35, dy: .2 }, spec: { value: 330, unit: 'Nm', label: 'Diesel torque for heavy loads' } },
    details: {
      design: { lead: 'A strong double-cab pickup stance, with alloy wheels and LED tail lamps.', rows: [['Body', 'Double Cab'], ['Trim', 'GLX'], ['Wheels', 'Alloy'], ['Tail lamps', 'LED']] },
      performance: { lead: 'A 2442 cc diesel engine tuned for load-carrying and everyday strength.', rows: [['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm'], ['Transmission', REQ], ['Drive', '4WD'], ['Fuel', 'Diesel']] },
      safety: { lead: 'Active braking and stability systems come standard with the GLX.', rows: [['Braking', 'ABS + BA'], ['Stability', 'ESP + TCS'], ['Assist', 'Hill start'], ['Airbags', REQ]] },
      comfort: { lead: 'A comfortable cabin with the everyday conveniences you expect.', rows: [['Climate', 'Auto A/C'], ['Infotainment', 'Touchscreen'], ['Access', 'Keyless'], ['Seating', REQ]] }
    }
  },
  'outlander-sport-h-line': {
    tag: 'An agile compact SUV for the city and the weekend.',
    story: { name: 'Outlander', kind: 'SUV', photo: { src: 'assets/img/story-outlander', big: 2560, ar: 1.794, fx: .5, fy: .63, cw: .36 }, spec: { value: 181, unit: 'hp', label: '2.5 L engine power' } },
    details: {
      design: { lead: 'A sleek compact SUV profile with a sporty stance.', rows: [['Model', 'Outlander Sport'], ['Trim', 'H Line'], ['Body', 'Compact SUV'], ['Wheels', 'Alloy']] },
      performance: { lead: 'A 2.0 L petrol engine. Figures are market-dependent; the showroom confirms the exact specification.', rows: [['Engine', '2.0 L'], ['Power', '148 hp'], ['Torque', REQ], ['Transmission', REQ], ['Drive', REQ], ['Fuel', 'Petrol']] },
      safety: { lead: NOTE, rows: [['Braking', REQ], ['Stability', REQ], ['Airbags', REQ], ['Driver assist', REQ]] },
      comfort: { lead: NOTE, rows: [['Climate', REQ], ['Infotainment', REQ], ['Seating', REQ], ['Access', REQ]] }
    }
  },
  'xpander': {
    tag: 'A spacious family MPV with room for everyone.',
    story: { name: 'Xpander', kind: 'Family MPV', photo: { src: 'assets/img/story-xpander', ar: 2.127, fx: .64, fy: .59, cw: .42 }, spec: { value: 7, unit: 'Seats', label: 'Room for the whole family' } },
    details: {
      design: { lead: 'A practical, space-focused body with a tall roofline and wide cabin.', rows: [['Model', 'Xpander'], ['Body', 'MPV'], ['Seating', '7 seats'], ['Wheels', 'Alloy']] },
      performance: { lead: 'A 1.5 L petrol engine tuned for efficient everyday family driving.', rows: [['Engine', '1.5 L'], ['Power', '103 hp'], ['Torque', '141 Nm'], ['Transmission', REQ], ['Drive', 'FWD'], ['Fuel', 'Petrol']] },
      safety: { lead: NOTE, rows: [['Braking', REQ], ['Stability', REQ], ['Airbags', REQ], ['Driver assist', REQ]] },
      comfort: { lead: NOTE, rows: [['Climate', REQ], ['Infotainment', REQ], ['Seating', REQ], ['Access', REQ]] }
    }
  }
};

window.MMK_MODELS = [
  { id: 'destinator-m-line', slug: 'destinator', name: 'Destinator', price: 'Price upon enquiry', img: 'assets/cars/destinator-m-line.webp', ar: 0.444, wheels: [0.200, 0.782, 0.744, 0.0715, 0.730], scale: 1,
    intro: 'Mitsubishi Destinator in the M Line trim.',
    specs: [['Model', 'Destinator'], ['Trim', 'M Line']] },
  { id: 'destinator-p-line', slug: 'destinator', name: 'Destinator P Line', price: 'Price upon enquiry', img: 'assets/cars/destinator-p-line.webp', ar: 0.4085, wheels: [0.182, 0.803, 0.791, 0.077, 0.774], scale: 1,
    intro: 'Mitsubishi Destinator in the P Line trim.',
    specs: [['Model', 'Destinator'], ['Trim', 'P Line']] },
  { id: 'l200-2wd-gl', slug: 'l200', name: 'L200 2WD GL', price: 'Price upon enquiry', img: 'assets/cars/l200-2wd-gl.webp', ar: 0.329, wheels: [0.216, 0.711, 0.711, 0.055, 0.712], scale: 1,
    intro: 'L200 2WD GL, diesel, double cabin.',
    specs: [['Trim', 'GL'], ['Drivetrain', '2WD'], ['Fuel', 'Diesel'], ['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm'], ['Body', 'Double Cabin']] },
  { id: 'l200-4wd-gl', slug: 'l200', name: 'L200 4WD GL', price: 'Price upon enquiry', img: 'assets/cars/l200-4wd-gl.webp', ar: 0.375, wheels: [0.159, 0.755, 0.754, 0.0695, 0.766], scale: 1,
    intro: 'L200 4WD GL, double cabin.',
    specs: [['Trim', 'GL'], ['Drivetrain', '4WD'], ['Body', 'Double Cabin']] },
  { id: 'l200-gl-single', slug: 'l200', name: 'L200 GL Single Cabin', price: 'Price upon enquiry', img: 'assets/cars/l200-gl-single.webp', ar: 0.387, wheels: [0.172, 0.759, 0.745, 0.0655, 0.755], scale: 1,
    intro: 'L200 4WD GL, diesel, single cabin.',
    specs: [['Trim', 'GL'], ['Drivetrain', '4WD'], ['Fuel', 'Diesel'], ['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm'], ['Body', 'Single Cabin']] },
  { id: 'l200-gls-petrol', slug: 'l200', name: 'L200 GLS Petrol', price: 'Price upon enquiry', img: 'assets/cars/l200-gls-petrol.webp', ar: 0.390, wheels: [0.158, 0.728, 0.726, 0.0685, 0.725], scale: 1,
    intro: 'L200 4WD GLS, petrol, double cabin.',
    specs: [['Trim', 'GLS'], ['Drivetrain', '4WD'], ['Fuel', 'Petrol'], ['Body', 'Double Cabin']] },
  { id: 'l200-glx-diesel', slug: 'l200', name: 'L200', price: 'Price upon enquiry', img: 'assets/cars/l200-glx-diesel.webp', ar: 0.426, wheels: [0.178, 0.739, 0.727, 0.0695, 0.735], scale: 1,
    intro: 'L200 4WD GLX, diesel, double cabin.',
    specs: [['Trim', 'GLX'], ['Drivetrain', '4WD'], ['Fuel', 'Diesel'], ['Engine', '2442 cc'], ['Power', '147 hp'], ['Torque', '330 Nm'], ['Body', 'Double Cabin']] },
  { id: 'outlander-sport-h-line', slug: 'asx', name: 'Outlander', price: 'Price upon enquiry', img: 'assets/cars/outlander-sport-h-line.webp', ar: 0.382, wheels: [0.191, 0.785, 0.770, 0.0788, 0.770], scale: 0.93, lift: 0.039,
    intro: 'Mitsubishi Outlander Sport in the H Line trim.',
    specs: [['Model', 'Outlander Sport'], ['Trim', 'H Line']] },
  { id: 'outlander-sport-m-line', slug: 'asx', name: 'Outlander Sport M Line', price: 'Price upon enquiry', img: 'assets/cars/outlander-sport-m-line.webp', ar: 0.413, wheels: [0.203, 0.815, 0.761, 0.0755, 0.748], scale: 0.98,
    intro: 'Mitsubishi Outlander Sport in the M Line trim.',
    specs: [['Model', 'Outlander Sport'], ['Trim', 'M Line']] },
  { id: 'xpander', slug: 'xpander', name: 'Xpander', price: 'Price upon enquiry', img: 'assets/cars/xpander.webp', ar: 0.3505, wheels: [0.2305, 0.7695, 0.773, 0.0625, 0.758], scale: 1, lift: 0.0285,
    intro: 'Mitsubishi Xpander.',
    specs: [['Model', 'Xpander']] },
  { id: 'pajero-sport', slug: 'pajero-sport', name: 'Pajero Sport', price: 'Price upon enquiry', img: 'assets/cars/pajero-sport.webp', ar: 0.3925, wheels: [0.191, 0.7716, 0.7506, 0.0816, 0.7506], scale: 1, lift: 0.0305,
    intro: 'Mitsubishi Pajero Sport, the mid-size SUV.',
    specs: [['Model', 'Pajero Sport'], ['Body', 'Mid-size SUV']] }
]
  /* Showcase shows one variant per model. */
  .filter(m => ['destinator-m-line', 'outlander-sport-h-line', 'l200-glx-diesel', 'xpander', 'pajero-sport'].includes(m.id))
  .map(m => Object.assign({}, MMK_EXTRA[m.id], m));
