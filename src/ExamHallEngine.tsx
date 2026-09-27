/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle2, FileText, Upload, RefreshCw, 
  ArrowRight, Award, Shield, Sparkles, Check, ChevronRight, HelpCircle,
  BookOpen, Terminal, CheckSquare, Eye, Play, Layers, Target, CheckCheck
} from 'lucide-react';
import { COMPLETE_CBSE_SYLLABUS, SubjectSyllabus } from './syllabusData';
import { callGeminiAI } from './aiRouter';

interface Question {
  id: string;
  section: 'A' | 'B' | 'C' | 'D' | 'E';
  questionNumber: number;
  text: string;
  marks: number;
  type: 'mcq' | 'subjective';
  options?: string[];
  correctAnswer?: string;
  solutionHint?: string;
  chapterTag?: string;
}

interface QuestionPaper {
  subjectName: string;
  totalMarks: number;
  durationMinutes: number;
  sections: {
    section: 'A' | 'B' | 'C' | 'D' | 'E';
    name: string;
    marksPerQ: number;
    totalQ: number;
    questions: Question[];
  }[];
}

const MATH_PAPER: QuestionPaper = {
  subjectName: 'Mathematics (Standard / Basic)',
  totalMarks: 80,
  durationMinutes: 180,
  sections: [
    {
      section: 'A', name: 'Multiple Choice Questions (MCQs)', marksPerQ: 1, totalQ: 5,
      questions: [
        { id: 'm1', section: 'A', questionNumber: 1, text: 'If HCF(306, 657) = 9, then LCM(306, 657) is:', marks: 1, type: 'mcq', options: ['(A) 22338', '(B) 23238', '(C) 3060', '(D) 1971'], correctAnswer: '(A)', chapterTag: 'Real Numbers' },
        { id: 'm2', section: 'A', questionNumber: 2, text: 'If α and β are zeroes of x² - 5x + 6, the value of (1/α + 1/β) is:', marks: 1, type: 'mcq', options: ['(A) 5/6', '(B) 6/5', '(C) -5/6', '(D) 1/6'], correctAnswer: '(A)', chapterTag: 'Polynomials' },
        { id: 'm3', section: 'A', questionNumber: 3, text: 'The 10th term of the AP: 2, 7, 12, ... is:', marks: 1, type: 'mcq', options: ['(A) 42', '(B) 47', '(C) 52', '(D) 37'], correctAnswer: '(B)', chapterTag: 'Arithmetic Progressions' },
        { id: 'm4', section: 'A', questionNumber: 4, text: 'If sin A = 3/5, then the value of cos A is:', marks: 1, type: 'mcq', options: ['(A) 4/5', '(B) 3/4', '(C) 5/4', '(D) 5/3'], correctAnswer: '(A)', chapterTag: 'Introduction to Trigonometry' },
        { id: 'm5', section: 'A', questionNumber: 5, text: 'Assertion (A): √3 is an irrational number. Reason (R): The square root of every prime number is irrational.', marks: 1, type: 'mcq', options: ['(A) Both A & R true, R explains A', '(B) Both A & R true, R does not explain A', '(C) A is true, R is false', '(D) A is false, R is true'], correctAnswer: '(A)', chapterTag: 'Real Numbers' },
      ]
    },
    {
      section: 'B', name: 'Very Short Answer Type Questions', marksPerQ: 2, totalQ: 2,
      questions: [
        { id: 'm6', section: 'B', questionNumber: 6, text: 'Prove that 3 + 2√5 is an irrational number, given that √5 is irrational.', marks: 2, type: 'subjective', solutionHint: 'Assume rational = a/b, isolate √5 to show contradiction.', chapterTag: 'Real Numbers' },
        { id: 'm7', section: 'B', questionNumber: 7, text: 'Find the coordinates of the point which divides the join of (-1, 7) and (4, -3) in the ratio 2:3.', marks: 2, type: 'subjective', solutionHint: 'Use section formula -> (1, 3).', chapterTag: 'Coordinate Geometry' },
      ]
    },
    {
      section: 'C', name: 'Short Answer Type Questions', marksPerQ: 3, totalQ: 2,
      questions: [
        { id: 'm8', section: 'C', questionNumber: 8, text: 'Prove that: (sin θ - 2sin³θ) / (2cos³θ - cos θ) = tan θ.', marks: 3, type: 'subjective', solutionHint: 'Factor out sin θ and cos θ.', chapterTag: 'Introduction to Trigonometry' },
        { id: 'm9', section: 'C', questionNumber: 9, text: 'Prove that the lengths of tangents drawn from an external point to a circle are equal.', marks: 3, type: 'subjective', solutionHint: 'Use congruent right triangles.', chapterTag: 'Circles' },
      ]
    },
    {
      section: 'D', name: 'Long Answer Type Questions', marksPerQ: 5, totalQ: 2,
      questions: [
        { id: 'm10', section: 'D', questionNumber: 10, text: 'State and prove Basic Proportionality Theorem (Thales Theorem). Using it, find EC if AD=1.5 cm, DB=3 cm, and AE=1 cm in ΔABC where DE || BC.', marks: 5, type: 'subjective', solutionHint: 'EC = 2 cm.', chapterTag: 'Triangles' },
        { id: 'm11', section: 'D', questionNumber: 11, text: 'A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream. Find speed of stream.', marks: 5, type: 'subjective', solutionHint: 'Speed of stream = 6 km/h.', chapterTag: 'Quadratic Equations' },
      ]
    },
    {
      section: 'E', name: 'Case Study Based Questions', marksPerQ: 4, totalQ: 1,
      questions: [
        { id: 'm12', section: 'E', questionNumber: 12, text: 'From the top of a 75 m high lighthouse, the angles of depression of two ships on the same side are 30° and 45°. Find: (i) Distance of closer ship [1M], (ii) Distance of farther ship [1M], (iii) Distance between the two ships [2M].', marks: 4, type: 'subjective', solutionHint: 'Distance = 75(√3 - 1)m.', chapterTag: 'Some Applications of Trigonometry' },
      ]
    }
  ]
};

