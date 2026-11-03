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
window.MMK_MODELS = [
  { id: 'destinator-m-line', slug: 'destinator', name: 'Destinator M Line', price: 'Price upon enquiry', img: 'assets/cars/destinator-m-line.webp', ar: 0.444, wheels: [0.200, 0.782, 0.744, 0.0715, 0.730], scale: 1,
    intro: 'Mitsubishi Destinator in the M Line trim.',
    specs: [['Model', 'Destinator'], ['Trim', 'M Line']] },
  { id: 'destinator-p-line', slug: 'destinator', name: 'Destinator P Line', price: 'Price upon enquiry', img: 'assets/cars/destinator-p-line.webp', ar: 0.379, wheels: [0.240, 0.760, 0.736, 0.0585, 0.723], scale: 1,
    intro: 'Mitsubishi Destinator in the P Line trim.',
    specs: [['Model', 'Destinator'], ['Trim', 'P Line']] },
  { id: 'l200-2wd-gl', slug: 'l200', name: 'L200 2WD GL', price: 'Price upon enquiry', img: 'assets/cars/l200-2wd-gl.webp', ar: 0.329, wheels: [0.216, 0.711, 0.711, 0.055, 0.712], scale: 1,
    intro: 'L200 2WD GL, diesel, double cabin.',
    specs: [['Trim', 'GL'], ['Drivetrain', '2WD'], ['Fuel', 'Diesel'], ['Body', 'Double Cabin']] },
  { id: 'l200-4wd-gl', slug: 'l200', name: 'L200 4WD GL', price: 'Price upon enquiry', img: 'assets/cars/l200-4wd-gl.webp', ar: 0.375, wheels: [0.159, 0.755, 0.754, 0.0695, 0.766], scale: 1,
    intro: 'L200 4WD GL, double cabin.',
    specs: [['Trim', 'GL'], ['Drivetrain', '4WD'], ['Body', 'Double Cabin']] },
  { id: 'l200-gl-single', slug: 'l200', name: 'L200 GL Single Cabin', price: 'Price upon enquiry', img: 'assets/cars/l200-gl-single.webp', ar: 0.387, wheels: [0.172, 0.759, 0.745, 0.0655, 0.755], scale: 1,
    intro: 'L200 4WD GL, diesel, single cabin.',
    specs: [['Trim', 'GL'], ['Drivetrain', '4WD'], ['Fuel', 'Diesel'], ['Body', 'Single Cabin']] },
  { id: 'l200-gls-petrol', slug: 'l200', name: 'L200 GLS Petrol', price: 'Price upon enquiry', img: 'assets/cars/l200-gls-petrol.webp', ar: 0.390, wheels: [0.158, 0.728, 0.726, 0.0685, 0.725], scale: 1,
    intro: 'L200 4WD GLS, petrol, double cabin.',
    specs: [['Trim', 'GLS'], ['Drivetrain', '4WD'], ['Fuel', 'Petrol'], ['Body', 'Double Cabin']] },
  { id: 'l200-glx-diesel', slug: 'l200', name: 'L200 GLX Diesel', price: 'Price upon enquiry', img: 'assets/cars/l200-glx-diesel.webp', ar: 0.426, wheels: [0.178, 0.739, 0.727, 0.0695, 0.735], scale: 1,
    intro: 'L200 4WD GLX, diesel, double cabin.',
    specs: [['Trim', 'GLX'], ['Drivetrain', '4WD'], ['Fuel', 'Diesel'], ['Body', 'Double Cabin']] },
  { id: 'outlander-sport-h-line', slug: 'asx', name: 'Outlander Sport H Line', price: 'Price upon enquiry', img: 'assets/cars/outlander-sport-h-line.webp', ar: 0.423, wheels: [0.212, 0.818, 0.698, 0.0775, 0.698], scale: 0.96,
    intro: 'Mitsubishi Outlander Sport in the H Line trim.',
    specs: [['Model', 'Outlander Sport'], ['Trim', 'H Line']] },
  { id: 'outlander-sport-m-line', slug: 'asx', name: 'Outlander Sport M Line', price: 'Price upon enquiry', img: 'assets/cars/outlander-sport-m-line.webp', ar: 0.413, wheels: [0.203, 0.815, 0.761, 0.0755, 0.748], scale: 0.98,
    intro: 'Mitsubishi Outlander Sport in the M Line trim.',
    specs: [['Model', 'Outlander Sport'], ['Trim', 'M Line']] }
].map(m => Object.assign({ url: 'https://www.mitsubishi-motors.com.kw/en/cars/' + m.slug }, m));