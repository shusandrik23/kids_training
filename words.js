/*
 * ============================================================================
 *  words.js — СЛОВА И ЗАДАНИЯ ДЛЯ ИГРЫ «Сладкая Учёба»
 * ============================================================================
 *
 *  КАК ДОБАВИТЬ СЛОВО
 *  ------------------
 *  1. Найдите массив WORDS ниже и нужную тему (комментарии // ===== ... =====).
 *  2. Добавьте ОДНУ строку — сразу на трёх языках:
 *
 *       { en: "cat", ru: "кошка", he: "חָתוּל", emoji: "🐈", topic: "animals" },
 *
 *     en    — слово по-английски (маленькими буквами);
 *     ru    — слово по-русски (маленькими буквами, с буквой «ё», где она нужна);
 *     he    — слово на иврите С ОГЛАСОВКАМИ (никуд);
 *     emoji — картинка-эмодзи. Если подходящего эмодзи нет, оставьте пустую
 *             строку: emoji: "" — тогда вместо картинки игра покажет карточку
 *             с русским словом, которая озвучивается по нажатию;
 *     topic — id темы из списка TOPICS (animals, food, colors, numbers ...).
 *
 *     Картинку можно нарисовать и без эмодзи (тогда emoji: ""):
 *       color:  "#ff0000"   — кружок этого цвета (для цветов);
 *       digits: "11"        — крупное цветное число (для чисел);
 *       shape:  "oval"      — фигура: circle, square, triangle, diamond, rectangle, oval.
 *     Эмодзи можно комбинировать: emoji: "🦁🦒" (зоопарк).
 *
 *  3. Слова не должны повторяться: en, ru и he у каждой записи — свои.
 *     Одинаковые картинки у разных слов тоже лучше не ставить — ребёнок
 *     не сможет их отличить. Карточку с русским словом вместо картинки
 *     оставляйте только для того, что невозможно нарисовать.
 *  4. Слова из нескольких частей («ice cream», «זְבוּב») можно добавлять —
 *     в игре «Собери слово по буквам» они просто не появятся.
 *  5. После изменений увеличьте VERSION в файле sw.js (например 2.0.0 → 2.0.1),
 *     иначе у детей на телефоне останется старая версия из кэша.
 *
 *  КАК ДОБАВИТЬ ТЕМУ
 *  -----------------
 *  Добавьте запись в TOPICS: { id: "space", name: "Космос", emoji: "🚀", kind: "noun" }
 *  kind — какое это слово, нужно для «Заполни пропуск»:
 *     noun (предмет), color (цвет), adj (какой?), verb (действие), number (число).
 *
 *  ДРУГИЕ ЗАДАНИЯ (ниже в этом файле)
 *  ----------------------------------
 *  LETTERS         — алфавиты для «Найди букву» (say — как произносить букву).
 *  SYLLABLE_WORDS  — слова, разбитые на слоги, для «Слово из слогов» и
 *                    «Найди слог». Части parts, склеенные вместе, должны
 *                    давать word.
 *  SENTENCES       — фразы для «Фразы» (слова через пробел).
 *  FILL_TEMPLATES  — шаблоны для «Заполни пропуск»: ___ — место для слова,
 *                    ru — перевод начала фразы.
 *  HEBREW_READING  — тексты на иврите с вопросами: answer обязательно должен
 *                    быть одним из options.
 *  MATH_PROBLEMS   — задачи на слух: answer должен быть среди options.
 * ============================================================================
 */

const TOPICS = [
    { id: "animals",     name: "Животные",           emoji: "🐶", kind: "noun" },
    { id: "birds",       name: "Птицы и насекомые",  emoji: "🦋", kind: "noun" },
    { id: "sea",         name: "Море",               emoji: "🐠", kind: "noun" },
    { id: "food",        name: "Еда",                emoji: "🍕", kind: "noun" },
    { id: "fruits",      name: "Фрукты и овощи",     emoji: "🍎", kind: "noun" },
    { id: "colors",      name: "Цвета",              emoji: "🎨", kind: "color" },
    { id: "numbers",     name: "Числа",              emoji: "🔢", kind: "number" },
    { id: "body",        name: "Тело",               emoji: "👀", kind: "noun" },
    { id: "family",      name: "Семья и люди",       emoji: "👨‍👩‍👧", kind: "noun" },
    { id: "professions", name: "Профессии",          emoji: "👩‍⚕️", kind: "noun" },
    { id: "home",        name: "Дом и вещи",         emoji: "🏠", kind: "noun" },
    { id: "clothes",     name: "Одежда",             emoji: "👕", kind: "noun" },
    { id: "nature",      name: "Природа и погода",   emoji: "🌦️", kind: "noun" },
    { id: "transport",   name: "Транспорт",          emoji: "🚗", kind: "noun" },
    { id: "school",      name: "Школа и игрушки",    emoji: "🎒", kind: "noun" },
    { id: "places",      name: "Места",              emoji: "🏙️", kind: "noun" },
    { id: "actions",     name: "Действия",           emoji: "🏃", kind: "verb" },
    { id: "adjectives",  name: "Какой?",             emoji: "📏", kind: "adj" },
    { id: "shapes",      name: "Фигуры",             emoji: "🔺", kind: "noun" }
];