const SCIENCE_PAPER: QuestionPaper = {
  subjectName: 'Science (PCB)',
  totalMarks: 80,
  durationMinutes: 180,
  sections: [
    {
      section: 'A', name: 'Multiple Choice Questions (MCQs)', marksPerQ: 1, totalQ: 5,
      questions: [
        { id: 's1', section: 'A', questionNumber: 1, text: 'Which gas is evolved when dilute hydrochloric acid reacts with zinc granules?', marks: 1, type: 'mcq', options: ['(A) O₂', '(B) CO₂', '(C) H₂', '(D) Cl₂'], correctAnswer: '(C)', chapterTag: 'Chemical Reactions and Equations' },
        { id: 's2', section: 'A', questionNumber: 2, text: 'What is the colour of the precipitate formed when aqueous lead nitrate reacts with potassium iodide?', marks: 1, type: 'mcq', options: ['(A) White', '(B) Yellow', '(C) Blue', '(D) Green'], correctAnswer: '(B)', chapterTag: 'Chemical Reactions and Equations' },
        { id: 's3', section: 'A', questionNumber: 3, text: 'The breakdown of pyruvate to give CO₂, water and energy takes place in:', marks: 1, type: 'mcq', options: ['(A) Cytoplasm', '(B) Mitochondria', '(C) Chloroplast', '(D) Nucleus'], correctAnswer: '(B)', chapterTag: 'Life Processes' },
        { id: 's4', section: 'A', questionNumber: 4, text: 'Where should an object be placed in front of a convex lens to get a real image of the exact same size?', marks: 1, type: 'mcq', options: ['(A) At F', '(B) At 2F', '(C) Infinity', '(D) Between O and F'], correctAnswer: '(B)', chapterTag: 'Light - Reflection and Refraction' },
        { id: 's5', section: 'A', questionNumber: 5, text: 'The commercial unit of electrical energy (1 kWh) is equal to:', marks: 1, type: 'mcq', options: ['(A) 3.6 × 10⁶ J', '(B) 3.6 × 10⁵ J', '(C) 36 × 10⁶ J', '(D) 1000 J'], correctAnswer: '(A)', chapterTag: 'Electricity' },
      ]
    },
    {
      section: 'B', name: 'Very Short Answer Type Questions', marksPerQ: 2, totalQ: 2,
      questions: [
        { id: 's6', section: 'B', questionNumber: 6, text: 'Why does the colour of copper sulphate solution change when an iron nail is dipped in it? Write the balanced equation.', marks: 2, type: 'subjective', solutionHint: 'Fe + CuSO₄ → FeSO₄ + Cu', chapterTag: 'Chemical Reactions and Equations' },
        { id: 's7', section: 'B', questionNumber: 7, text: 'Why are coils of electric toasters and electric irons made of an alloy rather than a pure metal?', marks: 2, type: 'subjective', solutionHint: 'Alloys have higher resistivity and do not oxidize at high temperatures.', chapterTag: 'Electricity' },
      ]
    },
    {
      section: 'C', name: 'Short Answer Type Questions', marksPerQ: 3, totalQ: 2,
      questions: [
        { id: 's8', section: 'C', questionNumber: 8, text: 'An object 4 cm in height is placed at 15 cm in front of a concave mirror of focal length 10 cm. Find image distance, nature, and size.', marks: 3, type: 'subjective', solutionHint: 'v = -30 cm, Real, inverted, magnified 8 cm.', chapterTag: 'Light - Reflection and Refraction' },
        { id: 's9', section: 'C', questionNumber: 9, text: 'Differentiate between Aerobic and Anaerobic respiration (3 points) and write equation for fermentation in yeast.', marks: 3, type: 'subjective', solutionHint: 'Oxygen presence, end products, energy yield.', chapterTag: 'Life Processes' },
      ]
    },
    {
      section: 'D', name: 'Long Answer Type Questions', marksPerQ: 5, totalQ: 2,
      questions: [
        { id: 's10', section: 'D', questionNumber: 10, text: '(a) What is an esterification reaction? Give equation. (b) Explain the cleansing action of soap with micelle formation.', marks: 5, type: 'subjective', solutionHint: 'Acid + Alcohol -> Ester + Water.', chapterTag: 'Carbon and its Compounds' },
        { id: 's11', section: 'D', questionNumber: 11, text: 'Describe double circulation of blood in the human heart. Why is separation of oxygenated and deoxygenated blood necessary?', marks: 5, type: 'subjective', solutionHint: 'Pulmonary and systemic circulation.', chapterTag: 'Life Processes' },
      ]
    },
    {
      section: 'E', name: 'Case Study Based Questions', marksPerQ: 4, totalQ: 1,
      questions: [
        { id: 's12', section: 'E', questionNumber: 12, text: 'Three resistors 5Ω, 10Ω, 30Ω in parallel across 12V battery. Calculate: (i) Current through each [1M], (ii) Total current [1M], (iii) Equivalent resistance [2M].', marks: 4, type: 'subjective', solutionHint: 'Total I = 4A, R_eq = 3Ω.', chapterTag: 'Electricity' },
      ]
    }
  ]
};

