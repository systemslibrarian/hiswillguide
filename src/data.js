export const DAILY_VERSE = {
  ref: 'Proverbs 3:5–6',
  text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways acknowledge him, and he will make your paths straight.',
};

export const GUIDE_PILLARS = [
  {
    icon: '\u2726',
    title: 'Scripture',
    description: 'God never leads contrary to His Word. Scripture is the clearest place to begin when seeking His will.',
  },
  {
    icon: '\u2637',
    title: 'Prayer',
    description: 'Guidance is relational. Bring your desires honestly before God and ask Him for wisdom with patient trust.',
  },
  {
    icon: '\u25CC',
    title: 'Wisdom',
    description: 'Mature counsel, sound judgment, and honest self-examination protect us from mistaking impulse for leading.',
  },
  {
    icon: '\u2192',
    title: 'Discernment',
    description: 'The goal is not endless analysis but faithful obedience to the next step God makes clear.',
  },
];

export const KEY_SCRIPTURES = [
  {
    ref: 'Romans 12:1\u20132',
    insight: 'Surrender and renewal lead to discernment.',
    text: 'I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.',
  },
  {
    ref: 'Proverbs 3:5\u20136',
    insight: 'Trust God instead of leaning on yourself.',
    text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
  },
  {
    ref: 'Ephesians 5:17',
    insight: 'Seek to understand what the will of the Lord is.',
    text: 'Therefore do not be foolish, but understand what the will of the Lord is.',
  },
  {
    ref: 'James 1:5',
    insight: 'Ask God for wisdom; He gives generously.',
    text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.',
  },
  {
    ref: 'Psalm 143:10',
    insight: 'A prayer to be taught and led by God.',
    text: 'Teach me to do your will, for you are my God! Let your good Spirit lead me on level ground!',
  },
  {
    ref: 'Micah 6:8',
    insight: "Much of God's will is already morally clear.",
    text: 'He has told you, O man, what is good; and what does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God?',
  },
];

export const PROMISES = [
  {
    title: 'God gives wisdom.',
    copy: 'He is not reluctant to guide those who ask sincerely and humbly.',
  },
  {
    title: 'God shapes desires.',
    copy: 'As you walk with Him, what you want becomes more aligned with what He loves.',
  },
  {
    title: 'God uses His people.',
    copy: 'He often confirms direction through wise counsel, community, and faithful correction.',
  },
  {
    title: 'God leads step by step.',
    copy: 'He may not show the whole path at once, but He is faithful to guide the next act of obedience.',
  },
];