const WORDS = [
    // ===== Животные =====
    { en: "cat", ru: "кошка", he: "חָתוּל", emoji: "🐈", topic: "animals" },
    { en: "dog", ru: "собака", he: "כֶּלֶב", emoji: "🐕", topic: "animals" },
    { en: "horse", ru: "лошадь", he: "סוּס", emoji: "🐎", topic: "animals" },
    { en: "cow", ru: "корова", he: "פָּרָה", emoji: "🐄", topic: "animals" },
    { en: "pig", ru: "свинья", he: "חֲזִיר", emoji: "🐖", topic: "animals" },
    { en: "sheep", ru: "овца", he: "כִּבְשָׂה", emoji: "🐑", topic: "animals" },
    { en: "goat", ru: "коза", he: "עֵז", emoji: "🐐", topic: "animals" },
    { en: "rabbit", ru: "кролик", he: "אַרְנָב", emoji: "🐇", topic: "animals" },
    { en: "mouse", ru: "мышь", he: "עַכְבָּר", emoji: "🐁", topic: "animals" },
    { en: "lion", ru: "лев", he: "אַרְיֵה", emoji: "🦁", topic: "animals" },
    { en: "tiger", ru: "тигр", he: "טִיגְרִיס", emoji: "🐅", topic: "animals" },
    { en: "leopard", ru: "леопард", he: "נָמֵר", emoji: "🐆", topic: "animals" },
    { en: "bear", ru: "медведь", he: "דֹּב", emoji: "🐻", topic: "animals" },
    { en: "wolf", ru: "волк", he: "זְאֵב", emoji: "🐺", topic: "animals" },
    { en: "fox", ru: "лиса", he: "שׁוּעָל", emoji: "🦊", topic: "animals" },
    { en: "monkey", ru: "обезьяна", he: "קוֹף", emoji: "🐒", topic: "animals" },
    { en: "gorilla", ru: "горилла", he: "גּוֹרִילָה", emoji: "🦍", topic: "animals" },
    { en: "elephant", ru: "слон", he: "פִּיל", emoji: "🐘", topic: "animals" },
    { en: "giraffe", ru: "жираф", he: "גִ'ירָפָה", emoji: "🦒", topic: "animals" },
    { en: "zebra", ru: "зебра", he: "זֶבְּרָה", emoji: "🦓", topic: "animals" },
    { en: "camel", ru: "верблюд", he: "גָּמָל", emoji: "🐫", topic: "animals" },
    { en: "hippo", ru: "бегемот", he: "הִיפּוֹפּוֹטָם", emoji: "🦛", topic: "animals" },
    { en: "rhino", ru: "носорог", he: "קַרְנַף", emoji: "🦏", topic: "animals" },
    { en: "kangaroo", ru: "кенгуру", he: "קֶנְגּוּרוּ", emoji: "🦘", topic: "animals" },
    { en: "panda", ru: "панда", he: "פַּנְדָּה", emoji: "🐼", topic: "animals" },
    { en: "koala", ru: "коала", he: "קוֹאָלָה", emoji: "🐨", topic: "animals" },
    { en: "deer", ru: "олень", he: "צְבִי", emoji: "🦌", topic: "animals" },
    { en: "squirrel", ru: "белка", he: "סְנָאִי", emoji: "🐿️", topic: "animals" },
    { en: "hedgehog", ru: "ёж", he: "קִפּוֹד", emoji: "🦔", topic: "animals" },
    { en: "frog", ru: "лягушка", he: "צְפַרְדֵּעַ", emoji: "🐸", topic: "animals" },
    { en: "snake", ru: "змея", he: "נָחָשׁ", emoji: "🐍", topic: "animals" },
    { en: "turtle", ru: "черепаха", he: "צָב", emoji: "🐢", topic: "animals" },
    { en: "crocodile", ru: "крокодил", he: "תַּנִּין", emoji: "🐊", topic: "animals" },
    { en: "donkey", ru: "осёл", he: "חֲמוֹר", emoji: "🫏", topic: "animals" },
    { en: "bat", ru: "летучая мышь", he: "עֲטַלֵּף", emoji: "🦇", topic: "animals" },
    { en: "puppy", ru: "щенок", he: "גּוּר כְּלָבִים", emoji: "🐶", topic: "animals" },
    { en: "kitten", ru: "котёнок", he: "חֲתַלְתּוּל", emoji: "🐱", topic: "animals" },
    { en: "hamster", ru: "хомяк", he: "אוֹגֵר", emoji: "🐹", topic: "animals" },
    { en: "dinosaur", ru: "динозавр", he: "דִּינוֹזָאוּר", emoji: "🦕", topic: "animals" },
    { en: "dragon", ru: "дракон", he: "דְּרָקוֹן", emoji: "🐉", topic: "animals" },
    { en: "unicorn", ru: "единорог", he: "חַד־קֶרֶן", emoji: "🦄", topic: "animals" },

    // ===== Птицы и насекомые =====
    { en: "bird", ru: "птица", he: "צִפּוֹר", emoji: "🐦", topic: "birds" },
    { en: "chicken", ru: "курица", he: "תַּרְנְגֹלֶת", emoji: "🐔", topic: "birds" },
    { en: "rooster", ru: "петух", he: "תַּרְנְגוֹל", emoji: "🐓", topic: "birds" },
    { en: "chick", ru: "цыплёнок", he: "אֶפְרוֹחַ", emoji: "🐤", topic: "birds" },
    { en: "duck", ru: "утка", he: "בַּרְוָז", emoji: "🦆", topic: "birds" },
    { en: "goose", ru: "гусь", he: "אַוָּז", emoji: "🪿", topic: "birds" },
    { en: "swan", ru: "лебедь", he: "בַּרְבּוּר", emoji: "🦢", topic: "birds" },
    { en: "owl", ru: "сова", he: "יַנְשׁוּף", emoji: "🦉", topic: "birds" },
    { en: "eagle", ru: "орёл", he: "נֶשֶׁר", emoji: "🦅", topic: "birds" },
    { en: "parrot", ru: "попугай", he: "תֻּכִּי", emoji: "🦜", topic: "birds" },
    { en: "penguin", ru: "пингвин", he: "פִּינְגְּוִין", emoji: "🐧", topic: "birds" },
    { en: "peacock", ru: "павлин", he: "טַוָּס", emoji: "🦚", topic: "birds" },
    { en: "flamingo", ru: "фламинго", he: "פְלָמִינְגּוֹ", emoji: "🦩", topic: "birds" },
    { en: "turkey", ru: "индюк", he: "תַּרְנְגוֹל הוֹדּוּ", emoji: "🦃", topic: "birds" },
    { en: "pigeon", ru: "голубь", he: "יוֹנָה", emoji: "🕊️", topic: "birds" },
    { en: "butterfly", ru: "бабочка", he: "פַּרְפַּר", emoji: "🦋", topic: "birds" },
    { en: "bee", ru: "пчела", he: "דְּבוֹרָה", emoji: "🐝", topic: "birds" },
    { en: "ant", ru: "муравей", he: "נְמָלָה", emoji: "🐜", topic: "birds" },
    { en: "spider", ru: "паук", he: "עַכָּבִישׁ", emoji: "🕷️", topic: "birds" },
    { en: "ladybug", ru: "божья коровка", he: "פָּרַת מֹשֶׁה רַבֵּנוּ", emoji: "🐞", topic: "birds" },
    { en: "snail", ru: "улитка", he: "חִלָּזוֹן", emoji: "🐌", topic: "birds" },
    { en: "mosquito", ru: "комар", he: "יַתּוּשׁ", emoji: "🦟", topic: "birds" },
    { en: "fly", ru: "муха", he: "זְבוּב", emoji: "🪰", topic: "birds" },
    { en: "caterpillar", ru: "гусеница", he: "זַחַל", emoji: "🐛", topic: "birds" },

    // ===== Море =====
    { en: "fish", ru: "рыба", he: "דָּג", emoji: "🐟", topic: "sea" },
    { en: "shark", ru: "акула", he: "כָּרִישׁ", emoji: "🦈", topic: "sea" },
    { en: "whale", ru: "кит", he: "לִוְיָתָן", emoji: "🐋", topic: "sea" },
    { en: "dolphin", ru: "дельфин", he: "דּוֹלְפִין", emoji: "🐬", topic: "sea" },
    { en: "octopus", ru: "осьминог", he: "תְּמָנוּן", emoji: "🐙", topic: "sea" },
    { en: "crab", ru: "краб", he: "סַרְטָן", emoji: "🦀", topic: "sea" },
    { en: "shrimp", ru: "креветка", he: "חֲסִילוֹן", emoji: "🦐", topic: "sea" },
    { en: "lobster", ru: "омар", he: "לוֹבְּסְטֶר", emoji: "🦞", topic: "sea" },
    { en: "squid", ru: "кальмар", he: "דְּיוֹנוֹן", emoji: "🦑", topic: "sea" },
    { en: "seal", ru: "тюлень", he: "כֶּלֶב יָם", emoji: "🦭", topic: "sea" },
    { en: "jellyfish", ru: "медуза", he: "מֵדוּזָה", emoji: "🪼", topic: "sea" },
    { en: "shell", ru: "ракушка", he: "צֶדֶף", emoji: "🐚", topic: "sea" },
    { en: "starfish", ru: "морская звезда", he: "כּוֹכַב יָם", emoji: "🌊⭐", topic: "sea" },

    // ===== Еда =====
    { en: "bread", ru: "хлеб", he: "לֶחֶם", emoji: "🍞", topic: "food" },
    { en: "milk", ru: "молоко", he: "חָלָב", emoji: "🥛", topic: "food" },
    { en: "water", ru: "вода", he: "מַיִם", emoji: "💧", topic: "food" },
    { en: "egg", ru: "яйцо", he: "בֵּיצָה", emoji: "🥚", topic: "food" },
    { en: "cheese", ru: "сыр", he: "גְּבִינָה", emoji: "🧀", topic: "food" },
    { en: "butter", ru: "масло", he: "חֶמְאָה", emoji: "🧈", topic: "food" },
    { en: "meat", ru: "мясо", he: "בָּשָׂר", emoji: "🥩", topic: "food" },
    { en: "soup", ru: "суп", he: "מָרָק", emoji: "🍲", topic: "food" },
    { en: "cake", ru: "торт", he: "עוּגָה", emoji: "🎂", topic: "food" },
    { en: "cookie", ru: "печенье", he: "עוּגִיָּה", emoji: "🍪", topic: "food" },
    { en: "candy", ru: "конфета", he: "סֻכָּרִיָּה", emoji: "🍬", topic: "food" },
    { en: "chocolate", ru: "шоколад", he: "שׁוֹקוֹלָד", emoji: "🍫", topic: "food" },
    { en: "ice cream", ru: "мороженое", he: "גְּלִידָה", emoji: "🍦", topic: "food" },
    { en: "pizza", ru: "пицца", he: "פִּיצָה", emoji: "🍕", topic: "food" },
    { en: "juice", ru: "сок", he: "מִיץ", emoji: "🧃", topic: "food" },
    { en: "tea", ru: "чай", he: "תֵּה", emoji: "🍵", topic: "food" },
    { en: "coffee", ru: "кофе", he: "קָפֶה", emoji: "☕", topic: "food" },
    { en: "honey", ru: "мёд", he: "דְּבַשׁ", emoji: "🍯", topic: "food" },
    { en: "salt", ru: "соль", he: "מֶלַח", emoji: "🧂", topic: "food" },
    { en: "sugar", ru: "сахар", he: "סֻכָּר", emoji: "", topic: "food" },
    { en: "rice", ru: "рис", he: "אֹרֶז", emoji: "🍚", topic: "food" },
    { en: "pasta", ru: "макароны", he: "פַּסְטָה", emoji: "🍝", topic: "food" },
    { en: "sandwich", ru: "бутерброд", he: "כָּרִיךְ", emoji: "🥪", topic: "food" },
    { en: "hamburger", ru: "гамбургер", he: "הַמְבּוּרְגֶּר", emoji: "🍔", topic: "food" },
    { en: "french fries", ru: "картошка фри", he: "צִ'יפְּס", emoji: "🍟", topic: "food" },
    { en: "popcorn", ru: "попкорн", he: "פּוֹפְּקוֹרְן", emoji: "🍿", topic: "food" },
    { en: "pancake", ru: "блин", he: "חֲבִיתִית", emoji: "🥞", topic: "food" },
    { en: "donut", ru: "пончик", he: "סֻפְגָּנִיָּה", emoji: "🍩", topic: "food" },
    { en: "pie", ru: "пирог", he: "פַּאי", emoji: "🥧", topic: "food" },
    { en: "lollipop", ru: "леденец", he: "סֻכָּרִיָּה עַל מַקֵּל", emoji: "🍭", topic: "food" },
    { en: "porridge", ru: "каша", he: "דַּיְסָה", emoji: "🥣", topic: "food" },
    { en: "sausage", ru: "сосиска", he: "נַקְנִיקִיָּה", emoji: "🌭", topic: "food" },
    { en: "salad", ru: "салат", he: "סָלָט", emoji: "🥗", topic: "food" },
    { en: "yogurt", ru: "йогурт", he: "יוֹגּוּרְט", emoji: "", topic: "food" },
    { en: "nut", ru: "орех", he: "אֱגוֹז", emoji: "🥜", topic: "food" },
    { en: "sushi", ru: "суши", he: "סוּשִׁי", emoji: "🍣", topic: "food" },
    { en: "breakfast", ru: "завтрак", he: "אֲרוּחַת בֹּקֶר", emoji: "🍳", topic: "food" },
    { en: "dinner", ru: "ужин", he: "אֲרוּחַת עֶרֶב", emoji: "🍛", topic: "food" },
    { en: "falafel", ru: "фалафель", he: "פָלָאפֶל", emoji: "🧆", topic: "food" },

    // ===== Фрукты и овощи =====
    { en: "apple", ru: "яблоко", he: "תַּפּוּחַ", emoji: "🍎", topic: "fruits" },
    { en: "banana", ru: "банан", he: "בָּנָנָה", emoji: "🍌", topic: "fruits" },
    { en: "tangerine", ru: "мандарин", he: "קְלֵמֶנְטִינָה", emoji: "🍊", topic: "fruits" },
    { en: "lemon", ru: "лимон", he: "לִימוֹן", emoji: "🍋", topic: "fruits" },
    { en: "pear", ru: "груша", he: "אַגָּס", emoji: "🍐", topic: "fruits" },
    { en: "peach", ru: "персик", he: "אֲפַרְסֵק", emoji: "🍑", topic: "fruits" },
    { en: "cherry", ru: "вишня", he: "דֻּבְדְּבָן", emoji: "🍒", topic: "fruits" },
    { en: "strawberry", ru: "клубника", he: "תּוּת שָׂדֶה", emoji: "🍓", topic: "fruits" },
    { en: "grapes", ru: "виноград", he: "עֲנָבִים", emoji: "🍇", topic: "fruits" },
    { en: "watermelon", ru: "арбуз", he: "אֲבַטִּיחַ", emoji: "🍉", topic: "fruits" },
    { en: "melon", ru: "дыня", he: "מֵלוֹן", emoji: "🍈", topic: "fruits" },
    { en: "pineapple", ru: "ананас", he: "אֲנָנָס", emoji: "🍍", topic: "fruits" },
    { en: "mango", ru: "манго", he: "מַנְגּוֹ", emoji: "🥭", topic: "fruits" },
    { en: "kiwi", ru: "киви", he: "קִיוִי", emoji: "🥝", topic: "fruits" },
    { en: "coconut", ru: "кокос", he: "קוֹקוֹס", emoji: "🥥", topic: "fruits" },
    { en: "blueberry", ru: "черника", he: "אֻכְמָנִית", emoji: "🫐", topic: "fruits" },
    { en: "plum", ru: "слива", he: "שָׁזִיף", emoji: "", topic: "fruits" },
    { en: "apricot", ru: "абрикос", he: "מִשְׁמֵשׁ", emoji: "", topic: "fruits" },
    { en: "pomegranate", ru: "гранат", he: "רִמּוֹן", emoji: "", topic: "fruits" },
    { en: "date", ru: "финик", he: "תָּמָר", emoji: "", topic: "fruits" },
    { en: "fig", ru: "инжир", he: "תְּאֵנָה", emoji: "", topic: "fruits" },
    { en: "tomato", ru: "помидор", he: "עַגְבָנִיָּה", emoji: "🍅", topic: "fruits" },
    { en: "cucumber", ru: "огурец", he: "מְלָפְפוֹן", emoji: "🥒", topic: "fruits" },
    { en: "carrot", ru: "морковь", he: "גֶּזֶר", emoji: "🥕", topic: "fruits" },
    { en: "potato", ru: "картошка", he: "תַּפּוּחַ אֲדָמָה", emoji: "🥔", topic: "fruits" },
    { en: "onion", ru: "лук", he: "בָּצָל", emoji: "🧅", topic: "fruits" },
    { en: "garlic", ru: "чеснок", he: "שׁוּם", emoji: "🧄", topic: "fruits" },
    { en: "corn", ru: "кукуруза", he: "תִּירָס", emoji: "🌽", topic: "fruits" },
    { en: "pepper", ru: "перец", he: "פִּלְפֵּל", emoji: "🌶️", topic: "fruits" },
    { en: "broccoli", ru: "брокколи", he: "בְּרוֹקוֹלִי", emoji: "🥦", topic: "fruits" },
    { en: "mushroom", ru: "гриб", he: "פִּטְרִיָּה", emoji: "🍄", topic: "fruits" },
    { en: "cabbage", ru: "капуста", he: "כְּרוּב", emoji: "", topic: "fruits" },
    { en: "lettuce", ru: "латук", he: "חַסָּה", emoji: "🥬", topic: "fruits" },
    { en: "eggplant", ru: "баклажан", he: "חָצִיל", emoji: "🍆", topic: "fruits" },
    { en: "pumpkin", ru: "тыква", he: "דְּלַעַת", emoji: "🎃", topic: "fruits" },
    { en: "avocado", ru: "авокадо", he: "אֲבוֹקָדוֹ", emoji: "🥑", topic: "fruits" },

    // ===== Цвета =====
    { en: "red", ru: "красный", he: "אָדֹם", emoji: "", color: "#ef4444", topic: "colors" },
    { en: "blue", ru: "синий", he: "כָּחֹל", emoji: "", color: "#2563eb", topic: "colors" },
    { en: "green", ru: "зелёный", he: "יָרֹק", emoji: "", color: "#22c55e", topic: "colors" },
    { en: "yellow", ru: "жёлтый", he: "צָהֹב", emoji: "", color: "#facc15", topic: "colors" },
    { en: "orange", ru: "оранжевый", he: "כָּתֹם", emoji: "", color: "#f97316", topic: "colors" },
    { en: "purple", ru: "фиолетовый", he: "סָגֹל", emoji: "", color: "#9333ea", topic: "colors" },
    { en: "pink", ru: "розовый", he: "וָרֹד", emoji: "", color: "#f9a8d4", topic: "colors" },
    { en: "black", ru: "чёрный", he: "שָׁחֹר", emoji: "", color: "#111827", topic: "colors" },
    { en: "white", ru: "белый", he: "לָבָן", emoji: "", color: "#ffffff", topic: "colors" },
    { en: "brown", ru: "коричневый", he: "חוּם", emoji: "", color: "#92400e", topic: "colors" },
    { en: "gray", ru: "серый", he: "אָפֹר", emoji: "", color: "#9ca3af", topic: "colors" },
    { en: "light blue", ru: "голубой", he: "תְּכֵלֶת", emoji: "", color: "#7dd3fc", topic: "colors" },

    // ===== Числа =====
    { en: "zero", ru: "ноль", he: "אֶפֶס", emoji: "", digits: "0", topic: "numbers" },
    { en: "one", ru: "один", he: "אַחַת", emoji: "", digits: "1", topic: "numbers" },
    { en: "two", ru: "два", he: "שְׁתַּיִם", emoji: "", digits: "2", topic: "numbers" },
    { en: "three", ru: "три", he: "שָׁלוֹשׁ", emoji: "", digits: "3", topic: "numbers" },
    { en: "four", ru: "четыре", he: "אַרְבַּע", emoji: "", digits: "4", topic: "numbers" },
    { en: "five", ru: "пять", he: "חָמֵשׁ", emoji: "", digits: "5", topic: "numbers" },
    { en: "six", ru: "шесть", he: "שֵׁשׁ", emoji: "", digits: "6", topic: "numbers" },
    { en: "seven", ru: "семь", he: "שֶׁבַע", emoji: "", digits: "7", topic: "numbers" },
    { en: "eight", ru: "восемь", he: "שְׁמוֹנֶה", emoji: "", digits: "8", topic: "numbers" },
    { en: "nine", ru: "девять", he: "תֵּשַׁע", emoji: "", digits: "9", topic: "numbers" },
    { en: "ten", ru: "десять", he: "עֶשֶׂר", emoji: "", digits: "10", topic: "numbers" },
    { en: "eleven", ru: "одиннадцать", he: "אַחַת עֶשְׂרֵה", emoji: "", digits: "11", topic: "numbers" },
    { en: "twelve", ru: "двенадцать", he: "שְׁתֵּים עֶשְׂרֵה", emoji: "", digits: "12", topic: "numbers" },
    { en: "thirteen", ru: "тринадцать", he: "שְׁלוֹשׁ עֶשְׂרֵה", emoji: "", digits: "13", topic: "numbers" },
    { en: "fourteen", ru: "четырнадцать", he: "אַרְבַּע עֶשְׂרֵה", emoji: "", digits: "14", topic: "numbers" },
    { en: "fifteen", ru: "пятнадцать", he: "חֲמֵשׁ עֶשְׂרֵה", emoji: "", digits: "15", topic: "numbers" },
    { en: "sixteen", ru: "шестнадцать", he: "שֵׁשׁ עֶשְׂרֵה", emoji: "", digits: "16", topic: "numbers" },
    { en: "seventeen", ru: "семнадцать", he: "שְׁבַע עֶשְׂרֵה", emoji: "", digits: "17", topic: "numbers" },
    { en: "eighteen", ru: "восемнадцать", he: "שְׁמוֹנֶה עֶשְׂרֵה", emoji: "", digits: "18", topic: "numbers" },
    { en: "nineteen", ru: "девятнадцать", he: "תְּשַׁע עֶשְׂרֵה", emoji: "", digits: "19", topic: "numbers" },
    { en: "twenty", ru: "двадцать", he: "עֶשְׂרִים", emoji: "", digits: "20", topic: "numbers" },
    { en: "hundred", ru: "сто", he: "מֵאָה", emoji: "", digits: "100", topic: "numbers" },

    // ===== Тело =====
    { en: "head", ru: "голова", he: "רֹאשׁ", emoji: "👤", topic: "body" },
    { en: "eye", ru: "глаз", he: "עַיִן", emoji: "👁️", topic: "body" },
    { en: "ear", ru: "ухо", he: "אֹזֶן", emoji: "👂", topic: "body" },
    { en: "nose", ru: "нос", he: "אַף", emoji: "👃", topic: "body" },
    { en: "mouth", ru: "рот", he: "פֶּה", emoji: "👄", topic: "body" },
    { en: "tooth", ru: "зуб", he: "שֵׁן", emoji: "🦷", topic: "body" },
    { en: "tongue", ru: "язык", he: "לָשׁוֹן", emoji: "👅", topic: "body" },
    { en: "hand", ru: "рука", he: "יָד", emoji: "✋", topic: "body" },
    { en: "foot", ru: "ступня", he: "כַּף רֶגֶל", emoji: "🦶", topic: "body" },
    { en: "leg", ru: "нога", he: "רֶגֶל", emoji: "🦵", topic: "body" },
    { en: "muscle", ru: "мышца", he: "שְׁרִיר", emoji: "💪", topic: "body" },
    { en: "finger", ru: "палец", he: "אֶצְבַּע", emoji: "☝️", topic: "body" },
    { en: "hair", ru: "волосы", he: "שֵׂעָר", emoji: "💇", topic: "body" },
    { en: "face", ru: "лицо", he: "פָּנִים", emoji: "🙂", topic: "body" },
    { en: "brain", ru: "мозг", he: "מֹחַ", emoji: "🧠", topic: "body" },
    { en: "heart", ru: "сердце", he: "לֵב", emoji: "❤️", topic: "body" },
    { en: "bone", ru: "кость", he: "עֶצֶם", emoji: "🦴", topic: "body" },
    { en: "neck", ru: "шея", he: "צַוָּאר", emoji: "", topic: "body" },
    { en: "back", ru: "спина", he: "גַּב", emoji: "", topic: "body" },
    { en: "belly", ru: "живот", he: "בֶּטֶן", emoji: "", topic: "body" },
    { en: "knee", ru: "колено", he: "בֶּרֶךְ", emoji: "", topic: "body" },
    { en: "shoulder", ru: "плечо", he: "כָּתֵף", emoji: "", topic: "body" },
    { en: "cheek", ru: "щека", he: "לֶחִי", emoji: "", topic: "body" },
    { en: "beard", ru: "борода", he: "זָקָן", emoji: "🧔", topic: "body" },

    // ===== Семья и люди =====
    { en: "mother", ru: "мама", he: "אִמָּא", emoji: "👩", topic: "family" },
    { en: "father", ru: "папа", he: "אַבָּא", emoji: "👨", topic: "family" },
    { en: "baby", ru: "малыш", he: "תִּינוֹק", emoji: "👶", topic: "family" },
    { en: "boy", ru: "мальчик", he: "יֶלֶד", emoji: "👦", topic: "family" },
    { en: "girl", ru: "девочка", he: "יַלְדָּה", emoji: "👧", topic: "family" },
    { en: "brother", ru: "брат", he: "אָח", emoji: "👬", topic: "family" },
    { en: "sister", ru: "сестра", he: "אָחוֹת", emoji: "👭", topic: "family" },
    { en: "grandmother", ru: "бабушка", he: "סָבְתָא", emoji: "👵", topic: "family" },
    { en: "grandfather", ru: "дедушка", he: "סַבָּא", emoji: "👴", topic: "family" },
    { en: "family", ru: "семья", he: "מִשְׁפָּחָה", emoji: "👪", topic: "family" },
    { en: "friend", ru: "друг", he: "חָבֵר", emoji: "🤝", topic: "family" },
    { en: "uncle", ru: "дядя", he: "דּוֹד", emoji: "", topic: "family" },
    { en: "aunt", ru: "тётя", he: "דּוֹדָה", emoji: "", topic: "family" },
    { en: "son", ru: "сын", he: "בֵּן", emoji: "👨‍👦", topic: "family" },
    { en: "daughter", ru: "дочь", he: "בַּת", emoji: "👨‍👧", topic: "family" },
    { en: "man", ru: "мужчина", he: "גֶּבֶר", emoji: "🙋‍♂️", topic: "family" },
    { en: "woman", ru: "женщина", he: "אִשָּׁה", emoji: "🙋‍♀️", topic: "family" },
    { en: "king", ru: "король", he: "מֶלֶךְ", emoji: "🤴", topic: "family" },
    { en: "queen", ru: "королева", he: "מַלְכָּה", emoji: "👸", topic: "family" },
    { en: "people", ru: "люди", he: "אֲנָשִׁים", emoji: "👥", topic: "family" },

    // ===== Профессии =====
    { en: "doctor", ru: "врач", he: "רוֹפֵא", emoji: "👩‍⚕️", topic: "professions" },
    { en: "teacher", ru: "учитель", he: "מוֹרֶה", emoji: "👩‍🏫", topic: "professions" },
    { en: "chef", ru: "повар", he: "טַבָּח", emoji: "👨‍🍳", topic: "professions" },
    { en: "farmer", ru: "фермер", he: "חַקְלַאי", emoji: "👨‍🌾", topic: "professions" },
    { en: "firefighter", ru: "пожарный", he: "כַּבַּאי", emoji: "👨‍🚒", topic: "professions" },
    { en: "police officer", ru: "полицейский", he: "שׁוֹטֵר", emoji: "👮", topic: "professions" },
    { en: "pilot", ru: "лётчик", he: "טַיָּס", emoji: "👨‍✈️", topic: "professions" },
    { en: "astronaut", ru: "космонавт", he: "אַסְטְרוֹנָאוּט", emoji: "👨‍🚀", topic: "professions" },
    { en: "singer", ru: "певица", he: "זַמֶּרֶת", emoji: "👩‍🎤", topic: "professions" },
    { en: "artist", ru: "художник", he: "צַיָּר", emoji: "👩‍🎨", topic: "professions" },
    { en: "builder", ru: "строитель", he: "פּוֹעֵל בִּנְיָן", emoji: "👷", topic: "professions" },
    { en: "driver", ru: "водитель", he: "נֶהָג", emoji: "", topic: "professions" },
    { en: "dentist", ru: "стоматолог", he: "רוֹפֵא שִׁנַּיִם", emoji: "👩‍⚕️🦷", topic: "professions" },
    { en: "scientist", ru: "учёный", he: "מַדְעָן", emoji: "👩‍🔬", topic: "professions" },
    { en: "student", ru: "ученик", he: "תַּלְמִיד", emoji: "👨‍🎓", topic: "professions" },
    { en: "clown", ru: "клоун", he: "לֵיצָן", emoji: "🤡", topic: "professions" },
    { en: "baker", ru: "пекарь", he: "אוֹפֶה", emoji: "👨‍🍳🥖", topic: "professions" },

    // ===== Дом и вещи =====
    { en: "house", ru: "дом", he: "בַּיִת", emoji: "🏠", topic: "home" },
    { en: "door", ru: "дверь", he: "דֶּלֶת", emoji: "🚪", topic: "home" },
    { en: "window", ru: "окно", he: "חַלּוֹן", emoji: "🪟", topic: "home" },
    { en: "room", ru: "комната", he: "חֶדֶר", emoji: "", topic: "home" },
    { en: "kitchen", ru: "кухня", he: "מִטְבָּח", emoji: "", topic: "home" },
    { en: "bed", ru: "кровать", he: "מִטָּה", emoji: "🛏️", topic: "home" },
    { en: "chair", ru: "стул", he: "כִּסֵּא", emoji: "🪑", topic: "home" },
    { en: "table", ru: "стол", he: "שֻׁלְחָן", emoji: "", topic: "home" },
    { en: "sofa", ru: "диван", he: "סַפָּה", emoji: "🛋️", topic: "home" },
    { en: "lamp", ru: "лампа", he: "מְנוֹרָה", emoji: "💡", topic: "home" },
    { en: "clock", ru: "часы", he: "שָׁעוֹן", emoji: "⏰", topic: "home" },
    { en: "phone", ru: "телефон", he: "טֶלֶפוֹן", emoji: "📱", topic: "home" },
    { en: "computer", ru: "компьютер", he: "מַחְשֵׁב", emoji: "💻", topic: "home" },
    { en: "television", ru: "телевизор", he: "טֶלֶוִיזְיָה", emoji: "📺", topic: "home" },
    { en: "key", ru: "ключ", he: "מַפְתֵּחַ", emoji: "🔑", topic: "home" },
    { en: "box", ru: "коробка", he: "קֻפְסָה", emoji: "📦", topic: "home" },
    { en: "cup", ru: "чашка", he: "סֵפֶל", emoji: "", topic: "home" },
    { en: "plate", ru: "тарелка", he: "צַלַּחַת", emoji: "🍽️", topic: "home" },
    { en: "spoon", ru: "ложка", he: "כַּף", emoji: "🥄", topic: "home" },
    { en: "fork", ru: "вилка", he: "מַזְלֵג", emoji: "🍴", topic: "home" },
    { en: "knife", ru: "нож", he: "סַכִּין", emoji: "🔪", topic: "home" },
    { en: "bottle", ru: "бутылочка", he: "בַּקְבּוּק", emoji: "🍼", topic: "home" },
    { en: "mirror", ru: "зеркало", he: "מַרְאָה", emoji: "🪞", topic: "home" },
    { en: "soap", ru: "мыло", he: "סַבּוֹן", emoji: "🧼", topic: "home" },
    { en: "toothbrush", ru: "зубная щётка", he: "מִבְרֶשֶׁת שִׁנַּיִם", emoji: "🪥", topic: "home" },
    { en: "broom", ru: "метла", he: "מַטְאֲטֵא", emoji: "🧹", topic: "home" },
    { en: "umbrella", ru: "зонт", he: "מִטְרִיָּה", emoji: "☂️", topic: "home" },
    { en: "basket", ru: "корзина", he: "סַל", emoji: "🧺", topic: "home" },
    { en: "candle", ru: "свеча", he: "נֵר", emoji: "🕯️", topic: "home" },
    { en: "picture", ru: "картина", he: "תְּמוּנָה", emoji: "🖼️", topic: "home" },
    { en: "pillow", ru: "подушка", he: "כָּרִית", emoji: "", topic: "home" },
    { en: "blanket", ru: "одеяло", he: "שְׂמִיכָה", emoji: "", topic: "home" },
    { en: "fridge", ru: "холодильник", he: "מְקָרֵר", emoji: "", topic: "home" },
    { en: "wall", ru: "стена", he: "קִיר", emoji: "🧱", topic: "home" },
    { en: "garden", ru: "сад", he: "גִּנָּה", emoji: "🏡", topic: "home" },
    { en: "toilet", ru: "туалет", he: "שֵׁרוּתִים", emoji: "🚽", topic: "home" },
    { en: "shower", ru: "душ", he: "מִקְלַחַת", emoji: "🚿", topic: "home" },
    { en: "bath", ru: "ванна", he: "אַמְבַּטְיָה", emoji: "🛁", topic: "home" },
    { en: "bell", ru: "колокольчик", he: "פַּעֲמוֹן", emoji: "🔔", topic: "home" },
    { en: "teapot", ru: "чайник", he: "קֻמְקוּם", emoji: "🫖", topic: "home" },

    // ===== Одежда =====
    { en: "shirt", ru: "рубашка", he: "חֻלְצָה", emoji: "👕", topic: "clothes" },
    { en: "pants", ru: "брюки", he: "מִכְנָסַיִם", emoji: "👖", topic: "clothes" },
    { en: "dress", ru: "платье", he: "שִׂמְלָה", emoji: "👗", topic: "clothes" },
    { en: "hat", ru: "шляпа", he: "כּוֹבַע", emoji: "👒", topic: "clothes" },
    { en: "cap", ru: "кепка", he: "כּוֹבַע מִצְחִיָּה", emoji: "🧢", topic: "clothes" },
    { en: "shoes", ru: "кроссовки", he: "נַעֲלַיִם", emoji: "👟", topic: "clothes" },
    { en: "boots", ru: "сапоги", he: "מַגָּפַיִם", emoji: "👢", topic: "clothes" },
    { en: "socks", ru: "носки", he: "גַּרְבַּיִם", emoji: "🧦", topic: "clothes" },
    { en: "coat", ru: "пальто", he: "מְעִיל", emoji: "🧥", topic: "clothes" },
    { en: "jacket", ru: "куртка", he: "זָ'קֶט", emoji: "", topic: "clothes" },
    { en: "scarf", ru: "шарф", he: "צָעִיף", emoji: "🧣", topic: "clothes" },
    { en: "gloves", ru: "перчатки", he: "כְּפָפוֹת", emoji: "🧤", topic: "clothes" },
    { en: "skirt", ru: "юбка", he: "חֲצָאִית", emoji: "", topic: "clothes" },
    { en: "shorts", ru: "шорты", he: "מִכְנָסַיִם קְצָרִים", emoji: "🩳", topic: "clothes" },
    { en: "sweater", ru: "свитер", he: "סְוֶודֶר", emoji: "", topic: "clothes" },
    { en: "glasses", ru: "очки", he: "מִשְׁקָפַיִם", emoji: "👓", topic: "clothes" },
    { en: "sunglasses", ru: "солнечные очки", he: "מִשְׁקְפֵי שֶׁמֶשׁ", emoji: "🕶️", topic: "clothes" },
    { en: "crown", ru: "корона", he: "כֶּתֶר", emoji: "👑", topic: "clothes" },
    { en: "ring", ru: "кольцо", he: "טַבַּעַת", emoji: "💍", topic: "clothes" },
    { en: "bag", ru: "сумка", he: "תִּיק", emoji: "👜", topic: "clothes" },
    { en: "pajamas", ru: "пижама", he: "פִּיגָ'מָה", emoji: "", topic: "clothes" },
    { en: "swimsuit", ru: "купальник", he: "בֶּגֶד יָם", emoji: "🩱", topic: "clothes" },
    { en: "tie", ru: "галстук", he: "עֲנִיבָה", emoji: "👔", topic: "clothes" },
    { en: "sandals", ru: "сандалии", he: "סַנְדָּלִים", emoji: "👡", topic: "clothes" },

    // ===== Природа и погода =====
    { en: "sun", ru: "солнце", he: "שֶׁמֶשׁ", emoji: "☀️", topic: "nature" },
    { en: "moon", ru: "луна", he: "יָרֵחַ", emoji: "🌙", topic: "nature" },
    { en: "star", ru: "звезда", he: "כּוֹכָב", emoji: "⭐", topic: "nature" },
    { en: "sky", ru: "небо", he: "שָׁמַיִם", emoji: "🌤️", topic: "nature" },
    { en: "cloud", ru: "облако", he: "עָנָן", emoji: "☁️", topic: "nature" },
    { en: "rain", ru: "дождь", he: "גֶּשֶׁם", emoji: "🌧️", topic: "nature" },
    { en: "snow", ru: "снег", he: "שֶׁלֶג", emoji: "❄️", topic: "nature" },
    { en: "wind", ru: "ветер", he: "רוּחַ", emoji: "💨", topic: "nature" },
    { en: "storm", ru: "гроза", he: "סְעָרָה", emoji: "⛈️", topic: "nature" },
    { en: "lightning", ru: "молния", he: "בָּרָק", emoji: "⚡", topic: "nature" },
    { en: "rainbow", ru: "радуга", he: "קֶשֶׁת", emoji: "🌈", topic: "nature" },
    { en: "fire", ru: "огонь", he: "אֵשׁ", emoji: "🔥", topic: "nature" },
    { en: "tree", ru: "дерево", he: "עֵץ", emoji: "🌳", topic: "nature" },
    { en: "flower", ru: "цветок", he: "פֶּרַח", emoji: "🌸", topic: "nature" },
    { en: "grass", ru: "трава", he: "דֶּשֶׁא", emoji: "🌿", topic: "nature" },
    { en: "leaf", ru: "лист", he: "עָלֶה", emoji: "🍃", topic: "nature" },
    { en: "sea", ru: "море", he: "יָם", emoji: "🌊", topic: "nature" },
    { en: "river", ru: "река", he: "נָהָר", emoji: "🏞️", topic: "nature" },
    { en: "lake", ru: "озеро", he: "אֲגַם", emoji: "", topic: "nature" },
    { en: "mountain", ru: "гора", he: "הַר", emoji: "⛰️", topic: "nature" },
    { en: "forest", ru: "лес", he: "יַעַר", emoji: "🌲", topic: "nature" },
    { en: "island", ru: "остров", he: "אִי", emoji: "🏝️", topic: "nature" },
    { en: "desert", ru: "пустыня", he: "מִדְבָּר", emoji: "🏜️", topic: "nature" },
    { en: "volcano", ru: "вулкан", he: "הַר גַּעַשׁ", emoji: "🌋", topic: "nature" },
    { en: "earth", ru: "Земля", he: "כַּדּוּר הָאָרֶץ", emoji: "🌍", topic: "nature" },
    { en: "stone", ru: "камень", he: "אֶבֶן", emoji: "🪨", topic: "nature" },
    { en: "sand", ru: "песок", he: "חוֹל", emoji: "⏳", topic: "nature" },
    { en: "rose", ru: "роза", he: "וֶרֶד", emoji: "🌹", topic: "nature" },
    { en: "sunflower", ru: "подсолнух", he: "חַמָּנִיָּה", emoji: "🌻", topic: "nature" },
    { en: "tulip", ru: "тюльпан", he: "צִבְעוֹנִי", emoji: "🌷", topic: "nature" },
    { en: "cactus", ru: "кактус", he: "קַקְטוּס", emoji: "🌵", topic: "nature" },
    { en: "palm tree", ru: "пальма", he: "דֶּקֶל", emoji: "🌴", topic: "nature" },
    { en: "ice", ru: "лёд", he: "קֶרַח", emoji: "🧊", topic: "nature" },
    { en: "snowman", ru: "снеговик", he: "אִישׁ שֶׁלֶג", emoji: "⛄", topic: "nature" },
    { en: "comet", ru: "комета", he: "כּוֹכַב שָׁבִיט", emoji: "☄️", topic: "nature" },
    { en: "planet", ru: "планета", he: "כּוֹכַב לֶכֶת", emoji: "🪐", topic: "nature" },
    { en: "day", ru: "день", he: "יוֹם", emoji: "🌞", topic: "nature" },
    { en: "night", ru: "ночь", he: "לַיְלָה", emoji: "🌃", topic: "nature" },
    { en: "morning", ru: "утро", he: "בֹּקֶר", emoji: "🌅", topic: "nature" },
    { en: "evening", ru: "вечер", he: "עֶרֶב", emoji: "🌆", topic: "nature" },
    { en: "summer", ru: "лето", he: "קַיִץ", emoji: "🩴", topic: "nature" },
    { en: "winter", ru: "зима", he: "חֹרֶף", emoji: "☃️", topic: "nature" },
    { en: "spring", ru: "весна", he: "אָבִיב", emoji: "🌱", topic: "nature" },
    { en: "autumn", ru: "осень", he: "סְתָיו", emoji: "🍂", topic: "nature" },

    // ===== Транспорт =====
    { en: "car", ru: "машина", he: "מְכוֹנִית", emoji: "🚗", topic: "transport" },
    { en: "bus", ru: "автобус", he: "אוֹטוֹבּוּס", emoji: "🚌", topic: "transport" },
    { en: "train", ru: "поезд", he: "רַכֶּבֶת", emoji: "🚂", topic: "transport" },
    { en: "plane", ru: "самолёт", he: "מָטוֹס", emoji: "✈️", topic: "transport" },
    { en: "ship", ru: "корабль", he: "אֳנִיָּה", emoji: "🚢", topic: "transport" },
    { en: "boat", ru: "лодка", he: "סִירָה", emoji: "⛵", topic: "transport" },
    { en: "bicycle", ru: "велосипед", he: "אוֹפַנַּיִם", emoji: "🚲", topic: "transport" },
    { en: "truck", ru: "грузовик", he: "מַשָּׂאִית", emoji: "🚚", topic: "transport" },
    { en: "taxi", ru: "такси", he: "מוֹנִית", emoji: "🚕", topic: "transport" },
    { en: "helicopter", ru: "вертолёт", he: "מַסּוֹק", emoji: "🚁", topic: "transport" },
    { en: "rocket", ru: "ракета", he: "טִיל", emoji: "🚀", topic: "transport" },
    { en: "motorcycle", ru: "мотоцикл", he: "אוֹפַנּוֹעַ", emoji: "🏍️", topic: "transport" },
    { en: "tractor", ru: "трактор", he: "טְרַקְטוֹר", emoji: "🚜", topic: "transport" },
    { en: "ambulance", ru: "скорая помощь", he: "אַמְבּוּלַנְס", emoji: "🚑", topic: "transport" },
    { en: "fire truck", ru: "пожарная машина", he: "כַּבָּאִית", emoji: "🚒", topic: "transport" },
    { en: "police car", ru: "полицейская машина", he: "נִיֶּדֶת", emoji: "🚓", topic: "transport" },
    { en: "scooter", ru: "самокат", he: "קוֹרְקִינֶט", emoji: "🛴", topic: "transport" },
    { en: "skateboard", ru: "скейтборд", he: "סְקֵייטְבּוֹרְד", emoji: "🛹", topic: "transport" },
    { en: "subway", ru: "метро", he: "רַכֶּבֶת תַּחְתִּית", emoji: "🚇", topic: "transport" },
    { en: "road", ru: "дорога", he: "כְּבִישׁ", emoji: "🛣️", topic: "transport" },
    { en: "traffic light", ru: "светофор", he: "רַמְזוֹר", emoji: "🚦", topic: "transport" },
    { en: "bridge", ru: "мост", he: "גֶּשֶׁר", emoji: "🌉", topic: "transport" },

    // ===== Школа и игрушки =====
    { en: "book", ru: "книга", he: "סֵפֶר", emoji: "📖", topic: "school" },
    { en: "pen", ru: "ручка", he: "עֵט", emoji: "🖊️", topic: "school" },
    { en: "pencil", ru: "карандаш", he: "עִפָּרוֹן", emoji: "✏️", topic: "school" },
    { en: "backpack", ru: "рюкзак", he: "תִּיק גַּב", emoji: "🎒", topic: "school" },
    { en: "notebook", ru: "тетрадь", he: "מַחְבֶּרֶת", emoji: "📓", topic: "school" },
    { en: "school", ru: "школа", he: "בֵּית סֵפֶר", emoji: "🏫", topic: "school" },
    { en: "ruler", ru: "линейка", he: "סַרְגֵּל", emoji: "📏", topic: "school" },
    { en: "scissors", ru: "ножницы", he: "מִסְפָּרַיִם", emoji: "✂️", topic: "school" },
    { en: "paint", ru: "краска", he: "צֶבַע", emoji: "🎨", topic: "school" },
    { en: "brush", ru: "кисточка", he: "מִכְחוֹל", emoji: "🖌️", topic: "school" },
    { en: "marker", ru: "фломастер", he: "טוּשׁ", emoji: "🖍️", topic: "school" },
    { en: "eraser", ru: "ластик", he: "מַחַק", emoji: "", topic: "school" },
    { en: "letter", ru: "письмо", he: "מִכְתָּב", emoji: "✉️", topic: "school" },
    { en: "paper", ru: "бумага", he: "נְיָר", emoji: "📄", topic: "school" },
    { en: "map", ru: "карта", he: "מַפָּה", emoji: "🗺️", topic: "school" },
    { en: "ball", ru: "мяч", he: "כַּדּוּר", emoji: "⚽", topic: "school" },
    { en: "doll", ru: "кукла", he: "בֻּבָּה", emoji: "🪆", topic: "school" },
    { en: "teddy bear", ru: "плюшевый мишка", he: "דֻּבִּי", emoji: "🧸", topic: "school" },
    { en: "toy", ru: "игрушка", he: "צַעֲצוּעַ", emoji: "🪀", topic: "school" },
    { en: "balloon", ru: "воздушный шарик", he: "בָּלוֹן", emoji: "🎈", topic: "school" },
    { en: "kite", ru: "воздушный змей", he: "עֲפִיפוֹן", emoji: "🪁", topic: "school" },
    { en: "drum", ru: "барабан", he: "תֹּף", emoji: "🥁", topic: "school" },
    { en: "guitar", ru: "гитара", he: "גִּיטָרָה", emoji: "🎸", topic: "school" },
    { en: "piano", ru: "пианино", he: "פְּסַנְתֵּר", emoji: "🎹", topic: "school" },
    { en: "violin", ru: "скрипка", he: "כִּנּוֹר", emoji: "🎻", topic: "school" },
    { en: "puzzle", ru: "пазл", he: "פָּאזֶל", emoji: "🧩", topic: "school" },
    { en: "dice", ru: "кубик", he: "קֻבִּיָּה", emoji: "🎲", topic: "school" },
    { en: "robot", ru: "робот", he: "רוֹבּוֹט", emoji: "🤖", topic: "school" },
    { en: "game", ru: "игра", he: "מִשְׂחָק", emoji: "🎮", topic: "school" },
    { en: "song", ru: "песня", he: "שִׁיר", emoji: "🎵", topic: "school" },
    { en: "gift", ru: "подарок", he: "מַתָּנָה", emoji: "🎁", topic: "school" },

    // ===== Места =====
    { en: "city", ru: "город", he: "עִיר", emoji: "🏙️", topic: "places" },
    { en: "street", ru: "улица", he: "רְחוֹב", emoji: "", topic: "places" },
    { en: "shop", ru: "магазин", he: "חֲנוּת", emoji: "🏪", topic: "places" },
    { en: "hospital", ru: "больница", he: "בֵּית חוֹלִים", emoji: "🏥", topic: "places" },
    { en: "park", ru: "парк", he: "פַּארְק", emoji: "⛲", topic: "places" },
    { en: "zoo", ru: "зоопарк", he: "גַּן חַיּוֹת", emoji: "🦁🦒", topic: "places" },
    { en: "castle", ru: "замок", he: "טִירָה", emoji: "🏰", topic: "places" },
    { en: "library", ru: "библиотека", he: "סִפְרִיָּה", emoji: "🏛️", topic: "places" },
    { en: "kindergarten", ru: "детский сад", he: "גַּן יְלָדִים", emoji: "🧸🏫", topic: "places" },
    { en: "playground", ru: "детская площадка", he: "גַּן שַׁעֲשׁוּעִים", emoji: "🛝", topic: "places" },
    { en: "beach", ru: "пляж", he: "חוֹף יָם", emoji: "🏖️", topic: "places" },
    { en: "farm", ru: "ферма", he: "חַוָּה", emoji: "🌾", topic: "places" },
    { en: "tent", ru: "палатка", he: "אֹהֶל", emoji: "⛺", topic: "places" },
    { en: "village", ru: "деревня", he: "כְּפָר", emoji: "🏘️", topic: "places" },
    { en: "circus", ru: "цирк", he: "קִרְקָס", emoji: "🎪", topic: "places" },

    // ===== Действия =====
    { en: "run", ru: "бегать", he: "לָרוּץ", emoji: "🏃", topic: "actions" },
    { en: "jump", ru: "прыгать", he: "לִקְפֹּץ", emoji: "🤸", topic: "actions" },
    { en: "walk", ru: "ходить", he: "לָלֶכֶת", emoji: "🚶", topic: "actions" },
    { en: "swim", ru: "плавать", he: "לִשְׂחוֹת", emoji: "🏊", topic: "actions" },
    { en: "eat", ru: "есть", he: "לֶאֱכֹל", emoji: "😋", topic: "actions" },
    { en: "drink", ru: "пить", he: "לִשְׁתּוֹת", emoji: "🥤", topic: "actions" },
    { en: "sleep", ru: "спать", he: "לִישֹׁן", emoji: "😴", topic: "actions" },
    { en: "read", ru: "читать", he: "לִקְרֹא", emoji: "📚", topic: "actions" },
    { en: "write", ru: "писать", he: "לִכְתֹּב", emoji: "✍️", topic: "actions" },
    { en: "draw", ru: "рисовать", he: "לְצַיֵּר", emoji: "✏️📄", topic: "actions" },
    { en: "sing", ru: "петь", he: "לָשִׁיר", emoji: "🎤", topic: "actions" },
    { en: "dance", ru: "танцевать", he: "לִרְקֹד", emoji: "💃", topic: "actions" },
    { en: "play", ru: "играть", he: "לְשַׂחֵק", emoji: "🤹", topic: "actions" },
    { en: "cry", ru: "плакать", he: "לִבְכּוֹת", emoji: "😭", topic: "actions" },
    { en: "laugh", ru: "смеяться", he: "לִצְחֹק", emoji: "😂", topic: "actions" },
    { en: "smile", ru: "улыбаться", he: "לְחַיֵּךְ", emoji: "😊", topic: "actions" },
    { en: "talk", ru: "говорить", he: "לְדַבֵּר", emoji: "🗣️", topic: "actions" },
    { en: "listen", ru: "слушать", he: "לְהַקְשִׁיב", emoji: "🎧", topic: "actions" },
    { en: "look", ru: "смотреть", he: "לְהִסְתַּכֵּל", emoji: "👀", topic: "actions" },
    { en: "think", ru: "думать", he: "לַחְשֹׁב", emoji: "🤔", topic: "actions" },
    { en: "climb", ru: "лазить", he: "לְטַפֵּס", emoji: "🧗", topic: "actions" },
    { en: "ride", ru: "кататься", he: "לִרְכֹּב", emoji: "🚴", topic: "actions" },
    { en: "cook", ru: "готовить", he: "לְבַשֵּׁל", emoji: "🥘", topic: "actions" },
    { en: "wash", ru: "мыть", he: "לִרְחֹץ", emoji: "🫧", topic: "actions" },
    { en: "clean", ru: "убирать", he: "לְנַקּוֹת", emoji: "🧽", topic: "actions" },
    { en: "open", ru: "открывать", he: "לִפְתֹּחַ", emoji: "🔓", topic: "actions" },
    { en: "close", ru: "закрывать", he: "לִסְגֹּר", emoji: "🔒", topic: "actions" },
    { en: "give", ru: "давать", he: "לָתֵת", emoji: "🫴", topic: "actions" },
    { en: "take", ru: "брать", he: "לָקַחַת", emoji: "🤲", topic: "actions" },
    { en: "buy", ru: "покупать", he: "לִקְנוֹת", emoji: "🛒", topic: "actions" },
    { en: "build", ru: "строить", he: "לִבְנוֹת", emoji: "🏗️", topic: "actions" },
    { en: "sit", ru: "сидеть", he: "לָשֶׁבֶת", emoji: "🧘", topic: "actions" },
    { en: "stand", ru: "стоять", he: "לַעֲמֹד", emoji: "🧍", topic: "actions" },
    { en: "hug", ru: "обнимать", he: "לְחַבֵּק", emoji: "🤗", topic: "actions" },
    { en: "kiss", ru: "целовать", he: "לְנַשֵּׁק", emoji: "😘", topic: "actions" },
    { en: "wave", ru: "махать", he: "לְנַפְנֵף", emoji: "👋", topic: "actions" },
    { en: "help", ru: "помогать", he: "לַעֲזֹר", emoji: "🆘", topic: "actions" },
    { en: "count", ru: "считать", he: "לִסְפֹּר", emoji: "🔢", topic: "actions" },
    { en: "love", ru: "любить", he: "לֶאֱהֹב", emoji: "🥰", topic: "actions" },
    { en: "learn", ru: "учиться", he: "לִלְמֹד", emoji: "📝", topic: "actions" },

    // ===== Какой? =====
    { en: "big", ru: "большой", he: "גָּדוֹל", emoji: "", topic: "adjectives" },
    { en: "small", ru: "маленький", he: "קָטָן", emoji: "", topic: "adjectives" },
    { en: "happy", ru: "весёлый", he: "שָׂמֵחַ", emoji: "😀", topic: "adjectives" },
    { en: "sad", ru: "грустный", he: "עָצוּב", emoji: "😢", topic: "adjectives" },
    { en: "angry", ru: "сердитый", he: "כּוֹעֵס", emoji: "😠", topic: "adjectives" },
    { en: "scared", ru: "испуганный", he: "מְפֻחָד", emoji: "😨", topic: "adjectives" },
    { en: "tired", ru: "усталый", he: "עָיֵף", emoji: "😫", topic: "adjectives" },
    { en: "hot", ru: "горячий", he: "חַם", emoji: "🥵", topic: "adjectives" },
    { en: "cold", ru: "холодный", he: "קַר", emoji: "🥶", topic: "adjectives" },
    { en: "fast", ru: "быстрый", he: "מָהִיר", emoji: "🏎️", topic: "adjectives" },
    { en: "slow", ru: "медленный", he: "אִטִּי", emoji: "🦥", topic: "adjectives" },
    { en: "tall", ru: "высокий", he: "גָּבוֹהַּ", emoji: "", topic: "adjectives" },
    { en: "short", ru: "низкий", he: "נָמוּךְ", emoji: "", topic: "adjectives" },
    { en: "long", ru: "длинный", he: "אָרֹךְ", emoji: "", topic: "adjectives" },
    { en: "new", ru: "новый", he: "חָדָשׁ", emoji: "🆕", topic: "adjectives" },
    { en: "old", ru: "старый", he: "יָשָׁן", emoji: "🏚️", topic: "adjectives" },
    { en: "dirty", ru: "грязный", he: "מְלֻכְלָךְ", emoji: "", topic: "adjectives" },
    { en: "good", ru: "хороший", he: "טוֹב", emoji: "👍", topic: "adjectives" },
    { en: "bad", ru: "плохой", he: "רַע", emoji: "👎", topic: "adjectives" },
    { en: "beautiful", ru: "красивый", he: "יָפֶה", emoji: "😍", topic: "adjectives" },
    { en: "strong", ru: "сильный", he: "חָזָק", emoji: "🏋️", topic: "adjectives" },
    { en: "sweet", ru: "сладкий", he: "מָתוֹק", emoji: "🧁", topic: "adjectives" },
    { en: "wet", ru: "мокрый", he: "רָטֹב", emoji: "💦", topic: "adjectives" },
    { en: "heavy", ru: "тяжёлый", he: "כָּבֵד", emoji: "", topic: "adjectives" },
    { en: "light", ru: "лёгкий", he: "קַל", emoji: "🪶", topic: "adjectives" },
    { en: "quiet", ru: "тихий", he: "שָׁקֵט", emoji: "🤫", topic: "adjectives" },
    { en: "loud", ru: "громкий", he: "רוֹעֵשׁ", emoji: "📢", topic: "adjectives" },
    { en: "hungry", ru: "голодный", he: "רָעֵב", emoji: "🤤", topic: "adjectives" },
    { en: "sick", ru: "больной", he: "חוֹלֶה", emoji: "🤒", topic: "adjectives" },
    { en: "funny", ru: "смешной", he: "מַצְחִיק", emoji: "🤪", topic: "adjectives" },

    // ===== Фигуры =====
    { en: "circle", ru: "круг", he: "עִגּוּל", emoji: "", shape: "circle", topic: "shapes" },
    { en: "square", ru: "квадрат", he: "רִבּוּעַ", emoji: "", shape: "square", topic: "shapes" },
    { en: "triangle", ru: "треугольник", he: "מְשֻׁלָּשׁ", emoji: "", shape: "triangle", topic: "shapes" },
    { en: "diamond", ru: "ромб", he: "מְעֻיָּן", emoji: "", shape: "diamond", topic: "shapes" },
    { en: "rectangle", ru: "прямоугольник", he: "מַלְבֵּן", emoji: "", shape: "rectangle", topic: "shapes" },
    { en: "oval", ru: "овал", he: "אֶלִיפְּסָה", emoji: "", shape: "oval", topic: "shapes" }
];