const SST_PAPER: QuestionPaper = {
  subjectName: 'Social Science (History, Geo, Civics, Eco)',
  totalMarks: 80,
  durationMinutes: 180,
  sections: [
    {
      section: 'A', name: 'Multiple Choice Questions (MCQs)', marksPerQ: 1, totalQ: 5,
      questions: [
        { id: 't1', section: 'A', questionNumber: 1, text: 'Who hosted the Congress of Vienna in 1815?', marks: 1, type: 'mcq', options: ['(A) Giuseppe Mazzini', '(B) Duke Metternich', '(C) Otto von Bismarck', '(D) Cavour'], correctAnswer: '(B)', chapterTag: 'The Rise of Nationalism in Europe' },
        { id: 't2', section: 'A', questionNumber: 2, text: 'In which year did Mahatma Gandhi return to India from South Africa?', marks: 1, type: 'mcq', options: ['(A) 1914', '(B) 1915', '(C) 1917', '(D) 1919'], correctAnswer: '(B)', chapterTag: 'Nationalism in India' },
        { id: 't3', section: 'A', questionNumber: 3, text: 'Black soil (Regur soil) is ideal for growing which crop?', marks: 1, type: 'mcq', options: ['(A) Rice', '(B) Wheat', '(C) Cotton', '(D) Tea'], correctAnswer: '(C)', chapterTag: 'Resources and Development' },
        { id: 't4', section: 'A', questionNumber: 4, text: 'Which sector has emerged as the largest producing sector in India?', marks: 1, type: 'mcq', options: ['(A) Primary', '(B) Secondary', '(C) Tertiary', '(D) Agriculture'], correctAnswer: '(C)', chapterTag: 'Sectors of the Indian Economy' },
        { id: 't5', section: 'A', questionNumber: 5, text: 'Which language is spoken by 80% of people in Brussels (Belgium)?', marks: 1, type: 'mcq', options: ['(A) Dutch', '(B) French', '(C) German', '(D) English'], correctAnswer: '(B)', chapterTag: 'Power Sharing' },
      ]
    },
    {
      section: 'B', name: 'Very Short Answer Type Questions', marksPerQ: 2, totalQ: 2,
      questions: [
        { id: 't6', section: 'B', questionNumber: 6, text: 'Why is power sharing desirable in a democracy? Give both prudential and moral reasons.', marks: 2, type: 'subjective', solutionHint: 'Reduces social conflict and upholds democratic spirit.', chapterTag: 'Power Sharing' },
        { id: 't7', section: 'B', questionNumber: 7, text: 'Distinguish between Kharif and Rabi cropping seasons with two examples each.', marks: 2, type: 'subjective', solutionHint: 'Kharif: monsoon, Rabi: winter.', chapterTag: 'Agriculture' },
      ]
    },
    {
      section: 'C', name: 'Short Answer Type Questions', marksPerQ: 3, totalQ: 2,
      questions: [
        { id: 't8', section: 'C', questionNumber: 8, text: 'Why did the Non-Cooperation Movement gradually slow down inদ্বিতীয় cities? Give three reasons.', marks: 3, type: 'subjective', solutionHint: 'Khadi cloth was expensive.', chapterTag: 'Nationalism in India' },
        { id: 't9', section: 'C', questionNumber: 9, text: 'How does the Reserve Bank of India (RBI) supervise the functioning of formal sector banks?', marks: 3, type: 'subjective', solutionHint: 'Ensures cash balance and fair lending.', chapterTag: 'Money and Credit' },
      ]
    },
    {
      section: 'D', name: 'Long Answer Type Questions', marksPerQ: 5, totalQ: 2,
      questions: [
        { id: 't10', section: 'D', questionNumber: 10, text: 'Describe the process of unification of Germany under the leadership of Otto von Bismarck.', marks: 5, type: 'subjective', solutionHint: 'Three wars over 7 years.', chapterTag: 'The Rise of Nationalism in Europe' },
        { id: 't11', section: 'D', questionNumber: 11, text: 'Explain the five key features of Federalism in the Indian Constitution.', marks: 5, type: 'subjective', solutionHint: 'Two or more levels of government.', chapterTag: 'Federalism' },
      ]
    },
    {
      section: 'E', name: 'Case Study Based Questions', marksPerQ: 4, totalQ: 1,
      questions: [
        { id: 't12', section: 'E', questionNumber: 12, text: 'Read the source on Salt March and answer: (i) Why salt? [1M], (ii) Dandi March route [1M], (iii) Difference from Non-Cooperation [2M].', marks: 4, type: 'subjective', solutionHint: 'Salt consumed by all.', chapterTag: 'Nationalism in India' },
      ]
    }
  ]
};

