/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChapterItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  weightage?: string;
}

export interface SubjectSyllabus {
  id: string;
  name: string;
  code: string;
  maxMarks: number;
  description: string;
  color: string;
  sections?: {
    sectionName: string;
    chapters: ChapterItem[];
  }[];
  chapters?: ChapterItem[];
}

export const COMPLETE_CBSE_SYLLABUS: SubjectSyllabus[] = [
  {
    id: 'math',
    name: 'Mathematics (Standard / Basic)',
    code: '041',
    maxMarks: 80,
    description: 'All 14 NCERT Class 10 Mathematics chapters aligned with CBSE 2026 board exam blueprint.',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    chapters: [
      { id: 'm1', title: 'Chapter 1: Real Numbers', description: 'Fundamental Theorem of Arithmetic, HCF & LCM, Revisiting Rational & Irrational numbers.' },
      { id: 'm2', title: 'Chapter 2: Polynomials', description: 'Geometrical meaning of zeroes of a polynomial, Relationship between zeroes and coefficients.' },
      { id: 'm3', title: 'Chapter 3: Pair of Linear Equations in Two Variables', description: 'Graphical method, Substitution, Elimination, and Cross-multiplication consistency.' },
      { id: 'm4', title: 'Chapter 4: Quadratic Equations', description: 'Solution by factorization, Quadratic Formula, Discriminant and nature of roots.' },
      { id: 'm5', title: 'Chapter 5: Arithmetic Progressions', description: 'Nth term of an AP, Sum of first n terms of an AP and practical applications.' },
      { id: 'm6', title: 'Chapter 6: Triangles', description: 'Similarity of triangles, Criteria for similarity (AA, SSS, SAS), Basic Proportionality Theorem (BPT).' },
      { id: 'm7', title: 'Chapter 7: Coordinate Geometry', description: 'Distance formula, Section formula, Area of a triangle on Cartesian plane.' },
      { id: 'm8', title: 'Chapter 8: Introduction to Trigonometry', description: 'Trigonometric ratios of acute angles, Values of specific angles (0°, 30°, 45°, 60°, 90°), Identities.' },
      { id: 'm9', title: 'Chapter 9: Some Applications of Trigonometry', description: 'Heights and Distances, Angle of Elevation, Angle of Depression.' },
      { id: 'm10', title: 'Chapter 10: Circles', description: 'Tangent to a circle, Theorems related to lengths of tangents drawn from an external point.' },
      { id: 'm11', title: 'Chapter 11: Areas Related to Circles', description: 'Perimeter and area of circle, Area of sector and segment of a circle.' },
      { id: 'm12', title: 'Chapter 12: Surface Areas and Volumes', description: 'Surface area and volume of combinations of solids (cubes, cylinders, cones, spheres, hemispheres).' },
      { id: 'm13', title: 'Chapter 13: Statistics', description: 'Mean, Median, and Mode of grouped data, Cumulative frequency graph (Ogive).' },
      { id: 'm14', title: 'Chapter 14: Probability', description: 'Classical definition of probability, Simple problems on single and multiple events.' },
    ]
  },
  {
    id: 'science',
    name: 'Science (PCB)',
    code: '086',
    maxMarks: 80,
    description: 'All 13 NCERT Class 10 Science chapters grouped by Chemistry, Biology, and Physics.',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    sections: [
      {
        sectionName: 'Chemistry',
        chapters: [
          { id: 's-chem-1', title: 'Chapter 1: Chemical Reactions and Equations', description: 'Writing chemical equations, balancing, types of chemical reactions (combination, decomposition, displacement, double displacement, oxidation & reduction).' },
          { id: 's-chem-2', title: 'Chapter 2: Acids, Bases and Salts', description: 'Chemical properties of acids and bases, pH scale, preparation and uses of sodium hydroxide, bleaching powder, baking soda, washing soda, and plaster of paris.' },
          { id: 's-chem-3', title: 'Chapter 3: Metals and Non-metals', description: 'Physical and chemical properties, reactivity series, formation and properties of ionic compounds, extraction of metals, corrosion.' },
          { id: 's-chem-4', title: 'Chapter 4: Carbon and its Compounds', description: 'Bonding in carbon (covalent bonding), versatile nature of carbon, homologous series, chemical properties of carbon compounds, ethanol and ethanoic acid, soaps and detergents.' },
        ]
      },
      {
        sectionName: 'Biology',
        chapters: [
          { id: 's-bio-5', title: 'Chapter 5: Life Processes', description: 'What are life processes? Nutrition, respiration, transportation, and excretion in plants and animals.' },
          { id: 's-bio-6', title: 'Chapter 6: Control and Coordination', description: 'Animals - nervous system, reflex action, human brain, chemical coordination (hormones); Plant coordination - tropic movements, phytohormones.' },
          { id: 's-bio-7', title: 'Chapter 7: How do Organisms Reproduce?', description: 'Asexual and sexual reproduction in plants and animals, reproductive health, contraception.' },
          { id: 's-bio-8', title: 'Chapter 8: Heredity and Evolution', description: 'Heredity, Mendel’s laws of inheritance, sex determination (evolution topic brief as per CBSE rationalized syllabus).' },
          { id: 's-bio-9', title: 'Chapter 9: Our Environment', description: 'Eco-system, biotic and abiotic components, food chains and webs, ozone layer depletion and garbage disposal.' },
        ]
      },
      {
        sectionName: 'Physics',
        chapters: [
          { id: 's-phy-10', title: 'Chapter 10: Light – Reflection and Refraction', description: 'Reflection of light by spherical mirrors, image formation, mirror formula; Refraction of light, laws of refraction, refractive index, lenses, lens formula, power of lens.' },
          { id: 's-phy-11', title: 'Chapter 11: Human Eye and Colourful World', description: 'Human eye, power of accommodation, defects of vision and their correction, refraction of light through a prism, dispersion of light, scattering of light.' },
          { id: 's-phy-12', title: 'Chapter 12: Electricity', description: 'Electric current, electric potential and potential difference, Ohm’s law, resistance, factors on which resistance depends, series and parallel combinations, heating effect of electric current, electric power.' },
          { id: 's-phy-13', title: 'Chapter 13: Magnetic Effects of Electric Current', description: 'Magnetic field, field lines, magnetic field due to current-carrying conductor, Fleming’s left-hand & right-hand rules, electric motor, electromagnetic induction, electric generator, domestic electric circuits.' },
        ]
      }
    ]
  },
  {
    id: 'sst',
    name: 'Social Science (History, Geo, Pol, Eco)',
    code: '087',
    maxMarks: 80,
    description: 'All 21 NCERT Class 10 Social Science chapters grouped across History, Geography, Civics, and Economics.',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    sections: [
      {
        sectionName: 'History (India and the Contemporary World - II)',
        chapters: [
          { id: 'hst-1', title: 'Chapter 1: The Rise of Nationalism in Europe', description: 'French Revolution, nationalism across 19th-century Europe, unification of Italy and Germany.' },
          { id: 'hst-2', title: 'Chapter 2: Nationalism in India', description: 'First World War, Khilafat and Non-Cooperation, Civil Disobedience Movement, sense of collective belonging.' },
          { id: 'hst-3', title: 'Chapter 3: The Making of a Global World', description: 'Pre-modern world, 19th-century global economy, inter-war economy, rebuilding of world economy.' },
          { id: 'hst-4', title: 'Chapter 4: The Age of Industrialisation', description: 'Proto-industrialisation, factories come up, hand labour vs steam power, industrial growth in colonies.' },
          { id: 'hst-5', title: 'Chapter 5: Print Culture and the Modern World', description: 'First printed books, print comes to Europe, print revolution, print culture in 19th-century India.' },
        ]
      },
      {
        sectionName: 'Geography (Contemporary India - II)',
        chapters: [
          { id: 'geo-1', title: 'Chapter 1: Resources and Development', description: 'Concept of resources, development of resources, resource planning in India, land resources, soil types.' },
          { id: 'geo-2', title: 'Chapter 2: Forest and Wildlife Resources', description: 'Flora and fauna in India, conservation of forest and wildlife, Community and Conservation.' },
          { id: 'geo-3', title: 'Chapter 3: Water Resources', description: 'Water scarcity, multi-purpose river projects, integrated water resource management, rainwater harvesting.' },
          { id: 'geo-4', title: 'Chapter 4: Agriculture', description: 'Types of farming, cropping pattern, major crops, technological and institutional reforms.' },
          { id: 'geo-5', title: 'Chapter 5: Minerals and Energy Resources', description: 'What is a mineral? Classification of minerals, conventional and non-conventional sources of energy, conservation.' },
          { id: 'geo-6', title: 'Chapter 6: Manufacturing Industries', description: 'Importance of manufacturing, industrial location, classification of industries, industrial pollution and environmental degradation.' },
          { id: 'geo-7', title: 'Chapter 7: Lifelines of National Economy', description: 'Transport (roadways, railways, pipelines, waterways, airways), communication, international trade, tourism.' },
        ]
      },
      {
        sectionName: 'Civics (Democratic Politics - II)',
        chapters: [
          { id: 'civ-1', title: 'Chapter 1: Power Sharing', description: 'Case studies of Belgium and Sri Lanka, why power sharing is desirable, forms of power sharing.' },
          { id: 'civ-2', title: 'Chapter 2: Federalism', description: 'What is federalism? What makes India a federal country? How is federalism practiced? Decentralization in India.' },
          { id: 'civ-3', title: 'Chapter 3: Gender, Religion and Caste', description: 'Gender and politics, religion, communalism and politics, caste and politics.' },
          { id: 'civ-4', title: 'Chapter 4: Political Parties', description: 'Why do we need political parties? National and regional political parties, state of party systems, how can parties be reformed?' },
          { id: 'civ-5', title: 'Chapter 5: Outcomes of Democracy', description: 'How do we assess democracy’s outcomes? Accountable, responsive and legitimate government, economic growth, reduction of inequality.' },
        ]
      },
      {
        sectionName: 'Economics (Understanding Economic Development)',
        chapters: [
          { id: 'eco-1', title: 'Chapter 1: Development', description: 'What development promises, income and other goals, national development, how to compare countries, human development index.' },
          { id: 'eco-2', title: 'Chapter 2: Sectors of Indian Economy', description: 'Primary, secondary and tertiary sectors in India, comparison of sectors, organized and unorganized sectors, employment generation.' },
          { id: 'eco-3', title: 'Chapter 3: Money and Credit', description: 'Money as a medium of exchange, modern forms of money, loan activities of banks, credit situations, formal and informal credit.' },
          { id: 'eco-4', title: 'Chapter 4: Globalisation and the Indian Economy', description: 'Production across countries, interlinking production, foreign trade and integration of markets, WTO, fair globalisation.' },
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English Language & Literature',
    code: '184',
    maxMarks: 80,
    description: 'Complete syllabus covering Grammar, Writing Skills, First Flight textbook prose & poems, and Footprints Without Feet.',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    sections: [
      {
        sectionName: 'Section A & B: Reading Comprehension & Writing Skills',
        chapters: [
          { id: 'eng-w-1', title: 'Unseen Discursive & Case-based Passages', description: 'Reading comprehension practice with objective and short answer questions.' },
          { id: 'eng-w-2', title: 'Grammar: Tenses, Modals & Subject-Verb Concord', description: 'Gap-filling, editing, and sentence transformation drills.' },
          { id: 'eng-w-3', title: 'Grammar: Reported Speech & Determiners', description: 'Direct and indirect speech conversation conversions.' },
          { id: 'eng-w-4', title: 'Writing: Formal Letter Writing', description: 'Letters to Editor, Inquiry, Placing Orders, and Complaint letters.' },
          { id: 'eng-w-5', title: 'Writing: Analytical Paragraph Writing', description: 'Interpreting charts, graphs, data, outlines and writing descriptive analytical paragraphs.' },
        ]
      },
      {
        sectionName: 'First Flight (Prose - All 9 Chapters)',
        chapters: [
          { id: 'eng-ff-p1', title: '1. A Letter to God', description: 'Lencho’s unwavering faith in God amidst a devastating hailstorm.' },
          { id: 'eng-ff-p2', title: '2. Nelson Mandela: Long Walk to Freedom', description: 'Inauguration speech, struggle against apartheid and journey to democracy.' },
          { id: 'eng-ff-p3', title: '3. Two Stories About Flying', description: 'I. His First Flight (Young seagull); II. The Black Aeroplane (Pilot flying through storm).' },
          { id: 'eng-ff-p4', title: '4. From the Diary of Anne Frank', description: 'Excerpts from Kitty, life in hiding during Nazi occupation.' },
          { id: 'eng-ff-p5', title: '5. Glimpses of India', description: 'I. A Baker from Goa; II. Coorg; III. Tea from Assam.' },
          { id: 'eng-ff-p6', title: '6. Mijbil the Otter', description: 'Maxwell’s adventures transporting his pet otter across continents.' },
          { id: 'eng-ff-p7', title: '7. Madam Rides the Bus', description: 'Valli’s bus journey and her firsthand experience of life and death.' },
          { id: 'eng-ff-p8', title: '8. The Sermon at Benares', description: 'Gautama Buddha’s enlightenment and Kisa Gotami realizing the universal truth of mortality.' },
          { id: 'eng-ff-p9', title: '9. The Proposal', description: 'Anton Chekhov’s famous one-act farcical play about marriage proposals among neighbours.' },
        ]
      },
      {
        sectionName: 'First Flight (Poems - All 10 Poems)',
        chapters: [
          { id: 'eng-ff-po1', title: '1. Dust of Snow', description: 'Robert Frost on how a simple moment in nature shifts a gloomy mood.' },
          { id: 'eng-ff-po2', title: '2. Fire and Ice', description: 'Robert Frost on the dual destructive forces of human desire and hatred.' },
          { id: 'eng-ff-po3', title: '3. A Tiger in the Zoo', description: 'Leslie Norris contrasting majestic tiger in natural habitat vs concrete cell.' },
          { id: 'eng-ff-po4', title: '4. How to Tell Wild Animals', description: 'Carolyn Wells humorous guide to identifying dangerous beasts.' },
          { id: 'eng-ff-po5', title: '5. The Ball Poem', description: 'John Berryman on the epistemology of loss when a boy loses his ball.' },
          { id: 'eng-ff-po6', title: '6. Amanda!', description: 'Robin Klein on a young girl yearning for freedom from constant nagging.' },
          { id: 'eng-ff-po7', title: '7. The Trees', description: 'Adrienne Rich on trees breaking out of domestic confinement into the forest.' },
          { id: 'eng-ff-po8', title: '8. Fog', description: 'Carl Sandburg capturing the silent, cat-like arrival and departure of fog.' },
          { id: 'eng-ff-po9', title: '9. The Tale of Custard the Dragon', description: 'Og Nash humorous ballad about Belinda and her brave/cowardly pets.' },
          { id: 'eng-ff-po10', title: '10. For Anne Gregory', description: 'W.B. Yeats on true beauty and loving someone for who they are inside.' },
        ]
      },
      {
        sectionName: 'Footprints Without Feet (Supplementary - All 9 Chapters)',
        chapters: [
          { id: 'eng-supp-1', title: '1. A Triumph of Surgery', description: 'James Herriot curing Tricki the pampered overweight dog through diet control.' },
          { id: 'eng-supp-2', title: '2. The Thief’s Story', description: 'Ruskin Bond on Anil reforming Hari Singh through trust and education.' },
          { id: 'eng-supp-3', title: '3. The Midnight Visitor', description: 'Ausable the clever secret agent outwitting Max using quick wits.' },
          { id: 'eng-supp-4', title: '4. A Question of Trust', description: 'Horace Danby, a meticulous thief, outsmarted by another clever lady thief.' },
          { id: 'eng-supp-5', title: '5. Footprints Without Feet', description: 'Griffin the scientist discovering invisibility and misusing it.' },
          { id: 'eng-supp-6', title: '6. The Making of a Scientist', description: 'Richard Ebright’s scientific curiosity and butterfly collection.' },
          { id: 'eng-supp-7', title: '7. The Necklace', description: 'Guy de Maupassant’s tragic irony about Matilda borrowing a fake diamond necklace.' },
          { id: 'eng-supp-8', title: '8. Bholi', description: 'K.A. Abbas on the transformation of a neglected girl through education and self-respect.' },
          { id: 'eng-supp-9', title: '9. The Book That Saved the Earth', description: 'Sci-fi play about Martians misunderstanding nursery rhyme book Mother Goose.' },
        ]
      }
    ]
  },
  {
    id: 'hindi',
    name: 'Hindi Course A',
    code: '002',
    maxMarks: 80,
    description: 'Complete CBSE Hindi Course A syllabus covering Kshitij Part-2 (Kavya & Gadya), Kritika Part-2, Vyakaran, and Rachnatmak Lekhan.',
    color: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
    sections: [
      {
        sectionName: 'क्षितिज भाग-2 (काव्य खंड - सभी 6 अध्याय)',
        chapters: [
          { id: 'hin-kav-1', title: '1. सूरदास के पद', description: 'उद्धव-गोपी संवाद और गोपियों का अनन्य कृष्ण प्रेम।' },
          { id: 'hin-kav-2', title: '2. राम-लक्ष्मण-परशुराम संवाद', description: 'रामचरितमानस के बालकांड से धनुष भंग प्रसंग।' },
          { id: 'hin-kav-3', title: '3. आत्मकथ्य', description: 'जयशंकर प्रसाद जी की आत्मकथा लिखने के संकोच और जीवन यथार्थ पर कविता।' },
          { id: 'hin-kav-4', title: '4. उत्साह और अट नहीं रही है', description: 'सूर्यकांत त्रिपाठी ‘निराला’ का बादलों के प्रति आह्वान और फाल्गुन की मादकता।' },
          { id: 'hin-kav-5', title: '5. यह दंतुरित मुस्कान और फसल', description: 'नागार्जुन द्वारा रचित बच्चे की मनमोहक मुस्कान और कृषि संस्कृति।' },
          { id: 'hin-kav-6', title: '6. संगतकार', description: 'मंगलेश डबराल द्वारा मुख्य गायक के साथ सुर मिलाने वाले सहयोगी का समर्पण।' },
        ]
      },
      {
        sectionName: 'क्षितिज भाग-2 (गद्य खंड - सभी 6 अध्याय)',
        chapters: [
          { id: 'hin-gad-1', title: '1. नेताजी का चश्मा', description: 'स्वयं प्रकाश जी की कहानी, कैप्टन चश्मेवाले का देशप्रेम।' },
          { id: 'hin-gad-2', title: '2. बालगोबिन भगत', description: 'रामवृक्ष बेनीपुरी का रेखाचित्र, पारंपरिक रूढ़ियों पर प्रहार और संगीत साधना।' },
          { id: 'hin-gad-3', title: '3. लखनवी अंदाज', description: 'यशपाल जी का व्यंग्य, नवाब साहब की नवाबी शान और झूठी शान-शौकत।' },
          { id: 'hin-gad-4', title: '4. एक कहानी यह भी', description: 'मन्नू भंडari की आत्मकथात्मक अंश, लेखिका का शुरुआती जीवन और व्यक्तित्व निर्माण।' },
          { id: 'hin-gad-5', title: '5. नौबतखाने में इबादत', description: 'यतीन्द्र मिश्र जी का शहनाई वादक बिस्मिल्ला ख़ाँ का सांस्कृतिक व्यक्तिव चित्र।' },
          { id: 'hin-gad-6', title: '6. संस्कृति', description: 'भदंत आनंद कौसल्यायन का निबंध, सभ्यता और संस्कृति में अंतर।' },
        ]
      },
      {
        sectionName: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक - सभी 3 अध्याय)',
        chapters: [
          { id: 'hin-krit-1', title: '1. माता का आँचल', description: 'शिवपूजन सहाय का आंचलिक उपन्यास अंश, बचपन और माता-पिता का आत्मीय स्नेह।' },
          { id: 'hin-krit-2', title: '2. साना-साना हाथ जोड़ि…', description: 'मधु कांकरिया की सिक्किम यात्रा वृत्तांत, प्राकृतिक सौंदर्य और मेहनतकश जीवन।' },
          { id: 'hin-krit-3', title: '3. मैं क्यों लिखता हूँ?', description: 'अज्ञेय जी का वैचारिक निबंध, लेखक की आंतरिक प्रेरणा और लेखन प्रक्रिया।' },
        ]
      },
      {
        sectionName: 'व्याकरण एवं रचनात्मक लेखन',
        chapters: [
          { id: 'hin-vyak-1', title: 'व्याकरण: वाक्य भेद (रचना के आधार पर)', description: 'सरल, संयुक्त और मिश्र वाक्य रूपांतरण।' },
          { id: 'hin-vyak-2', title: 'व्याकरण: वाच्य (कर्तृ, कर्म और भाव वाच्य)', description: 'वाच्य परिवर्तन और पहचान।' },
          { id: 'hin-vyak-3', title: 'व्याकरण: पद परिचय', description: 'संज्ञा, सर्वनाम, विशेषण, क्रिया और अव्यय शब्दों का व्याकरणिक परिचय।' },
          { id: 'hin-vyak-4', title: 'व्याकरण: अलंकार (शब्दालंकार व अर्थालंकार)', description: 'प्रास, यमक, श्लेष, उपमा, रूपक, उत्प्रेक्षा, अतिश्योक्ति और मानवीकरण।' },
          { id: 'hin-rach-1', title: 'रचनात्मक लेखन: अनुच्छेद, पत्र, स्ववृत्त/ईमेल, विज्ञापन/संदेश', description: 'बोर्ड परीक्षा के नवीनतम प्रारूप पर आधारित रचनात्मक लेखन अभ्यास।' },
        ]
      }
    ]
  },
  {
    id: 'it',
    name: 'Information Technology (Code 402)',
    code: '402',
    maxMarks: 50,
    description: 'Complete CBSE IT Code 402 syllabus covering Part A Employability Skills (5 Units) and Part B Subject Specific Skills (4 Units).',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    sections: [
      {
        sectionName: 'Part A: Employability Skills (All 5 Units)',
        chapters: [
          { id: 'it-emp-1', title: 'Unit 1: Communication Skills-II', description: 'Methods of communication, active listening skills, feedback, and communication barriers.' },
          { id: 'it-emp-2', title: 'Unit 2: Self-Management Skills-II', description: 'Stress management, self-awareness, goal setting, time management, and positive attitude.' },
          { id: 'it-emp-3', title: 'Unit 3: Information and Communication Technology Skills-II', description: 'Operating systems, file management, care and maintenance of computers.' },
          { id: 'it-emp-4', title: 'Unit 4: Entrepreneurial Skills-II', description: 'Entrepreneurship and society, qualities of an entrepreneur, barriers to entrepreneurship.' },
          { id: 'it-emp-5', title: 'Unit 5: Green Skills-II', description: 'Sustainable development, green economy, role of individuals in conservation of environment.' },
        ]
      },
      {
        sectionName: 'Part B: Subject Specific Skills (All 4 Units)',
        chapters: [
          { id: 'it-sub-1', title: 'Unit 1: Digital Documentation (Advanced - Word Processor)', description: 'Styles, images, templates, tables, and mail merge in LibreOffice Writer / MS Word.' },
          { id: 'it-sub-2', title: 'Unit 2: Electronic Spreadsheet (Advanced - Calc)', description: 'Consolidating data, creating scenarios, goal seek, macros, and linking spreadsheets.' },
          { id: 'it-sub-3', title: 'Unit 3: Database Management System (DBMS & SQL)', description: 'Concepts of DBMS, tables, queries, forms, reports, SQL queries (SELECT, INSERT, UPDATE, DELETE).' },
          { id: 'it-sub-4', title: 'Unit 4: Web Applications and Security', description: 'Networking fundamentals, web browsers, internet security, workplace safety, and emergency procedures.' },
        ]
      }
    ]
  }
];
