const { getDatabase, WisdomText } = require('./db/database');
const crypto = require('crypto');

const seedData = [
  // Bhagavad Gita
  { book_name: "gita", chapter: "2", verse: "47", content: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction." },
  { book_name: "gita", chapter: "2", verse: "20", content: "The soul is neither born, nor does it ever die; nor having once existed, does it ever cease to be. The soul is without birth, eternal, immortal, and ageless. It is not destroyed when the body is destroyed." },
  { book_name: "gita", chapter: "6", verse: "34", content: "For the mind is restless, turbulent, obstinate and very strong, O Krishna. To subdue it, it seems to me, is more difficult than controlling the wind." },
  
  // The Bible
  { book_name: "bible", chapter: "Matthew 11", verse: "28", content: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls." },
  { book_name: "bible", chapter: "Psalm 23", verse: "4", content: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
  { book_name: "bible", chapter: "Philippians 4", verse: "6", content: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },

  // The Quran
  { book_name: "quran", chapter: "94", verse: "5", content: "So truly where there is hardship, there is also ease; indeed, with hardship comes ease." },
  { book_name: "quran", chapter: "2", verse: "286", content: "God does not burden a soul beyond that which it can bear." },
  { book_name: "quran", chapter: "13", verse: "28", content: "Those who believe and whose hearts find rest in the remembrance of God - indeed, in the remembrance of God do hearts find rest." },

  // Dhammapada (Buddhism)
  { book_name: "dhammapada", chapter: "1", verse: "1", content: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with an impure mind a person speaks or acts suffering follows him like the wheel that follows the foot of the ox." },
  { book_name: "dhammapada", chapter: "15", verse: "197", content: "Let us live happily then, free from hatred among those who hate. Among men who hate, let us dwell free from hatred." },

  // Tao Te Ching
  { book_name: "tao_te_ching", chapter: "16", verse: "1", content: "Nature does not hurry, yet everything is accomplished. If you search for peace, return to the source. Stillness is the lord of restlessness." },
  { book_name: "tao_te_ching", chapter: "22", verse: "1", content: "When you are content to be simply yourself and don't compare or compete, everybody will respect you." },

  // Guru Granth Sahib
  { book_name: "granth_sahib", chapter: "Japji Sahib", verse: "1", content: "There is but one God. True is His Name, creative His personality and immortal His form. He is without fear sans enmity, unborn and self-illumined." },
  { book_name: "granth_sahib", chapter: "Ang 25", verse: "1", content: "The world is burning in the fire of desire, in greed, arrogance and excessive ego. Only by attaching to the Truth can one find peace." },

  // The Torah
  { book_name: "torah", chapter: "Genesis 1", verse: "3", content: "And God said, Let there be light: and there was light." },
  { book_name: "torah", chapter: "Leviticus 19", verse: "18", content: "You shall not take vengeance or bear a grudge against your kinsfolk. Love your neighbor as yourself." }
];

async function seed() {
  await getDatabase();
  console.log('Seeding wisdom texts...');

  for (const item of seedData) {
    // Check if already exists to avoid duplicates if run multiple times
    const existing = await WisdomText.findOne({ 
      book_name: item.book_name, 
      chapter: item.chapter, 
      verse: item.verse 
    }).lean();

    if (!existing) {
      await WisdomText.create({
        id: crypto.randomUUID(),
        book_name: item.book_name,
        chapter: item.chapter,
        verse: item.verse,
        content: item.content
      });
    }
  }

  console.log('Finished seeding wisdom texts.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
