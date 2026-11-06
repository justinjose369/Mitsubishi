/* Legal information pages. Each page is { file, title, desc, intro, sections: [{ h, p: [paragraph | { list: [...] }] }] }.
   Privacy Policy follows the text published on the Mitsubishi dev site. The other three are plain-language drafts based on
   the same site and its content; they should be reviewed by the company's legal team before launch. */
const PHONE = '+218 918 804 961';

const privacy = {
  file: 'privacy-policy.html', slug: 'privacy-policy', title: 'Privacy Policy',
  desc: 'How Mitsubishi Motors Libya collects, uses and protects your information.',
  intro: 'We value your privacy.',
  sections: [
    { h: 'Our commitment', p: [
      'Mitsubishi values your privacy. Mitsubishi collects information from our users at several different points on our website. Mitsubishi is the sole owner of the information collected on this site. We do not sell or rent this information to third parties. We only share this information with our authorized dealers, affiliates, and marketing partners contracted to provide services on our behalf (such as brochure fulfillment and customer communications).',
      'Mitsubishi uses two types of user information: anonymous information gathered from cookies and log files, and personal information voluntarily provided by users for specific services.'] },
    { h: 'Anonymous information: cookies and log files', p: [
      'A cookie is a small piece of data stored on your device that contains information about your interaction with our website. The use of cookies is not linked to your personal information unless you voluntarily provide that information.',
      'If you reject or delete cookies, you may still use our website; however, certain features and services may not function properly. For example, you may not receive notifications about special offers or be able to participate in promotions or contests. Cookies also enable us to analyze website usage and improve the overall user experience.',
      'Mitsubishi also maintains standard web server logs that may record information such as:',
      { list: ['The Internet domain from which you access our website.', 'Your IP address.', 'The type of browser and operating system you use.', 'The date and time of your visit.', 'The pages you view.', 'The referring website that directed you to our website.'] },
      'We use this information to improve our website, understand visitor behavior, identify popular content, and enhance the user experience. Although we generally do not attempt to identify individual users from these logs, we may use them to investigate security incidents or unauthorized activities. Where required, this information may be shared with law enforcement authorities in accordance with applicable laws.'] },
    { h: 'Volunteering personal information', p: [
      'You may voluntarily provide personal information such as your name, email address, phone number, and other contact details when requesting brochures, booking test drives, submitting inquiries, participating in surveys, contests, promotions, or subscribing to updates and special offers.',
      'If you no longer wish to receive promotional emails from Mitsubishi, you may unsubscribe by contacting us via email or through the contact information provided on our website.',
      'Mitsubishi does not sell or rent your personal information to third parties. We may share your information with our authorized dealers, affiliates, and trusted service providers only when necessary to provide requested services or fulfill business operations on our behalf. All information is handled in accordance with this Privacy Policy.',
      'If your personal information changes, you may request that we update or correct your information by contacting our customer support team.'] },
    { h: 'Security', p: [
      'Mitsubishi takes reasonable precautions to protect your personal information during transmission and after it is received.',
      'When sensitive information is submitted through secure forms, it is protected using industry-standard SSL (Secure Socket Layer) encryption technology.',
      'Once your information is received, we maintain appropriate administrative, technical, and physical safeguards to protect it against unauthorized access, alteration, disclosure, misuse, or destruction.',
      'Our website may contain links to third-party websites. Please note that Mitsubishi is not responsible for the privacy practices or content of those external websites. We encourage users to review the privacy policies of any third-party sites they visit.'] },
    { h: 'Notification of changes', p: [
      'Mitsubishi reserves the right to modify this Privacy Policy at any time. Any updates will be posted on this page so users remain informed about the information we collect, how we use it, and under what circumstances it may be disclosed.',
      'Any information collected will continue to be governed by the Privacy Policy that was in effect at the time the information was collected unless otherwise required by law.'] },
    { h: 'Certain disclosures', p: [
      'Mitsubishi may disclose personal or non-personal information to auditors, legal advisors, service providers, or other organizations performing services on behalf of Mitsubishi. Whenever practical, such parties will be required to protect the confidentiality of the information and use it only for the intended purpose.',
      'We may also disclose information when required by law, court order, subpoena, or other legal process.',
      'Additionally, we may disclose information where we reasonably believe it is necessary to:',
      { list: ['Protect the safety of an individual.', 'Protect public safety.', 'Protect the security, integrity, and reliability of Mitsubishi or this website.'] }] },
    { h: 'Children', p: [
      'Mitsubishi does not knowingly collect personal information from children under the age of 13. If we become aware that a child under 13 has submitted personal information through our website, we will promptly delete that information.'] },
    { h: 'Contact information', p: [
      `For any questions regarding this Privacy Policy or your personal information, please contact us through the Contact Us page on this website or call ${PHONE}.`,
      'You may also contact your nearest authorized Mitsubishi dealer for assistance regarding your privacy-related requests.'] }
  ]
};

