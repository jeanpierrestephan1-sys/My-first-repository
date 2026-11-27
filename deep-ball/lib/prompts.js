// Question bank. Every question has many right answers.
// 'e' = the whole family can answer. 'h' = harder, only used in the "Trivia buffs" setting.
// To add your own: add a line to a category, or add a whole new category.

const BANK = {
  'History': [
    ['Name a U.S. president', 'e'], ['Name an ancient civilization', 'e'], ['Name a war the United States fought in', 'e'],
    ['Name a famous explorer', 'e'], ['Name an invention from before 1900', 'e'], ['Name a king or queen of England', 'e'],
    ['Name one of the original thirteen colonies', 'e'], ['Name a signer of the Declaration of Independence', 'h'],
    ['Name a Roman emperor', 'h'], ['Name a country that was part of the Soviet Union', 'h'],
    ['Name a vice president who never became president', 'h'], ['Name a First Lady', 'h'],
  ],
  'Science & Nature': [
    ['Name a planet or moon in our solar system', 'e'], ['Name a chemical element', 'e'], ['Name a bone in the human body', 'e'],
    ['Name a kind of storm or severe weather', 'e'], ['Name a famous scientist', 'e'], ['Name a dinosaur', 'e'], ['Name a kind of tree', 'e'],
    ['Name a constellation', 'h'], ['Name a part of a cell', 'h'], ['Name a gas found in the air', 'h'],
    ['Name a unit of measurement named after a person', 'h'], ['Name a gemstone or mineral', 'h'],
  ],
  'Geography': [
    ['Name a country in Africa', 'e'], ['Name a U.S. state capital', 'e'], ['Name a river', 'e'], ['Name an island country', 'e'],
    ['Name a mountain or mountain range', 'e'], ['Name a country in South America', 'e'], ['Name a U.S. national park', 'e'],
    ['Name a landlocked country', 'h'], ['Name a capital city in Asia', 'h'], ['Name a desert', 'h'],
    ['Name a U.S. state that borders Canada', 'h'], ['Name a country the equator passes through', 'h'],
  ],
  'Movies & TV': [
    ['Name a Disney or Pixar movie', 'e'], ['Name a TV show set in a workplace', 'e'], ['Name an actor who has played a superhero', 'e'],
    ['Name a movie with a number in its title', 'e'], ['Name a game show', 'e'], ['Name a cartoon character', 'e'], ['Name a movie set in space', 'e'],
    ['Name a sitcom from the 1990s', 'e'], ['Name a movie that won Best Picture', 'h'], ['Name a film directed by Steven Spielberg', 'h'],
    ['Name an actor who has played James Bond', 'h'], ['Name an actor with more than one Oscar', 'h'],
  ],
  'Music': [
    ['Name a Beatles song', 'e'], ['Name a musical instrument', 'e'], ['Name a singer known by one name', 'e'], ['Name a Christmas song', 'e'],
    ['Name a Taylor Swift song', 'e'], ['Name a Broadway musical', 'e'], ['Name a country music star', 'e'],
    ['Name a classical composer', 'h'], ['Name a song with a city or state in the title', 'h'], ['Name a band with a color in its name', 'h'],
    ['Name a one-hit wonder', 'h'], ['Name a Motown artist or group', 'h'],
  ],
  'Food & Drink': [
    ['Name a pizza topping', 'e'], ['Name a kind of pasta', 'e'], ['Name a breakfast cereal', 'e'], ['Name a cheese', 'e'],
    ['Name a spice or herb', 'e'], ['Name a candy bar', 'e'], ['Name an ice cream flavor', 'e'], ['Name a kind of bread', 'e'],
    ['Name a cocktail', 'h'], ['Name a food named after a place', 'h'], ['Name a kind of dumpling or stuffed dough from anywhere in the world', 'h'],
    ['Name a French cooking term used in English', 'h'],
  ],
  'Sports': [
    ['Name an Olympic sport', 'e'], ['Name a sport that uses a net', 'e'], ['Name an NBA team', 'e'], ['Name a sport played without a ball', 'e'],
    ['Name a martial art', 'e'], ['Name a baseball team', 'e'], ['Name something you would find in a gym bag', 'e'],
    ['Name a city that has hosted the Olympics', 'h'], ['Name a golfer who has won a major', 'h'], ['Name a tennis Grand Slam champion', 'h'],
    ['Name an athlete famous by a nickname', 'h'], ['Name a team that has won the World Series', 'h'],
  ],
  'Football': [
    ['Name a city with an NFL team', 'e'], ['Name a position on a football team', 'e'], ['Name a famous quarterback, past or present', 'e'],
    ['Name a football team named after an animal', 'e'], ['Name a food you would find at a tailgate', 'e'], ['Name a football movie', 'e'],
    ['Name a college with a famous football team', 'e'], ['Name a football penalty', 'h'], ['Name a Heisman Trophy winner', 'h'],
    ['Name a college bowl game', 'h'], ['Name an NFL head coach, past or present', 'h'], ['Name a quarterback with more than one Super Bowl win', 'h'],
  ],
  'Books & Words': [
    ['Name a book you had to read in school', 'e'], ['Name a Dr. Seuss book', 'e'], ['Name a Harry Potter character', 'e'], ['Name a famous author', 'e'],
    ['Name a punctuation mark', 'e'], ['Name a language other than English', 'e'], ['Name a fairy tale', 'e'], ['Name a word that starts and ends with the same letter', 'e'],
    ['Name a Shakespeare play', 'h'], ['Name a palindrome', 'h'], ['Name a word with no A, E, I, O or U', 'h'], ['Name a Greek or Roman god', 'h'],
  ],
  'Animals': [
    ['Name a dog breed', 'e'], ['Name an animal with stripes or spots', 'e'], ['Name a bird that cannot fly', 'e'], ['Name a sea creature that is not a fish', 'e'],
    ['Name a big cat', 'e'], ['Name an insect', 'e'], ['Name an animal native to Australia', 'e'], ['Name a farm animal', 'e'],
    ['Name an animal that hibernates', 'h'], ['Name a marsupial', 'h'], ['Name a primate', 'h'], ['Name a venomous animal', 'h'],
  ],
  'Everyday Life': [
    ['Name something in a junk drawer', 'e'], ['Name a board game', 'e'], ['Name a car brand', 'e'], ['Name something you pack for the beach', 'e'],
    ['Name a chore nobody wants', 'e'], ['Name a tool in a toolbox', 'e'], ['Name a card game', 'e'], ['Name something people collect', 'e'],
    ['Name a kitchen appliance', 'e'], ['Name a car brand that no longer makes cars', 'h'], ['Name a currency other than the dollar', 'h'],
    ['Name a company founded before 1900', 'h'],
  ],
  'Famous Faces': [
    ['Name a famous person named Chris', 'e'], ['Name a celebrity chef', 'e'], ['Name a superhero', 'e'], ['Name a fictional detective', 'e'],
    ['Name a late-night TV host, past or present', 'e'], ['Name a famous duo', 'e'], ['Name a video game character', 'e'], ['Name a Muppet', 'e'],
    ['Name a famous painter', 'h'], ['Name a famous person known by their initials', 'h'], ['Name an astronaut', 'h'], ['Name a Nobel Peace Prize winner', 'h'],
  ],
  'Holidays': [
    ['Name a Thanksgiving side dish', 'e'], ['Name a Christmas movie', 'e'], ['Name a Halloween costume', 'e'], ['Name one of Santa\'s reindeer', 'e'],
    ['Name a holiday that is not in December', 'e'], ['Name something you find in a stocking', 'e'], ['Name a birthday party game', 'e'],
    ['Name a gift from The Twelve Days of Christmas', 'h'], ['Name a holiday celebrated mainly outside the United States', 'h'],
    ['Name a tradition for New Year\'s Eve or New Year\'s Day from anywhere in the world', 'h'],
  ],
};

