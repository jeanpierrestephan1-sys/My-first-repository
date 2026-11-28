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

// ---------- second helping: more questions for every category, plus four new categories ----------
const MORE = {
  'History': [
    ['Name a famous general', 'e'], ['Name something the ancient Romans built or used', 'e'], ['Name a famous pirate or outlaw', 'e'],
    ['Name a U.S. president from the last 60 years', 'e'], ['Name a country that fought in World War II', 'e'],
    ['Name a person famous for being the first to do something', 'e'], ['Name something people used before electricity', 'e'],
    ['Name a famous castle or palace', 'e'], ['Name a job that no longer exists', 'e'],
    ['Name a right protected by the Bill of Rights', 'h'], ['Name a dynasty or royal house', 'h'], ['Name a famous treaty', 'h'],
    ['Name a state that joined the Union after 1850', 'h'], ['Name a world leader during World War II', 'h'],
    ['Name an ancient Greek philosopher or writer', 'h'], ['Name a famous revolution', 'h'],
  ],
  'Science & Nature': [
    ['Name something with a shell', 'e'], ['Name something that orbits something else', 'e'], ['Name a flower', 'e'],
    ['Name something invisible that is real', 'e'], ['Name something that melts', 'e'], ['Name a part of a plant', 'e'],
    ['Name something a doctor measures', 'e'], ['Name a fruit that grows on a tree', 'e'], ['Name something hot enough to burn you', 'e'],
    ['Name a vitamin or mineral the body needs', 'h'], ['Name a branch of science', 'h'], ['Name a form of energy', 'h'],
    ['Name a famous space mission or spacecraft', 'h'], ['Name a disease that has a vaccine', 'h'],
    ['Name an element named after a place or a person', 'h'], ['Name a layer of the Earth or its atmosphere', 'h'], ['Name a famous volcano', 'h'],
  ],
  'Geography': [
    ['Name a country in Asia', 'e'], ['Name a U.S. state that touches an ocean', 'e'], ['Name a city with a famous nickname', 'e'],
    ['Name a famous beach or island vacation spot', 'e'], ['Name a language spoken in more than one country', 'e'],
    ['Name a U.S. city named after another place', 'e'], ['Name a country with a five-letter name', 'e'], ['Name a famous street or neighborhood', 'e'],
    ['Name a world city with a subway', 'e'], ['Name a country famous for its food', 'e'],
    ['Name a country that changed its name', 'h'], ['Name a strait, canal or channel', 'h'], ['Name a state capital named after a person', 'h'],
    ['Name a country with more than 100 million people', 'h'], ['Name one of the tallest mountains in the world', 'h'],
    ['Name a very small country', 'h'], ['Name a U.S. territory or a place that is not quite a country', 'h'],
  ],
  'Movies & TV': [
    ['Name a movie with a one-word title', 'e'], ['Name a movie that makes everyone cry', 'e'], ['Name a TV theme song everyone knows', 'e'],
    ['Name a movie set in a high school', 'e'], ['Name a famous movie car or vehicle', 'e'], ['Name a reality TV show', 'e'],
    ['Name a movie with a talking toy, car or animal', 'e'], ['Name a holiday TV special', 'e'], ['Name a movie princess', 'e'],
    ['Name a kids\' TV show from when you were little', 'e'],
    ['Name a Best Actor or Best Actress winner', 'h'], ['Name a movie that is a remake', 'h'], ['Name a TV show with a famous finale', 'h'],
    ['Name a movie that runs longer than three hours', 'h'], ['Name a famous movie score or its composer', 'h'],
    ['Name an actor who has also directed a movie', 'h'], ['Name a Saturday Night Live cast member', 'h'],
  ],
  'Music': [
    ['Name a song with a food in the title', 'e'], ['Name a song about a car or driving', 'e'], ['Name a boy band or girl group', 'e'],
    ['Name a song people always pick at karaoke', 'e'], ['Name a famous guitarist', 'e'], ['Name a song from a Disney movie', 'e'],
    ['Name a lullaby or nursery rhyme', 'e'], ['Name a famous singer from the 1980s', 'e'], ['Name a song with "love" in the title', 'e'],
    ['Name a dance or dance craze', 'e'], ['Name a patriotic song', 'e'],
    ['Name an album it seemed everyone owned', 'h'], ['Name a band with a number in its name', 'h'], ['Name a famous music festival or concert venue', 'h'],
    ['Name a song that was a hit for two different artists', 'h'], ['Name a jazz or blues legend', 'h'], ['Name an opera or a ballet', 'h'],
  ],
  'Food & Drink': [
    ['Name something you put on a burger', 'e'], ['Name a food that is always served cold', 'e'], ['Name a food you only eat at a fair or ballpark', 'e'],
    ['Name a breakfast food', 'e'], ['Name a kind of pie', 'e'], ['Name a fast food chain', 'e'], ['Name a spicy food', 'e'],
    ['Name something that goes in a salad', 'e'], ['Name a kind of cookie', 'e'], ['Name a drink that is served hot', 'e'],
    ['Name a food people either love or hate', 'e'],
    ['Name a fermented food or drink', 'h'], ['Name a Japanese dish', 'h'], ['Name a regional style of pizza or barbecue', 'h'],
    ['Name a classic sauce', 'h'], ['Name an Italian dessert or pastry', 'h'], ['Name a dish named after a person', 'h'],
  ],
  'Sports': [
    ['Name a game played at recess', 'e'], ['Name a famous stadium or arena', 'e'], ['Name a Summer Olympic sport that is not swimming or running', 'e'],
    ['Name an athlete people call the greatest ever at their sport', 'e'], ['Name a sport with a goalie', 'e'], ['Name a pro team mascot', 'e'],
    ['Name a piece of gear that protects an athlete', 'e'], ['Name a sport you can play alone', 'e'], ['Name a famous sports rivalry', 'e'],
    ['Name a hockey term', 'e'],
    ['Name a famous racehorse or horse race', 'h'], ['Name a race car driver', 'h'], ['Name a country that has won the World Cup', 'h'],
    ['Name a pitcher in the Baseball Hall of Fame', 'h'], ['Name an NBA Most Valuable Player', 'h'],
    ['Name an Olympic gold medalist in gymnastics or swimming', 'h'], ['Name a sports movie based on a true story', 'h'],
  ],
  'Football': [
    ['Name something painted or standing on a football field', 'e'], ['Name a football cheer, chant or tradition', 'e'],
    ['Name something a coach yells from the sideline', 'e'], ['Name a Super Bowl party food', 'e'], ['Name a famous football stadium', 'e'],
    ['Name an NFL team from a warm-weather city', 'e'], ['Name a sideline job that is not player or coach', 'e'],
    ['Name a jersey number a famous quarterback wore', 'e'], ['Name an NFL team with a color in its name or nickname', 'e'],
    ['Name a Super Bowl MVP', 'h'], ['Name a wide receiver in the Hall of Fame', 'h'], ['Name an NFL team that has moved cities', 'h'],
    ['Name an offensive formation or a defensive scheme', 'h'], ['Name a coach with more than one Super Bowl win', 'h'],
    ['Name a number one overall draft pick', 'h'], ['Name a college football conference', 'h'], ['Name a quarterback famous for running', 'h'],
  ],
  'Books & Words': [
    ['Name a sound word like "buzz"', 'e'], ['Name a book you read to little kids', 'e'], ['Name a word with a double letter in the middle', 'e'],
    ['Name a magazine or newspaper', 'e'], ['Name a word with more than one meaning', 'e'], ['Name a book with a color or number in the title', 'e'],
    ['Name a character from a nursery rhyme', 'e'], ['Name a word that came from texting or the internet', 'e'],
    ['Name a famous wizard, witch or dragon', 'e'], ['Name a word longer than ten letters', 'e'],
    ['Name a poet', 'h'], ['Name a classic novel that has been banned somewhere', 'h'], ['Name a book by Roald Dahl or C.S. Lewis', 'h'],
    ['Name a famous villain from a book', 'h'], ['Name a Latin phrase still used in English', 'h'], ['Name a figure of speech', 'h'],
    ['Name a Russian or French novelist', 'h'],
  ],
  'Animals': [
    ['Name an animal with horns or antlers', 'e'], ['Name an animal that comes out at night', 'e'], ['Name a pet that is not a dog or cat', 'e'],
    ['Name an animal that lives in a herd or pack', 'e'], ['Name a bird of prey', 'e'], ['Name an animal with a very long neck, nose or tail', 'e'],
    ['Name the zoo animal everyone visits first', 'e'], ['Name a creature that lives in a pond', 'e'], ['Name an animal from a children\'s book', 'e'],
    ['Name a bug that bites or stings', 'e'], ['Name an animal that changes color or sheds its skin', 'e'],
    ['Name an endangered species', 'h'], ['Name a breed of horse or cattle', 'h'], ['Name an animal that migrates', 'h'],
    ['Name a kind of shark or whale', 'h'], ['Name an animal that uses tools', 'h'], ['Name a reptile that is not a snake or turtle', 'h'],
  ],
  'Everyday Life': [
    ['Name something in a glove compartment', 'e'], ['Name the first thing people do in the morning', 'e'], ['Name something people leave behind at a hotel', 'e'],
    ['Name something that beeps', 'e'], ['Name something you find under couch cushions', 'e'], ['Name something you hang on a wall', 'e'],
    ['Name a thing people borrow and never return', 'e'], ['Name something kept in a garage', 'e'], ['Name a smell everyone recognizes', 'e'],
    ['Name something you have to replace every year', 'e'], ['Name a terrible password people really use', 'e'],
    ['Name something that has gotten smaller over the years', 'h'], ['Name something that used to be free', 'h'], ['Name a common phobia', 'h'],
    ['Name a job that did not exist 30 years ago', 'h'], ['Name a unit of measurement almost nobody uses', 'h'], ['Name a superstition', 'h'],
  ],
  'Famous Faces': [
    ['Name a famous person who is very tall', 'e'], ['Name a talk show host, past or present', 'e'], ['Name an athlete who became an actor or announcer', 'e'],
    ['Name a cartoon villain', 'e'], ['Name a famous person from your home state', 'e'], ['Name a famous Tom', 'e'],
    ['Name a famous person known for a mustache or beard', 'e'], ['Name a famous royal', 'e'], ['Name a storybook or movie hero who is an orphan', 'e'],
    ['Name a famous person who goes by a nickname', 'e'],
    ['Name a famous architect or designer', 'h'], ['Name the founder of a famous company', 'h'], ['Name a famous aviator, mountaineer or polar explorer', 'h'],
    ['Name a stand-up comedian', 'h'], ['Name a famous photographer or sculptor', 'h'], ['Name a famous economist or philosopher', 'h'],
    ['Name a person with an airport named after them', 'h'],
  ],
  'Holidays': [
    ['Name something on a Thanksgiving table that is not food', 'e'], ['Name a Christmas decoration', 'e'], ['Name something kids get at Easter', 'e'],
    ['Name a Valentine\'s Day gift', 'e'], ['Name a Halloween candy', 'e'], ['Name something you do on a snow day', 'e'],
    ['Name a summer holiday tradition', 'e'], ['Name a party supply', 'e'], ['Name something that happens at every family holiday dinner', 'e'],
    ['Name a birthday tradition', 'e'],
    ['Name a holiday whose date moves every year', 'h'], ['Name a saint with a day named for them', 'h'],
    ['Name a festival of lights or harvest festival from any culture', 'h'], ['Name a Christmas carol written before 1900', 'h'],
    ['Name a famous parade', 'h'],
  ],
  'Tech & Inventions': [
    ['Name something you plug in', 'e'], ['Name a social media app', 'e'], ['Name a video game console', 'e'],
    ['Name something the smartphone replaced', 'e'], ['Name a robot from real life or the movies', 'e'], ['Name a website everyone has used', 'e'],
    ['Name a tech company', 'e'], ['Name an emoji people overuse', 'e'], ['Name something that used to need a wire', 'e'],
    ['Name an invention you could not live without', 'e'],
    ['Name a programming language', 'h'], ['Name an invention from the 20th century', 'h'], ['Name a gadget that was discontinued', 'h'],
    ['Name a file type', 'h'], ['Name a space telescope, probe or rover', 'h'], ['Name a computer or phone brand from the 1990s', 'h'],
  ],
  'Travel': [
    ['Name something you need at the airport', 'e'], ['Name something in every hotel room', 'e'], ['Name a place people go on a honeymoon', 'e'],
    ['Name a theme park or a famous ride', 'e'], ['Name a road trip snack', 'e'], ['Name a famous museum or zoo', 'e'],
    ['Name something people buy as a souvenir', 'e'], ['Name a way to travel that is not a car or plane', 'e'], ['Name a city people visit for the food', 'e'],
    ['Name something people always overpack', 'e'],
    ['Name an airline', 'h'], ['Name a famous ancient ruin', 'h'], ['Name an island chain', 'h'], ['Name a famous hotel or train', 'h'],
    ['Name a famous road, trail or route', 'h'], ['Name a city with a famous festival or marathon', 'h'],
  ],
  'Toys & Games': [
    ['Name a toy it seemed every kid had', 'e'], ['Name a playground game', 'e'], ['Name a board game with dice', 'e'], ['Name a card game', 'e'],
    ['Name a video game the whole family can play', 'e'], ['Name a classic arcade game', 'e'], ['Name a doll or action figure', 'e'],
    ['Name a game you play in the car', 'e'], ['Name a backyard game', 'e'], ['Name a chess piece or a chess move', 'e'],
    ['Name a toy from before 1970', 'h'], ['Name a strategy board game', 'h'], ['Name a poker hand', 'h'], ['Name a kind of puzzle', 'h'],
    ['Name a video game studio or a famous game designer', 'h'], ['Name a game show round or a famous game show catchphrase', 'h'],
  ],
  'Work & School': [
    ['Name a school subject', 'e'], ['Name something in a backpack', 'e'], ['Name a job with a uniform', 'e'],
    ['Name an excuse for not doing homework', 'e'], ['Name something on an office desk', 'e'], ['Name a job kids want when they grow up', 'e'],
    ['Name a school lunch food', 'e'], ['Name something every teacher says', 'e'], ['Name a college or university', 'e'],
    ['Name a tool a doctor or dentist uses', 'e'],
    ['Name an Ivy League school', 'h'], ['Name a job title that sounds made up', 'h'], ['Name a college mascot', 'h'],
    ['Name a degree or professional certification', 'h'], ['Name a Fortune 500 company', 'h'], ['Name a meeting phrase everyone is tired of', 'h'],
  ],
};
for (const [cat, qs] of Object.entries(MORE)) BANK[cat] = (BANK[cat] || []).concat(qs);

HUDDLE.push(
  'Who in this family would be lost without a phone?', 'Who in this family is most likely to cry at a movie?',
  'Who in this family is the pickiest eater?', 'Who in this family takes the longest to get ready?',
  'Who would win a family arm-wrestling tournament?', 'Who in this family is the best driver?',
  'Who in this family gives the best gifts?', 'Who would be first to quit a camping trip?',
  'Who in this family is the most competitive?', 'Who in this family has the messiest car or room?',
  'What is the best fast food chain?', 'What is the best breakfast food?', 'What is the best candy?',
  'What show should this family binge next?', 'What is the worst chore?',
);

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
