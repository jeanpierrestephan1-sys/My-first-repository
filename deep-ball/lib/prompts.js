// Question bank. Every question has many right answers: a few everyone thinks of, and a long tail.
// 'e' = the whole family can answer. 'h' = harder, only used in the "Trivia buffs" setting.
// To add your own: add a line to a category, or add a whole new category.

const BANK = {
  'History': [
    ['Name a U.S. president who served before 1900', 'e'], ['Name a person on U.S. money', 'e'],
    ['Name something invented in the 1800s', 'e'], ['Name a famous ship', 'e'], ['Name an explorer who has a place named after them', 'e'],
    ['Name an empire', 'e'], ['Name a wonder of the ancient or modern world', 'e'], ['Name a famous person from the American Revolution', 'e'],
    ['Name something a medieval knight carried or wore', 'e'], ['Name a famous queen', 'e'],
    ['Name a president who died in office', 'h'], ['Name a country that no longer exists', 'h'], ['Name a Roman emperor', 'h'],
    ['Name a wife of Henry VIII', 'h'], ['Name a battle of the Civil War', 'h'], ['Name a signer of the Declaration of Independence', 'h'],
    ['Name a pharaoh or ancient Egyptian god', 'h'],
  ],
  'Science & Nature': [
    ['Name something in space that is not a planet', 'e'], ['Name a planet that has moons', 'e'], ['Name an organ in the human body', 'e'],
    ['Name a bone in the human body', 'e'], ['Name something that glows in the dark', 'e'], ['Name a natural disaster', 'e'],
    ['Name a dinosaur', 'e'], ['Name a simple machine or a tool that works like one', 'e'], ['Name something that is a liquid at room temperature besides water', 'e'],
    ['Name a scientist with a law, unit or theory named after them', 'e'],
    ['Name a chemical element with a one-letter symbol', 'h'], ['Name a noble gas', 'h'], ['Name a part of the eye or ear', 'h'],
    ['Name a moon of Jupiter or Saturn', 'h'], ['Name a kind of cloud', 'h'], ['Name a geologic period or era', 'h'], ['Name a subatomic particle', 'h'],
  ],
  'Geography': [
    ['Name a country that is also an island', 'e'], ['Name a U.S. state with a two-word name', 'e'],
    ['Name a country whose name starts with a vowel', 'e'], ['Name a city that has hosted the Olympics', 'e'],
    ['Name a famous bridge, tower or monument', 'e'], ['Name a country where Spanish is the main language', 'e'], ['Name one of the Great Lakes or a sea', 'e'],
    ['Name a U.S. state capital that is not the biggest city in its state', 'e'], ['Name a country that borders the Mediterranean', 'e'],
    ['Name a U.S. national park', 'e'],
    ['Name a country with red, white and blue on its flag besides the United States', 'h'], ['Name a landlocked country', 'h'],
    ['Name a country that drives on the left', 'h'], ['Name a capital city in Africa', 'h'], ['Name a river that runs through a capital city', 'h'],
    ['Name a country the equator passes through', 'h'], ['Name a U.S. state that borders Canada', 'h'],
  ],
  'Movies & TV': [
    ['Name a movie where an animal is the star', 'e'], ['Name a movie with a color in its title', 'e'], ['Name a TV family', 'e'],
    ['Name a movie villain', 'e'], ['Name a movie that has at least three sequels', 'e'], ['Name a TV show that ran for more than ten seasons', 'e'],
    ['Name a movie set mostly on a boat, a plane or a train', 'e'], ['Name a Pixar character', 'e'], ['Name a movie robot or alien', 'e'],
    ['Name a game show host, past or present', 'e'],
    ['Name a movie that won Best Picture', 'h'], ['Name a film directed by Steven Spielberg', 'h'], ['Name an actor who has played a U.S. president', 'h'],
    ['Name an actor who has played Batman or James Bond', 'h'], ['Name a movie based on a Stephen King story', 'h'],
    ['Name a TV show with a spinoff', 'h'], ['Name a black-and-white movie', 'h'],
  ],
  'Music': [
    ['Name a song with a girl\'s name in the title', 'e'], ['Name a band named after a place', 'e'], ['Name an instrument in an orchestra', 'e'],
    ['Name a singer known by one name', 'e'], ['Name a song everyone sings at a wedding or a ballgame', 'e'], ['Name a Beatles song', 'e'],
    ['Name a musician who also acts', 'e'], ['Name a song with a number in the title', 'e'], ['Name a Broadway musical', 'e'],
    ['Name a famous band from England', 'e'],
    ['Name a song with a color in the title', 'h'], ['Name a classical composer', 'h'], ['Name a band whose lead singer went solo', 'h'],
    ['Name a one-hit wonder', 'h'], ['Name a Motown artist or group', 'h'], ['Name a musician who played Woodstock or Live Aid', 'h'],
    ['Name a famous drummer', 'h'],
  ],
  'Food & Drink': [
    ['Name a food that is better the next day', 'e'], ['Name a food you eat with your hands', 'e'], ['Name a sandwich', 'e'],
    ['Name a food named after a place', 'e'], ['Name a vegetable kids refuse to eat', 'e'], ['Name a kind of pasta shape', 'e'],
    ['Name a cheese', 'e'], ['Name a food that comes on a stick', 'e'], ['Name a soup', 'e'], ['Name a candy that has been around more than 50 years', 'e'],
    ['Name a food that is yellow', 'e'],
    ['Name a cocktail', 'h'], ['Name a kind of dumpling or stuffed dough from anywhere in the world', 'h'], ['Name a spice in a pumpkin pie or curry', 'h'],
    ['Name a cut of beef', 'h'], ['Name a wine grape or wine region', 'h'], ['Name a French cooking term used in English', 'h'],
  ],
  'Sports': [
    ['Name a sport in the Winter Olympics', 'e'], ['Name a sport with no ball', 'e'],
    ['Name a pro team named after an animal', 'e'], ['Name an athlete famous enough to go by one name', 'e'], ['Name a sport played on ice or in water', 'e'],
    ['Name a piece of equipment a baseball player uses', 'e'], ['Name a pro team from Pennsylvania, New York or California', 'e'],
    ['Name a sport with a racket, paddle or stick', 'e'], ['Name something a referee or umpire shouts', 'e'], ['Name a track and field event', 'e'],
    ['Name a golfer who has won the Masters', 'h'], ['Name a heavyweight boxing champion', 'h'],
    ['Name an athlete who played two pro sports or switched sports', 'h'], ['Name a team that has won the Stanley Cup', 'h'],
    ['Name a tennis player with at least five Grand Slam titles', 'h'], ['Name an athlete whose jersey number was retired', 'h'],
  ],
  'Football': [
    ['Name an NFL team named after a person, job or group of people', 'e'], ['Name a position on a football team', 'e'],
    ['Name a quarterback who has won a Super Bowl', 'e'], ['Name a food you would find at a tailgate', 'e'], ['Name a football movie', 'e'],
    ['Name a college team with an animal mascot', 'e'], ['Name something that stops the clock in football', 'e'], ['Name an NFL team in a cold-weather city', 'e'],
    ['Name a way to score in football', 'e'], ['Name a famous football coach', 'e'],
    ['Name a football penalty', 'h'], ['Name a Heisman Trophy winner', 'h'], ['Name a college bowl game', 'h'],
    ['Name an NFL team that has never won a Super Bowl', 'h'], ['Name a running back in the Hall of Fame', 'h'],
    ['Name a pair of brothers who both played in the NFL', 'h'], ['Name a famous play or game that has its own nickname', 'h'],
  ],
  'Books & Words': [
    ['Name a book that became a movie', 'e'], ['Name a word with a silent letter', 'e'],
    ['Name a character from a fairy tale', 'e'], ['Name a book series with at least five books', 'e'], ['Name a word that is also a name', 'e'],
    ['Name a word that means "big"', 'e'], ['Name a Dr. Seuss character', 'e'], ['Name a famous fictional place', 'e'],
    ['Name a word that is spelled the same forward and backward', 'e'], ['Name a comic strip', 'e'],
    ['Name a Shakespeare play', 'h'], ['Name a novel by Charles Dickens or Jane Austen', 'h'], ['Name a word English borrowed from another language', 'h'],
    ['Name a Greek or Roman god', 'h'], ['Name a word with no A, E, I, O or U', 'h'], ['Name a Pulitzer or Nobel winning author', 'h'],
    ['Name a collective noun for a group of animals', 'h'],
  ],
  'Animals': [
    ['Name an animal that is black and white', 'e'], ['Name an animal whose name is also a verb', 'e'], ['Name a bird that cannot fly', 'e'],
    ['Name an animal that carries its home or builds one', 'e'], ['Name an animal you would not want in your tent', 'e'], ['Name a dog breed named after a place', 'e'],
    ['Name a sea creature with no bones', 'e'], ['Name an animal faster than a person', 'e'], ['Name a baby animal with its own name', 'e'],
    ['Name an animal that lives more than 50 years', 'e'],
    ['Name an animal that hibernates', 'h'], ['Name a marsupial', 'h'], ['Name a mammal that lays eggs or lives in the sea', 'h'],
    ['Name an animal that is extinct besides a dinosaur', 'h'], ['Name a venomous animal that is not a snake', 'h'], ['Name a primate', 'h'],
    ['Name an animal on a country\'s flag or coat of arms', 'h'],
  ],
  'Everyday Life': [
    ['Name something everyone has in a junk drawer', 'e'], ['Name something people lose all the time', 'e'], ['Name a thing with buttons', 'e'],
    ['Name something you should not put in a microwave', 'e'], ['Name a chore nobody wants', 'e'], ['Name something that comes in pairs', 'e'],
    ['Name a board game that causes arguments', 'e'], ['Name something people are always late for', 'e'], ['Name something you only buy once a decade', 'e'],
    ['Name a thing in this house that is older than the youngest player', 'e'], ['Name something that always needs batteries or charging', 'e'],
    ['Name a car brand that no longer makes cars', 'h'], ['Name a currency other than the dollar', 'h'], ['Name a company older than 100 years', 'h'],
    ['Name a store or restaurant chain that went out of business', 'h'], ['Name something that used to be common in homes and is now rare', 'h'],
    ['Name a brand name people use for the whole product', 'h'],
  ],
  'Famous Faces': [
    ['Name a famous person named Michael or Jennifer', 'e'], ['Name a fictional detective or spy', 'e'], ['Name a famous duo', 'e'],
    ['Name a superhero without a cape', 'e'], ['Name a celebrity chef', 'e'], ['Name a video game character', 'e'], ['Name a Muppet or Sesame Street character', 'e'],
    ['Name a famous person with a famous sibling', 'e'], ['Name someone famous for being very rich', 'e'], ['Name a cartoon dog or cat', 'e'],
    ['Name a famous painter', 'h'], ['Name an astronaut', 'h'], ['Name a famous person known by their initials', 'h'],
    ['Name a Nobel Peace Prize winner', 'h'], ['Name a famous person who changed their name', 'h'],
    ['Name a famous inventor besides Edison', 'h'], ['Name a Supreme Court justice, past or present', 'h'],
  ],
  'Holidays': [
    ['Name a Thanksgiving dish that is not turkey', 'e'], ['Name a Christmas movie', 'e'], ['Name a Halloween costume you see every year', 'e'],
    ['Name one of Santa\'s reindeer', 'e'], ['Name a holiday with no gifts', 'e'], ['Name something that ends up in a Christmas stocking', 'e'],
    ['Name a thing people do on the Fourth of July', 'e'], ['Name a holiday song that never says the word Christmas', 'e'],
    ['Name a New Year\'s resolution people break', 'e'], ['Name a gift nobody wants', 'e'],
    ['Name a gift from The Twelve Days of Christmas', 'h'], ['Name a holiday celebrated mainly outside the United States', 'h'],
    ['Name a character from A Christmas Carol or It\'s a Wonderful Life', 'h'], ['Name a federal holiday that always falls on a Monday', 'h'],
    ['Name a New Year\'s tradition from anywhere in the world', 'h'],
  ],
};