// Huddle plays: no right answer, you score by matching the family.
const HUDDLE = [
  'Who in this family yells loudest at the TV?', 'Who in this family would win the most money on a quiz show?',
  'Who in this family falls asleep first on the couch?', 'Who in this family is the best cook?',
  'Who in this family takes board games too seriously?', 'Who in this family would survive longest on a desert island?',
  'What is the best pie on the holiday table?', 'What is the best pizza topping?', 'What is the best ice cream flavor?',
  'What is the best decade for music?', 'What is the greatest movie of all time?', 'What is the best holiday of the year?',
  'Who is the greatest quarterback of all time?', 'What is the best family vacation spot?', 'What is the best board game?',
  'Which team does this family love to hate?',
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Values climb through the game like rows on a quiz board; the last play is worth double.
function valueAt(i, count) {
  const row = Math.min(5, Math.ceil(((i + 1) * 5) / count));
  return row * 200 * (i === count - 1 ? 2 : 1);
}

// A game script: slots for category picks, a few huddle plays in the middle, plus the unused question pool.
function buildGame(count, crowd) {
  const pool = {};
  for (const [cat, qs] of Object.entries(BANK)) {
    pool[cat] = shuffle(qs.filter(([, t]) => crowd === 'buffs' || t === 'e').map(([q]) => q));
  }
  const huddle = shuffle(HUDDLE.slice());
  const nHuddle = Math.max(1, Math.round(count / 4));
  const slots = shuffle(Array.from({ length: count - 2 }, (_, i) => i + 1)).slice(0, nHuddle);
  const plays = [];
  for (let i = 0; i < count; i++) {
    const value = valueAt(i, count);
    if (slots.includes(i)) plays.push({ type: 'huddle', cat: 'Family Huddle', q: huddle.pop(), value });
    else plays.push({ type: 'deep', cat: '', q: '', value });
  }
  return { plays, pool };
}

module.exports = { buildGame, shuffle };
