export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: {
    english: string;
    wordByWord: string;
    commentary: string;
  };
}

export interface Chapter {
  number: number;
  name: string;
  translation: string;
  verses: number;
  summary: string;
}

export const chapters: Chapter[] = [
  {
    number: 1,
    name: 'Arjuna Vishada Yoga',
    translation: "The Yoga of Arjuna's Dejection",
    verses: 47,
    summary: "Arjuna's moral dilemma on the battlefield of Kurukshetra",
  },
  {
    number: 2,
    name: 'Sankhya Yoga',
    translation: 'The Yoga of Knowledge',
    verses: 72,
    summary: 'Krishna begins his teachings on the immortal soul and dharma',
  },
  {
    number: 3,
    name: 'Karma Yoga',
    translation: 'The Yoga of Action',
    verses: 43,
    summary: 'The path of selfless action and duty',
  },
  {
    number: 4,
    name: 'Jnana Karma Sanyasa Yoga',
    translation: 'The Yoga of Wisdom and Action',
    verses: 42,
    summary: 'The divine incarnation and the knowledge of action',
  },
  {
    number: 5,
    name: 'Karma Sanyasa Yoga',
    translation: 'The Yoga of Renunciation',
    verses: 29,
    summary: 'The balance between renunciation and action',
  },
  {
    number: 6,
    name: 'Dhyana Yoga',
    translation: 'The Yoga of Meditation',
    verses: 47,
    summary: 'The practice of meditation and self-control',
  },
];