// Алфавиты для «Найди букву». say — что произносит голос.
const LETTERS = {
    en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(ch => ({ ch, say: ch })),
    ru: [
        ["А", "а"], ["Б", "бэ"], ["В", "вэ"], ["Г", "гэ"], ["Д", "дэ"], ["Е", "е"], ["Ё", "ё"],
        ["Ж", "жэ"], ["З", "зэ"], ["И", "и"], ["Й", "и краткое"], ["К", "ка"], ["Л", "эль"],
        ["М", "эм"], ["Н", "эн"], ["О", "о"], ["П", "пэ"], ["Р", "эр"], ["С", "эс"], ["Т", "тэ"],
        ["У", "у"], ["Ф", "эф"], ["Х", "ха"], ["Ц", "цэ"], ["Ч", "че"], ["Ш", "ша"], ["Щ", "ща"],
        ["Ъ", "твёрдый знак"], ["Ы", "ы"], ["Ь", "мягкий знак"], ["Э", "э"], ["Ю", "ю"], ["Я", "я"]
    ].map(([ch, say]) => ({ ch, say })),
    he: [
        ["א", "אָלֶף"], ["ב", "בֵּית"], ["ג", "גִּימֶל"], ["ד", "דָּלֶת"], ["ה", "הֵא"], ["ו", "וָו"],
        ["ז", "זַיִן"], ["ח", "חֵית"], ["ט", "טֵית"], ["י", "יוּד"], ["כ", "כָּף"], ["ל", "לָמֶד"],
        ["מ", "מֵם"], ["נ", "נוּן"], ["ס", "סָמֶךְ"], ["ע", "עַיִן"], ["פ", "פֵּא"], ["צ", "צָדִי"],
        ["ק", "קוּף"], ["ר", "רֵישׁ"], ["ש", "שִׁין"], ["ת", "תָּו"]
    ].map(([ch, say]) => ({ ch, say }))
};

