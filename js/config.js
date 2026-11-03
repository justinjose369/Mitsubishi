/**
 * Mitsubishi Motors Libya - site configuration.
 * Edit this file to change phone numbers, WhatsApp, enquiry destinations and social links.
 * All values below were taken from https://www.mitsubishi-motors.com.kw/en (contact page / footer / WhatsApp widget).
 */
window.MMK_CONFIG = {
  phone:        { display: '+218 918 804 961', tel: '+218918804961' },                    // Libya office (header call, contact section)
  whatsapp:     { number: '218918804961', text: 'Hello Mitsubishi Motors Libya, I would like to make an enquiry.' },   // ASSUMPTION: the Libya mobile number is used for WhatsApp; confirm it is WhatsApp-enabled
  partsPhone:   { display: '+218 925 818 264', tel: '+218925818264' },                            // Parts and Accessories
  serviceCentres: [
    { name: 'Al Rai',    tel: '+96522055985', display: '2205 5985' },
    { name: 'Fahaheel',  tel: '+96523923957', display: '2392 3957' },
    { name: 'Ahmadi',    tel: '+96523980533', display: '2398 0533' },
    { name: 'Jahra',     tel: '+96524565603', display: '2456 5603' }
  ],
  address: ['P O Box 5166, Swani Road', 'Al Fallah Street, Tripoli, Libya'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Swani+Road+Al+Fallah+Street+Tripoli+Libya',
  hours: [ ['Sunday – Thursday', '08:30 – 20:30'], ['Friday', '16:00 – 20:00'], ['Saturday', '08:30 – 20:30'] ],

  /**
   * Enquiry destination.
   *  - endpoint: URL that accepts a JSON POST (your CRM, a form service, a WordPress/CF7 REST route, etc.).
   *  - email:    no public enquiry e-mail address was found on the source site; add one to enable the mailto fallback.
   *  - If neither is set, the form falls back to a pre-filled WhatsApp message to the number above.
   */
  enquiry: { endpoint: '', email: '', fleetEmail: '' },

  social: {
    facebook:  'https://www.facebook.com/Mitsubishimotorskuwait/',
    instagram: 'https://www.instagram.com/mitsubishimotorskuwait/',
    x:         'https://twitter.com/MitsubishiKW',
    youtube:   'https://www.youtube.com/channel/UCmmrqYuWGnRX_Kd3g89V2Qg'
  },

  /**
   * Footer offices: address and phone numbers taken from
   * https://middleeastgrp.com/mitsubishi-libya-automotives-vehicle/
   */
  footerOffices: [
    { name: 'Libya', address: ['P O Box 5166, Swani Road', 'Al Fallah Street, Tripoli, Libya'],
      phones: [{ display: '+218 918 804 961', tel: '+218918804961' }, { display: '+218 925 818 264', tel: '+218925818264' }],
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Swani+Road+Al+Fallah+Street+Tripoli+Libya' },
    { name: 'Dubai head office', address: ['Baniyas Street, Al Masraf Tower', 'Office 1102, Dubai, UAE'],
      phones: [{ display: '+971 4 228 2211', tel: '+97142282211' }],
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Al+Masraf+Tower+Baniyas+Street+Dubai' }
  ],
  officialSite: 'https://www.mitsubishi-motors.com.kw'
};