// Sample shlokas from different chapters
export const shlokas: Shloka[] = [
  {
    id: '1.1',
    chapter: 1,
    verse: 1,
    sanskrit:
      'धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||',
    transliteration:
      'dhṛitarāśhtra uvācha dharma-kṣhetre kuru-kṣhetre samavetā yuyutsavaḥ māmakāḥ pāṇḍavāśh chaiva kim akurvata sañjaya',
    translations: {
      english:
        'Dhritarashtra said: O Sanjaya, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?',
      wordByWord:
        'dhṛitarāśhtraḥ uvācha—Dhritarashtra said; dharma-kṣhetre—the land of dharma; kuru-kṣhetre—at Kurukshetra; samavetāḥ—having gathered; yuyutsavaḥ—desiring to fight; māmakāḥ—my sons; pāṇḍavāḥ—the sons of Pandu; cha—and; eva—certainly; kim—what; akurvata—did they do; sañjaya—Sanjay',
      commentary:
        'The Bhagavad Gita begins with King Dhritarashtra asking his minister Sanjaya about the events on the battlefield. The blind king is anxious to know what happened when his sons and the Pandavas assembled to fight.',
    },
  },
  {
    id: '2.47',
    chapter: 2,
    verse: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||',
    transliteration:
      "karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi",
    translations: {
      english:
        'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.',
      wordByWord:
        'karmaṇi—in prescribed duties; eva—only; adhikāraḥ—right; te—your; mā—not; phaleṣhu—in the fruits; kadāchana—at any time; mā—never; karma-phala—results of the activities; hetuḥ—cause; bhūḥ—be; mā—not; te—your; saṅgaḥ—attachment; astu—must be; akarmaṇi—in inaction',
      commentary:
        "This is one of the most important verses of the Gita. It teaches the principle of Nishkama Karma - performing one's duty without attachment to results. This verse emphasizes focusing on the action itself rather than being motivated by its fruits.",
    },
  },
  {
    id: '3.27',
    chapter: 3,
    verse: 27,
    sanskrit: 'प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः | अहङ्कारविमूढात्मा कर्ताहमिति मन्यते ||',
    transliteration:
      'prakṛiteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśhaḥ ahankāra-vimūḍhātmā kartāham iti manyate',
    translations: {
      english:
        'All actions are performed by the modes of material nature. But due to illusion, the soul, deluded by false ego, thinks itself to be the doer.',
      wordByWord:
        'prakṛiteḥ—of material nature; kriyamāṇāni—carried out; guṇaiḥ—by the three modes; karmāṇi—activities; sarvaśhaḥ—all kinds of; ahankāra-vimūḍha-ātmā—those who are bewildered by the ego and misidentify themselves with the body; kartā—the doer; aham—I; iti—thus; manyate—thinks',
      commentary:
        "This verse explains that all activities are actually carried out by the three modes of material nature. However, those who are deluded by false ego think 'I am the doer' and thus become bound by karma.",
    },
  },
  {
    id: '4.7',
    chapter: 4,
    verse: 7,
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत | अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||',
    transliteration:
      'yadā yadā hi dharmasya glānir bhavati bhārata abhyutthānam adharmasya tadātmānaṁ sṛijāmyaham',
    translations: {
      english:
        'Whenever there is a decline in righteousness and a rise in unrighteousness, O Arjuna, at that time I manifest Myself on earth.',
      wordByWord:
        'yadā yadā—whenever; hi—certainly; dharmasya—of righteousness; glāniḥ—decline; bhavati—occurs; bhārata—Arjuna; abhyutthānam—rise; adharmasya—of unrighteousness; tadā—then; ātmānam—self; sṛijāmi—manifest; aham—I',
      commentary:
        'Lord Krishna explains the purpose of divine incarnation. Whenever dharma declines and adharma rises, the Lord incarnates to restore balance and protect the righteous.',
    },
  },
  {
    id: '4.8',
    chapter: 4,
    verse: 8,
    sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् | धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ||',
    transliteration:
      'paritrāṇāya sādhūnāṁ vināśhāya cha duṣhkṛitām dharma-sansthāpanārthāya sambhavāmi yuge yuge',
    translations: {
      english:
        'To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of dharma, I advent Myself age after age.',
      wordByWord:
        'paritrāṇāya—for the protection; sādhūnām—of the righteous; vināśhāya—for the annihilation; cha—and; duṣhkṛitām—of the wicked; dharma—the eternal religion; sansthāpana-arthāya—to reestablish; sambhavāmi—I appear; yuge yuge—age after age',
      commentary:
        'This verse continues the theme of divine incarnation, stating the three purposes: protecting the good, destroying evil, and establishing dharma. The Lord appears in every age to fulfill these objectives.',
    },
  },
  {
    id: '5.10',
    chapter: 5,
    verse: 10,
    sanskrit:
      'ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः | लिप्यते न स पापेन पद्मपत्रमिवाम्भसा ||',
    transliteration:
      'brahmaṇy ādhāya karmāṇi saṅgaṁ tyaktvā karoti yaḥ lipyate na sa pāpena padma-patram ivāmbhasā',
    translations: {
      english:
        'One who performs their duties without attachment, dedicating them to the Supreme, is not tainted by sin, just as a lotus leaf is untouched by water.',
      wordByWord:
        'brahmaṇi—to the Supreme; ādhāya—dedicating; karmāṇi—all actions; saṅgam—attachment; tyaktvā—abandoning; karoti—performs; yaḥ—who; lipyate—is affected; na—not; saḥ—that person; pāpena—by sin; padma-patram—a lotus leaf; iva—like; ambhasā—by water',
      commentary:
        'This beautiful analogy compares the karma yogi to a lotus leaf. Just as water does not stick to a lotus leaf, sin does not attach to one who works without selfish desires, offering all actions to the Divine.',
    },
  },
  {
    id: '6.5',
    chapter: 6,
    verse: 5,
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् | आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||',
    transliteration:
      'uddhared ātmanātmānaṁ nātmānam avasādayet ātmaiva hyātmano bandhur ātmaiva ripur ātmanaḥ',
    translations: {
      english:
        'Elevate yourself through the power of your mind, and not degrade yourself, for the mind can be the friend and also the enemy of the self.',
      wordByWord:
        'uddharet—elevate; ātmanā—through the mind; ātmānam—the self; na—not; ātmānam—the self; avasādayet—degrade; ātmā—the mind; eva—certainly; hi—indeed; ātmanaḥ—of the self; bandhuḥ—friend; ātmā—the mind; eva—certainly; ripuḥ—enemy; ātmanaḥ—of the self',
      commentary:
        'This verse emphasizes self-responsibility and the dual nature of the mind. Through discipline and right understanding, the mind becomes our greatest ally. Through neglect and wrong pursuits, it becomes our worst enemy.',
    },
  },
  {
    id: '2.20',
    chapter: 2,
    verse: 20,
    sanskrit:
      'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः | अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ||',
    transliteration:
      "na jāyate mriyate vā kadāchin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ ajo nityaḥ śhāśhvato 'yaṁ purāṇo na hanyate hanyamāne śharīre",
    translations: {
      english:
        'The soul is never born and never dies. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.',
      wordByWord:
        'na—never; jāyate—takes birth; mriyate—dies; vā—or; kadāchit—at any time; na—not; ayam—this; bhūtvā—having once existed; bhavitā—will be; vā—or; na—not; bhūyaḥ—further; ajaḥ—unborn; nityaḥ—eternal; śhāśhvataḥ—immortal; ayam—this; purāṇaḥ—primordial; na hanyate—is not destroyed; hanyamāne—is destroyed; śharīre—when the body',
      commentary:
        'One of the foundational verses on the nature of the soul. It establishes that the soul is eternal and indestructible, beyond birth and death. This knowledge removes the fear of death and grief.',
    },
  },
  {
    id: '3.21',
    chapter: 3,
    verse: 21,
    sanskrit: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः | स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ||',
    transliteration:
      'yad yad ācharati śhreṣhṭhas tat tad evetaro janaḥ sa yat pramāṇaṁ kurute lokas tad anuvartate',
    translations: {
      english:
        'Whatever actions great persons perform, common people follow. Whatever standards they set, the world pursues.',
      wordByWord:
        'yat yat—whatever; ācharati—does; śhreṣhṭhaḥ—the best; tat tat—that (alone); eva—certainly; itaraḥ—common; janaḥ—people; saḥ—they; yat—whichever; pramāṇam—standard; kurute—perform; lokaḥ—world; tat—that; anuvartate—follows',
      commentary:
        'This verse emphasizes the responsibility of leaders and exemplary individuals. People naturally follow the examples set by those they respect. Therefore, those in positions of influence must conduct themselves with integrity.',
    },
  },
  {
    id: '6.35',
    chapter: 6,
    verse: 35,
    sanskrit:
      'श्रीभगवानुवाच | असंशयं महाबाहो मनो दुर्निग्रहं चलम् | अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ||',
    transliteration:
      'śhrī bhagavān uvācha asanśhayaṁ mahā-bāho mano durnigrahaṁ chalam abhyāsena tu kaunteya vairāgyeṇa cha gṛihyate',
    translations: {
      english:
        'The Blessed Lord said: Undoubtedly, O mighty-armed one, the mind is restless and difficult to control. But it can be controlled, O son of Kunti, through practice and detachment.',
      wordByWord:
        'śhrī-bhagavān uvācha—the Supreme Lord said; asanśhayam—undoubtedly; mahā-bāho—mighty-armed one; manaḥ—the mind; durnigraham—difficult to restrain; chalam—restless; abhyāsena—by practice; tu—but; kaunteya—Arjun, the son of Kunti; vairāgyeṇa—by detachment; cha—and; gṛihyate—can be controlled',
      commentary:
        "Lord Krishna acknowledges Arjuna's concern about the restless mind but offers hope. Through consistent practice (abhyasa) and cultivating detachment (vairagya), even the turbulent mind can be brought under control.",
    },
  },
];

export const gitaData = {
  chapters,
  shlokas,
};