// Слова по слогам: «Слово из слогов» и «Найди слог» (для en и ru слоги берутся отсюда).
const SYLLABLE_WORDS = {
    en: [
        { word: "apple", parts: ["ap", "ple"], ru: "яблоко", emoji: "🍎" },
        { word: "banana", parts: ["ba", "na", "na"], ru: "банан", emoji: "🍌" },
        { word: "tiger", parts: ["ti", "ger"], ru: "тигр", emoji: "🐅" },
        { word: "monkey", parts: ["mon", "key"], ru: "обезьяна", emoji: "🐒" },
        { word: "rabbit", parts: ["rab", "bit"], ru: "кролик", emoji: "🐇" },
        { word: "pencil", parts: ["pen", "cil"], ru: "карандаш", emoji: "✏️" },
        { word: "window", parts: ["win", "dow"], ru: "окно", emoji: "🪟" },
        { word: "baby", parts: ["ba", "by"], ru: "малыш", emoji: "👶" },
        { word: "table", parts: ["ta", "ble"], ru: "стол", emoji: "" },
        { word: "water", parts: ["wa", "ter"], ru: "вода", emoji: "💧" },
        { word: "flower", parts: ["flow", "er"], ru: "цветок", emoji: "🌸" },
        { word: "basket", parts: ["bas", "ket"], ru: "корзина", emoji: "🧺" },
        { word: "butterfly", parts: ["but", "ter", "fly"], ru: "бабочка", emoji: "🦋" },
        { word: "elephant", parts: ["el", "e", "phant"], ru: "слон", emoji: "🐘" },
        { word: "kangaroo", parts: ["kan", "ga", "roo"], ru: "кенгуру", emoji: "🦘" },
        { word: "panda", parts: ["pan", "da"], ru: "панда", emoji: "🐼" },
        { word: "lemon", parts: ["lem", "on"], ru: "лимон", emoji: "🍋" },
        { word: "pumpkin", parts: ["pump", "kin"], ru: "тыква", emoji: "🎃" },
        { word: "robot", parts: ["ro", "bot"], ru: "робот", emoji: "🤖" },
        { word: "pizza", parts: ["piz", "za"], ru: "пицца", emoji: "🍕" },
        { word: "candy", parts: ["can", "dy"], ru: "конфета", emoji: "🍬" },
        { word: "carrot", parts: ["car", "rot"], ru: "морковь", emoji: "🥕" },
        { word: "zebra", parts: ["ze", "bra"], ru: "зебра", emoji: "🦓" },
        { word: "penguin", parts: ["pen", "guin"], ru: "пингвин", emoji: "🐧" },
        { word: "rainbow", parts: ["rain", "bow"], ru: "радуга", emoji: "🌈" },
        { word: "sunflower", parts: ["sun", "flow", "er"], ru: "подсолнух", emoji: "🌻" },
        { word: "dolphin", parts: ["dol", "phin"], ru: "дельфин", emoji: "🐬" },
        { word: "turtle", parts: ["tur", "tle"], ru: "черепаха", emoji: "🐢" },
        { word: "tomato", parts: ["to", "ma", "to"], ru: "помидор", emoji: "🍅" },
        { word: "spider", parts: ["spi", "der"], ru: "паук", emoji: "🕷️" }
    ],
    ru: [
        { word: "мама", parts: ["ма", "ма"], ru: "мама", emoji: "👩" },
        { word: "папа", parts: ["па", "па"], ru: "папа", emoji: "👨" },
        { word: "каша", parts: ["ка", "ша"], ru: "каша", emoji: "🥣" },
        { word: "рука", parts: ["ру", "ка"], ru: "рука", emoji: "✋" },
        { word: "вода", parts: ["во", "да"], ru: "вода", emoji: "💧" },
        { word: "рыба", parts: ["ры", "ба"], ru: "рыба", emoji: "🐟" },
        { word: "луна", parts: ["лу", "на"], ru: "луна", emoji: "🌙" },
        { word: "коза", parts: ["ко", "за"], ru: "коза", emoji: "🐐" },
        { word: "лиса", parts: ["ли", "са"], ru: "лиса", emoji: "🦊" },
        { word: "сова", parts: ["со", "ва"], ru: "сова", emoji: "🦉" },
        { word: "зима", parts: ["зи", "ма"], ru: "зима", emoji: "❄️" },
        { word: "лето", parts: ["ле", "то"], ru: "лето", emoji: "☀️" },
        { word: "молоко", parts: ["мо", "ло", "ко"], ru: "молоко", emoji: "🥛" },
        { word: "собака", parts: ["со", "ба", "ка"], ru: "собака", emoji: "🐕" },
        { word: "машина", parts: ["ма", "ши", "на"], ru: "машина", emoji: "🚗" },
        { word: "корова", parts: ["ко", "ро", "ва"], ru: "корова", emoji: "🐄" },
        { word: "голова", parts: ["го", "ло", "ва"], ru: "голова", emoji: "" },
        { word: "ягода", parts: ["я", "го", "да"], ru: "ягода", emoji: "🍓" },
        { word: "банан", parts: ["ба", "нан"], ru: "банан", emoji: "🍌" },
        { word: "кукла", parts: ["кук", "ла"], ru: "кукла", emoji: "🪆" },
        { word: "бабочка", parts: ["ба", "боч", "ка"], ru: "бабочка", emoji: "🦋" },
        { word: "карандаш", parts: ["ка", "ран", "даш"], ru: "карандаш", emoji: "✏️" },
        { word: "арбуз", parts: ["ар", "буз"], ru: "арбуз", emoji: "🍉" },
        { word: "ракета", parts: ["ра", "ке", "та"], ru: "ракета", emoji: "🚀" },
        { word: "панда", parts: ["пан", "да"], ru: "панда", emoji: "🐼" }
    ],
    he: [
        { word: "כֶּלֶב", parts: ["כֶּ", "לֶב"], ru: "собака", emoji: "🐕" },
        { word: "בַּיִת", parts: ["בַּ", "יִת"], ru: "дом", emoji: "🏠" },
        { word: "סֵפֶר", parts: ["סֵ", "פֶר"], ru: "книга", emoji: "📖" },
        { word: "תַּפּוּחַ", parts: ["תַּ", "פּוּ", "חַ"], ru: "яблоко", emoji: "🍎" },
        { word: "יֶלֶד", parts: ["יֶ", "לֶד"], ru: "мальчик", emoji: "👦" },
        { word: "חָתוּל", parts: ["חָ", "תוּל"], ru: "кошка", emoji: "🐈" },
        { word: "בָּנָנָה", parts: ["בָּ", "נָ", "נָה"], ru: "банан", emoji: "🍌" },
        { word: "גְּלִידָה", parts: ["גְּ", "לִי", "דָה"], ru: "мороженое", emoji: "🍦" },
        { word: "פַּרְפַּר", parts: ["פַּרְ", "פַּר"], ru: "бабочка", emoji: "🦋" },
        { word: "אַרְנָב", parts: ["אַרְ", "נָב"], ru: "кролик", emoji: "🐇" },
        { word: "שׁוּעָל", parts: ["שׁוּ", "עָל"], ru: "лиса", emoji: "🦊" },
        { word: "צִפּוֹר", parts: ["צִ", "פּוֹר"], ru: "птица", emoji: "🐦" },
        { word: "עוּגָה", parts: ["עוּ", "גָה"], ru: "торт", emoji: "🎂" },
        { word: "כַּדּוּר", parts: ["כַּ", "דּוּר"], ru: "мяч", emoji: "⚽" },
        { word: "מְכוֹנִית", parts: ["מְ", "כוֹ", "נִית"], ru: "машина", emoji: "🚗" },
        { word: "אוֹטוֹבּוּס", parts: ["אוֹ", "טוֹ", "בּוּס"], ru: "автобус", emoji: "🚌" },
        { word: "גֶּזֶר", parts: ["גֶּ", "זֶר"], ru: "морковь", emoji: "🥕" },
        { word: "לִימוֹן", parts: ["לִי", "מוֹן"], ru: "лимон", emoji: "🍋" },
        { word: "פֶּרַח", parts: ["פֶּ", "רַח"], ru: "цветок", emoji: "🌸" },
        { word: "שֶׁמֶשׁ", parts: ["שֶׁ", "מֶשׁ"], ru: "солнце", emoji: "☀️" },
        { word: "מַיִם", parts: ["מַ", "יִם"], ru: "вода", emoji: "💧" },
        { word: "סוּסָה", parts: ["סוּ", "סָה"], ru: "лошадка", emoji: "🐎" },
        { word: "דְּבוֹרָה", parts: ["דְּ", "בוֹ", "רָה"], ru: "пчела", emoji: "🐝" },
        { word: "מִטְרִיָּה", parts: ["מִטְ", "רִ", "יָּה"], ru: "зонт", emoji: "☂️" }
    ]
};