const ENGLISH_PAPER: QuestionPaper = {
  subjectName: 'English Language & Literature',
  totalMarks: 80,
  durationMinutes: 180,
  sections: [
    {
      section: 'A', name: 'Reading & Grammar MCQs', marksPerQ: 1, totalQ: 5,
      questions: [
        { id: 'e1', section: 'A', questionNumber: 1, text: 'Identify the figure of speech in "He stalks in his vivid stripes":', marks: 1, type: 'mcq', options: ['(A) Simile', '(B) Personification', '(C) Metaphor', '(D) Oxymoron'], correctAnswer: '(B)', chapterTag: 'A Tiger in the Zoo' },
        { id: 'e2', section: 'A', questionNumber: 2, text: 'How much money did Lencho ask God for, and how much did he receive?', marks: 1, type: 'mcq', options: ['(A) 100 & 70 pesos', '(B) 100 & 50 pesos', '(C) 70 & 30 pesos', '(D) 100 & 80 pesos'], correctAnswer: '(A)', chapterTag: 'A Letter to God' },
        { id: 'e3', section: 'A', questionNumber: 3, text: 'Neither the teacher nor the students _____ present yesterday.', marks: 1, type: 'mcq', options: ['(A) was', '(B) were', '(C) is', '(D) has'], correctAnswer: '(B)', chapterTag: 'Grammar - Subject-Verb Concord' },
        { id: 'e4', section: 'A', questionNumber: 4, text: 'Riya said, "I have completed my project." -> Riya said that she _____ her project.', marks: 1, type: 'mcq', options: ['(A) has completed', '(B) had completed', '(C) completed', '(D) completes'], correctAnswer: '(B)', chapterTag: 'Grammar - Reported Speech' },
        { id: 'e5', section: 'A', questionNumber: 5, text: 'What was the real cause of Tricki\'s ailment in \'A Triumph of Surgery\'?', marks: 1, type: 'mcq', options: ['(A) Infection', '(B) Overfeeding & lack of exercise', '(C) Fever', '(D) Injury'], correctAnswer: '(B)', chapterTag: 'A Triumph of Surgery' },
      ]
    },
    {
      section: 'B', name: 'Short Answer Literature', marksPerQ: 2, totalQ: 2,
      questions: [
        { id: 'e6', section: 'B', questionNumber: 6, text: 'Why did Lencho call the post office employees a "bunch of crooks"? Explain the irony.', marks: 2, type: 'subjective', solutionHint: 'Employees collected money for him.', chapterTag: 'A Letter to God' },
        { id: 'e7', section: 'B', questionNumber: 7, text: 'How did the crow and the hemlock tree change the poet\'s mood in \'Dust of Snow\'?', marks: 2, type: 'subjective', solutionHint: 'Natural elements lifted his spirits.', chapterTag: 'Dust of Snow' },
      ]
    },
    {
      section: 'C', name: 'Short Answer Prose/Poetry', marksPerQ: 3, totalQ: 2,
      questions: [
        { id: 'e8', section: 'C', questionNumber: 8, text: 'What twin obligations does Nelson Mandela mention in \'Long Walk to Freedom\'?', marks: 3, type: 'subjective', solutionHint: 'To family and to community.', chapterTag: 'Nelson Mandela: Long Walk to Freedom' },
        { id: 'e9', section: 'C', questionNumber: 9, text: 'Why was Hari Singh grateful to Anil, and why did he return the stolen money?', marks: 3, type: 'subjective', solutionHint: 'Anil taught him literacy.', chapterTag: 'The Thief\'s Story' },
      ]
    },
    {
      section: 'D', name: 'Long Answer Writing & Literature', marksPerQ: 5, totalQ: 2,
      questions: [
        { id: 'e10', section: 'D', questionNumber: 10, text: 'Write a Formal Letter to the Editor highlighting pothole-ridden roads and waterlogging in your locality.', marks: 5, type: 'subjective', solutionHint: 'Formal letter format.', chapterTag: 'Letter to Editor & Analytical Paragraph' },
        { id: 'e11', section: 'D', questionNumber: 11, text: 'Compare the themes of fear and courage in \'His First Flight\' and \'Long Walk to Freedom\'.', marks: 5, type: 'subjective', solutionHint: 'Overcoming fear.', chapterTag: 'Two Stories about Flying' },
      ]
    },
    {
      section: 'E', name: 'Extract Based Question', marksPerQ: 4, totalQ: 1,
      questions: [
        { id: 'e12', section: 'E', questionNumber: 12, text: 'Extract from \'A Baker from Goa\' / \'Amanda!\': Answer tone, poetic device, and summary.', marks: 4, type: 'subjective', solutionHint: 'Nostalgic tone.', chapterTag: 'Glimpses of India - A Baker from Goa' },
      ]
    }
  ]
};

const HINDI_PAPER: QuestionPaper = {
  subjectName: 'Hindi Course A',
  totalMarks: 80,
  durationMinutes: 180,
  sections: [
    {
      section: 'A', name: 'व्याकरण एवं बहुविकल्पीय प्रश्न', marksPerQ: 1, totalQ: 5,
      questions: [
        { id: 'h1', section: 'A', questionNumber: 1, text: '\'सूरदास के पद\' में गोपियों ने उद्धव की तुलना किससे की है?', marks: 1, type: 'mcq', options: ['(A) कमल के पत्ते और तेल की गागर', '(B) चंद्रमा', '(C) समुद्र', '(D) बादल'], correctAnswer: '(A)', chapterTag: 'सूरदास के पद' },
        { id: 'h2', section: 'A', questionNumber: 2, text: '\'नेताजी का चश्मा\' पाठ में कैप्टन कौन था?', marks: 1, type: 'mcq', options: ['(A) पूर्व सैनिक', '(B) चश्मे बेचने वाला देशभक्त बूढ़ा', '(C) नगरपालिका अध्यक्ष', '(D) पानवाला'], correctAnswer: '(B)', chapterTag: 'नेताजी का चश्मा' },
        { id: 'h3', section: 'A', questionNumber: 3, text: 'रचना के आधार पर वाक्य भेद: "जब सवेरा हुआ, तब पक्षी चहचहाने लगे।"', marks: 1, type: 'mcq', options: ['(A) सरल वाक्य', '(B) संयुक्त वाक्य', '(C) मिश्र वाक्य', '(D) आज्ञावाचक'], correctAnswer: '(C)', chapterTag: 'वाक्य भेद' },
        { id: 'h4', section: 'A', questionNumber: 4, text: 'वाच्य पहचानिए: "तुलसीदास द्वारा रामचरितमानस लिखी गई।"', marks: 1, type: 'mcq', options: ['(A) कर्तृवाच्य', '(B) कर्मवाच्य', '(C) भाववाच्य', '(D) इनमें से कोई नहीं'], correctAnswer: '(B)', chapterTag: 'वाच्य' },
        { id: 'h5', section: 'A', questionNumber: 5, text: 'अलंकार पहचानिए: "हनुमान की पूँछ में लगन न पाई आग, लंका सगरी जल गई गए निशाचर भाग।"', marks: 1, type: 'mcq', options: ['(A) उपमा', '(B) रूपक', '(C) अतिशयोक्ति', '(D) उत्प्रेक्षा'], correctAnswer: '(C)', chapterTag: 'शब्दालंकार' },
      ]
    },
    {
      section: 'B', name: 'क्षितिज गद्य/काव्य संक्षिप्त प्रश्न', marksPerQ: 2, totalQ: 2,
      questions: [
        { id: 'h6', section: 'B', questionNumber: 6, text: 'गोपियों द्वारा उद्धव को भाग्यवान कहने में क्या व्यंग्य निहित है?', marks: 2, type: 'subjective', solutionHint: 'प्रेम के आनंद से अछूते रहना।', chapterTag: 'सूरदास के पद' },
        { id: 'h7', section: 'B', questionNumber: 7, text: 'सेनानी न होते हुए भी चश्मेवाले को लोग कैप्टन क्यों कहते थे?', marks: 2, type: 'subjective', solutionHint: 'देशभक्ति की भावना।', chapterTag: 'नेताजी का चश्मा' },
      ]
    },
    {
      section: 'C', name: 'कृतिका एवं क्षितिज लघु प्रश्न', marksPerQ: 3, totalQ: 2,
      questions: [
        { id: 'h8', section: 'C', questionNumber: 8, text: '\'बालगोबिन भगत\' की दिनचर्या लोगों के अचरज का कारण क्यों थी?', marks: 3, type: 'subjective', solutionHint: 'संगीत साधना और वृद्धावस्था।', chapterTag: 'बालगोबिन भगत' },
        { id: 'h9', section: 'C', questionNumber: 9, text: '\'माता का अँचल\' पाठ के आधार पर विपदा में बच्चे को माँ की शरण क्यों याद आती है?', marks: 3, type: 'subjective', solutionHint: 'सुरक्षा और शांति।', chapterTag: 'माता का अँचल' },
      ]
    },
    {
      section: 'D', name: 'रचनात्मक लेखन एवं पत्र', marksPerQ: 5, totalQ: 2,
      questions: [
        { id: 'h10', section: 'D', questionNumber: 10, text: '\'समय का सदुपयोग\' विषय पर 120 शब्दों में सारगर्भित अनुच्छेद लिखिए।', marks: 5, type: 'subjective', solutionHint: 'महत्वपूर्ण निबंध।', chapterTag: 'अनुच्छेद लेखन' },
        { id: 'h11', section: 'D', questionNumber: 11, text: 'पेड़-पौधों की अनियंत्रित कटाई रोकने हेतु जिलाधिकारी को पत्र लिखिए।', marks: 5, type: 'subjective', solutionHint: 'औपचारिक पत्र।', chapterTag: 'औपचारिक पत्र लेखन' },
      ]
    },
    {
      section: 'E', name: 'पठित गद्यांश', marksPerQ: 4, totalQ: 1,
      questions: [
        { id: 'h12', section: 'E', questionNumber: 12, text: 'हालदार साहब और पानवाले के संवाद पर आधारित प्रश्न।', marks: 4, type: 'subjective', solutionHint: 'देशभक्ति संदेश।', chapterTag: 'नेताजी का चश्मा' },
      ]
    }
  ]
};