export const SECTIONS = [
  {
    id: 'surrender',
    number: '01',
    title: 'Am I Willing to Surrender?',
    subtitle: 'The Starting Point',
    theme: 'Before seeking direction, seek the Director.',
    color: '#b8860b',
    description:
      "God's will begins not with a decision to make, but with a life yielded to Him. The first question is not \"What should I do?\" but \"Am I willing to do whatever God asks?\"",
    questions: [
      'Have I genuinely told God I will do whatever He asks, even if it costs me comfort?',
      "Am I seeking God's will to obey it, or just to validate a plan I already prefer?",
      'Is there any area of my life I am still withholding from God?',
    ],
    scriptures: [
      {
        ref: 'Romans 12:1\u20132',
        text: 'Present your bodies as a living sacrifice... be transformed by the renewal of your mind, that by testing you may discern what is the will of God.',
        insight: 'Surrender comes before discernment.',
      },
      {
        ref: 'John 7:17',
        text: "If anyone's will is to do God's will, he will know whether the teaching is from God.",
        insight: 'Willingness to obey often precedes clarity.',
      },
      {
        ref: 'Luke 22:42',
        text: 'Not my will, but yours, be done.',
        insight: 'Jesus models surrendered trust in the Father.',
      },
    ],
  },
  {
    id: 'heart',
    number: '02',
    title: 'Are My Motives Aligned With God?',
    subtitle: 'The Heart',
    theme: "Confusion about God's will often begins with unexamined desires.",
    color: '#3d4a6b',
    description:
      "Discernment requires honesty about the motives of the heart. Sometimes confusion about God\u2019s will is not caused by a lack of guidance, but by hidden desires shaping what we hope God will say.",
    questions: [
      "Am I pursuing God's glory, or my own comfort or reputation?",
      'Would I still follow this path if no one noticed or applauded it?',
      'Is fear, pride, or the need for control influencing my desire for this outcome?',
    ],
    scriptures: [
      {
        ref: 'Psalm 139:23\u201324',
        text: 'Search me, O God, and know my heart! Try me and know my thoughts! And see if there be any grievous way in me, and lead me in the way everlasting!',
        insight: 'Honest self-examination begins with inviting God to search us.',
      },
      {
        ref: 'James 4:3',
        text: 'You ask and do not receive, because you ask wrongly, to spend it on your passions.',
        insight: 'Wrong motives can block answered prayer.',
      },
      {
        ref: 'Matthew 6:33',
        text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.',
        insight: 'Kingdom-first priorities reorder everything else.',
      },
    ],
  },
  {
    id: 'scripture',
    number: '03',
    title: 'What Does Scripture Already Say?',
    subtitle: 'The Clear Word',
    theme: "God's written Word is the first lens for every decision.",
    color: '#7a5c2e',
    description:
      "Much of God's will is already clear in Scripture \u2014 holiness, gratitude, justice, love. Before seeking specific direction, consider whether you are walking in what He has plainly revealed.",
    questions: [
      'Am I already obeying the will God has clearly shown me?',
      'Does this decision align with what Scripture clearly commands or forbids?',
      'Am I overlooking a biblical principle because I want an easier answer?',
      'Would this choice help me love God and neighbor more faithfully?',
    ],
    scriptures: [
      {
        ref: '1 Thessalonians 4:3',
        text: 'For this is the will of God, your sanctification.',
        insight: "God's revealed will often begins with holiness in body and spirit.",
      },
      {
        ref: 'Psalm 119:105',
        text: 'Your word is a lamp to my feet and a light to my path.',
        insight: 'God guides through His Word.',
      },
      {
        ref: '2 Timothy 3:16\u201317',
        text: 'All Scripture is breathed out by God and profitable... that the man of God may be complete, equipped for every good work.',
        insight: 'Scripture equips for faithful living.',
      },
      {
        ref: 'Micah 6:8',
        text: 'What does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God.',
        insight: "Much of God's will is moral clarity, not mystery.",
      },
    ],
  },
  {
    id: 'prayer',
    number: '04',
    title: 'Am I Asking God in Prayer?',
    subtitle: 'The Conversation',
    theme: 'God gives wisdom generously to those who ask.',
    color: '#4a3728',
    description:
      'Prayer is not only speaking to God but lingering before Him. Bring the decision honestly, ask for wisdom, and pay attention to the peace or unrest that follows.',
    questions: [
      'Have I prayed about this persistently, not just briefly?',
      'Am I listening in prayer, or only listing my requests?',
      'Do I sense the peace of God, or am I trying to rush past inner unrest?',
    ],
    scriptures: [
      {
        ref: 'James 1:5',
        text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.',
        insight: 'God is generous with wisdom.',
      },
      {
        ref: 'Philippians 4:6\u20137',
        text: 'In everything by prayer and supplication with thanksgiving let your requests be made known to God... and the peace of God... will guard your hearts and your minds in Christ Jesus.',
        insight: 'Peace matters in biblical discernment.',
      },
      {
        ref: 'Colossians 1:9',
        text: 'We have not ceased to pray for you, asking that you may be filled with the knowledge of his will in all spiritual wisdom and understanding.',
        insight: "Paul models prayer for knowledge of God's will.",
      },
    ],
  },
  {
    id: 'spirit',
    number: '05',
    title: 'Am I Walking by the Spirit or by My Flesh?',
    subtitle: 'The Inner Guide',
    theme: 'Discernment is relational, not merely analytical.',
    color: '#5b3a6b',
    description:
      'The Christian life is meant to be lived in step with the Holy Spirit. The more you walk with Him, the more your desires, reactions, and priorities are reshaped. Yet even sincere hearts can deceive \u2014 test every inner sense carefully. The guidance of the Holy Spirit will never contradict Scripture and will produce the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control (Galatians 5:22\u201323).',
    questions: [
      'Am I cultivating sensitivity to the Holy Spirit through daily obedience?',
      'Where do I already see God at work around me?',
      "Are my desires moving toward God's heart or toward self-protection?",
      'Could this sense of peace be comfort, avoidance, or the path of least resistance?',
    ],
    scriptures: [
      {
        ref: 'Romans 8:14',
        text: 'For all who are led by the Spirit of God are sons of God.',
        insight: "God's children are not abandoned to self-direction.",
      },
      {
        ref: 'Galatians 5:25',
        text: 'If we live by the Spirit, let us also keep in step with the Spirit.',
        insight: 'Guidance is an ongoing walk, not a one-time event.',
      },
      {
        ref: 'Psalm 37:4',
        text: 'Delight yourself in the Lord, and he will give you the desires of your heart.',
        insight: 'As delight deepens, desires are reordered.',
      },
      {
        ref: 'Jeremiah 17:9',
        text: 'The heart is deceitful above all things, and desperately sick; who can understand it?',
        insight: 'Inner impressions must align with Scripture and counsel.',
      },
    ],
  },
  {
    id: 'counsel',
    number: '06',
    title: 'Have I Sought Godly Counsel?',
    subtitle: 'The Community',
    theme: 'Discernment in Scripture is rarely isolated.',
    color: '#1b4332',
    description:
      'Wise believers can help expose blind spots, confirm sound direction, and slow down impulsive decisions. Isolation is usually not a sign of maturity.',
    questions: [
      'Have I invited mature believers to speak honestly into this decision?',
      'Am I open to counsel that challenges what I want?',
      'Does my church community see wisdom and fruit in this direction?',
    ],
    scriptures: [
      {
        ref: 'Proverbs 11:14',
        text: 'Where there is no guidance, a people falls, but in an abundance of counselors there is safety.',
        insight: 'Safety often comes through godly counsel.',
      },
      {
        ref: 'Proverbs 15:22',
        text: 'Without counsel plans fail, but with many advisers they succeed.',
        insight: 'God often uses others to steady us.',
      },
    ],
  },
  {
    id: 'circumstances',
    number: '07',
    title: 'What Doors Is God Opening or Closing?',
    subtitle: 'The Open and Closed Doors',
    theme: 'God steers through both opportunity and restraint.',
    color: '#8b4513',
    description:
      "Circumstances matter, but they are not the only voice. An open door is not always God's invitation, and a closed door is not always failure. Paul was actively prevented by the Holy Spirit from entering Asia and Bithynia, and then redirected to Macedonia through a vision \u2014 demonstrating that God's \u201cno\u201d is often part of a larger \u201cyes.\u201d Watch providence with humility. Circumstances can provide helpful guidance, but they should never override Scripture, wisdom, or godly counsel. As Paul writes, \u201cTest everything; hold fast what is good\u201d (1 Thessalonians 5:21).",
    questions: [
      'Are doors opening or closing as I move in this direction?',
      'Am I mistaking convenience for confirmation?',
      "Could an obstacle be God's redirection rather than simple resistance?",
    ],
    scriptures: [
      {
        ref: 'Proverbs 16:9',
        text: 'The heart of man plans his way, but the Lord establishes his steps.',
        insight: 'We plan, but God governs.',
      },
      {
        ref: 'Proverbs 19:21',
        text: 'Many are the plans in the mind of a man, but it is the purpose of the Lord that will stand.',
        insight: "God's purpose is stronger than our preference.",
      },
      {
        ref: 'Acts 16:6\u201310',
        text: 'They went through the region of Phrygia and Galatia, having been forbidden by the Holy Spirit to speak the word in Asia... they attempted to go into Bithynia, but the Spirit of Jesus did not allow them... And a vision appeared to Paul in the night: a man of Macedonia was standing there, urging him, "Come over to Macedonia and help us."',
        insight: "Closed doors and divine redirection are part of God's active guidance.",
      },
    ],
  },
  {
    id: 'trust',
    number: '08',
    title: 'Am I Willing to Trust and Wait?',
    subtitle: 'The Crisis of Belief',
    theme: "God's timing is part of God's will.",
    color: '#1a1a2e',
    description:
      'Sometimes the will of God is not a green light but a season of waiting. Trusting Him means accepting that His wisdom is better than your desired timeline.',
    questions: [
      "Am I willing to wait for God's timing even when it feels slow?",
      'Is this decision asking for faith beyond my current comfort?',
      'Am I trying to force clarity instead of resting in God?',
    ],
    scriptures: [
      {
        ref: 'Proverbs 3:5\u20136',
        text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
        insight: 'Trust and direction belong together.',
      },
      {
        ref: 'Psalm 25:4\u20135',
        text: 'Make me to know your ways, O Lord; teach me your paths... for you I wait all the day long.',
        insight: 'Biblical guidance includes patient waiting.',
      },
      {
        ref: 'Isaiah 55:8\u20139',
        text: 'For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord.',
        insight: "God's wisdom exceeds your immediate logic.",
      },
    ],
  },
  {
    id: 'obedience',
    number: '09',
    title: 'Will I Obey What God Reveals?',
    subtitle: 'The Response',
    theme: 'Clarity is meant to lead to obedience.',
    color: '#6b2737',
    description:
      'The aim of discernment is not information but faithful response. Once God makes the next step clear, the question becomes whether you will actually walk in it.',
    questions: [
      'If God makes His will clear, am I ready to obey even at personal cost?',
      'Is there a step of obedience I already know but have delayed?',
      "Am I seeking God's glory or my own comfort?",
    ],
    scriptures: [
      {
        ref: 'John 14:21',
        text: 'Whoever has my commandments and keeps them, he it is who loves me.',
        insight: 'Obedience is a love response to Christ.',
      },
      {
        ref: 'James 1:22',
        text: 'But be doers of the word, and not hearers only, deceiving yourselves.',
        insight: 'Obedience is not optional for those who truly hear God.',
      },
      {
        ref: 'Hebrews 13:20\u201321',
        text: 'May the God of peace... equip you with everything good that you may do his will.',
        insight: 'God not only leads; He equips.',
      },
    ],
  },
  {
    id: 'glory',
    number: '10',
    title: 'Does This Ultimately Honor God?',
    subtitle: 'The Glory of God',
    theme: 'The ultimate aim of the Christian life is the glory of God.',
    color: '#9a7b4f',
    description:
      "The ultimate aim of the Christian life is the glory of God. Even after seeking Scripture, prayer, counsel, and wisdom, the final question remains: does this decision ultimately honor Christ and reflect His character? Discernment is not complete when we find what we want to do \u2014 it is complete when we confirm that what we plan to do is for Him.",
    questions: [
      "Am I genuinely motivated by God's glory here, or am I using spiritual language to justify what I already want?",
      'Would this decision honor Christ if others saw it?',
      'Does this choice point attention toward God or toward myself?',
      'Could I pursue this path in a way that clearly glorifies God?',
    ],
    scriptures: [
      {
        ref: '1 Corinthians 10:31',
        text: 'Whether you eat or drink, or whatever you do, do all to the glory of God.',
        insight: 'Every decision, small or large, is an opportunity for doxology.',
      },
      {
        ref: 'Colossians 3:17',
        text: 'Whatever you do, in word or deed, do everything in the name of the Lord Jesus, giving thanks to God the Father through him.',
        insight: 'Doing all in Christ\u2019s name means acting as His representative.',
      },
      {
        ref: 'Matthew 5:16',
        text: 'Let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.',
        insight: 'Faithful choices point others toward God, not toward ourselves.',
      },
    ],
  }
];