// Фразы для «Собери фразу». ru — перевод (для русских фраз — подсказка-эмодзи).
const SENTENCES = {
    en: [
        { text: "I have a cat", ru: "У меня есть кошка", emoji: "🐈" },
        { text: "The sun is hot", ru: "Солнце горячее", emoji: "☀️" },
        { text: "I like big apples", ru: "Я люблю большие яблоки", emoji: "🍎" },
        { text: "The dog runs fast", ru: "Собака быстро бегает", emoji: "🐕" },
        { text: "My mom reads a book", ru: "Моя мама читает книгу", emoji: "📖" },
        { text: "The bird can fly", ru: "Птица умеет летать", emoji: "🐦" },
        { text: "I drink cold milk", ru: "Я пью холодное молоко", emoji: "🥛" },
        { text: "We play with a ball", ru: "Мы играем с мячом", emoji: "⚽" },
        { text: "The fish is in the water", ru: "Рыба в воде", emoji: "🐟" },
        { text: "It is a red car", ru: "Это красная машина", emoji: "🚗" },
        { text: "I see a big tree", ru: "Я вижу большое дерево", emoji: "🌳" },
        { text: "She has a pink dress", ru: "У неё розовое платье", emoji: "👗" }
    ],
    ru: [
        { text: "Кошка пьёт молоко", ru: "", emoji: "🐈" },
        { text: "Машина едет быстро", ru: "", emoji: "🚗" },
        { text: "Книга лежит на столе", ru: "", emoji: "📖" },
        { text: "Собака громко лает", ru: "", emoji: "🐕" },
        { text: "Мама печёт вкусный торт", ru: "", emoji: "🎂" },
        { text: "Птица поёт на дереве", ru: "", emoji: "🐦" },
        { text: "Я люблю красные яблоки", ru: "", emoji: "🍎" },
        { text: "Мы играем в мяч", ru: "", emoji: "⚽" },
        { text: "Летом светит яркое солнце", ru: "", emoji: "☀️" },
        { text: "Зимой идёт белый снег", ru: "", emoji: "❄️" },
        { text: "Рыба плавает в реке", ru: "", emoji: "🐟" },
        { text: "Папа читает сказку", ru: "", emoji: "📚" }
    ],
    he: [
        { text: "הַכֶּלֶב רָץ מַהֵר", ru: "Собака бежит быстро", emoji: "🐕" },
        { text: "אֲנִי אוֹהֵב גְּלִידָה", ru: "Я люблю мороженое", emoji: "🍦" },
        { text: "הַשֶּׁמֶשׁ צְהֻבָּה וְחַמָּה", ru: "Солнце жёлтое и тёплое", emoji: "☀️" },
        { text: "אִמָּא קוֹרֵאת סֵפֶר", ru: "Мама читает книгу", emoji: "📖" },
        { text: "הַיֶּלֶד שׁוֹתֶה חָלָב", ru: "Мальчик пьёт молоко", emoji: "🥛" },
        { text: "יֵשׁ לִי חָתוּל קָטָן", ru: "У меня есть маленький кот", emoji: "🐈" },
        { text: "הַצִּפּוֹר עָפָה בַּשָּׁמַיִם", ru: "Птица летит в небе", emoji: "🐦" },
        { text: "הַתַּפּוּחַ אָדֹם וּמָתוֹק", ru: "Яблоко красное и сладкое", emoji: "🍎" },
        { text: "אַבָּא נוֹהֵג בַּמְּכוֹנִית", ru: "Папа ведёт машину", emoji: "🚗" },
        { text: "אֲנַחְנוּ מְשַׂחֲקִים בְּכַדּוּר", ru: "Мы играем в мяч", emoji: "⚽" }
    ]
};

