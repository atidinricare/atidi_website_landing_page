// Treatments Seed Data
// All 24 dental treatments with complete details

export interface TreatmentSeedData {
  id: string
  name: string
  shortName: string
  category: string
  icon: string
  tagline: string
  description: string
  usaPrice: { min: number; max: number }
  indiaPrice: { min: number; max: number }
  savingsPercent: number
  procedure: Array<{
    step: number
    title: string
    description: string
  }>
  materials: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
  featured: boolean
  opensInNewTab: boolean
}

export const treatmentsData: TreatmentSeedData[] = [
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    shortName: 'Implants',
    category: 'Implantology',
    icon: 'Smile',
    tagline: 'Permanent tooth replacement',
    description: 'Dental implants are titanium posts surgically placed into the jawbone to replace missing teeth. They provide a strong foundation for fixed or removable replacement teeth.',
    usaPrice: { min: 3000, max: 5000 },
    indiaPrice: { min: 500, max: 800 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Initial Consultation',
        description: 'Comprehensive dental examination, X-rays, and CBCT scan to assess bone density and plan implant placement.',
      },
      {
        step: 2,
        title: 'Implant Placement',
        description: 'Titanium implant post is surgically placed into the jawbone under local anesthesia. The procedure takes 30-60 minutes per implant.',
      },
      {
        step: 3,
        title: 'Healing Period',
        description: 'Osseointegration occurs over 3-6 months as the bone fuses with the implant. Temporary crown may be placed.',
      },
      {
        step: 4,
        title: 'Final Crown',
        description: 'Custom-made porcelain or zirconium crown is attached to the implant, completing your new permanent tooth.',
      },
    ],
    materials: [
      'Nobel Biocare implants (Swiss)',
      'Straumann implants (Swiss)',
      'Alpha Bio',
      'Adin',
      'Noris',
      'AB Dent',
      'Osstem',
      'Dentium',
      'Dio',
      'Dentsply Sirona',
      'Zirconia or porcelain crowns',
      'Titanium Grade 4/5',
    ],
    faqs: [
      {
        question: 'How long do dental implants last?',
        answer: 'With proper care, dental implants can last a lifetime. The crown may need replacement after 10-15 years.',
      },
      {
        question: 'Is the procedure painful?',
        answer: 'The procedure is performed under local anesthesia and is virtually painless. Post-operative discomfort is manageable with prescribed medication.',
      },
      {
        question: 'Can I get implants if I have bone loss?',
        answer: 'Yes, bone grafting procedures can rebuild the jawbone to support implants. We evaluate each case individually.',
      },
      {
        question: 'Whom should I contact if I have any inconvenience after the procedure?',
        answer: 'You can reach our care managers 24/7 who will coordinate with the treating doctor and our partner network to address any concerns promptly.',
      },
      {
        question: 'After implant placement, do I get post operative care back in USA?',
        answer: 'Yes, we have a partner clinic network across 10 US states that provides follow-up and post-operative care after your implant placement in India.',
      },
    ],
    featured: true,
    opensInNewTab: true,
  },
  {
    id: 'root-canal',
    name: 'Root Canal Treatment',
    shortName: 'Root Canal',
    category: 'Endodontics',
    icon: 'Zap',
    tagline: 'Save your natural tooth',
    description: 'Root canal treatment involves removing infected pulp from inside the tooth, cleans and disinfects the canal, then fills and seals it to prevent reinfection.',
    usaPrice: { min: 1000, max: 1500 },
    indiaPrice: { min: 150, max: 300 },
    savingsPercent: 75,
    procedure: [
      {
        step: 1,
        title: 'Diagnosis & X-ray',
        description: 'Digital X-ray to assess infection extent and root canal anatomy.',
      },
      {
        step: 2,
        title: 'Access Opening',
        description: 'Local anesthesia administered, then access is created to reach the infected pulp chamber.',
      },
      {
        step: 3,
        title: 'Canal Cleaning',
        description: 'Infected pulp is removed and canals shaped by using rotary instruments. Canals are cleaned with antimicrobial solutions.',
      },
      {
        step: 4,
        title: 'Filling & Crown',
        description: 'Cleaned canals are filled with biocompatible material. A crown is placed to protect the tooth.',
      },
    ],
    materials: [
      'Rotary Ni-Ti instruments',
      'Biocompatible gutta-percha',
      'Dental microscope assisted',
      'Digital X-ray imaging',
    ],
    faqs: [
      {
        question: 'Is root canal painful?',
        answer: 'Modern root canal treatment is no more painful than getting a filling. We use effective anesthesia and advanced techniques.',
      },
      {
        question: 'How long does the treatment take?',
        answer: 'Most of the RCTs are completed in a single sitting within 60 to 90 minutes. In some cases it takes more than one sitting.',
      },
    ],
    featured: true,
    opensInNewTab: true,
  },
  {
    id: 'dental-veneers',
    name: 'Dental Veneers',
    shortName: 'Veneers',
    category: 'Cosmetic',
    icon: 'Sparkles',
    tagline: 'Transform your smile',
    description: 'Porcelain veneers are thin, custom-made shells that cover the front surface of teeth to improve appearance. They can change tooth color, shape, size, and length.',
    usaPrice: { min: 1000, max: 2500 },
    indiaPrice: { min: 200, max: 400 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Smile Design',
        description: 'Digital smile design consultation to plan your ideal smile. Mock-ups created to visualize results.',
      },
      {
        step: 2,
        title: 'Preparation',
        description: 'Minimal tooth preparation (0.3-0.5mm). Impressions taken for custom veneer fabrication.',
      },
      {
        step: 3,
        title: 'Temporary Veneers',
        description: 'Temporary veneers placed while permanent ones are crafted in our lab.',
      },
      {
        step: 4,
        title: 'Final Bonding',
        description: 'Permanent veneers are bonded using special adhesive. Adjustments made for perfect fit and bite.',
      },
    ],
    materials: [
      'E-max porcelain (Germany)',
      'Zirconia veneers',
      'Digital CAD/CAM design',
      'Ivoclar bonding systems',
    ],
    faqs: [
      {
        question: 'How long do veneers last?',
        answer: 'With proper care, porcelain veneers can last 10-15 years or more.',
      },
      {
        question: 'Do veneers look natural?',
        answer: 'Yes, modern veneers are crafted to match natural teeth in color, translucency, and shape.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'full-mouth-makeover',
    name: 'Full Mouth Makeover',
    shortName: 'Smile Makeover',
    category: 'Comprehensive',
    icon: 'Star',
    tagline: 'Complete smile transformation',
    description: 'A comprehensive treatment plan combining multiple procedures to achieve optimal oral health and aesthetics. Customized for each patient\'s unique needs.',
    usaPrice: { min: 15000, max: 50000 },
    indiaPrice: { min: 3000, max: 10000 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Comprehensive Assessment',
        description: 'Full oral examination, digital X-rays, 3D scans, and smile analysis.',
      },
      {
        step: 2,
        title: 'Treatment Planning',
        description: 'Customized treatment plan with digital smile design preview and cost breakdown.',
      },
      {
        step: 3,
        title: 'Foundation Work',
        description: 'Address any underlying issues: extractions, root canals, gum treatment.',
      },
      {
        step: 4,
        title: 'Restoration',
        description: 'Implants, crowns, veneers, or bridges placed according to plan.',
      },
    ],
    materials: [
      'Multiple premium materials',
      'Customized per treatment',
      'International brand implants',
      'High-grade ceramics',
    ],
    faqs: [
      {
        question: 'How is the treatment plan created?',
        answer: 'We use digital smile design software to create a customized plan based on your facial features, preferences, and oral health needs.',
      },
      {
        question: 'Can I see the results before treatment?',
        answer: 'Yes, we provide digital mock-ups and temporary restorations so you can preview your new smile.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening',
    shortName: 'Whitening',
    category: 'Cosmetic',
    icon: 'Sun',
    tagline: 'Brighten your smile',
    description: 'Professional teeth whitening using advanced laser or LED technology to remove stains and brighten your smile by up to 8 shades.',
    usaPrice: { min: 500, max: 1000 },
    indiaPrice: { min: 100, max: 200 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Shade Assessment',
        description: 'Initial shade recorded and target shade discussed.',
      },
      {
        step: 2,
        title: 'Preparation',
        description: 'Gums and lips protected with barriers.',
      },
      {
        step: 3,
        title: 'Whitening Application',
        description: 'Professional whitening gel applied and activated with LED/laser.',
      },
      {
        step: 4,
        title: 'Final Assessment',
        description: 'Results evaluated, aftercare instructions provided.',
      },
    ],
    materials: [
      'Philips Zoom whitening',
      'Professional-grade peroxide gels',
      'LED/laser activation',
    ],
    faqs: [
      {
        question: 'How white will my teeth get?',
        answer: 'Results vary, but most patients achieve 4-8 shades lighter. We\'ll discuss realistic expectations.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'dental-crowns',
    name: 'Dental Crowns',
    shortName: 'Crowns',
    category: 'Restorative',
    icon: 'Crown',
    tagline: 'Restore damaged teeth',
    description: 'Custom-made caps that cover damaged or weakened teeth, restoring their shape, size, strength, and appearance.',
    usaPrice: { min: 1000, max: 1500 },
    indiaPrice: { min: 150, max: 300 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Tooth Preparation',
        description: 'Tooth is shaped to accommodate the crown. Impressions taken.',
      },
      {
        step: 2,
        title: 'Temporary Crown',
        description: 'Temporary crown placed while permanent one is fabricated.',
      },
      {
        step: 3,
        title: 'Crown Fabrication',
        description: 'Custom crown created in dental lab using CAD/CAM technology.',
      },
      {
        step: 4,
        title: 'Final Placement',
        description: 'Permanent crown cemented. Bite and fit adjusted.',
      },
    ],
    materials: [
      'E-max porcelain',
      'Zirconia',
      'PFM (Porcelain fused to metal)',
      'Full gold (optional)',
    ],
    faqs: [
      {
        question: 'Which crown material is best?',
        answer: 'Zirconia and E-max are most popular for their strength and aesthetics. We\'ll recommend based on tooth location.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'orthodontics',
    name: 'Orthodontic Treatment',
    shortName: 'Braces/Aligners',
    category: 'Orthodontics',
    icon: 'AlignCenter',
    tagline: 'Straighten your teeth',
    description: 'Comprehensive orthodontic treatment using traditional braces or clear aligners to correct misalignment, crowding, and bite issues.',
    usaPrice: { min: 4000, max: 8000 },
    indiaPrice: { min: 800, max: 2000 },
    savingsPercent: 75,
    procedure: [
      {
        step: 1,
        title: 'Records & Planning',
        description: 'X-rays, photos, and impressions taken. Treatment plan created.',
      },
      {
        step: 2,
        title: 'Appliance Placement',
        description: 'Braces fitted or aligners provided with instructions.',
      },
      {
        step: 3,
        title: 'Adjustment Phase',
        description: 'Regular adjustments (can be done via partner network in USA).',
      },
      {
        step: 4,
        title: 'Retention',
        description: 'Retainers provided to maintain results.',
      },
    ],
    materials: [
      'Metal braces (3M)',
      'Ceramic braces',
      'Clear aligners (similar to Invisalign)',
      'Lingual braces (hidden)',
    ],
    faqs: [
      {
        question: 'Can I continue treatment in the USA?',
        answer: 'Yes, we coordinate with partner orthodontists for ongoing adjustments and monitoring.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'invisalign-aligners',
    name: 'Invisalign/Aligners',
    shortName: 'Aligners',
    category: 'Orthodontics',
    icon: 'AlignCenter',
    tagline: 'Clear aligners for a perfect smile',
    description: 'Advanced digital orthodontic treatment using clear aligners to correct mild to severe misalignment, crowding, and bite issues. Most advanced and patient friendly treatment with maximum comfort.',
    usaPrice: { min: 3000, max: 7000 },
    indiaPrice: { min: 600, max: 1500 },
    savingsPercent: 78,
    procedure: [
      {
        step: 1,
        title: 'Records & Planning',
        description: 'X-rays, photos, and digital impressions taken. Treatment plan created.',
      },
      {
        step: 2,
        title: 'Aligners Providing',
        description: 'Aligners provided with instructions.',
      },
      {
        step: 3,
        title: 'Adjustment Phase',
        description: 'Fixing missing attachments can be done via partner network in USA.',
      },
    ],
    materials: [
      'Invisalign (Lite/Moderate/Comprehensive)',
      'ClearCorrect',
      'Dentcare Aligners',
      'Illusion Orthodontics',
      'Dezy',
      '32 Watts Clear Aligners',
      'Snazzy',
    ],
    faqs: [
      {
        question: 'Are aligners only for minor corrections?',
        answer: 'No, we can use aligners in any conditions — mild to severe malocclusion cases.',
      },
      {
        question: 'Is there any age limit to use aligners?',
        answer: 'No, anyone at any age can use aligners — from 7 to 70 years.',
      },
      {
        question: 'Any time limit to wear them in a day?',
        answer: 'For better results you can use them for 16 to 18 hours a day. At the same time, you can remove them whenever you need to.',
      },
    ],
    featured: true,
    opensInNewTab: true,
  },
  {
    id: 'gum-treatment',
    name: 'Gum Treatment',
    shortName: 'Periodontics',
    category: 'Periodontics',
    icon: 'Heart',
    tagline: 'Healthy gums, healthy smile',
    description: 'Treatment for gum disease ranging from deep cleaning (scaling and root planing) to surgical interventions for advanced periodontitis.',
    usaPrice: { min: 500, max: 3000 },
    indiaPrice: { min: 100, max: 600 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Assessment',
        description: 'Periodontal probing, X-rays to assess bone loss.',
      },
      {
        step: 2,
        title: 'Deep Cleaning',
        description: 'Scaling and root planing to remove tartar and bacteria.',
      },
      {
        step: 3,
        title: 'Surgery (if needed)',
        description: 'Flap surgery, bone grafting, or tissue regeneration.',
      },
      {
        step: 4,
        title: 'Maintenance',
        description: 'Regular maintenance cleanings and monitoring.',
      },
    ],
    materials: [
      'Ultrasonic scalers',
      'Bone graft materials',
      'Guided tissue regeneration membranes',
    ],
    faqs: [
      {
        question: 'Is gum disease reversible?',
        answer: 'Early gum disease (gingivitis) is reversible. Advanced periodontitis can be managed but requires ongoing care.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'dental-bridges',
    name: 'Dental Bridges',
    shortName: 'Bridges',
    category: 'Restorative',
    icon: 'Link',
    tagline: 'Bridge the gap beautifully',
    description: 'Fixed dental prosthetic that replaces one or more missing teeth by anchoring to adjacent teeth or implants.',
    usaPrice: { min: 2000, max: 5000 },
    indiaPrice: { min: 400, max: 1000 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Preparation',
        description: 'Adjacent teeth are prepared to serve as anchors for the bridge.',
      },
      {
        step: 2,
        title: 'Impressions',
        description: 'Digital impressions taken for precise bridge fabrication.',
      },
      {
        step: 3,
        title: 'Temporary Bridge',
        description: 'Temporary bridge placed while permanent one is crafted.',
      },
      {
        step: 4,
        title: 'Final Placement',
        description: 'Permanent bridge cemented and adjusted for perfect fit.',
      },
    ],
    materials: [
      'Zirconia bridges',
      'Porcelain-fused-to-metal',
      'All-ceramic options',
    ],
    faqs: [
      {
        question: 'How many teeth can a bridge replace?',
        answer: 'A bridge can replace 1-4 missing teeth, depending on the supporting teeth and bone structure.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'all-on-4',
    name: 'All-on-4 Implants',
    shortName: 'All-on-4',
    category: 'Comprehensive',
    icon: 'Grid',
    tagline: 'Full arch in one day',
    description: 'Revolutionary technique to replace an entire arch of teeth using just 4 strategically placed implants, often with same-day teeth.',
    usaPrice: { min: 20000, max: 35000 },
    indiaPrice: { min: 4000, max: 7000 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: '3D Planning',
        description: 'CT scan and digital planning for precise implant placement.',
      },
      {
        step: 2,
        title: 'Implant Surgery',
        description: '4 implants placed at strategic angles for maximum support.',
      },
      {
        step: 3,
        title: 'Same-Day Teeth',
        description: 'Temporary fixed teeth attached on the same day.',
      },
      {
        step: 4,
        title: 'Final Prosthesis',
        description: 'Permanent hybrid denture fitted after healing (3-6 months).',
      },
    ],
    materials: [
      'Nobel Biocare All-on-4 system',
      'Titanium implants',
      'Hybrid denture (acrylic/zirconia)',
    ],
    faqs: [
      {
        question: 'Can I get teeth the same day?',
        answer: 'Yes, most patients receive a temporary fixed prosthesis on the same day as implant surgery.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'wisdom-teeth',
    name: 'Wisdom Teeth Removal',
    shortName: 'Extractions',
    category: 'Oral Surgery',
    icon: 'Scissors',
    tagline: 'Pain-free extraction',
    description: 'Safe and comfortable removal of impacted or problematic wisdom teeth using modern surgical techniques.',
    usaPrice: { min: 300, max: 800 },
    indiaPrice: { min: 50, max: 150 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'X-ray Assessment',
        description: 'Panoramic X-ray (OPG) or CBCT to evaluate tooth position and roots.',
      },
      {
        step: 2,
        title: 'Anesthesia',
        description: 'Local anesthesia or sedation as needed for comfort.',
      },
      {
        step: 3,
        title: 'Extraction',
        description: 'Tooth removed using minimally invasive techniques.',
      },
      {
        step: 4,
        title: 'Recovery',
        description: 'Post-op care instructions and follow-up check.',
      },
    ],
    materials: [
      'Modern surgical instruments',
      'Dissolvable sutures',
      'Sedation options available',
    ],
    faqs: [
      {
        question: 'Is wisdom tooth removal painful?',
        answer: 'The procedure itself is painless due to anesthesia. Post-operative discomfort is manageable with medication.',
      },
    ],
    featured: true,
    opensInNewTab: true,
  },
  {
    id: 'smile-design',
    name: 'Digital Smile Design',
    shortName: 'DSD',
    category: 'Cosmetic',
    icon: 'Palette',
    tagline: 'Preview your perfect smile',
    description: 'Advanced digital planning that allows you to see your new smile before treatment begins, ensuring predictable and stunning results.',
    usaPrice: { min: 500, max: 1500 },
    indiaPrice: { min: 100, max: 300 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Photography & Scans',
        description: 'High-resolution photos and 3D scans of your face and teeth.',
      },
      {
        step: 2,
        title: 'Digital Design',
        description: 'Your ideal smile is designed using advanced software.',
      },
      {
        step: 3,
        title: 'Preview',
        description: 'See your new smile in video and try temporary mock-ups.',
      },
      {
        step: 4,
        title: 'Treatment Plan',
        description: 'Detailed plan created to achieve your designed smile.',
      },
    ],
    materials: [
      'DSD software',
      'Facial analysis tools',
      'Mock-up materials',
    ],
    faqs: [
      {
        question: 'Is DSD only for cosmetic cases?',
        answer: 'While popular for cosmetic work, DSD can be used for any treatment requiring precise planning and visualization.',
      },
    ],
    featured: true,
    opensInNewTab: true,
  },
  {
    id: 'dentures',
    name: 'Dentures',
    shortName: 'Dentures',
    category: 'Restorative',
    icon: 'Smile',
    tagline: 'Comfortable, natural-looking dentures',
    description: 'Custom-crafted full or partial dentures designed for comfort and a natural appearance, restoring function and confidence.',
    usaPrice: { min: 1500, max: 3000 },
    indiaPrice: { min: 300, max: 600 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Impressions',
        description: 'Detailed impressions and bite records taken for precise fit.',
      },
      {
        step: 2,
        title: 'Try-In',
        description: 'Wax try-in to verify fit, bite, and aesthetics.',
      },
      {
        step: 3,
        title: 'Fabrication',
        description: 'Dentures crafted in lab using high-quality acrylic and teeth.',
      },
      {
        step: 4,
        title: 'Fitting',
        description: 'Final dentures fitted and adjusted for comfort.',
      },
    ],
    materials: [
      'Ivoclar teeth',
      'BPS denture system',
      'Flexible partial options',
    ],
    faqs: [
      {
        question: 'How long do dentures last?',
        answer: 'With proper care, dentures typically last 5-7 years before needing replacement.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'tooth-filling',
    name: 'Tooth Filling',
    shortName: 'Fillings',
    category: 'Restorative',
    icon: 'Shield',
    tagline: 'Restore decayed teeth',
    description: 'Tooth-colored composite fillings to repair cavities and minor tooth damage, blending seamlessly with your natural teeth.',
    usaPrice: { min: 200, max: 500 },
    indiaPrice: { min: 30, max: 80 },
    savingsPercent: 85,
    procedure: [
      {
        step: 1,
        title: 'Decay Removal',
        description: 'Decayed portion of the tooth is removed.',
      },
      {
        step: 2,
        title: 'Preparation',
        description: 'Tooth is cleaned and prepared for filling.',
      },
      {
        step: 3,
        title: 'Filling Placement',
        description: 'Composite resin applied in layers and cured with light.',
      },
      {
        step: 4,
        title: 'Shaping & Polish',
        description: 'Filling shaped to match bite and polished for a natural look.',
      },
    ],
    materials: [
      '3M composite resin',
      'Glass ionomer',
      'Tooth-colored materials',
    ],
    faqs: [
      {
        question: 'Are white fillings as strong as silver?',
        answer: 'Modern composite fillings are very durable and bond directly to tooth structure for added strength.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'dental-sealants',
    name: 'Dental Sealants',
    shortName: 'Sealants',
    category: 'Preventive',
    icon: 'Shield',
    tagline: 'Prevent cavities before they start',
    description: 'Protective coating applied to chewing surfaces of back teeth to prevent decay, especially effective for children and cavity-prone adults.',
    usaPrice: { min: 30, max: 60 },
    indiaPrice: { min: 5, max: 15 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Cleaning',
        description: 'Teeth thoroughly cleaned and dried.',
      },
      {
        step: 2,
        title: 'Etching',
        description: 'Tooth surface lightly etched for bonding.',
      },
      {
        step: 3,
        title: 'Application',
        description: 'Sealant material applied to grooves and fissures.',
      },
      {
        step: 4,
        title: 'Curing',
        description: 'Sealant hardened with curing light.',
      },
    ],
    materials: [
      'BPA-free sealant materials',
      'Light-cured resin',
    ],
    faqs: [
      {
        question: 'Are sealants only for children?',
        answer: 'While most common for children, adults with deep grooves or high cavity risk benefit too.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'tooth-extraction',
    name: 'Tooth Extraction',
    shortName: 'Extraction',
    category: 'Oral Surgery',
    icon: 'Scissors',
    tagline: 'Safe, gentle removal',
    description: 'Simple and surgical tooth extractions performed with minimal discomfort using modern techniques and anesthesia.',
    usaPrice: { min: 200, max: 600 },
    indiaPrice: { min: 30, max: 100 },
    savingsPercent: 85,
    procedure: [
      {
        step: 1,
        title: 'X-ray & Assessment',
        description: 'Tooth and root structure evaluated.',
      },
      {
        step: 2,
        title: 'Anesthesia',
        description: 'Local anesthesia for complete comfort.',
      },
      {
        step: 3,
        title: 'Extraction',
        description: 'Tooth carefully removed with minimal tissue disruption.',
      },
      {
        step: 4,
        title: 'Post-Op Care',
        description: 'Gauze placed and aftercare instructions provided.',
      },
    ],
    materials: [
      'Modern surgical instruments',
      'Dissolvable sutures',
      'Hemostatic agents',
    ],
    faqs: [
      {
        question: 'When should I consider an implant after extraction?',
        answer: 'Implant placement can often be planned 2-3 months after extraction once the bone heals.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'bone-grafting',
    name: 'Bone Grafting',
    shortName: 'Bone Graft',
    category: 'Oral Surgery',
    icon: 'Layers',
    tagline: 'Rebuild your jawbone',
    description: 'Bone augmentation procedures to rebuild jawbone density, often required before dental implant placement.',
    usaPrice: { min: 2000, max: 5000 },
    indiaPrice: { min: 400, max: 1000 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'CT Scan',
        description: '3D imaging to assess bone volume and density.',
      },
      {
        step: 2,
        title: 'Graft Placement',
        description: 'Bone graft material placed at the deficient site.',
      },
      {
        step: 3,
        title: 'Membrane',
        description: 'Barrier membrane placed to protect the graft.',
      },
      {
        step: 4,
        title: 'Healing',
        description: '3-6 months for bone integration before implant placement.',
      },
    ],
    materials: [
      'Bio-Oss bone graft (Swiss)',
      'Collagen membranes',
      'PRF (platelet-rich fibrin)',
    ],
    faqs: [
      {
        question: 'Where does the bone graft material come from?',
        answer: 'We use bovine-derived or synthetic bone graft materials that are safe and well-researched.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'sinus-lift',
    name: 'Sinus Lift',
    shortName: 'Sinus Lift',
    category: 'Oral Surgery',
    icon: 'ArrowUp',
    tagline: 'Enable upper jaw implants',
    description: 'Surgical procedure to add bone to the upper jaw in the area of molars and premolars, making dental implants possible.',
    usaPrice: { min: 3000, max: 6000 },
    indiaPrice: { min: 600, max: 1200 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'CT Assessment',
        description: '3D scan to measure bone height and sinus anatomy.',
      },
      {
        step: 2,
        title: 'Sinus Membrane Lift',
        description: 'Sinus membrane carefully elevated.',
      },
      {
        step: 3,
        title: 'Bone Graft',
        description: 'Bone graft material placed beneath the membrane.',
      },
      {
        step: 4,
        title: 'Healing',
        description: '4-6 months healing before implant placement.',
      },
    ],
    materials: [
      'Bio-Oss (Swiss)',
      'Collagen membranes',
      'Piezoelectric surgery instruments',
    ],
    faqs: [
      {
        question: 'Is a sinus lift painful?',
        answer: 'Performed under local anesthesia, the procedure is comfortable. Post-op discomfort is mild and manageable.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'tmj-treatment',
    name: 'TMJ Treatment',
    shortName: 'TMJ/TMD',
    category: 'Specialized',
    icon: 'Activity',
    tagline: 'Relief from jaw pain',
    description: 'Comprehensive treatment for temporomandibular joint disorders including splint therapy, physical therapy, and surgical options.',
    usaPrice: { min: 1000, max: 5000 },
    indiaPrice: { min: 200, max: 1000 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Diagnosis',
        description: 'Clinical examination, X-rays, and MRI if needed.',
      },
      {
        step: 2,
        title: 'Splint Therapy',
        description: 'Custom occlusal splint fabricated to relieve joint stress.',
      },
      {
        step: 3,
        title: 'Physical Therapy',
        description: 'Exercises and techniques to improve jaw movement.',
      },
      {
        step: 4,
        title: 'Follow-up',
        description: 'Ongoing monitoring and adjustment of treatment.',
      },
    ],
    materials: [
      'Custom occlusal splints',
      'Diagnostic imaging',
      'Botox (if indicated)',
    ],
    faqs: [
      {
        question: 'What causes TMJ disorders?',
        answer: 'TMJ can be caused by teeth grinding, jaw injury, arthritis, or stress. Treatment addresses the underlying cause.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'pediatric-dentistry',
    name: 'Pediatric Dentistry',
    shortName: 'Kids Dental',
    category: 'Specialized',
    icon: 'Baby',
    tagline: 'Gentle care for little smiles',
    description: 'Child-friendly dental treatments in a comfortable, welcoming environment. From routine checkups to specialized pediatric procedures.',
    usaPrice: { min: 200, max: 800 },
    indiaPrice: { min: 30, max: 150 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Child-Friendly Exam',
        description: 'Gentle examination in a kid-friendly environment.',
      },
      {
        step: 2,
        title: 'Cleaning',
        description: 'Professional cleaning with flavored polish.',
      },
      {
        step: 3,
        title: 'Treatment',
        description: 'Any required treatment performed with sedation options.',
      },
      {
        step: 4,
        title: 'Prevention Plan',
        description: 'Fluoride application, sealants, and home care guidance.',
      },
    ],
    materials: [
      'Child-safe materials',
      'Fluoride varnish',
      'Tooth-colored fillings',
    ],
    faqs: [
      {
        question: 'At what age should my child first visit the dentist?',
        answer: 'The first dental visit is recommended by age 1 or within 6 months of the first tooth appearing.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'laser-dentistry',
    name: 'Laser Dentistry',
    shortName: 'Laser',
    category: 'Specialized',
    icon: 'Zap',
    tagline: 'Minimally invasive precision',
    description: 'Advanced laser procedures for gum contouring, cavity treatment, and soft tissue surgery with minimal pain and faster healing.',
    usaPrice: { min: 500, max: 2000 },
    indiaPrice: { min: 100, max: 400 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Assessment',
        description: 'Evaluation to determine suitability for laser treatment.',
      },
      {
        step: 2,
        title: 'Preparation',
        description: 'Protective eyewear and area preparation.',
      },
      {
        step: 3,
        title: 'Laser Treatment',
        description: 'Precise laser application for the specific procedure.',
      },
      {
        step: 4,
        title: 'Post-Care',
        description: 'Minimal aftercare needed due to reduced trauma.',
      },
    ],
    materials: [
      'Diode laser',
      'Er:YAG laser',
      'CO2 laser',
    ],
    faqs: [
      {
        question: 'Is laser dentistry safe?',
        answer: 'Yes, dental lasers are FDA-approved and have been used safely for decades.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'dental-inlays-onlays',
    name: 'Inlays & Onlays',
    shortName: 'Inlays/Onlays',
    category: 'Restorative',
    icon: 'Puzzle',
    tagline: 'Precision lab-crafted restorations',
    description: 'Custom-made restorations for moderate tooth damage — stronger than fillings and more conservative than crowns.',
    usaPrice: { min: 800, max: 1500 },
    indiaPrice: { min: 150, max: 300 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Preparation',
        description: 'Damaged area removed and tooth prepared.',
      },
      {
        step: 2,
        title: 'Impression',
        description: 'Digital impression for precise fabrication.',
      },
      {
        step: 3,
        title: 'Lab Fabrication',
        description: 'Custom inlay/onlay crafted from porcelain or composite.',
      },
      {
        step: 4,
        title: 'Bonding',
        description: 'Restoration bonded and polished for a seamless fit.',
      },
    ],
    materials: [
      'E-max porcelain',
      'Zirconia',
      'Lab-processed composite',
    ],
    faqs: [
      {
        question: 'When is an inlay better than a filling?',
        answer: 'Inlays are recommended when the cavity is too large for a filling but the tooth doesn\'t need a full crown.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'mouth-guard',
    name: 'Custom Mouth Guards',
    shortName: 'Mouth Guards',
    category: 'Preventive',
    icon: 'Shield',
    tagline: 'Protect your teeth',
    description: 'Custom-fitted mouth guards for teeth grinding (bruxism), sports protection, or sleep apnea management.',
    usaPrice: { min: 300, max: 800 },
    indiaPrice: { min: 50, max: 150 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Impressions',
        description: 'Precise impressions of your teeth taken.',
      },
      {
        step: 2,
        title: 'Custom Fabrication',
        description: 'Guard crafted from durable, comfortable material.',
      },
      {
        step: 3,
        title: 'Fitting',
        description: 'Guard fitted and adjusted for comfort and function.',
      },
      {
        step: 4,
        title: 'Instructions',
        description: 'Care and usage instructions provided.',
      },
    ],
    materials: [
      'Medical-grade EVA',
      'Hard acrylic',
      'Dual-laminate materials',
    ],
    faqs: [
      {
        question: 'How do I know if I grind my teeth?',
        answer: 'Signs include jaw pain, headaches, worn teeth, and tooth sensitivity. Your dentist can identify wear patterns.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
  {
    id: 'fluoride-treatment',
    name: 'Fluoride Treatment',
    shortName: 'Fluoride',
    category: 'Preventive',
    icon: 'Droplet',
    tagline: 'Strengthen your enamel',
    description: 'Professional fluoride application to strengthen tooth enamel and prevent cavities, ideal for both children and adults.',
    usaPrice: { min: 30, max: 60 },
    indiaPrice: { min: 5, max: 15 },
    savingsPercent: 80,
    procedure: [
      {
        step: 1,
        title: 'Cleaning',
        description: 'Teeth cleaned to remove plaque and debris.',
      },
      {
        step: 2,
        title: 'Application',
        description: 'Fluoride varnish or gel applied to all teeth.',
      },
      {
        step: 3,
        title: 'Setting Time',
        description: 'Fluoride left to absorb for a few minutes.',
      },
      {
        step: 4,
        title: 'Aftercare',
        description: 'Avoid eating or drinking for 30 minutes.',
      },
    ],
    materials: [
      'Sodium fluoride varnish',
      'APF gel',
      'Professional-grade fluoride',
    ],
    faqs: [
      {
        question: 'Is fluoride safe?',
        answer: 'Professional fluoride treatments are safe and recommended by dental associations worldwide.',
      },
    ],
    featured: true,
    opensInNewTab: false,
  },
]