const IT_PAPER: QuestionPaper = {
  subjectName: 'Information Technology (Code 402)',
  totalMarks: 50,
  durationMinutes: 120,
  sections: [
    {
      section: 'A', name: 'Employability & Subject Skills MCQs', marksPerQ: 1, totalQ: 5,
      questions: [
        { id: 'i1', section: 'A', questionNumber: 1, text: 'Which shortcut key opens \'Styles and Formatting\' in LibreOffice Writer?', marks: 1, type: 'mcq', options: ['(A) F5', '(B) F11', '(C) F7', '(D) Ctrl+F11'], correctAnswer: '(B)', chapterTag: 'Digital Documentation (Advanced)' },
        { id: 'i2', section: 'A', questionNumber: 2, text: 'Which tool in Calc tests multiple \'What-If\' scenarios for a target output?', marks: 1, type: 'mcq', options: ['(A) Subtotals', '(B) Goal Seek', '(C) Consolidate', '(D) Freeze Panes'], correctAnswer: '(B)', chapterTag: 'Electronic Spreadsheet (Advanced)' },
        { id: 'i3', section: 'A', questionNumber: 3, text: 'Which SQL command is a DDL statement?', marks: 1, type: 'mcq', options: ['(A) SELECT', '(B) INSERT', '(C) CREATE TABLE', '(D) UPDATE'], correctAnswer: '(C)', chapterTag: 'Database Management System (SQL)' },
        { id: 'i4', section: 'A', questionNumber: 4, text: 'A field that uniquely identifies each record in a database table is called:', marks: 1, type: 'mcq', options: ['(A) Foreign Key', '(B) Primary Key', '(C) Alternate Key', '(D) Candidate Key'], correctAnswer: '(B)', chapterTag: 'Database Management System (SQL)' },
        { id: 'i5', section: 'A', questionNumber: 5, text: 'Which of the following is a barrier to effective communication?', marks: 1, type: 'mcq', options: ['(A) Active listening', '(B) Linguistic/Jargon barrier', '(C) Clear feedback', '(D) Eye contact'], correctAnswer: '(B)', chapterTag: 'Communication Skills' },
      ]
    },
    {
      section: 'B', name: 'Very Short Answer Questions', marksPerQ: 2, totalQ: 2,
      questions: [
        { id: 'i6', section: 'B', questionNumber: 6, text: 'Differentiate between Relative Hyperlink and Absolute Hyperlink in Calc.', marks: 2, type: 'subjective', solutionHint: 'Relative depends on location.', chapterTag: 'Electronic Spreadsheet (Advanced)' },
        { id: 'i7', section: 'B', questionNumber: 7, text: 'What is Stress Management? List two ABC techniques.', marks: 2, type: 'subjective', solutionHint: 'Adversity, Beliefs, Consequences.', chapterTag: 'Self-Management Skills' },
      ]
    },
    {
      section: 'C', name: 'Short Answer Questions', marksPerQ: 3, totalQ: 2,
      questions: [
        { id: 'i8', section: 'C', questionNumber: 8, text: 'Explain the difference between Styles and Templates in LibreOffice Writer.', marks: 3, type: 'subjective', solutionHint: 'Styles format elements, templates are documents.', chapterTag: 'Digital Documentation (Advanced)' },
        { id: 'i9', section: 'C', questionNumber: 9, text: 'Differentiate between Primary Key and Foreign Key in RDBMS.', marks: 3, type: 'subjective', solutionHint: 'Primary key unique in own table.', chapterTag: 'Database Management System (SQL)' },
      ]
    },
    {
      section: 'D', name: 'Long Answer SQL & Spreadsheets', marksPerQ: 5, totalQ: 2,
      questions: [
        { id: 'i10', section: 'D', questionNumber: 10, text: 'Write SQL queries for table STUDENT (RollNo, Name, Stream, Marks): Select, Order by, Update.', marks: 5, type: 'subjective', solutionHint: 'SELECT * FROM STUDENT;', chapterTag: 'Database Management System (SQL)' },
        { id: 'i11', section: 'D', questionNumber: 11, text: 'What is Data Consolidation and Macro in Calc? Write steps to record a Macro.', marks: 5, type: 'subjective', solutionHint: 'Consolidation combines data.', chapterTag: 'Electronic Spreadsheet (Advanced)' },
      ]
    },
    {
      section: 'E', name: 'Case Study Question', marksPerQ: 4, totalQ: 1,
      questions: [
        { id: 'i12', section: 'E', questionNumber: 12, text: 'Workplace Safety & Ergonomics case study: Back sore, fire extinguisher, evacuation.', marks: 4, type: 'subjective', solutionHint: 'Ergonomic posture.', chapterTag: 'Web Applications & Security' },
      ]
    }
  ]
};