const terms = {
  file: 'terms-and-conditions.html', slug: 'terms-and-conditions', title: 'Terms and Conditions',
  desc: 'The terms that apply when you use the Mitsubishi Motors Libya website.',
  intro: 'Please read these terms before using this website.',
  sections: [
    { h: '1. Introduction', p: [
      'These Terms and Conditions apply to your use of this website. By using the website you agree to them. If you do not agree, please do not use the website.'] },
    { h: '2. Your use of the website', p: [
      'You may use this website for your own personal, lawful purposes, to learn about Mitsubishi vehicles, genuine parts and services, and to contact us. You agree not to misuse the website, interfere with its operation, attempt unauthorized access, or submit false or misleading information.'] },
    { h: '3. Vehicle information, prices and availability', p: [
      'We take care to keep the information on this website accurate, but specifications, equipment, colours, availability and prices can change without notice and may vary by market. Where a figure is not shown, it is being confirmed or is available on request.',
      'Photographs and illustrations are for guidance only and may show equipment or finishes that are not part of every vehicle. Please confirm details with our team or an authorized Mitsubishi dealer before you decide to buy.'] },
    { h: '4. Enquiries and information you send us', p: [
      'When you send an enquiry, request a brochure or contact us through the website, please give accurate details so that we can reply. How we handle your information is described in our Privacy Policy.',
      'Sending an enquiry does not create an order or a binding agreement to supply a vehicle, parts or services.'] },
    { h: '5. Intellectual property', p: [
      'The Mitsubishi name, the three-diamond logo and related names, images and designs are trademarks or protected works of Mitsubishi Motors Corporation and its licensors. The content of this website is provided for your personal, non-commercial use. You may not copy, republish, or use it for other purposes without written permission.'] },
    { h: '6. Links to other websites', p: [
      'This website may link to websites run by other organizations. We do not control those websites and are not responsible for their content or their privacy practices.'] },
    { h: '7. Limits of responsibility', p: [
      'The website and its content are provided on an "as is" basis. To the extent permitted by law, we are not liable for any loss arising from the use of, or inability to use, the website, or from reliance on the information it contains.'] },
    { h: '8. Changes to these terms', p: [
      'We may update these Terms and Conditions from time to time. The updated version will be published on this page and applies from the time it is posted.'] },
    { h: '9. Contact', p: [
      `If you have a question about these terms, please use the Contact Us page or call ${PHONE}.`] }
  ]
};

const dataProtection = {
  file: 'data-protection.html', slug: 'data-protection', title: 'Data Protection',
  desc: 'How Mitsubishi Motors Libya looks after the personal data you share with us.',
  intro: 'How we look after the information you share with us.',
  sections: [
    { h: 'What we collect', p: [
      'We collect the personal details you choose to give us, such as your name, email address, phone number and the vehicle or service you are asking about, when you send an enquiry, request a brochure, ask about parts, or contact our fleet team.',
      'We also collect basic technical information about visits to the website, such as browser type, pages viewed and the date and time of the visit, so that we can keep the website secure and improve it.'] },
    { h: 'How we use it', p: [
      'We use your details to answer your enquiry, provide the brochures, parts information or services you ask for, and, if you ask us to, keep you updated about vehicles and offers.',
      'We do not sell or rent your personal information.'] },
    { h: 'Who we share it with', p: [
      'We only share personal information with authorized Mitsubishi dealers, affiliates and service providers when this is needed to deal with your request, or where the law requires it.'] },
    { h: 'How we protect it', p: [
      'We use reasonable administrative, technical and physical safeguards to protect your information against unauthorized access, alteration, disclosure or loss.'] },
    { h: 'Your choices', p: [
      'You can ask us to update or correct the personal information we hold about you, and you can ask us to stop sending you promotional messages at any time.',
      `To make a request, please use the Contact Us page or call ${PHONE}.`] },
    { h: 'More information', p: [
      'Our Privacy Policy gives more detail about cookies, log files and how we handle information. Please read it together with this page.'] }
  ]
};

const disclaimer = {
  file: 'legal-disclaimer.html', slug: 'legal-disclaimer', title: 'Legal Disclaimer',
  desc: 'Important information about the content of the Mitsubishi Motors Libya website.',
  intro: 'Important information about the content of this website.',
  sections: [
    { h: 'General information only', p: [
      'The content of this website is provided for general information about Mitsubishi vehicles, genuine parts and services in Libya. It is not an offer to sell, a quotation, or a contract.'] },
    { h: 'Specifications, equipment and prices', p: [
      'Vehicle specifications, equipment, colours, availability and prices may change at any time and can differ by model, variant and market. Prices are available on enquiry. Where a figure is shown as "On request", it is being confirmed.',
      'Please confirm the details of any vehicle with our team or an authorized Mitsubishi dealer before you decide to buy.'] },
    { h: 'Images and illustrations', p: [
      'Photographs, renderings and illustrations are for guidance. Vehicles shown may include optional or regional equipment, special finishes or driving conditions that are not part of the vehicle you buy. Images are not a guarantee of how a vehicle looks or performs.'] },
    { h: 'No warranty', p: [
      'We work to keep this website accurate and up to date, but we give no warranty that the information is complete or free of errors. To the extent permitted by law, we accept no liability for loss resulting from reliance on the content of this website.'] },
    { h: 'Links to other websites', p: [
      'Links to websites run by other organizations are provided for convenience. We do not control those websites and are not responsible for their content.'] },
    { h: 'Trademarks', p: [
      'Mitsubishi, the three-diamond logo and related names and designs are trademarks of Mitsubishi Motors Corporation. All other names belong to their owners.'] },
    { h: 'Questions', p: [
      `If you have a question about this disclaimer, please use the Contact Us page or call ${PHONE}.`] }
  ]
};

module.exports = { LEGAL: [privacy, terms, dataProtection, disclaimer] };