// Huddle plays: no right answer, you score by matching the family.
const HUDDLE = [
  'Who in this family yells loudest at the TV?', 'Who in this family would win the most money on a quiz show?',
  'Who in this family falls asleep first on the couch?', 'Who in this family is the best cook?',
  'Who in this family takes board games too seriously?', 'Who in this family would survive longest on a desert island?',
  'Who in this family is most likely to be late?', 'Who in this family tells the longest stories?',
  'Who in this family would be first out in a zombie movie?', 'Who in this family has the worst taste in music?',
  'What is the best pie on the holiday table?', 'What is the best pizza topping?', 'What is the best decade for music?',
  'What is the greatest movie of all time?', 'What is the best family vacation we ever took?', 'What food does this family argue about most?',
  'Who is the greatest quarterback of all time?', 'Which team does this family love to hate?',
  'What is the one thing someone always forgets to pack?', 'What is this family\'s most quoted movie?',
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Values climb through the game like rows on a quiz board.
function valueAt(i, count) {
  return Math.min(5, Math.ceil(((i + 1) * 5) / (count - 1))) * 200;
}

// A game script: slots for category picks, a few huddle plays in the middle, a wager on the final play,
// plus the unused question pool.
// seen = questions this family has answered before. Each category brings one of them back as a rematch,
// so burned answers come back into play.
const PER_CATEGORY = 4;
function buildGame(count, crowd, seen) {
  const pool = {};
  for (const [cat, qs] of Object.entries(BANK)) {
    const all = shuffle(qs.filter(([, t]) => crowd === 'buffs' || t === 'e').map(([q]) => q));
    const old = all.filter((q) => seen && seen.has(q)), fresh = all.filter((q) => !(seen && seen.has(q)));
    const picks = [];
    const rematch = old.pop();
    while (picks.length < PER_CATEGORY - 1 && fresh.length) picks.push(fresh.pop());
    while (picks.length < PER_CATEGORY - 1 && old.length) picks.push(old.pop());
    // Questions are taken from the end: more often than not, a category with history leads with its rematch.
    if (rematch) { if (Math.random() < 0.6) picks.push(rematch); else picks.unshift(rematch); }
    else if (fresh.length) picks.push(fresh.pop());
    pool[cat] = picks;
  }
  const huddle = shuffle(HUDDLE.slice());
  const nHuddle = Math.max(1, Math.round(count / 4));
  const slots = shuffle(Array.from({ length: count - 2 }, (_, i) => i + 1)).slice(0, nHuddle);
  const plays = [];
  for (let i = 0; i < count; i++) {
    const value = valueAt(i, count);
    if (i === count - 1) plays.push({ type: 'deep', cat: '', q: '', value: 0, final: true });
    else if (slots.includes(i)) plays.push({ type: 'huddle', cat: 'Family Huddle', q: huddle.pop(), value });
    else plays.push({ type: 'deep', cat: '', q: '', value });
  }
  return { plays, pool };
}

module.exports = { buildGame, shuffle };