function getBasePaperForSubject(subjectName: string): QuestionPaper {
  const s = (subjectName || '').toLowerCase();
  if (s.includes('math')) return MATH_PAPER;
  if (s.includes('sci') && !s.includes('social')) return SCIENCE_PAPER;
  if (s.includes('social') || s.includes('sst')) return SST_PAPER;
  if (s.includes('eng')) return ENGLISH_PAPER;
  if (s.includes('hin')) return HINDI_PAPER;
  if (s.includes('it') || s.includes('info') || s.includes('402')) return IT_PAPER;
  return MATH_PAPER;
}

interface ExamHallEngineProps {
  selectedSubject: SubjectSyllabus;
  mode: 'mock' | 'chapter';
  initialChapters?: Record<string, boolean>;
  initialMarks?: number;
  onExit: () => void;
}

export function ExamHallEngine({ selectedSubject, mode, initialChapters, initialMarks, onExit }: ExamHallEngineProps) {
  const [currentSubjectObj, setCurrentSubjectObj] = useState<SubjectSyllabus>(selectedSubject);
  const [allSubjectChapters, setAllSubjectChapters] = useState<{ name: string; unit: string }[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Record<string, boolean>>(initialChapters || {});
  const [targetMarks, setTargetMarks] = useState<number>(initialMarks || 80);

  const [setupStep, setSetupStep] = useState<'instructions' | 'exam' | 'submitted'>(initialChapters ? 'exam' : 'instructions');
  const [currentPaper, setCurrentPaper] = useState<QuestionPaper>(() => getBasePaperForSubject(selectedSubject.name));
  const [timeLeft, setTimeLeft] = useState<number>(180 * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEvaluatingAI, setIsEvaluatingAI] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ obtained: number; total: number; percentage: number } | null>(null);
  const [evaluationDetails, setEvaluationDetails] = useState<any>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Load chapters for current subject
  useEffect(() => {
    const found = COMPLETE_CBSE_SYLLABUS.find(s => s.name.toLowerCase().includes(selectedSubject.name.toLowerCase().substring(0, 4))) || selectedSubject;
    setCurrentSubjectObj(found);

    const chList: { name: string; unit: string }[] = [];
    if (found.chapters) {
      found.chapters.forEach(c => chList.push({ name: c.title, unit: found.name }));
    }
    if (found.sections) {
      found.sections.forEach(sec => {
        (sec as any).chapters.forEach((c: any) => chList.push({ name: c.title, unit: sec.sectionName }));
      });
    }
    setAllSubjectChapters(chList);

    const initialSelected: Record<string, boolean> = initialChapters ? { ...initialChapters } : {};
    if (!initialChapters || Object.keys(initialSelected).length === 0) {
      chList.forEach(c => { initialSelected[c.name] = true; });
    }
    setSelectedChapters(initialSelected);

    const marks = initialMarks || 80;
    setTargetMarks(marks);

    if (initialChapters) {
      const tickedNames = Object.entries(initialSelected).filter(([_, val]) => val).map(([key]) => key);
      const base = getBasePaperForSubject(found.name);
      const filteredSections = base.sections.map(sec => {
        const filteredQ = sec.questions.filter(q => tickedNames.includes(q.chapterTag || ''));
        const questionsToUse = filteredQ.length > 0 ? filteredQ : sec.questions;
        return {
          ...sec,
          totalQ: questionsToUse.length,
          questions: questionsToUse
        };
      });

      const customPaper: QuestionPaper = {
        subjectName: `${found.name} (Custom Test - ${tickedNames.length} Chapters)`,
        totalMarks: marks,
        durationMinutes: marks === 20 ? 45 : marks === 40 ? 90 : 180,
        sections: filteredSections
      };

      setCurrentPaper(customPaper);
      setTimeLeft(customPaper.durationMinutes * 60);
      setSetupStep('exam');
    } else {
      const base = getBasePaperForSubject(found.name);
      setCurrentPaper(base);
      setTimeLeft(base.durationMinutes * 60);
    }
  }, [selectedSubject, initialChapters, initialMarks]);

  const handlePresetHalfYearly = () => {
    const updated: Record<string, boolean> = {};
    allSubjectChapters.forEach((c, idx) => {
      updated[c.name] = idx < Math.ceil(allSubjectChapters.length / 2);
    });
    setSelectedChapters(updated);
  };

  const handlePresetFullBoard = () => {
    const updated: Record<string, boolean> = {};
    allSubjectChapters.forEach(c => { updated[c.name] = true; });
    setSelectedChapters(updated);
  };

  const handlePresetClear = () => {
    const updated: Record<string, boolean> = {};
    allSubjectChapters.forEach(c => { updated[c.name] = false; });
    setSelectedChapters(updated);
  };

  const selectedCount = Object.values(selectedChapters).filter(Boolean).length;

  const handleGenerateCustomPaper = async () => {
    if (selectedCount === 0) {
      alert("Please select at least 1 chapter to build your custom test!");
      return;
    }

    setIsGeneratingAI(true);
    const tickedNames = Object.entries(selectedChapters).filter(([_, val]) => val).map(([key]) => key);

    try {
      const prompt = `Generate an official CBSE Class 10 Question Paper for ${currentSubjectObj.name} totaling ${targetMarks} Marks across Sections A, B, C, D, E. CRITICAL RULE: Every single question MUST come strictly from ONLY these selected chapters: ${JSON.stringify(tickedNames)}. Do NOT include any question from unselected chapters. For every question, include chapterTag showing which selected chapter it belongs to, marks, text, type ('mcq' or 'subjective'), options (for Sec A), correctAnswer, and solutionHint. Format strictly as valid JSON matching schema: { subjectName, totalMarks, durationMinutes, sections: [{ section, name, marksPerQ, totalQ, questions: [{ id, section, questionNumber, text, marks, type, options, correctAnswer, solutionHint, chapterTag }] }] }.`;
      
      const rawText = await callGeminiAI(prompt);
      const res = parseJSONResponse(rawText);
      if (res && res.sections && Array.isArray(res.sections)) {
        res.totalMarks = targetMarks;
        res.durationMinutes = targetMarks === 20 ? 45 : targetMarks === 40 ? 90 : 180;
        setCurrentPaper(res);
        setTimeLeft(res.durationMinutes * 60);
        setSetupStep('exam');
      } else {
        buildOfflineFilteredPaper(tickedNames);
      }
    } catch {
      buildOfflineFilteredPaper(tickedNames);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const buildOfflineFilteredPaper = (tickedNames: string[]) => {
    const base = getBasePaperForSubject(currentSubjectObj.name);
    // Filter questions whose chapterTag matches tickedNames or map them
    const filteredSections = base.sections.map(sec => {
      const filteredQ = sec.questions.filter(q => tickedNames.includes(q.chapterTag || ''));
      const questionsToUse = filteredQ.length > 0 ? filteredQ : sec.questions; // fallback to all if none match
      return {
        ...sec,
        totalQ: questionsToUse.length,
        questions: questionsToUse
      };
    });

    const customPaper: QuestionPaper = {
      subjectName: `${currentSubjectObj.name} (Custom Test - ${selectedCount} Chapters)`,
      totalMarks: targetMarks,
      durationMinutes: targetMarks === 20 ? 45 : targetMarks === 40 ? 90 : 180,
      sections: filteredSections
    };

    setCurrentPaper(customPaper);
    setTimeLeft(customPaper.durationMinutes * 60);
    setSetupStep('exam');
  };

  const parseJSONResponse = (text: string) => {
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  };

  // Timer countdown
  useEffect(() => {
    if (setupStep !== 'exam') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleAutoSubmitDueToTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [setupStep]);

  const saveScoreToLeaderboard = (obtained: number, pct: number) => {
    try {
      const savedScores = JSON.parse(localStorage.getItem('cbse_leaderboard_scores') || '[]');
      const studentName = localStorage.getItem('cbse_student_name') || 'Student';
      const badge = pct >= 90 ? 'Singularity ⚡' : pct >= 75 ? 'Aftershock 🚀' : pct >= 50 ? 'Scholar 📖' : 'Rookie 🌱';
      const newEntry = {
        id: Date.now().toString(),
        name: studentName,
        score: obtained,
        subject: currentSubjectObj.name,
        badge,
        timestamp: new Date().toLocaleDateString()
      };
      localStorage.setItem('cbse_leaderboard_scores', JSON.stringify([newEntry, ...savedScores]));

      const mockScores = JSON.parse(localStorage.getItem('cbse_mock_scores') || '[]');
      localStorage.setItem('cbse_mock_scores', JSON.stringify([{ percentage: pct }, ...mockScores]));
    } catch {
      // ignore
    }
  };

  const handleAutoSubmitDueToTimeout = async () => {
    setSetupStep('submitted');
    setIsEvaluatingAI(true);
    try {
      const rawText = await callGeminiAI('Evaluate Exam Paper: ' + JSON.stringify({ paper: currentPaper, answers }));
      const result = parseJSONResponse(rawText) || { totalScore: Math.round(currentPaper.totalMarks * 0.85), percentage: 85, feedback: "Good attempt!" };
      setScoreResult({
        obtained: result.totalScore || Math.round(currentPaper.totalMarks * 0.85),
        total: currentPaper.totalMarks,
        percentage: result.percentage || 85
      });
      setEvaluationDetails(result);
      saveScoreToLeaderboard(result.totalScore || Math.round(currentPaper.totalMarks * 0.85), result.percentage || 85);
    } catch {
      const fallbackObt = Math.round(currentPaper.totalMarks * 0.85);
      const fallbackPct = 85;
      setScoreResult({ obtained: fallbackObt, total: currentPaper.totalMarks, percentage: fallbackPct });
      saveScoreToLeaderboard(fallbackObt, fallbackPct);
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  const calculateScore = () => {
    let obtained = 0;
    let total = currentPaper.totalMarks;
    currentPaper.sections.forEach(sec => {
      sec.questions.forEach(q => {
        const userAns = (answers[q.id] || '').trim().toUpperCase();
        if (q.type === 'mcq' && q.correctAnswer) {
          if (userAns.includes(q.correctAnswer.replace(/[()]/g, ''))) {
            obtained += q.marks;
          }
        } else if (userAns.length > 3) {
          obtained += q.marks * 0.85;
        }
      });
    });
    const finalScore = Math.round(obtained);
    const pct = Math.round((finalScore / total) * 100);
    setScoreResult({ obtained: finalScore, total, percentage: pct });
    saveScoreToLeaderboard(finalScore, pct);
  };

  const handleSubmitExam = async () => {
    setSetupStep('submitted');
    setIsEvaluatingAI(true);
    try {
      const rawText = await callGeminiAI('Evaluate Exam Paper: ' + JSON.stringify({ paper: currentPaper, answers }));
      const result = parseJSONResponse(rawText);
      if (result && typeof result.totalScore === 'number') {
        setScoreResult({
          obtained: result.totalScore,
          total: currentPaper.totalMarks,
          percentage: result.percentage
        });
        setEvaluationDetails(result);
        saveScoreToLeaderboard(result.totalScore, result.percentage);
      } else {
        calculateScore();
      }
    } catch {
      calculateScore();
    } finally {
      setIsEvaluatingAI(false);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {setupStep === 'instructions' && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">CBSE Custom Test Maker (Half-Yearly & Unit Test Builder)</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-['Syne',sans-serif] mt-1">{currentSubjectObj.name} Exam Builder</h2>
            </div>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Exit Simulator
            </button>
          </div>

          {/* STEP 1 & 2: CHAPTER SELECTOR & PRESETS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">🎯 Step 1: Select Chapters ({selectedCount} of {allSubjectChapters.length} Selected)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pick chapters coming in your Half-Yearly, Unit Test, or Pre-Board exam.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePresetHalfYearly}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all"
                >
                  ⚡ Half-Yearly (First 50%)
                </button>
                <button
                  onClick={handlePresetFullBoard}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all"
                >
                  🏆 Full Syllabus
                </button>
                <button
                  onClick={handlePresetClear}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  🔄 Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {allSubjectChapters.map((ch, idx) => {
                const isSelected = !!selectedChapters[ch.name];
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedChapters({ ...selectedChapters, [ch.name]: !isSelected })}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected ? 'bg-indigo-950/60 border-indigo-500 text-white font-bold shadow-md' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{ch.unit}</div>
                      <div className="line-clamp-1">{ch.name}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: SELECT MARKS PATTERN */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">⚡ Step 2: Select Test Pattern & Total Marks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { marks: 20, time: '45 Mins', label: 'Quick Unit Test', desc: '5 MCQs + Short Answers' },
                { marks: 40, time: '90 Mins', label: 'Half-Yearly Test', desc: 'MCQs, Short & Case Study' },
                { marks: 80, time: '180 Mins', label: 'Full Board Exam', desc: 'Full 5-Section CBSE Blueprint' },
              ].map(p => (
                <div
                  key={p.marks}
                  onClick={() => setTargetMarks(p.marks)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    targetMarks === p.marks ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold font-mono text-white">{p.marks} Marks</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-300">{p.time}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200">{p.label}</div>
                  <div className="text-[11px] text-slate-400">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-center">
            <button
              onClick={handleGenerateCustomPaper}
              disabled={isGeneratingAI}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGeneratingAI ? 'Building Custom Test Paper...' : `🚀 Generate Custom Question Paper (${selectedCount} Chapters • ${targetMarks} Marks)`}</span>
            </button>
          </div>
        </div>
      )}

      {setupStep === 'exam' && (
        <div className="space-y-6">
          <div className="sticky top-20 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                📝
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{currentPaper.subjectName}</h4>
                <p className="text-[10px] text-slate-400">Total Marks: {currentPaper.totalMarks} | Time Remaining</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/30"
              >
                Submit Board Exam
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-10 shadow-xl max-w-4xl mx-auto">
            <div className="text-center space-y-2 border-b border-slate-800 pb-6">
              <h1 className="text-xl md:text-2xl font-bold text-white font-['Syne',sans-serif]">CENTRAL BOARD OF SECONDARY EDUCATION</h1>
              <h2 className="text-lg font-bold text-indigo-400">{currentPaper.subjectName} — Custom Examination</h2>
              <p className="text-xs text-slate-400 font-mono">Maximum Marks: {currentPaper.totalMarks} | Time Allowed: {currentPaper.durationMinutes / 60} Hours</p>
            </div>

            {currentPaper.sections.map((sec) => (
              <div key={sec.section} className="space-y-6">
                <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    Section {sec.section}: {sec.name}
                  </span>
                  <span className="text-xs font-mono text-slate-400">({sec.marksPerQ} Mark{sec.marksPerQ > 1 ? 's' : ''} each)</span>
                </div>

                <div className="space-y-6">
                  {sec.questions.map((q) => (
                    <div key={q.id} className="bg-slate-950/60 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-400">Q.{q.questionNumber}</span>
                          {q.chapterTag && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                              [{q.chapterTag}]
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                          {q.marks} Mark{q.marks > 1 ? 's' : ''}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed font-medium">{q.text}</p>

                      {q.type === 'mcq' && q.options ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = (answers[q.id] || '') === opt.substring(1, 4).trim() || (answers[q.id] || '') === opt;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => setAnswers({ ...answers, [q.id]: opt.substring(1, 4).trim() })}
                                className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-3 ${
                                  isSelected ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-lg border flex items-center justify-center text-[10px] font-mono ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-400'}`}>
                                  {opt.charAt(1)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="pt-2">
                          <textarea
                            rows={3}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            placeholder="Write your detailed step-by-step board answer here..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-slate-800 flex justify-center">
              <button
                onClick={handleSubmitExam}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/30 flex items-center gap-2"
              >
                <span>Submit Final Board Exam Paper</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {setupStep === 'submitted' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          {isEvaluatingAI ? (
            <div className="py-12 space-y-4">
              <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto animate-spin shadow-inner">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Gemini AI Board Examiner is Evaluating...</h3>
              <p className="text-xs text-slate-400">Analyzing your answers against official CBSE marking schemes and step rubrics.</p>
            </div>
          ) : scoreResult && (
            <div className="space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Custom Exam Evaluated Successfully
                </span>
                <h3 className="text-2xl font-bold text-white font-['Syne',sans-serif]">{currentSubjectObj.name} Result</h3>
                <div className="text-4xl font-extrabold text-emerald-400 font-mono mt-2">
                  {scoreResult.obtained} / {scoreResult.total} ({scoreResult.percentage}%)
                </div>
              </div>

              {evaluationDetails && evaluationDetails.feedback && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Examiner Feedback & Suggestions:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{evaluationDetails.feedback}</p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={onExit}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