// Шаблоны «Заполни пропуск» (английский). Ключ — kind темы.
const FILL_TEMPLATES = {
    noun:   [ { en: "Look at the ___!", ru: "Посмотри:" }, { en: "I can see the ___", ru: "Я вижу:" }, { en: "I like the ___", ru: "Мне нравится:" } ],
    color:  [ { en: "The ball is ___", ru: "Мяч" }, { en: "My hat is ___", ru: "Моя шляпа:" } ],
    adj:    [ { en: "The cat is ___", ru: "Кот" }, { en: "I am ___", ru: "Я:" } ],
    verb:   [ { en: "I like to ___", ru: "Я люблю" }, { en: "I can ___", ru: "Я умею" } ],
    number: [ { en: "The number is ___", ru: "Число:" }, { en: "I can count to ___", ru: "Я умею считать до:" } ]
};

// Тексты на иврите с вопросами. answer — правильный ответ, он есть среди options.
const HEBREW_READING = [
    {
        text: "הַיֶּלֶד דָּוִד שׁוֹתֶה חָלָב חַם בַּבֹּקֶר.",
        ru: "Мальчик Давид пьёт горячее молоко утром.",
        questions: [
            { q: "מָה דָּוִד שׁוֹתֶה?", ru: "Что пьёт Давид?", answer: "חָלָב חַם", options: ["חָלָב חַם", "מַיִם קָרִים", "מִיץ תַּפּוּזִים", "תֵּה מָתוֹק"] },
            { q: "מָתַי דָּוִד שׁוֹתֶה חָלָב?", ru: "Когда Давид пьёт молоко?", answer: "בַּבֹּקֶר", options: ["בַּבֹּקֶר", "בָּעֶרֶב", "בַּלַּיְלָה", "בַּצָּהֳרַיִם"] }
        ]
    },
    {
        text: "לְדָנָה יֵשׁ חָתוּל לָבָן. הֶחָתוּל אוֹהֵב לִישֹׁן עַל הַסַּפָּה.",
        ru: "У Даны есть белый кот. Кот любит спать на диване.",
        questions: [
            { q: "מָה יֵשׁ לְדָנָה?", ru: "Что есть у Даны?", answer: "חָתוּל", options: ["חָתוּל", "כֶּלֶב", "דָּג", "צִפּוֹר"] },
            { q: "אֵיזֶה צֶבַע הֶחָתוּל?", ru: "Какого цвета кот?", answer: "לָבָן", options: ["לָבָן", "שָׁחֹר", "אָדֹם", "יָרֹק"] },
            { q: "אֵיפֹה הֶחָתוּל יָשֵׁן?", ru: "Где спит кот?", answer: "עַל הַסַּפָּה", options: ["עַל הַסַּפָּה", "עַל הַמִּטָּה", "בַּגִּנָּה", "מִתַּחַת לַשֻּׁלְחָן"] }
        ]
    },
    {
        text: "הַיּוֹם יוֹרֵד גֶּשֶׁם. נוֹעָה לוֹקַחַת מִטְרִיָּה כְּחֻלָּה.",
        ru: "Сегодня идёт дождь. Ноа берёт синий зонт.",
        questions: [
            { q: "מָה מֶזֶג הָאֲוִיר הַיּוֹם?", ru: "Какая сегодня погода?", answer: "יוֹרֵד גֶּשֶׁם", options: ["יוֹרֵד גֶּשֶׁם", "יֵשׁ שֶׁמֶשׁ", "יוֹרֵד שֶׁלֶג", "חַם מְאוֹד"] },
            { q: "מָה נוֹעָה לוֹקַחַת?", ru: "Что берёт Ноа?", answer: "מִטְרִיָּה", options: ["מִטְרִיָּה", "כּוֹבַע", "כַּדּוּר", "סֵפֶר"] },
            { q: "אֵיזֶה צֶבַע הַמִּטְרִיָּה?", ru: "Какого цвета зонт?", answer: "כְּחֻלָּה", options: ["כְּחֻלָּה", "אֲדֻמָּה", "צְהֻבָּה", "יְרֻקָּה"] }
        ]
    },
    {
        text: "אַבָּא קָנָה בַּשּׁוּק שְׁלוֹשָׁה תַּפּוּחִים וּבָנָנָה אַחַת.",
        ru: "Папа купил на рынке три яблока и один банан.",
        questions: [
            { q: "כַּמָּה תַּפּוּחִים קָנָה אַבָּא?", ru: "Сколько яблок купил папа?", answer: "שְׁלוֹשָׁה", options: ["שְׁלוֹשָׁה", "שְׁנַיִם", "אַרְבָּעָה", "חֲמִשָּׁה"] },
            { q: "אֵיפֹה אַבָּא קָנָה אֶת הַפֵּרוֹת?", ru: "Где папа купил фрукты?", answer: "בַּשּׁוּק", options: ["בַּשּׁוּק", "בַּגַּן", "בַּבַּיִת", "בַּיָּם"] },
            { q: "מָה עוֹד אַבָּא קָנָה?", ru: "Что ещё купил папа?", answer: "בָּנָנָה", options: ["בָּנָנָה", "עוּגָה", "גְּלִידָה", "לֶחֶם"] }
        ]
    },
    {
        text: "בְּשַׁבָּת הַמִּשְׁפָּחָה נוֹסַעַת לַיָּם. הַיְּלָדִים בּוֹנִים אַרְמוֹן בַּחוֹל.",
        ru: "В субботу семья едет на море. Дети строят замок из песка.",
        questions: [
            { q: "לְאָן נוֹסַעַת הַמִּשְׁפָּחָה?", ru: "Куда едет семья?", answer: "לַיָּם", options: ["לַיָּם", "לַגַּן", "לְסַבְתָּא", "לַחֲנוּת"] },
            { q: "מָתַי הֵם נוֹסְעִים?", ru: "Когда они едут?", answer: "בְּשַׁבָּת", options: ["בְּשַׁבָּת", "בְּיוֹם רִאשׁוֹן", "בַּלַּיְלָה", "בַּחֹרֶף"] },
            { q: "מָה בּוֹנִים הַיְּלָדִים?", ru: "Что строят дети?", answer: "אַרְמוֹן", options: ["אַרְמוֹן", "גֶּשֶׁר", "סִירָה", "מְכוֹנִית"] }
        ]
    },
    {
        text: "לְיוֹסִי יֵשׁ כֶּלֶב קָטָן. שֵׁם הַכֶּלֶב רֶקְס. רֶקְס אוֹהֵב לָרוּץ בַּפַּארְק.",
        ru: "У Йоси есть маленькая собака. Собаку зовут Рекс. Рекс любит бегать в парке.",
        questions: [
            { q: "מָה שֵׁם הַכֶּלֶב?", ru: "Как зовут собаку?", answer: "רֶקְס", options: ["רֶקְס", "מִיצִי", "בּוֹבּוֹ", "לוּלוּ"] },
            { q: "אֵיזֶה כֶּלֶב יֵשׁ לְיוֹסִי?", ru: "Какая собака у Йоси?", answer: "קָטָן", options: ["קָטָן", "גָּדוֹל", "שָׁחֹר", "זָקֵן"] },
            { q: "מָה רֶקְס אוֹהֵב לַעֲשׂוֹת?", ru: "Что любит делать Рекс?", answer: "לָרוּץ", options: ["לָרוּץ", "לִישֹׁן", "לִשְׂחוֹת", "לָשִׁיר"] }
        ]
    },
    {
        text: "בַּגַּן יֵשׁ עֵץ גָּבוֹהַּ. עַל הָעֵץ יוֹשֶׁבֶת צִפּוֹר צְהֻבָּה וְשָׁרָה.",
        ru: "В саду есть высокое дерево. На дереве сидит жёлтая птичка и поёт.",
        questions: [
            { q: "מָה יֵשׁ בַּגַּן?", ru: "Что есть в саду?", answer: "עֵץ גָּבוֹהַּ", options: ["עֵץ גָּבוֹהַּ", "בְּרֵכָה", "בַּיִת קָטָן", "מְכוֹנִית"] },
            { q: "מִי יוֹשֶׁבֶת עַל הָעֵץ?", ru: "Кто сидит на дереве?", answer: "צִפּוֹר", options: ["צִפּוֹר", "חָתוּל", "קוֹף", "סְנָאִי"] },
            { q: "מָה הַצִּפּוֹר עוֹשָׂה?", ru: "Что делает птичка?", answer: "שָׁרָה", options: ["שָׁרָה", "יְשֵׁנָה", "אוֹכֶלֶת", "בּוֹכָה"] }
        ]
    },
    {
        text: "מִיכַל בַּת שֵׁשׁ. הִיא לוֹמֶדֶת בְּכִתָּה א. הִיא אוֹהֶבֶת לְצַיֵּר.",
        ru: "Михаль шесть лет. Она учится в первом классе. Она любит рисовать.",
        questions: [
            { q: "בַּת כַּמָּה מִיכַל?", ru: "Сколько лет Михаль?", answer: "שֵׁשׁ", options: ["שֵׁשׁ", "חָמֵשׁ", "שֶׁבַע", "עֶשֶׂר"] },
            { q: "מָה מִיכַל אוֹהֶבֶת?", ru: "Что любит Михаль?", answer: "לְצַיֵּר", options: ["לְצַיֵּר", "לָשִׁיר", "לִרְקֹד", "לְבַשֵּׁל"] }
        ]
    },
    {
        text: "בַּבֹּקֶר אֲנִי אוֹכֵל לֶחֶם עִם גְּבִינָה וְשׁוֹתֶה מִיץ תַּפּוּזִים.",
        ru: "Утром я ем хлеб с сыром и пью апельсиновый сок.",
        questions: [
            { q: "מָה אֲנִי אוֹכֵל בַּבֹּקֶר?", ru: "Что я ем утром?", answer: "לֶחֶם עִם גְּבִינָה", options: ["לֶחֶם עִם גְּבִינָה", "פִּיצָה", "מָרָק", "אֹרֶז"] },
            { q: "מָה אֲנִי שׁוֹתֶה?", ru: "Что я пью?", answer: "מִיץ תַּפּוּזִים", options: ["מִיץ תַּפּוּזִים", "חָלָב", "קָפֶה", "מַיִם"] }
        ]
    },
    {
        text: "סָבְתָא אוֹפָה עוּגַת שׁוֹקוֹלָד. הַנְּכָדִים בָּאִים לֶאֱכֹל.",
        ru: "Бабушка печёт шоколадный торт. Внуки приходят поесть.",
        questions: [
            { q: "מִי אוֹפָה עוּגָה?", ru: "Кто печёт торт?", answer: "סָבְתָא", options: ["סָבְתָא", "אִמָּא", "סַבָּא", "אַבָּא"] },
            { q: "אֵיזוֹ עוּגָה הִיא אוֹפָה?", ru: "Какой торт она печёт?", answer: "עוּגַת שׁוֹקוֹלָד", options: ["עוּגַת שׁוֹקוֹלָד", "עוּגַת גְּבִינָה", "עוּגַת תַּפּוּחִים", "עוּגַת גֶּזֶר"] },
            { q: "מִי בָּא לֶאֱכֹל?", ru: "Кто приходит поесть?", answer: "הַנְּכָדִים", options: ["הַנְּכָדִים", "הַשְּׁכֵנִים", "הַחֲבֵרִים", "הַמּוֹרִים"] }
        ]
    },
    {
        text: "בַּחֹרֶף קַר. אֲנַחְנוּ לוֹבְשִׁים מְעִיל, צָעִיף וּכְפָפוֹת.",
        ru: "Зимой холодно. Мы надеваем пальто, шарф и перчатки.",
        questions: [
            { q: "מָתַי קַר?", ru: "Когда холодно?", answer: "בַּחֹרֶף", options: ["בַּחֹרֶף", "בַּקַּיִץ", "בָּאָבִיב", "תָּמִיד"] },
            { q: "מָה לוֹבְשִׁים כְּשֶׁקַּר?", ru: "Что надевают, когда холодно?", answer: "מְעִיל", options: ["מְעִיל", "בֶּגֶד יָם", "סַנְדָּלִים", "מִכְנָסַיִם קְצָרִים"] }
        ]
    },
    {
        text: "הַפִּיל הוּא חַיָּה גְּדוֹלָה מְאוֹד. יֵשׁ לוֹ חֶדֶק אָרֹךְ וְאָזְנַיִם גְּדוֹלוֹת.",
        ru: "Слон — очень большое животное. У него длинный хобот и большие уши.",
        questions: [
            { q: "אֵיזוֹ חַיָּה גְּדוֹלָה מְאוֹד?", ru: "Какое животное очень большое?", answer: "הַפִּיל", options: ["הַפִּיל", "הָעַכְבָּר", "הֶחָתוּל", "הַצִּפּוֹר"] },
            { q: "מָה אָרֹךְ אֵצֶל הַפִּיל?", ru: "Что длинное у слона?", answer: "הַחֶדֶק", options: ["הַחֶדֶק", "הַזָּנָב", "הָרַגְלַיִם", "הַשִּׁנַּיִם"] }
        ]
    },
    {
        text: "רוֹנִי נוֹסֵעַ לְבֵית הַסֵּפֶר בְּאוֹטוֹבּוּס צָהֹב.",
        ru: "Рони едет в школу на жёлтом автобусе.",
        questions: [
            { q: "לְאָן נוֹסֵעַ רוֹנִי?", ru: "Куда едет Рони?", answer: "לְבֵית הַסֵּפֶר", options: ["לְבֵית הַסֵּפֶר", "לַיָּם", "לַפַּארְק", "לְסַבָּא"] },
            { q: "בְּמָה רוֹנִי נוֹסֵעַ?", ru: "На чём едет Рони?", answer: "בְּאוֹטוֹבּוּס", options: ["בְּאוֹטוֹבּוּס", "בְּרַכֶּבֶת", "בְּמוֹנִית", "בְּאוֹפַנַּיִם"] },
            { q: "אֵיזֶה צֶבַע הָאוֹטוֹבּוּס?", ru: "Какого цвета автобус?", answer: "צָהֹב", options: ["צָהֹב", "כָּחֹל", "אָדֹם", "לָבָן"] }
        ]
    },
    {
        text: "בַּלַּיְלָה יֵשׁ בַּשָּׁמַיִם יָרֵחַ וְהַרְבֵּה כּוֹכָבִים.",
        ru: "Ночью на небе луна и много звёзд.",
        questions: [
            { q: "מָה יֵשׁ בַּשָּׁמַיִם בַּלַּיְלָה?", ru: "Что на небе ночью?", answer: "יָרֵחַ וְכוֹכָבִים", options: ["יָרֵחַ וְכוֹכָבִים", "שֶׁמֶשׁ", "קֶשֶׁת", "צִפּוֹרִים"] },
            { q: "מָתַי רוֹאִים כּוֹכָבִים?", ru: "Когда видно звёзды?", answer: "בַּלַּיְלָה", options: ["בַּלַּיְלָה", "בַּבֹּקֶר", "בַּצָּהֳרַיִם", "אַף פַּעַם"] }
        ]
    }
];

