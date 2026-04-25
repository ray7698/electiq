// Data exports
// ---- TIMELINE DATA ----
export let TIMELINE_DATA = {
  india: [
    {
      icon: '📝',
      name: 'Voter Registration',
      duration: 'Ongoing / before cutoff',
      description:
        'Citizens 18+ can register on the Electoral Roll via the Election Commission of India. Registration is free and mandatory to vote.',
      keyRules:
        'Must be 18+ on the qualifying date. Register at your local ERO or online at voters.eci.gov.in.',
      citizenDuty:
        "Check if you're registered. Update address if moved. Help family members register.",
      typicalTimeline: 'Rolls are updated quarterly. Final roll published 4 weeks before election.',
    },
    {
      icon: '📣',
      name: 'Election Announcement',
      duration: '45–90 days before voting',
      description:
        'The Election Commission announces the election schedule, triggering the Model Code of Conduct (MCC) immediately.',
      keyRules:
        'Once MCC kicks in, the ruling party cannot announce new schemes or use government resources for campaigning.',
      citizenDuty: 'Note important dates: nomination deadline, voting day, result day.',
      typicalTimeline: 'Schedule announced 4–6 weeks before first phase of voting.',
    },
    {
      icon: '🎫',
      name: 'Candidate Nomination',
      duration: '2 weeks',
      description:
        'Candidates file nomination papers with the Returning Officer. Papers are scrutinised and withdrawal deadline follows.',
      keyRules:
        'Must be an Indian citizen, 25+ for Lok Sabha. Pay a security deposit (₹25,000 for general, ₹12,500 for SC/ST).',
      citizenDuty:
        'Research candidates filing in your constituency. Check their affidavits on ECI website.',
      typicalTimeline:
        'Nominations open ~2 weeks after announcement. Withdrawal deadline 2 days after scrutiny.',
    },
    {
      icon: '📢',
      name: 'Campaign Period',
      duration: '2–4 weeks',
      description:
        'Candidates and parties campaign through rallies, advertisements, and door-to-door visits. Strictly governed by MCC.',
      keyRules:
        'Campaign ends 48 hours before polling (silence period). Cash distribution or bribing voters is illegal.',
      citizenDuty: 'Attend public meetings. Read manifestos. Verify claims using fact-checkers.',
      typicalTimeline: 'Active campaigning for 3–4 weeks. Silence period 48 hours before voting.',
    },
    {
      icon: '🗳',
      name: 'Voting Day',
      duration: '1 day (multiple phases)',
      description:
        'Eligible voters cast their ballot at their designated polling booth using Electronic Voting Machines (EVMs).',
      keyRules:
        'Carry valid photo ID (Voter ID, Aadhaar, Passport etc.). Voting is secret. You get an indelible ink mark.',
      citizenDuty:
        'Find your booth at voters.eci.gov.in. Carry your Voter ID. Vote early to avoid queues.',
      typicalTimeline:
        'Polls open 7am–6pm. Large states vote in multiple phases over several weeks.',
    },
    {
      icon: '🏆',
      name: 'Results & Declaration',
      duration: '1–2 days after last phase',
      description:
        'Votes counted at counting centres under strict security. Results declared constituency-by-constituency.',
      keyRules:
        'Winning candidate gets simple majority (FPTP). President invites largest party/coalition to form government.',
      citizenDuty:
        'Follow results on ECI website. Understand coalition-formation if no single majority.',
      typicalTimeline: 'Counting begins at 8am on result day. Full results usually by evening.',
    },
  ],
  us: [
    {
      icon: '📝',
      name: 'Voter Registration',
      duration: 'Varies by state',
      description:
        'US citizens register to vote at the state level. Deadlines vary — some states allow same-day registration.',
      keyRules:
        'Must be a US citizen, 18+ by Election Day. Felony convictions may restrict rights in some states.',
      citizenDuty:
        "Register at vote.gov. Check your state's deadline — typically 15–30 days before election.",
      typicalTimeline:
        'Register well in advance. Deadlines range from 30 days to Election Day depending on state.',
    },
    {
      icon: '🎪',
      name: 'Primaries & Caucuses',
      duration: 'Feb – June (election year)',
      description:
        'Voters choose party nominees through state-by-state primaries. Results determine delegates to the national convention.',
      keyRules:
        'Open vs closed primaries vary by state. Super Tuesday is the biggest single primary day.',
      citizenDuty: 'Participate in your party primary. Presidential candidates are chosen here.',
      typicalTimeline: 'Iowa caucuses traditionally first (Jan/Feb). Primaries run through June.',
    },
    {
      icon: '🏟',
      name: 'National Conventions',
      duration: 'July – August',
      description:
        'Each major party officially nominates its presidential and vice-presidential candidates at a national convention.',
      keyRules: 'Delegates cast votes to formally nominate. Party platform is adopted.',
      citizenDuty: "Watch conventions to understand each party's platform and priorities.",
      typicalTimeline: 'Republican and Democratic conventions held in summer of election year.',
    },
    {
      icon: '📢',
      name: 'General Campaign',
      duration: 'Sept – Nov',
      description:
        'Presidential and congressional candidates campaign nationally. Presidential debates are held in September/October.',
      keyRules:
        'Campaign finance limits apply. Foreign interference is illegal. FEC regulates spending.',
      citizenDuty:
        'Watch presidential debates. Research down-ballot candidates (Senate, House, local).',
      typicalTimeline: 'General campaign intensifies after Labor Day. Debates held in Sept/Oct.',
    },
    {
      icon: '🗳',
      name: 'Election Day',
      duration: 'First Tuesday after first Monday in November',
      description:
        'Citizens vote in-person or by mail/absentee ballot. Polls open and close at state-specific times.',
      keyRules:
        'Electoral College system — 270 electoral votes needed to win presidency. Popular vote decides each state.',
      citizenDuty:
        'Check polling place at usa.gov. Many states allow early voting and mail-in ballots.',
      typicalTimeline: 'Election Day is fixed. Early voting begins weeks earlier in most states.',
    },
    {
      icon: '🏛',
      name: 'Electoral College & Inauguration',
      duration: 'Dec – Jan',
      description:
        'Electors meet in December to cast official votes. Congress certifies in January. Inauguration on Jan 20.',
      keyRules:
        '270 electoral votes required. Most states are winner-take-all. Maine and Nebraska split proportionally.',
      citizenDuty:
        "Understand your state's electors. Inauguration marks the official transfer of power.",
      typicalTimeline: 'Electors vote in December. Congress certifies Jan 6. Inauguration Jan 20.',
    },
  ],
  uk: [
    {
      icon: '📝',
      name: 'Electoral Registration',
      duration: 'Ongoing',
      description:
        'UK citizens and qualifying residents register to vote individually online or by post through their local council.',
      keyRules:
        'Must be 18+ on polling day (16+ in Scotland/Wales for devolved elections). British, Irish, or qualifying Commonwealth citizen.',
      citizenDuty: 'Register at gov.uk/register-to-vote. Check registration before each election.',
      typicalTimeline: 'Registration deadline typically 12 working days before polling day.',
    },
    {
      icon: '📣',
      name: 'Dissolution & Announcement',
      duration: '25 working days before election',
      description:
        'Parliament is dissolved and an election is called. The formal election period begins with the issue of writs.',
      keyRules:
        'Fixed-term Parliament Act sets 5-year terms, but early elections can be called. Purdah restrictions apply to government.',
      citizenDuty:
        'Note the polling date. Request postal vote if needed — deadline is 11 working days before.',
      typicalTimeline: '25 working days between dissolution and polling day (minimum).',
    },
    {
      icon: '🎫',
      name: 'Candidate Nominations',
      duration: 'First week',
      description:
        'Candidates submit nomination papers signed by 10 registered electors plus a £500 deposit.',
      keyRules:
        'Must be a British citizen or qualifying Commonwealth/Irish citizen. Age 18+. Deposit returned if 5%+ votes received.',
      citizenDuty: 'Check who is standing in your constituency at electoralcommission.org.uk.',
      typicalTimeline: 'Nominations close approximately 19 working days before polling day.',
    },
    {
      icon: '📢',
      name: 'Short Campaign Period',
      duration: '~3 weeks',
      description:
        'Intense campaigning with spending limits strictly enforced. TV debates, leaflets, canvassing and digital advertising.',
      keyRules:
        'Campaign spending limits per constituency: ~£15,000 + per-elector amount. Imprint required on all campaign materials.',
      citizenDuty:
        'Read manifestos. Attend hustings. Use tactical voting tools if relevant to your constituency.',
      typicalTimeline:
        'Campaigning intensifies in the final 3 weeks. Media blackout on election day itself.',
    },
    {
      icon: '🗳',
      name: 'Polling Day',
      duration: 'One day: 7am – 10pm',
      description:
        'Voters attend their designated polling station and mark their ballot paper with an X for one candidate.',
      keyRules:
        'Photo ID required since 2023. First-Past-The-Post system: highest vote-getter wins each constituency.',
      citizenDuty:
        'Bring accepted photo ID (driving licence, passport, voter ID card). Find your polling station on your poll card.',
      typicalTimeline:
        'Polls open 7am to 10pm. Exit poll published at 10pm. Results through the night.',
    },
    {
      icon: '🏆',
      name: 'Results & New Government',
      duration: 'Overnight into next day',
      description:
        'Local counts declare constituency results through the night. Party with most seats forms the government.',
      keyRules:
        '326+ seats needed for a majority. If hung parliament, coalition or confidence-and-supply agreements are negotiated.',
      citizenDuty:
        'Follow results live. New PM appointed by the King typically the day after polling day.',
      typicalTimeline:
        'Most seats declared overnight. Final seat often by mid-morning. PM appointed next day.',
    },
  ],
};

// Original English data to fall back on for translation
export const DEFAULT_TIMELINE_DATA = JSON.parse(JSON.stringify(TIMELINE_DATA));

// Static strings for UI translation
export const STATIC_UI_BASE = {
  'hero-eyebrow': 'Your civic guide',
  'hero-title': 'Understand your vote.\nShape your future.',
  'hero-subtitle':
    'ElectIQ makes democracy simple — learn the election process, ask AI anything, and become a confident citizen.',
  'btn-start': 'Start Learning',
  'btn-ask': 'Ask AI Assistant',
};

export function setTimelineData(data) {
  Object.assign(TIMELINE_DATA, data);
}
