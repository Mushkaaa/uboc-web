export const site = {
  meta: {
    lang: 'sk',
    url: 'https://uboc.sk',
    title: 'Úboč – marketing, weby a sociálne siete | Liptovský Mikuláš',
    description:
      'Marketingové štúdio z Liptova. Staviame rýchle weby, vedieme merateľné kampane a staráme sa o sociálne siete. Prvá konzultácia je zadarmo.',
    ogTitle: 'Úboč – dostaneme vás na mapu',
    ogDescription:
      'Marketing, weby a sociálne siete pre firmy z Liptova, Oravy a Žiliny. Napíšte nám, prvý rozhovor nič nestojí.',
    ogImage: '/og.png',
    ogImageAlt: 'Vrstevnicová mapa v modrej, ružovej a žltej s nápisom Úboč',
    themeColor: '#2B23E6',
  },

  brand: {
    name: 'Úboč',
    legalName: 'Úboč s. r. o.',
    descriptor: 'marketingové štúdio z Liptova',
    founded: 2019,
  },

  ui: {
    skipToContent: 'Preskočiť na obsah',
    skipIntro: 'Preskočiť úvod',
    menuOpen: 'Menu',
    menuClose: 'Zavrieť',
    menuLabel: 'Hlavná navigácia',
    close: 'Zavrieť',
    cursorView: 'Otvoriť',
    cursorDrag: 'Potiahnuť',
    backToTop: 'Späť hore',
  },

  nav: [
    { label: 'Služby', href: '#sluzby' },
    { label: 'Práce', href: '#prace' },
    { label: 'Proces', href: '#proces' },
    { label: 'Výsledky', href: '#vysledky' },
    { label: 'Tím', href: '#tim' },
    { label: 'Kontakt', href: '#kontakt' },
  ],

  cta: {
    primary: 'Dohodnúť konzultáciu zadarmo',
    short: 'Konzultácia zadarmo',
    barText: 'Prvý rozhovor je zadarmo',
    barButton: 'Napísať nám',
    href: '#kontakt',
  },

  hero: {
    title: 'Dostaneme vás na mapu.',
    titleLines: {
      mobile: ['Dostaneme', 'vás', 'na mapu.'],
      desktop: ['Dostaneme vás', 'na mapu.'],
    },
    lead:
      'Sme Úboč, marketingové štúdio z Liptovského Mikuláša. Staviame weby, vedieme kampane a staráme sa o sociálne siete firmám, ktoré chcú, aby ich zákazníci našli skôr než konkurenciu.',
    secondaryCta: { label: 'Pozrieť naše práce', href: '#prace' },
    note: 'Prvý rozhovor trvá 30 minút, online alebo pri káve v Mikuláši. Bez záväzkov.',
    hintPointer: 'Pohnite myšou, terén sa zdvihne s vami.',
    hintTouch: 'Potiahnite prstom po mape.',
  },

  services: {
    id: 'sluzby',
    title: 'S čím vám pomôžeme',
    lead: 'Tri veci, ktoré robíme každý deň. Môžete si vybrať jednu, no najlepšie fungujú spolu.',
    items: [
      {
        id: 'marketing',
        visual: 'bars',
        title: 'Marketing',
        summary: 'Kampane na Googli a Mete, ktoré vieme zmerať do posledného eura.',
        description:
          'Najprv zistíme, odkiaľ k vám zákazníci naozaj chodia a koľko vás jeden stojí. Potom nastavíme kampane, pri ktorých každý mesiac vidíte, čo priniesli: dopyty, rezervácie alebo objednávky, nie iba kliky.',
        list: [
          'Google Ads a Meta Ads',
          'Lokálne SEO a profil firmy na Googli',
          'E-mailové kampane a newslettre',
          'Meranie v GA4 a mesačný report v ľudskej reči',
        ],
        price: 'od 450 € mesačne',
      },
      {
        id: 'weby',
        visual: 'wireframe',
        title: 'Weby',
        summary: 'Rýchle weby a e-shopy, ktoré si viete upravovať sami.',
        description:
          'Web navrhujeme od obsahu, nie od šablóny. Dostanete stránku, ktorá sa na mobile načíta do dvoch sekúnd, dá sa nájsť na Googli a texty či fotky v nej zmeníte bez programátora.',
        list: [
          'Firemné weby a landing pages',
          'E-shopy a rezervačné systémy',
          'Texty, fotky a základ SEO v cene',
          'Správa, zálohy a úpravy po spustení',
        ],
        price: 'od 1 900 € za web',
      },
      {
        id: 'socialne-siete',
        visual: 'tiles',
        title: 'Sociálne siete',
        summary: 'Obsah, ktorý znie ako vy a vychádza pravidelne.',
        description:
          'Raz mesačne prídeme k vám, nafotíme a natočíme materiál na ďalšie týždne. O plán príspevkov, texty, odpovede na správy aj reklamu sa staráme my, vy len schvaľujete.',
        list: [
          'Instagram, Facebook, TikTok a LinkedIn',
          'Foto a video priamo u vás',
          'Plán príspevkov na mesiac dopredu',
          'Odpovede na komentáre a správy do 24 hodín',
        ],
        price: 'od 390 € mesačne',
      },
    ],
    priceNote:
      'Ceny sú bez DPH. Presnú sumu vám povieme po prvom rozhovore, ešte predtým, ako čokoľvek podpíšete.',
    toggleOpen: 'Zobraziť podrobnosti',
    toggleClose: 'Skryť podrobnosti',
  },

  works: {
    id: 'prace',
    title: 'Vybrané práce',
    lead: 'Šesť projektov z posledných dvoch rokov. Pri každom nájdete číslo, ktoré vieme doložiť.',
    counter: '{current} / {total}',
    carouselLabel: 'Vybrané práce, posúvajte do strán',
    openLabel: 'Otvoriť projekt {client}',
    detail: {
      challengeTitle: 'Východisko',
      solutionTitle: 'Čo sme spravili',
      resultsTitle: 'Výsledok',
      cta: 'Chcem niečo podobné',
    },
    items: [
      {
        id: 'tri-hole',
        client: 'Penzión Tri hole',
        place: 'Liptovský Ján',
        year: 2025,
        services: 'Web a kampane',
        preview: 'calendar',
        palette: { bg: '#170F96', a: '#FFD84A', b: '#EEF1FB' },
        metric: { value: '+64 %', label: 'priamych rezervácií za prvú sezónu' },
        summary:
          'Nový web s rezerváciou na tri kliknutia a kampane, ktoré znížili závislosť od rezervačných portálov.',
        challenge:
          'Sedem z desiatich rezervácií prichádzalo cez rezervačné portály a penzión z každej odvádzal províziu 15 až 18 %.',
        solution:
          'Postavili sme web s vlastným rezervačným kalendárom, nafotili izby aj okolie a spustili kampane na Googli a Mete pre hostí, ktorí v penzióne už boli alebo hľadajú ubytovanie v Jánskej doline.',
        results: [
          '+64 % priamych rezervácií medzi zimou 2024 a zimou 2025',
          'Podiel rezervačných portálov klesol zo 71 % na 44 %',
          'Na províziách ušetrených približne 9 400 € za sezónu',
        ],
      },
      {
        id: 'u-kmotry',
        client: 'Pekáreň U Kmotry',
        place: 'Žilina',
        year: 2025,
        services: 'Sociálne siete',
        preview: 'feed',
        palette: { bg: '#FF4D9D', a: '#120E3D', b: '#FFD84A' },
        metric: { value: '9 800', label: 'sledovateľov na Instagrame za 10 mesiacov' },
        summary: 'Zo susedskej pekárne účet, pre ktorý ľudia v sobotu ráno stoja v rade.',
        challenge:
          'Pekáreň piekla výborný kváskový chlieb, no vedeli o nej len ľudia z okolitých ulíc. Instagram mal 1 200 sledovateľov a nový príspevok raz za dva týždne.',
        solution:
          'Každý mesiac sme strávili jedno ráno v pekárni s kamerou. Vznikli krátke videá z pečenia, týždenná ponuka každý pondelok a predobjednávky cez jednoduchý formulár.',
        results: [
          'Z 1 200 na 9 800 sledovateľov za 10 mesiacov',
          '310 predobjednávok týždenne',
          'Sobotná ponuka býva vypredaná do 10:30',
        ],
      },
      {
        id: 'volnobeh',
        client: 'Bike servis Voľnobeh',
        place: 'Liptovský Mikuláš',
        year: 2024,
        services: 'Web a lokálne SEO',
        preview: 'map',
        palette: { bg: '#EEF1FB', a: '#2B23E6', b: '#FF4D9D' },
        metric: { value: '3,1×', label: 'viac objednávok servisu cez internet' },
        summary: 'Online objednávka termínu a prvé miesto v mapách namiesto telefónu, ktorý nikto nestíhal dvíhať.',
        challenge:
          'Servis prijímal objednávky iba telefonicky a počas sezóny nestíhal dvíhať. V mapách Google bol až na druhej strane výsledkov.',
        solution:
          'Spravili sme web s online objednávkou termínu, doplnili profil firmy na Googli a naučili tím pýtať si recenziu hneď pri odovzdaní bicykla.',
        results: [
          '3,1× viac objednávok servisu než rok predtým',
          '1. miesto v mapách na „servis bicyklov Liptov“',
          'Z 23 na 187 recenzií s priemerom 4,9',
        ],
      },
      {
        id: 'hoblina',
        client: 'Stolárstvo Hoblina',
        place: 'Ružomberok',
        year: 2025,
        services: 'Web a Google Ads',
        preview: 'chart',
        palette: { bg: '#FFD84A', a: '#120E3D', b: '#2B23E6' },
        metric: { value: '47', label: 'dopytov na kuchyne za prvý štvrťrok' },
        summary: 'Web, ktorý ukazuje hotovú prácu, a kampaň, ktorá zaplnila výrobu na päť mesiacov dopredu.',
        challenge:
          'Zákazky chodili len na odporúčanie a medzi nimi vznikali prázdne týždne. Starý web nemal jedinú fotku hotovej práce.',
        solution:
          'Nafotili sme dvanásť realizácií, postavili web s dopytovým formulárom, ktorý sa pýta na rozmery a rozpočet, a spustili Google Ads pre Ružomberok a okolie.',
        results: [
          '47 dopytov za prvé tri mesiace',
          'Cena za jeden dopyt 11 €',
          'Výroba obsadená na päť mesiacov dopredu',
        ],
      },
      {
        id: 'dymka',
        client: 'Pražiareň Dymka',
        place: 'Dolný Kubín',
        year: 2024,
        services: 'E-shop a e-maily',
        preview: 'shop',
        palette: { bg: '#5A2EF5', a: '#FFD84A', b: '#EEF1FB' },
        metric: { value: '38 %', label: 'obratu z e-shopu do jedného roka' },
        summary: 'E-shop s predplatným kávy pre zákazníkov, ktorí si ju dovtedy pýtali cez správy.',
        challenge:
          'Káva sa predávala iba v kaviarni a na trhoch. Stáli zákazníci si ju objednávali poštou cez správy na Instagrame.',
        solution:
          'Spustili sme e-shop s predplatným a sériu e-mailov, ktorá novému zákazníkovi poradí s prípravou a po troch týždňoch pripomenie ďalšie balenie.',
        results: [
          'E-shop tvorí po 12 mesiacoch 38 % obratu',
          '420 aktívnych predplatných',
          'Zákazník s predplatným nakupuje 2,4× častejšie',
        ],
      },
      {
        id: 'previs',
        client: 'Lezecká stena Previs',
        place: 'Žilina',
        year: 2025,
        services: 'Kampaň a sociálne siete',
        preview: 'reel',
        palette: { bg: '#120E3D', a: '#FF4D9D', b: '#FFD84A' },
        metric: { value: '1 900', label: 'predaných vstupov za otvárací mesiac' },
        summary: 'Zo stavby steny seriál, ktorý vypredal otvárací víkend ešte pred otvorením.',
        challenge:
          'Nová stena otvárala v meste, kde už dve fungovali. Do otvorenia ostávalo šesť týždňov a nemala žiadne publikum.',
        solution:
          'Zo stavby sme spravili seriál: každý týždeň krátke video o tom, ako stena rastie. K tomu predpredaj vstupov so zľavou a kampaň pre žilinských študentov.',
        results: [
          '1 900 vstupov predaných za prvý mesiac',
          '410 000 zhliadnutí videí pred otvorením',
          '640 ľudí si kúpilo vstup ešte v predpredaji',
        ],
      },
    ],
  },

  process: {
    id: 'proces',
    title: 'Ako pracujeme',
    lead: 'Štyri kroky. Po každom z nich viete, čo je hotové a čo príde ďalej.',
    steps: [
      {
        title: 'Rozhovor',
        duration: '30 minút, zadarmo',
        text:
          'Povieme si, čo predávate, komu a čo vám dnes nefunguje. Ak zistíme, že vám nevieme pomôcť, povieme to hneď.',
      },
      {
        title: 'Plán',
        duration: 'do 5 pracovných dní',
        text:
          'Dostanete návrh na dve strany: čo spravíme, v akom poradí, koľko to stojí a podľa akých čísel spoznáme, že to funguje.',
      },
      {
        title: 'Výroba',
        duration: 'web 4 až 8 týždňov, kampane do 14 dní',
        text:
          'Pracujeme v týždenných krokoch. Každý piatok vidíte, čo pribudlo, a môžete to pripomienkovať, kým sa to dá ľahko zmeniť.',
      },
      {
        title: 'Meranie a ladenie',
        duration: 'každý mesiac',
        text:
          'Po spustení sledujeme dopyty, objednávky a cenu za zákazníka. Raz mesačne vám pošleme report a navrhneme, čo upraviť.',
      },
    ],
  },

  results: {
    id: 'vysledky',
    title: 'Výsledky v číslach',
    items: [
      { value: 84, decimals: 0, suffix: '', label: 'dokončených projektov od roku 2019' },
      { value: 4.2, decimals: 1, suffix: '×', label: 'priemerná návratnosť výdavkov na reklamu v roku 2025' },
      { value: 92, decimals: 0, suffix: ' %', label: 'klientov s nami pracuje dlhšie ako rok' },
      { value: 24, decimals: 0, suffix: ' h', label: 'najdlhšie čakáte na našu odpoveď v pracovný deň' },
    ],
    note: 'Čísla vychádzajú z našich interných meraní k 31. 12. 2025.',
  },

  team: {
    id: 'tim',
    title: 'Kto za tým stojí',
    lead:
      'Je nás päť a sedíme v jednej kancelárii v Liptovskom Mikuláši. S kým sa dohodnete na začiatku, s tým pracujete až do konca.',
    portraitAlt: 'Ilustrovaný portrét z vrstevníc: {name}',
    members: [
      {
        name: 'Tereza Hrončeková',
        initials: 'TH',
        role: 'Stratégia a kampane',
        bio: 'Úboč založila v roku 2019 po šiestich rokoch v bratislavskej agentúre. Rozpočty kampaní kontroluje každé ráno pri prvej káve.',
        colors: ['#2B23E6', '#FF4D9D'],
      },
      {
        name: 'Matúš Ďurica',
        initials: 'MĎ',
        role: 'Vývoj webov',
        bio: 'Verí, že web sa má načítať skôr, než stihnete žmurknúť. Cez víkend ho nájdete na skialpoch v Žiarskej doline.',
        colors: ['#170F96', '#5A2EF5'],
      },
      {
        name: 'Simona Kubalová',
        initials: 'SK',
        role: 'Sociálne siete a texty',
        bio: 'Píše tak, ako ľudia hovoria. Z každej návštevy u klienta odchádza s plnou kartou videí a aspoň jednou historkou.',
        colors: ['#FF4D9D', '#5A2EF5'],
      },
      {
        name: 'Adam Lehotský',
        initials: 'AL',
        role: 'Dizajn',
        bio: 'Navrhuje weby, logá aj polepy áut. Tvrdí, že dobrý dizajn spoznáte podľa toho, že vám nič neprekáža.',
        colors: ['#5A2EF5', '#2B23E6'],
      },
      {
        name: 'Nina Bartková',
        initials: 'NB',
        role: 'Foto a video',
        bio: 'Fotí a točí všetko, čo vidíte na sieťach našich klientov. Najlepšie zábery vraj vznikajú päť minút po tom, ako všetci prestanú pózovať.',
        colors: ['#2B23E6', '#170F96'],
      },
    ],
  },

  testimonials: {
    id: 'referencie',
    title: 'Čo hovoria klienti',
    prev: 'Predošlá',
    next: 'Ďalšia',
    counter: '{current} / {total}',
    regionLabel: 'Referencie klientov',
    items: [
      {
        quote:
          'Prvýkrát presne viem, koľko ma stojí jedna rezervácia a odkiaľ prišla. Províziu, ktorú sme ušetrili, sme dali do novej sauny.',
        name: 'Jana Mrvová',
        role: 'majiteľka',
        company: 'Penzión Tri hole',
      },
      {
        quote:
          'Bál som sa, že budeme na Instagrame pôsobiť umelo. Simona nás natočila tak, ako naozaj pečieme, a ľudia to spoznali.',
        name: 'Peter Gažo',
        role: 'pekár a majiteľ',
        company: 'Pekáreň U Kmotry',
      },
      {
        quote:
          'Report dostanem každý mesiac na jednu stranu a rozumiem každému riadku. To sa mi s agentúrou predtým nestalo.',
        name: 'Marek Šimček',
        role: 'konateľ',
        company: 'Stolárstvo Hoblina',
      },
      {
        quote:
          'Telefón konečne nezvoní celý deň. Ľudia si termín vyberú na webe a my máme čas opravovať bicykle.',
        name: 'Lucia Ondrejková',
        role: 'spolumajiteľka',
        company: 'Bike servis Voľnobeh',
      },
    ],
  },

  contact: {
    id: 'kontakt',
    title: 'Napíšte nám, s čím sa trápite',
    lead: 'Odpovieme do 24 hodín v pracovné dni. Prvý rozhovor trvá 30 minút a nič nestojí.',
    email: 'ahoj@uboc.sk',
    phone: { display: '+421 900 000 000', href: 'tel:+421900000000' },
    address: {
      street: 'Pod Hrebeňom 12',
      zip: '031 01',
      city: 'Liptovský Mikuláš',
      country: 'Slovensko',
    },
    hours: 'Pondelok až piatok, 9:00 – 17:00',
    form: {
      emailSubject: 'Nová správa z webu uboc.sk',
      legend: 'Kontaktný formulár',
      requiredNote: 'Polia bez označenia „nepovinné“ treba vyplniť.',
      fields: {
        name: {
          label: 'Meno a priezvisko',
          errors: {
            required: 'Napíšte, prosím, svoje meno.',
            tooShort: 'Meno je príliš krátke.',
          },
        },
        email: {
          label: 'E-mail',
          errors: {
            required: 'Bez e-mailu vám nevieme odpovedať.',
            invalid: 'E-mail nemá správny tvar. Skúste napríklad meno@firma.sk.',
          },
        },
        phone: {
          label: 'Telefón (nepovinné)',
          errors: { invalid: 'Telefónne číslo zadajte v tvare +421 900 000 000.' },
        },
        company: { label: 'Firma alebo web (nepovinné)' },
        interest: {
          label: 'S čím potrebujete pomôcť?',
          options: ['Marketing', 'Web', 'Sociálne siete', 'Ešte neviem'],
          errors: { required: 'Vyberte aspoň jednu možnosť.' },
        },
        budget: {
          label: 'Približný rozpočet (nepovinné)',
          placeholder: 'Vyberte rozpočet',
          options: ['do 1 000 €', '1 000 – 3 000 €', '3 000 – 8 000 €', 'viac ako 8 000 €', 'zatiaľ neviem'],
        },
        message: {
          label: 'Správa',
          placeholder: 'Napíšte pár viet o firme a o tom, čo chcete zmeniť.',
          errors: {
            required: 'Napíšte nám aspoň pár slov, aby sme sa vedeli pripraviť.',
            tooShort: 'Skúste to trochu rozviesť, stačia dve vety.',
            tooLong: 'Správa je príliš dlhá. Skráťte ju, prosím, na 2 000 znakov.',
          },
        },
        consent: {
          label: 'Súhlasím so spracovaním osobných údajov na účel odpovede na túto správu.',
          policyLink: 'Zásady ochrany osobných údajov',
          errors: { required: 'Bez súhlasu vám nemôžeme odpovedať.' },
        },
      },
      submit: 'Odoslať správu',
      sending: 'Odosielame…',
      errorSummary: 'Správu sa nepodarilo odoslať. Skontrolujte, prosím, označené polia.',
      offline: 'Vyzerá to, že ste bez pripojenia. Text vo formulári ostáva, odošlite ho, keď budete online.',
      success: {
        title: 'Správa je u nás.',
        text: 'Ďakujeme, {name}. Ozveme sa vám do 24 hodín v pracovné dni, zvyčajne skôr.',
        again: 'Poslať ďalšiu správu',
      },
      error: {
        title: 'Správu sa nepodarilo odoslať.',
        text: 'Chyba je na našej strane. Skúste to o chvíľu znova alebo nám napíšte priamo na {email}.',
        retry: 'Skúsiť znova',
      },
      demoNote: 'Demo režim: formulár nie je pripojený, správa sa nikam neodoslala.',
    },
  },

  footer: {
    line: 'Marketing, weby a sociálne siete z Liptova.',
    contactTitle: 'Kontakt',
    socialTitle: 'Sledujte nás',
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
    privacy: { label: 'Ochrana osobných údajov', href: '#' },
    noCookies: 'Tento web nepoužíva cookies ani sledovacie skripty.',
    copyright: '© 2026 Úboč s. r. o.',
  },
} as const;

export type Site = typeof site;