// Задачи «Слушай и решай».
const MATH_PROBLEMS = [
    { text: "У Маши было 3 яблока, она съела 1. Сколько осталось?", answer: 2, options: [1, 2, 3, 4] },
    { text: "На ветке сидело 4 птички, прилетело ещё 2. Сколько всего птичек?", answer: 6, options: [5, 6, 7, 4] },
    { text: "В гараже стояло 5 машин, 2 уехали. Сколько осталось?", answer: 3, options: [2, 3, 4, 5] },
    { text: "У Саши было 4 конфеты, мама дала ещё 3. Сколько стало конфет?", answer: 7, options: [6, 7, 8, 5] },
    { text: "В вазе 6 цветов. Мама поставила ещё 4. Сколько цветов в вазе?", answer: 10, options: [9, 10, 11, 8] },
    { text: "У кошки 4 лапы. Сколько лап у двух кошек?", answer: 8, options: [6, 8, 4, 10] },
    { text: "На столе было 8 печений, дети съели 5. Сколько осталось?", answer: 3, options: [2, 3, 4, 5] },
    { text: "В пруду плавали 7 уток, 3 улетели. Сколько уток осталось?", answer: 4, options: [3, 4, 5, 10] },
    { text: "У Пети 2 машинки, у Коли на 3 больше. Сколько машинок у Коли?", answer: 5, options: [4, 5, 6, 1] },
    { text: "В коробке 10 карандашей, 4 сломались. Сколько целых?", answer: 6, options: [5, 6, 7, 14] },
    { text: "На дереве 9 яблок, упало 2. Сколько яблок на дереве?", answer: 7, options: [6, 7, 8, 11] },
    { text: "У бабушки 3 внука и 2 внучки. Сколько всего внуков?", answer: 5, options: [4, 5, 6, 1] }
];

if (typeof module !== "undefined") {
    module.exports = { TOPICS, WORDS, LETTERS, SYLLABLE_WORDS, SENTENCES, FILL_TEMPLATES, HEBREW_READING, MATH_PROBLEMS };
}
