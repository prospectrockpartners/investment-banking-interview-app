import React, { useState, useEffect, useRef } from 'react';
import { Play, Camera, BarChart3, Award, Clock, SkipForward, CheckCircle, TrendingUp, Target } from 'lucide-react';

const InvestmentBankingInterviewApp = () => {
  // Main app state
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    contentMastery: 0,
    hasCompletedWritten: false,
    hasCompletedVideo: false,
    totalSessions: 0
  });

  // Assessment state
  const [assessmentData, setAssessmentData] = useState({
    questions: [],
    currentIndex: 0,
    answers: [],
    isActive: false,
    isComplete: false,
    results: []
  });

  // Video assessment state
  const [videoAssessmentData, setVideoAssessmentData] = useState({
    questions: [],
    currentIndex: 0,
    recordings: [],
    isActive: false,
    isComplete: false,
    isRecording: false,
    recordingStartTime: null,
    preparationTime: 30,
    responseTime: 120,
    currentPhase: 'setup', // 'preparation', 'recording', 'review'
    results: []
  });

  // Investment Banking Questions Database - 32 comprehensive questions (8 per category)
  const QUESTION_BANKS = {
    behavioral: [
      "Tell me about a time when you had to lead a team through a challenging project with a tight deadline.",
      "Describe a situation where you had to analyze complex data to make a recommendation.",
      "Give me an example of when you had to work with someone who had a different working style than you.",
      "Tell me about a time when you failed at something important. What did you learn?",
      "Walk me through a time when you had to manage multiple competing priorities under pressure.",
      "Tell me about a time when you had to persuade someone to see your point of view.",
      "Describe a situation where you identified an error that others missed.",
      "Tell me about a time when you went above and beyond what was expected."
    ],
    whyIB: [
      "Why are you interested in investment banking specifically?",
      "What attracts you to our firm over our competitors?",
      "How do you see yourself contributing to our investment banking team?",
      "Where do you see yourself in 5 years within investment banking?",
      "What specific group within investment banking interests you most and why?",
      "How have you prepared yourself for a career in investment banking?",
      "What do you think will be the biggest challenge in investment banking for you?",
      "Why investment banking instead of consulting or other finance roles?"
    ],
    markets: [
      "What recent market development do you think will most impact M&A activity this year?",
      "How do you think rising interest rates are affecting corporate financing decisions?",
      "What sector do you think will see the most consolidation activity?",
      "Walk me through a recent IPO that caught your attention and why.",
      "How are current geopolitical tensions affecting capital markets?",
      "How do ESG considerations impact investment decisions today?",
      "What recent earnings report or company announcement caught your attention?",
      "How do you stay current with financial markets and economic trends?"
    ],
    technical: [
      "Walk me through how you would value a company for acquisition.",
      "What are the three main valuation methodologies and when would you use each?",
      "Explain how you would build a DCF model for a cyclical business.",
      "How would you compare two companies in the same industry for investment purposes?",
      "Explain the difference between enterprise value and equity value.",
      "Walk me through an LBO model.",
      "How would you determine if a company is undervalued or overvalued?",
      "Explain how you would approach acquisition financing for a $2B deal."
    ]
  };

  // Student-focused model answers for summer internship recruiting
  const MODEL_ANSWERS = {
    "Tell me about a time when you had to lead a team through a challenging project with a tight deadline.": {
      answer: "During my Finance Society's stock pitch competition, I led a 5-person team analyzing Tesla for our portfolio with only 10 days to prepare. The challenge was that three members had never built a financial model before, and we were competing against 12 other teams for a $2,000 prize. I took initiative by organizing daily 2-hour work sessions and created a project timeline with clear deliverables. I assigned experienced members to build the DCF while I taught newer members comparable analysis using automotive industry peers. When our initial revenue assumptions were challenged by our advisor 3 days before the deadline, I coordinated an emergency meeting, researched EV market growth projections, and rebuilt our model assumptions overnight. We finished with a comprehensive 25-slide deck, presented confidently to industry professionals, and placed 2nd overall, earning recognition from Goldman Sachs recruiters in attendance.",
      score: 94,
      breakdown: {
        situation: "Clear student context with specific details (5-person team, 10 days, Finance Society)",
        task: "Defined leadership challenge with mixed skill levels typical for students",
        action: "Specific leadership actions: organization, teaching, crisis management, research",
        result: "Quantified outcome relevant to recruiting (2nd place, recruiter recognition)",
        leadership: "Teaching weaker members, crisis adaptation, taking personal responsibility"
      }
    },
    "Why are you interested in investment banking specifically?": {
      answer: "My interest in investment banking began during my Corporate Finance course when we analyzed Disney's acquisition of 21st Century Fox. I was fascinated by how investment bankers valued the $71B transaction and structured the deal to address regulatory concerns. This led me to pursue a summer research role with my finance professor, where I analyzed three potential M&A targets for a local private equity firm, building DCF models and comparable company analyses. The combination of rigorous financial modeling, strategic thinking, and high-stakes decision-making appeals to me. Through my Finance Club leadership and networking events, I've learned that IB offers unparalleled training in financial analysis and client interaction. I'm particularly drawn to the diversity of industries and deal types—from helping companies go public to advising on complex mergers. The skills I'd develop in financial modeling, pitch creation, and strategic advisory work align perfectly with my long-term goal of working in private equity.",
      score: 91,
      breakdown: {
        personalMotivation: "Specific class experience that sparked interest (Disney/Fox deal)",
        relevantExperience: "Student research role with concrete modeling work",
        industryKnowledge: "Understanding of IB work: M&A, IPOs, strategic advisory",
        careerConnection: "Links to long-term PE goals showing career planning",
        studentActivities: "Finance Club involvement and networking efforts"
      }
    },
    "What recent market development do you think will most impact M&A activity this year?": {
      answer: "I believe rising interest rates will be the most significant factor affecting M&A activity in 2024. In my Financial Markets course, we studied how rate changes impact deal economics, and I've been tracking this in practice. With the Fed raising rates from near 0% to over 5%, leveraged buyout financing costs have increased dramatically—leveraged loan spreads are now 400-500 bps vs. 200-300 bps in 2021. This particularly affects private equity deals, as we saw with KKR's reduced bid activity last quarter. However, this creates opportunities for strategic acquirers with strong balance sheets. Microsoft's cash-financed Activision deal exemplifies this trend—they avoided financing risk that leveraged buyers couldn't match. I expect to see more strategic buyers gaining advantages in auctions, while PE firms focus on operational improvements rather than leverage-driven returns. Companies will also accelerate refinancing activities to lock in rates before further increases, which should drive increased debt capital markets activity.",
      score: 89,
      breakdown: {
        academicConnection: "Links to coursework (Financial Markets class)",
        currentAnalysis: "Specific data on rate changes and market impact",
        realExamples: "Microsoft/Activision and KKR examples with context",
        mechanismUnderstanding: "Clear cause-and-effect from rates to deal activity",
        forwardThinking: "Predictions about PE behavior and debt markets"
      }
    },
    "Walk me through how you would value a company for acquisition.": {
      answer: "I would use three methodologies that I've learned in my Valuation course and applied in case competitions. First, DCF analysis: I'd build a 5-year model starting with revenue drivers based on historical growth and industry trends. I'd project key expense items as percentages of revenue, calculate unlevered free cash flow, and discount using WACC. For terminal value, I'd use both perpetuity growth and exit multiple methods. Second, comparable company analysis: I'd identify 6-8 public companies with similar business models and calculate trading multiples like EV/Revenue and EV/EBITDA, adjusting for differences in growth and profitability. Third, precedent transaction analysis: I'd research recent M&A deals in the industry, analyzing transaction multiples and control premiums. In my recent case study on Salesforce, I triangulated these methods and weighted them based on market conditions—giving more weight to comps in stable markets. For acquisition purposes, I'd also consider synergy values and control premiums, typically 20-30% for strategic buyers.",
      score: 88,
      breakdown: {
        academicFoundation: "References Valuation course and case competition experience",
        methodology: "All three standard approaches with proper sequencing",
        technicalDetail: "Specific components like WACC, terminal value methods",
        practicalApplication: "Real case study example (Salesforce)",
        acquisitionContext: "Control premiums and synergy considerations"
      }
    },
    "Describe a situation where you had to analyze complex data to make a recommendation.": {
      answer: "For my Economics senior thesis, I analyzed student loan debt patterns across 200+ universities to recommend policy changes. I collected data from Department of Education databases, university financial aid offices, and employment surveys, totaling over 50,000 data points. The complexity came from inconsistent reporting formats and multiple variables affecting outcomes. Using Excel and R programming I learned in my Statistics course, I identified that students at schools with higher sticker prices but generous aid actually graduated with 15% less debt than peers at 'affordable' public schools. I discovered the key factor was aid transparency—schools that clearly communicated total costs and aid packages had students making better borrowing decisions. My recommendation was to standardize financial aid reporting, which I presented to our university's Board of Trustees. They implemented a simplified aid calculator on the admissions website, and prospective student surveys showed 40% better understanding of true costs.",
      score: 87,
      breakdown: {
        academicProject: "Senior thesis with substantial scope (200+ universities)",
        dataComplexity: "Multiple sources and large dataset (50,000+ points)",
        analyticalSkills: "Technical tools (Excel, R) and statistical analysis",
        keyInsight: "Counterintuitive finding with quantified impact (15% less debt)",
        businessImpact: "Real implementation and measured outcome (40% improvement)"
      }
    },
    "Give me an example of when you had to work with someone who had a different working style than you.": {
      answer: "During my summer internship at a local wealth management firm, I was paired with another intern who had a completely different approach to client research. I prefer detailed, systematic analysis using spreadsheets and frameworks, while she was more intuitive and relationship-focused. Initially, this created tension when preparing investment recommendations for high-net-worth clients. I wanted to build comprehensive financial models while she focused on understanding client personalities and risk tolerance through conversations. After a week of conflicting approaches, I suggested we combine our strengths. I handled the quantitative analysis—building portfolio optimization models and risk assessments—while she conducted client interviews and relationship mapping. We created a two-part presentation: my detailed financial analysis supported by her insights on client motivations and concerns. Our supervisor praised this approach, and we were assigned to work on the firm's largest client, ultimately helping them restructure a $2M portfolio. This taught me that different working styles can be complementary rather than conflicting.",
      score: 85,
      breakdown: {
        professionalContext: "Internship setting relevant to finance recruiting",
        specificDifference: "Clear contrast between analytical vs. relationship approaches",
        conflictResolution: "Proactive solution combining both strengths",
        businessOutcome: "Successful client work with quantified impact ($2M portfolio)",
        personalGrowth: "Learning about complementary working styles"
      }
    },
    "Tell me about a time when you failed at something important. What did you learn?": {
      answer: "During my junior year, I was treasurer of our Finance Society and responsible for securing sponsorship for our annual conference. I initially focused only on large banks, assuming they'd provide the biggest funding. After two months, I had zero commitments and our event was at risk. I realized my approach was too narrow and I wasn't building relationships—just sending cold emails. I pivoted by researching smaller boutique firms and regional banks, then reached out through LinkedIn to alumni working there. I also created a detailed sponsorship packet showing our member demographics and past event success metrics. Within three weeks, I secured $8,000 from five different firms, enough to fund our conference for 200 students. I learned that persistence without strategy isn't effective—I needed to diversify my approach and focus on relationship-building rather than just chasing the biggest names. This experience taught me to be more adaptive and research-driven in my approach to challenges.",
      score: 89,
      breakdown: {
        situation: "Clear academic context with specific role and stakes (Finance Society treasurer, annual conference)",
        task: "Well-defined responsibility with clear importance (securing sponsorship for major event)",
        failure: "Honest admission of ineffective strategy and zero results after significant time investment",
        action: "Specific corrective measures: strategy pivot, research, relationship building, creating materials",
        result: "Quantified positive outcome with broader impact ($8,000 raised, 200 student event)",
        learning: "Thoughtful reflection on strategic thinking and relationship importance for future success"
      }
    },
    "What attracts you to our firm over our competitors?": {
      answer: "Three specific factors draw me to Goldman Sachs over other bulge bracket firms. First, your commitment to developing junior talent through structured programs like the Analyst Development Program. When I spoke with Sarah Chen, a second-year analyst in your Technology group, she emphasized how partners actively mentor analysts and include them in client meetings from day one. Second, I'm particularly interested in your leading M&A franchise in the technology sector. Your recent advisory role on Microsoft's Activision acquisition and Meta's deals demonstrates the complex, high-stakes transactions I want to learn from. Finally, your emphasis on innovation, like Marcus and your alternative investments platform, shows forward-thinking that extends beyond traditional banking. During my informational interview with an associate in your TMT group, I learned about your deal diversity—from growth equity transactions to large cap M&A—which offers broader learning opportunities than more specialized firms. The combination of strong training, market-leading deals, and innovative culture aligns perfectly with my goal of developing comprehensive investment banking skills.",
      score: 93,
      breakdown: {
        specificResearch: "Names specific Goldman programs (Analyst Development Program) and shows real networking",
        differentiation: "Clear comparison points vs competitors with concrete examples",
        dealKnowledge: "References recent major transactions (Microsoft/Activision) showing market awareness",
        networkingEvidence: "Mentions specific conversations with current employees by name and group",
        careerAlignment: "Connects firm strengths to personal development goals and learning objectives",
        firmCulture: "Demonstrates understanding of firm's broader strategy beyond traditional banking"
      }
    },
    "Walk me through a recent IPO that caught your attention and why.": {
      answer: "ARM Holdings' September 2023 IPO caught my attention because it was the largest tech IPO in nearly two years, raising $4.87 billion. In my Financial Markets course, we studied how IPO timing reflects market conditions, and ARM's pricing at $51 per share—the top of their range—showed strong investor appetite despite a challenging IPO market. What fascinated me was the strategic timing: SoftBank took ARM private in 2016 for $32 billion, then spun it out at a $54.5 billion valuation, demonstrating how private equity can create value through operational improvements and market timing. The company's chip architecture powers 95% of smartphones, giving them exposure to AI and mobile computing trends that investors wanted. From a valuation perspective, ARM traded at 104x trailing earnings but only 17x projected 2024 revenue, showing how growth companies are valued on forward metrics. The deal also highlighted geopolitical considerations—ARM chose New York over London for the listing, reflecting the deeper US capital markets. This IPO taught me how successful public offerings require the right combination of company fundamentals, market timing, and compelling growth narrative.",
      score: 92,
      breakdown: {
        recentAwareness: "Specific recent IPO (ARM Holdings, September 2023) with accurate details",
        financialMetrics: "Precise data: $4.87B raised, $51 share price, valuation multiples",
        academicConnection: "Links to Financial Markets coursework and IPO timing concepts",
        strategicAnalysis: "SoftBank's value creation strategy and market positioning insights",
        marketContext: "Understanding of challenging IPO environment and investor sentiment",
        valuationInsight: "Sophisticated analysis of growth company valuation (104x earnings vs 17x revenue)"
      }
    },
    "What are the three main valuation methodologies and when would you use each?": {
      answer: "The three core valuation methodologies I learned in my Corporate Finance course are DCF analysis, comparable company analysis, and precedent transaction analysis. DCF is best for companies with predictable cash flows—I'd use it for mature businesses like utilities or consumer staples where I can reliably forecast 5-year financials. The method involves projecting free cash flows, calculating WACC using CAPM for cost of equity, and determining terminal value through perpetuity growth or exit multiples. Comparable company analysis works well for companies in established industries with good public comparables. I'd identify 6-8 similar firms and calculate trading multiples like EV/EBITDA and P/E ratios, adjusting for differences in growth, margins, and risk. This method reflects current market sentiment but can be distorted by overall market conditions. Precedent transaction analysis is ideal when valuing for M&A purposes, as it incorporates control premiums that strategic buyers typically pay. I'd research recent deals in the same industry and analyze transaction multiples, considering deal timing and strategic rationale. In practice, I'd triangulate all three methods, weighting them based on data quality and market conditions. For a stable company, I might weight DCF at 50%, comps at 30%, and precedents at 20%, adjusting based on the valuation purpose.",
      score: 94,
      breakdown: {
        comprehensiveMethodology: "Covers all three standard valuation approaches with clear definitions",
        academicFoundation: "References Corporate Finance coursework and technical concepts (WACC, CAPM)",
        practicalApplication: "Specific guidance on when to use each method with industry examples",
        technicalDepth: "Detailed process steps including DCF components and comparable selection",
        realWorldInsight: "Understanding of triangulation approach and weighting based on circumstances",
        professionalContext: "Distinguishes between trading values and M&A applications with control premiums"
      }
    },
    "Walk me through a time when you had to manage multiple competing priorities under pressure.": {
      answer: "During my junior year spring semester, I was juggling three major deadlines within one week: my Corporate Finance final project, Finance Club's annual conference planning as VP of Events, and training new team members at my part-time accounting internship. The finance final required building a comprehensive LBO model for a $500M acquisition, worth 40% of our grade. Simultaneously, I was coordinating venue, speakers, and 150+ RSVPs for our March conference, with vendor contracts due the same week. At my internship, my supervisor asked me to train two new hires on our month-end closing procedures during our busiest period. I created a priority matrix ranking tasks by deadline and impact. I dedicated early mornings (6-8 AM) to the LBO model when my focus was sharpest, scheduled conference vendor calls during lunch breaks, and streamlined internship training by creating step-by-step Excel templates the new hires could follow independently. I also delegated conference registration management to other club officers. The result: I earned an A- on the finance project, our conference had 89% attendance with positive feedback, and both new interns successfully completed their first month-end close. This experience taught me that effective prioritization and delegation are crucial for managing multiple high-stakes commitments.",
      score: 91,
      breakdown: {
        specificContext: "Clear academic and professional setting with three distinct pressures",
        quantifiedDetails: "Specific numbers: $500M LBO, 40% grade weight, 150+ RSVPs, 89% attendance",
        strategicApproach: "Priority matrix framework and time management strategy (early mornings, lunch breaks)",
        actionSteps: "Concrete actions: Excel templates, delegation, scheduling optimization",
        positiveOutcomes: "Quantified results across all three priorities with specific grades and metrics",
        professionalLearning: "Clear insight about prioritization and delegation for future situations"
      }
    },
    "How do you see yourself contributing to our investment banking team?": {
      answer: "I would contribute through three key areas that align with what I've learned about analyst responsibilities. First, technical excellence: My Corporate Finance and Valuation coursework, plus Excel modeling experience from case competitions, prepared me to build accurate financial models and conduct thorough company research. I'm detail-oriented and understand that in IB, precision in pitch books and client materials is critical. Second, work ethic and reliability: Through my Finance Club leadership and internship experience managing multiple deadlines, I've proven I can deliver high-quality work under tight timelines. I thrive in fast-paced environments and take ownership of my responsibilities. Third, continuous learning and adaptation: I'm genuinely curious about different industries and business models. During my summer research role, I quickly learned new sectors from healthcare to technology, which would help me support senior bankers across various client engagements. Additionally, my communication skills from presenting to 200+ students at finance conferences would help in client meetings and internal team collaboration. I'm eager to absorb knowledge from experienced team members while contributing my quantitative skills, strong work ethic, and fresh perspective to help deliver exceptional client service.",
      score: 88,
      breakdown: {
        technicalSkills: "Specific coursework and modeling experience relevant to analyst role",
        workEthic: "Evidence from leadership and internship experiences with deadline management",
        learningAgility: "Demonstrates adaptability and curiosity across industries",
        communicationSkills: "Public speaking experience relevant to client interaction",
        teamOrientation: "Shows understanding of learning from seniors while contributing value",
        clientFocus: "Understands the ultimate goal of exceptional client service"
      }
    },
    "Where do you see yourself in 5 years within investment banking?": {
      answer: "In five years, I see myself as a Vice President in investment banking, having progressed through the analyst and associate levels while developing deep industry expertise. My immediate goal is to excel as an analyst for 2-3 years, mastering financial modeling, valuation techniques, and client interaction skills. I'd want to work across different industry groups initially—perhaps starting in TMT or Healthcare—to understand various business models and market dynamics. After business school, I'd return as an associate to develop my client management and deal execution capabilities. By year 5 as a VP, I envision leading deal teams, managing client relationships, and mentoring junior staff. I'm particularly interested in developing expertise in M&A advisory for mid-market companies, where I could have significant client impact and transaction responsibility. Ideally, I'd specialize in a sector that combines my analytical interests with growing market opportunities—perhaps fintech or healthcare technology. Throughout this progression, I'd want to build strong internal relationships and maintain the technical excellence that's crucial for advancement. Long-term, this foundation would prepare me for either continued advancement to Managing Director or transitioning to private equity, where my IB experience would be invaluable for sourcing and executing investments.",
      score: 90,
      breakdown: {
        realisticProgression: "Understands typical IB career path: Analyst → Associate → VP progression",
        timeframeAwareness: "Appropriate 2-3 year analyst timeline and business school consideration",
        skillDevelopment: "Shows understanding of skills needed at each level (modeling → client management → team leadership)",
        industrySpecialization: "Thoughtful approach to developing sector expertise (TMT, Healthcare, fintech)",
        clientOrientation: "Focus on mid-market M&A and client impact demonstrates business understanding",
        longTermVision: "Considers both IB advancement and PE transition showing career planning"
      }
    },
    "What specific group within investment banking interests you most and why?": {
      answer: "I'm most interested in the M&A group, specifically focused on middle-market transactions in the technology sector. Three factors drive this interest: First, deal complexity and learning opportunity. M&A involves sophisticated financial modeling, from DCF and LBO analyses to accretion/dilution models, which builds on my Corporate Finance coursework. I'm fascinated by how strategic buyers and financial sponsors evaluate synergies differently, and how investment bankers structure deals to address regulatory, financing, and stakeholder concerns. Second, the strategic nature of the work appeals to me. In my Finance Club's case competitions, I enjoyed analyzing how acquisitions could transform companies' competitive positions. M&A allows me to work on transactions that reshape entire industries. Third, the middle-market focus offers more client interaction and deal responsibility than mega-cap transactions where analysts have narrower roles. I want to work closely with CEOs and CFOs of growing companies where my analysis directly impacts deal outcomes. The technology sector specifically interests me because of rapid innovation cycles, diverse business models from SaaS to hardware, and the prevalence of strategic consolidation. Recent deals like Microsoft's Activision acquisition demonstrate how tech M&A requires understanding both financial metrics and strategic positioning in evolving markets.",
      score: 93,
      breakdown: {
        specificGroup: "Clear focus on M&A with thoughtful reasoning and sector specialization",
        technicalUnderstanding: "Demonstrates knowledge of M&A modeling and different buyer perspectives",
        academicConnection: "Links to Corporate Finance coursework and case competition experience",
        strategicInsight: "Shows understanding of how M&A reshapes competitive landscapes",
        careerReasoning: "Smart rationale for middle-market focus (more responsibility and client interaction)",
        marketAwareness: "References recent major deals (Microsoft/Activision) showing current knowledge"
      }
    },
    "How do you think rising interest rates are affecting corporate financing decisions?": {
      answer: "Rising rates are fundamentally reshaping corporate financing decisions across multiple dimensions. In my Financial Markets course, we studied how the Fed's aggressive tightening from 0.25% to 5.25% has increased borrowing costs dramatically. First, debt financing has become significantly more expensive. Investment-grade corporate bond yields have risen from ~2% to over 5%, while leveraged loan spreads have widened to 400-500 basis points. This is pushing companies to accelerate refinancing of near-term maturities before rates climb further, creating a wave of debt capital markets activity. Second, capital allocation priorities are shifting. With higher discount rates, companies are applying stricter hurdle rates to capital expenditures and M&A. We're seeing more focus on organic growth and operational efficiency rather than acquisitive strategies. Private equity firms are particularly affected since their leveraged buyout models rely heavily on cheap debt financing. Third, equity markets are being repriced as the risk-free rate rises, making equity financing more attractive relative to debt for highly leveraged companies. Finally, cash-rich companies like Apple and Microsoft are gaining competitive advantages in M&A auctions since they can avoid financing risk that leveraged buyers face. This creates a two-tiered M&A market favoring strategic acquirers over financial sponsors.",
      score: 92,
      breakdown: {
        academicFoundation: "References Financial Markets coursework and specific Fed policy data",
        specificMetrics: "Concrete data: 0.25% to 5.25% Fed rates, IG bonds ~2% to 5%, loan spreads 400-500 bps",
        comprehensiveAnalysis: "Covers debt costs, capital allocation, equity pricing, and M&A implications",
        marketMechanisms: "Explains cause-and-effect relationships between rates and corporate behavior",
        strategicInsight: "Identifies competitive dynamics between strategic vs financial buyers",
        currentRelevance: "Addresses ongoing market conditions with forward-looking perspective"
      }
    },
    "What sector do you think will see the most consolidation activity?": {
      answer: "I believe healthcare technology will see the most consolidation activity over the next 2-3 years. Several converging factors support this thesis: First, market fragmentation creates consolidation opportunities. The health tech space has hundreds of point solutions—from telehealth platforms to AI diagnostics to electronic health records—but healthcare systems want integrated solutions. We're already seeing this with Teladoc's acquisitions of specialty platforms and Oracle's $28B purchase of Cerner. Second, regulatory tailwinds are accelerating adoption. CMS reimbursement expansions for digital health services, plus the FDA's streamlined approval processes for software medical devices, are validating business models and attracting strategic acquirers. Third, cash-rich buyers are seeking growth. Traditional healthcare companies like UnitedHealth, CVS, and pharmaceutical giants have significant M&A capacity and need digital capabilities to compete. Technology companies like Microsoft (Healthcare Bot) and Google (Cloud Healthcare API) are also acquiring to build healthcare platforms. Fourth, venture-backed companies face exit pressure. With IPO markets challenging, many well-funded health tech startups with proven products but subscale revenues will seek strategic exits. Finally, demographic trends create urgency—aging populations and provider shortages make digital health solutions essential infrastructure rather than nice-to-have technologies. This creates compelling strategic rationale for consolidation.",
      score: 89,
      breakdown: {
        sectorSpecificity: "Clear thesis on healthcare technology with detailed reasoning",
        marketDynamics: "Understands fragmentation-to-consolidation trend and buyer motivations",
        regulatoryAwareness: "Knowledge of CMS reimbursement and FDA approval processes",
        dealExamples: "References real transactions (Oracle/Cerner $28B, Teladoc acquisitions)",
        buyerAnalysis: "Identifies multiple buyer categories (healthcare cos, tech giants, PE) with rationale",
        macroTrends: "Connects demographic trends and market forces to M&A activity"
      }
    },
    "How are current geopolitical tensions affecting capital markets?": {
      answer: "Current geopolitical tensions are creating significant volatility and structural shifts in capital markets. The Russia-Ukraine conflict has disrupted global supply chains and energy markets, leading to elevated inflation that's forced central banks to raise rates aggressively. This has dampened both equity and debt markets—the VIX volatility index has averaged 25-30 versus historical norms of 15-20. China-Taiwan tensions and US-China trade restrictions are fragmenting global capital flows. We're seeing 'friend-shoring' where companies restructure supply chains based on geopolitical alignment rather than pure economic efficiency. This is driving M&A activity as companies acquire suppliers in allied countries. In my International Economics course, we studied how sanctions create market segmentation. Russian companies are effectively shut out of Western capital markets, while Chinese firms face increased scrutiny for US listings. The CHIPS Act and Inflation Reduction Act are creating domestic investment incentives, boosting US infrastructure and clean energy IPOs. Currency markets are also affected—the dollar's strength as a safe haven is hurting emerging market debt and making dollar-denominated financing more expensive globally. For investment banking, this means more complex cross-border due diligence, regulatory approval processes, and currency hedging strategies. Deal timelines are extending as buyers conduct enhanced national security reviews.",
      score: 87,
      breakdown: {
        currentEvents: "References specific conflicts (Russia-Ukraine, China-Taiwan) and policy responses",
        marketMetrics: "Quantified impact data (VIX 25-30 vs 15-20 historical, currency effects)",
        academicConnection: "Links to International Economics coursework on sanctions and market segmentation",
        structuralChanges: "Understands 'friend-shoring' trend and supply chain restructuring",
        policyImpact: "Knowledge of CHIPS Act, IRA, and their market effects",
        ibImplications: "Connects geopolitical trends to specific IB work (due diligence, regulatory approvals)"
      }
    },
    "Explain how you would build a DCF model for a cyclical business.": {
      answer: "Building a DCF for a cyclical business requires modifications to standard modeling approaches to account for earnings volatility and economic sensitivity. First, I'd use normalized financials rather than just historical data. For a company like Caterpillar, I'd analyze 10+ years to identify full economic cycles and calculate average margins through peaks and troughs. Instead of linear growth assumptions, I'd model different economic scenarios—recession, recovery, and expansion phases—with corresponding revenue and margin profiles. Second, working capital becomes crucial since cyclical companies typically build inventory in anticipation of demand and face collection issues during downturns. I'd model working capital as a percentage of sales but adjust these percentages based on cycle timing. Third, capital expenditure patterns need careful consideration. Cyclical companies often delay capex during downturns and accelerate it during expansions. I'd model maintenance vs growth capex separately and tie growth capex to cycle positioning. Fourth, terminal value requires special attention. I'd use through-cycle average margins and growth rates rather than exit year figures, since the final year might be at a cycle peak or trough. Finally, I'd apply scenario analysis with different probabilities for economic outcomes and potentially use a higher discount rate to reflect business volatility. The key is creating a model that reflects underlying business fundamentals rather than just extrapolating current cycle positioning.",
      score: 93,
      breakdown: {
        cyclicalUnderstanding: "Recognizes key challenges of earnings volatility and economic sensitivity",
        normalizationApproach: "Uses through-cycle analysis and multiple scenarios vs linear projections",
        workingCapitalInsight: "Understands cyclical working capital dynamics and collection challenges",
        capexModeling: "Distinguishes maintenance vs growth capex and cycle timing considerations",
        terminalValue: "Sophisticated approach using through-cycle averages vs exit year metrics",
        riskAdjustment: "Considers scenario analysis and appropriate discount rate adjustments"
      }
    },
    "How would you compare two companies in the same industry for investment purposes?": {
      answer: "I'd conduct a comprehensive comparative analysis using both quantitative and qualitative frameworks. First, financial metrics comparison: I'd calculate key ratios including profitability (ROE, ROIC, EBITDA margins), efficiency (asset turnover, working capital cycles), and leverage (debt/equity, interest coverage). For growth analysis, I'd examine 3-5 year revenue and earnings CAGR, plus forward guidance. Using my Valuation course methodology, I'd compare trading multiples like P/E, EV/EBITDA, and EV/Sales, adjusting for differences in growth rates and margins. Second, competitive positioning assessment: I'd analyze market share trends, pricing power, and competitive moats. Porter's Five Forces framework helps evaluate industry dynamics and each company's defensive position. Third, management quality evaluation through capital allocation decisions, strategic execution, and communication with investors. I'd review management presentations and earnings call transcripts for strategic clarity. Fourth, ESG and regulatory considerations, especially important for institutional investors. Finally, I'd build sensitivity analyses showing how key value drivers (growth rates, margins, multiples) affect relative valuations. For example, comparing Microsoft vs Oracle, I'd focus on cloud transition progress, recurring revenue percentages, and competitive positioning in enterprise software. The goal is identifying which company offers better risk-adjusted returns based on current valuation, growth prospects, and execution capability.",
      score: 91,
      breakdown: {
        systematicFramework: "Structured approach combining quantitative metrics and qualitative analysis",
        financialRigor: "Comprehensive ratio analysis covering profitability, efficiency, and leverage",
        valuationMethods: "Uses multiple approaches (ratios, multiples) with appropriate adjustments",
        strategicAnalysis: "Incorporates competitive positioning and Porter's Five Forces framework",
        managementAssessment: "Evaluates capital allocation and strategic execution capabilities",
        practicalApplication: "Uses real example (Microsoft vs Oracle) showing sector-specific considerations"
      }
    },
    "Explain the difference between enterprise value and equity value.": {
      answer: "Enterprise value and equity value represent different perspectives on company valuation. Equity value represents the total value of a company's shares—essentially what equity investors own. It's calculated as share price times shares outstanding, or market capitalization for public companies. Enterprise value represents the total value of the entire business, including both equity and debt holders' claims. The formula is: EV = Market Cap + Total Debt - Cash and Cash Equivalents. The key conceptual difference: equity value is what shareholders own after all debt obligations, while enterprise value is what someone would pay to acquire the entire company. In my Corporate Finance course, we learned EV is more useful for comparing companies with different capital structures. For example, if Company A has $1B market cap with no debt, and Company B has $800M market cap with $300M net debt, both have $1B enterprise value despite different equity values. When using valuation multiples, EV-based ratios like EV/EBITDA and EV/Sales are preferred because they're capital structure neutral—they compare operating performance regardless of financing decisions. Equity-based multiples like P/E ratios are affected by leverage since interest expense impacts net income. In M&A, buyers typically think in enterprise value terms since they're acquiring the entire business and will restructure the capital. However, equity value determines what shareholders receive in a transaction.",
      score: 92,
      breakdown: {
        clearDefinitions: "Precise definitions distinguishing ownership (equity) vs total business value (enterprise)",
        technicalAccuracy: "Correct EV formula and mathematical relationship between the concepts",
        academicFoundation: "References Corporate Finance coursework and capital structure concepts",
        practicalExample: "Uses hypothetical companies to illustrate the difference clearly",
        multipleUsage: "Explains when to use EV vs equity-based multiples and why",
        maContext: "Shows understanding of practical applications in M&A transactions"
      }
    },
    "Tell me about a time when you had to persuade someone to see your point of view.": {
      answer: "As Finance Club President, I needed to convince our executive board to change our annual stock pitch competition format from individual presentations to team-based analysis. The board was resistant because the individual format had been used for five years and alumni judges were familiar with it. I recognized this was about change management and evidence-based persuasion. First, I gathered data showing that while individual competitions attracted 25-30 participants, our peer schools' team competitions averaged 60+ participants. Second, I reached out to alumni working in investment banking who confirmed that actual IB work is collaborative, not individual. I scheduled one-on-one meetings with each board member to address their specific concerns: logistics, judging criteria, and alumni coordination. I created a detailed proposal showing how team format would better prepare students for recruiting while increasing participation and engagement. I also offered to pilot the new format with a smaller spring competition before implementing it for our main fall event. The board approved the change unanimously, our fall competition had 72 participants (140% increase), and post-event surveys showed 95% preferred the team format. Alumni judges also gave positive feedback about the more realistic collaborative environment. This taught me that effective persuasion combines data, stakeholder consultation, and addressing specific concerns rather than just pushing my preference.",
      score: 88,
      breakdown: {
        clearStakeholders: "Identifies specific group (executive board) and their resistance points",
        strategicApproach: "Systematic persuasion strategy using data, alumni input, and individual meetings",
        evidenceBased: "Uses concrete data (participation rates, peer comparisons) to build case",
        stakeholderFocus: "Addresses specific concerns of each board member individually",
        implementationPlan: "Offers pilot program to reduce risk and build confidence",
        quantifiedResults: "Strong outcomes: 140% participation increase, 95% satisfaction, positive alumni feedback"
      }
    },
    "Describe a situation where you identified an error that others missed.": {
      answer: "During my accounting internship at a regional CPA firm, I was reviewing quarterly financial statements for a $50M manufacturing client when I noticed something unusual in their inventory valuation. The senior accountant and manager had already reviewed the statements, but I spotted that raw materials inventory had increased 40% quarter-over-quarter while production volume remained flat. This seemed inconsistent with their just-in-time inventory management approach. I dug deeper into the supporting documentation and discovered that $2.3M in obsolete aluminum inventory from a discontinued product line had been incorrectly included in current raw materials rather than written off. The error occurred because the client's inventory system hadn't been updated when they discontinued the product three months earlier. I immediately brought this to my supervisor's attention with supporting documentation showing the product discontinuation date and usage patterns. We verified the error through physical inventory counts and client discussions. The correction required a $2.3M write-down that significantly impacted their quarterly results and debt covenant compliance. The client appreciated catching this before their bank review, and my supervisor noted this in my evaluation as demonstrating strong analytical thinking. This experience taught me the importance of understanding business context when reviewing numbers—the increase made sense from an accounting perspective but not from an operational standpoint.",
      score: 91,
      breakdown: {
        technicalSkill: "Demonstrates analytical ability by connecting inventory trends to business operations",
        attention: "Catches significant error ($2.3M) that multiple senior professionals missed",
        investigation: "Shows thorough follow-up process with documentation and verification",
        businessContext: "Understands operational implications (just-in-time vs actual inventory patterns)",
        communication: "Properly escalates with supporting evidence rather than assumptions",
        impactAwareness: "Recognizes materiality for debt covenants and bank relationships"
      }
    },
    "Tell me about a time when you went above and beyond what was expected.": {
      answer: "During my summer internship at a boutique investment firm, I was assigned to create a standard industry analysis comparing regional banks for a potential investment. The expectation was to deliver a 10-slide comparison using public filings and basic metrics. However, I noticed our analysis would benefit from understanding the actual competitive dynamics rather than just financial ratios. I took initiative to conduct a comprehensive study that went far beyond the basic assignment. I researched local market demographics, branch networks, and lending specializations for each bank. I analyzed their loan portfolios by geography and sector, identifying which banks had exposure to specific regional economic drivers like agriculture or energy. I also created a proprietary scoring system weighing factors like deposit growth, credit quality trends, and efficiency ratios. Most importantly, I reached out to industry contacts from my finance network and conducted informational interviews with three bank executives to understand strategic positioning and market outlook. This gave us insights that weren't available in public documents. My final deliverable was a 25-slide comprehensive analysis with investment recommendations ranked by risk-adjusted return potential. The managing director was impressed enough to present my analysis to the investment committee, and they ultimately invested in my top-ranked recommendation. This taught me that going beyond minimum requirements by adding unique insights and primary research can significantly increase the value of your work.",
      score: 89,
      breakdown: {
        initiativeTaking: "Expands basic assignment into comprehensive research project without being asked",
        valueCreation: "Adds unique insights through primary research and industry networking",
        analyticalDepth: "Creates proprietary scoring methodology and sector-specific analysis",
        networking: "Leverages professional contacts for primary source information",
        businessImpact: "Work influences actual investment decision and committee presentation",
        professionalGrowth: "Shows understanding of how to add value beyond basic expectations"
      }
    },
    "How have you prepared yourself for a career in investment banking?": {
      answer: "I've taken a comprehensive approach to preparing for investment banking through academics, practical experience, and professional development. Academically, I've completed core finance courses including Corporate Finance, Valuation, and Financial Markets, plus electives in M&A Analysis and Private Equity. I maintain a 3.7 GPA in my finance concentration. For technical skills, I've mastered Excel modeling through case competitions and built DCF, LBO, and comparable company analyses for real companies. I also completed the Bloomberg Market Concepts certification and taught myself VBA for financial modeling automation. Practically, I've gained relevant experience through my summer research role analyzing M&A targets for a local private equity firm, where I built 20+ financial models and pitched investment recommendations. My Finance Club leadership as VP of Events has taught me project management and client-facing skills essential for investment banking. I've also completed two investment banking internships—one at a regional firm and another at a boutique—where I worked on live transactions and pitch materials. For industry knowledge, I read the Wall Street Journal daily, follow IB-focused LinkedIn content, and attend finance networking events. I've conducted 15+ informational interviews with current IB professionals to understand day-to-day responsibilities and career progression. Finally, I've prepared extensively for recruiting through mock interviews and studying recent transactions in my target sectors. This multi-faceted preparation has given me both the technical foundation and industry understanding necessary for success in investment banking.",
      score: 92,
      breakdown: {
        academicPreparation: "Strong coursework foundation with specific finance classes and quantified performance",
        technicalSkills: "Demonstrates modeling expertise with Bloomberg certification and programming skills",
        practicalExperience: "Multiple internships and real-world project experience with quantified work",
        industryKnowledge: "Shows commitment to staying current with markets and transactions",
        networkBuilding: "Active informational interviewing and professional relationship development",
        leadershipEvidence: "Finance Club leadership demonstrates client-facing and project management skills"
      }
    },
    "What do you think will be the biggest challenge in investment banking for you?": {
      answer: "I believe the biggest challenge will be managing the intensity and pace while maintaining attention to detail across multiple live transactions. Investment banking is known for its demanding hours and fast-moving deal timelines, where small errors can have significant consequences for clients and transactions. Coming from an academic environment where I typically have days or weeks to perfect assignments, I'll need to adapt to producing high-quality work under extreme time pressure. My strategy for addressing this challenge has three components: First, developing efficient work processes and templates to minimize repetitive tasks while ensuring accuracy. During my accounting internship, I created Excel templates that reduced month-end closing time by 30% while improving accuracy. Second, I'm focusing on building stamina and stress management techniques. I've been practicing with case competitions that have tight deadlines and high stakes, plus I maintain a consistent exercise routine to manage stress. Third, I plan to be proactive about asking questions and clarifying expectations early rather than spending hours on work that misses the mark. From my informational interviews with current analysts, I've learned that successful IB professionals develop systems for managing multiple priorities and aren't afraid to seek guidance when needed. While this challenge is significant, I'm confident that my strong work ethic, attention to detail, and preparation will help me adapt quickly to the IB environment.",
      score: 86,
      breakdown: {
        selfAwareness: "Honest assessment of real challenge (pace and detail under pressure) vs superficial answer",
        strategicThinking: "Three-part approach showing thoughtful preparation for addressing the challenge",
        evidenceBase: "Uses internship experience and case competitions as relevant preparation examples",
        industryInsight: "Shows understanding from informational interviews with current professionals",
        growthMindset: "Demonstrates confidence in ability to adapt while acknowledging difficulty",
        practicalPreparation: "Specific actions taken (exercise, templates, question-asking strategy)"
      }
    },
    "Why investment banking instead of consulting or other finance roles?": {
      answer: "Investment banking appeals to me more than consulting or other finance roles for three key reasons that align with my strengths and career goals. First, the direct financial impact and measurable outcomes in IB resonate with my analytical mindset. In M&A advisory, I can see exactly how my DCF models and valuation work influences billion-dollar transactions and shapes companies' strategic futures. Consulting often involves recommendations that may or may not be implemented, whereas IB work has immediate, tangible results. Second, I'm drawn to the technical depth and financial modeling intensity that IB offers. My Corporate Finance coursework and case competition experience showed me I excel at building complex financial models and understanding how capital structure decisions affect business value. While consulting requires analytical thinking, IB's focus on financial analysis and deal structuring better matches my quantitative strengths. Third, the accelerated learning curve and early responsibility in IB align with my career timeline. As an analyst, I'd work directly on live transactions with significant client impact from day one. In consulting, junior roles often involve more research and presentation preparation without the same level of strategic transaction work. Long-term, my goal is private equity, and IB provides the most direct path with essential deal experience, financial modeling skills, and industry relationships. While I respect consulting's problem-solving approach, investment banking's combination of financial complexity, immediate impact, and clear career progression to my PE goal makes it the optimal choice.",
      score: 90,
      breakdown: {
        specificDifferentiation: "Clear comparison between IB vs consulting with concrete reasoning",
        personalAlignment: "Connects career choice to specific strengths (analytical, quantitative)",
        impactFocus: "Shows understanding of immediate vs delayed impact in different career paths",
        technicalMatch: "Links academic performance and interests to IB's financial modeling focus",
        careerProgression: "Demonstrates strategic thinking about path to long-term PE goal",
        industryUnderstanding: "Shows knowledge of day-to-day responsibilities and learning opportunities"
      }
    },
    "How do ESG considerations impact investment decisions today?": {
      answer: "ESG considerations have evolved from nice-to-have criteria to fundamental investment factors affecting both risk assessment and return generation. In my Sustainable Finance course, we studied how ESG integration creates material value for institutional investors. First, risk mitigation: ESG factors help identify potential operational, regulatory, and reputational risks. Companies with poor environmental practices face increasing regulatory costs and potential stranded assets, while weak governance structures create execution risk and potential legal issues. BlackRock's annual letter emphasizing climate risk as investment risk demonstrates how major asset managers now view ESG as fiduciary responsibility. Second, return enhancement: Companies with strong ESG profiles often demonstrate superior operational efficiency, employee retention, and customer loyalty. Research shows ESG leaders typically trade at premium valuations due to perceived quality and sustainability. Third, capital access and costs: Companies with poor ESG ratings face higher borrowing costs and limited access to certain investor pools. Many pension funds and sovereign wealth funds have ESG mandates that exclude non-compliant companies. In M&A, ESG due diligence has become standard practice since buyers want to avoid inheriting environmental liabilities or governance issues. However, ESG also creates opportunities—the energy transition is driving massive capital reallocation toward renewable infrastructure, clean technology, and sustainable business models. Investment banks are increasingly advising on green bonds, sustainability-linked loans, and ESG-focused transactions.",
      score: 87,
      breakdown: {
        academicFoundation: "References Sustainable Finance coursework and institutional research",
        riskFramework: "Understanding of ESG as risk mitigation tool across multiple dimensions",
        returnAnalysis: "Shows how ESG factors influence valuations and operational performance",
        capitalMarkets: "Demonstrates knowledge of ESG impact on funding costs and investor access",
        practicalApplication: "Connects to M&A due diligence and actual transaction considerations",
        opportunityAwareness: "Recognizes ESG as growth driver for new investment themes and products"
      }
    },
    "What recent earnings report or company announcement caught your attention?": {
      answer: "Tesla's Q3 2023 earnings report particularly caught my attention because it highlighted the tension between growth and profitability that many high-growth companies face. Tesla reported revenue of $23.4 billion, up 9% year-over-year, but automotive gross margin compressed to 16.3% from 19.3% in the prior year due to aggressive price cuts. What made this interesting from an investment banking perspective is how it demonstrates the strategic trade-offs between market share gains and near-term profitability. Tesla's price cuts throughout 2023 were designed to maintain volume growth amid increasing EV competition from Ford, GM, and Chinese manufacturers like BYD. However, the margin compression raised questions about Tesla's premium positioning and long-term pricing power. The earnings call revealed that Tesla is betting on achieving cost advantages through manufacturing scale and efficiency improvements, plus revenue diversification through energy storage and full self-driving capabilities. For investment bankers, this situation illustrates classic strategic advisory considerations: How do you balance growth investments against margin protection? When should companies prioritize market share versus profitability? Tesla's approach also highlights the importance of forward-looking guidance and strategic narrative in equity valuations—despite margin pressure, the stock remained resilient due to management's long-term automation and AI positioning. This type of dynamic creates opportunities for strategic advisory work as companies navigate competitive positioning and capital allocation decisions.",
      score: 89,
      breakdown: {
        currentAwareness: "Specific recent earnings with accurate financial details and context",
        strategicAnalysis: "Understands growth vs profitability trade-offs and competitive dynamics",
        industryContext: "Places Tesla's strategy within broader EV market competition and trends",
        investmentImplications: "Connects operational decisions to valuation and stock performance considerations",
        advisoryRelevance: "Shows how earnings results create strategic advisory opportunities for investment banks",
        financialSophistication: "Demonstrates understanding of margin analysis and forward-looking valuation metrics"
      }
    },
    "How do you stay current with financial markets and economic trends?": {
      answer: "I maintain a systematic approach to staying current that combines daily reading, data analysis, and professional networking. My morning routine starts with the Wall Street Journal and Financial Times for market headlines and deal announcements. I use Bloomberg Terminal access through our university to track key indices, sector performance, and economic indicators like the yield curve and VIX. For deeper analysis, I read research reports from major investment banks—particularly their weekly economic outlooks and sector rotation recommendations. I subscribe to several finance-focused newsletters including Matt Levine's Money Stuff for market commentary and The Acquirer's Multiple for M&A trends. Social media plays a strategic role: I follow key finance professionals on LinkedIn and Twitter for real-time market insights and deal flow updates. I've also joined several finance student organizations where we discuss current events and their market implications. Weekly, I review economic data releases like employment reports, inflation data, and Federal Reserve communications to understand macroeconomic trends affecting capital markets. I attend virtual events hosted by finance organizations and university career services, often featuring current market practitioners. To synthesize this information, I maintain a weekly market summary document where I track major developments, their potential impacts, and how they might affect different sectors or deal activity. This systematic approach ensures I can discuss current market conditions confidently while understanding the broader economic context that drives investment banking activity.",
      score: 85,
      breakdown: {
        systematicApproach: "Structured daily and weekly routine for market information consumption",
        sourcesDiversity: "Multiple high-quality sources from traditional media to social platforms",
        technicalAccess: "Uses Bloomberg Terminal and understands key market indicators",
        professionalNetwork: "Leverages student organizations and industry events for insights",
        activeProcessing: "Creates weekly summaries to synthesize information rather than passive consumption",
        businessRelevance: "Connects market trends to investment banking activity and deal flow"
      }
    },
    "Walk me through an LBO model.": {
      answer: "An LBO model analyzes how much a private equity firm can pay for a company using primarily debt financing while achieving target returns. I'll walk through the key components I learned in my Private Equity course. First, transaction assumptions: determine the purchase price, financing structure (typically 60-70% debt, 30-40% equity), and exit timeline (usually 3-5 years). The debt structure includes senior debt, subordinated debt, and potentially mezzanine financing, each with different interest rates and terms. Second, operating model: project the company's financials focusing on cash flow generation to service debt. This includes revenue growth assumptions, margin improvement initiatives, and working capital changes. Free cash flow calculation is critical since it determines debt paydown capacity. Third, debt schedule: model each debt tranche with principal amortization, interest payments, and cash sweeps. Many LBOs include mandatory and optional debt paydowns based on excess cash flow. Fourth, returns analysis: calculate the IRR and money multiple for the equity investment by modeling exit scenarios. Common exit methods include strategic sale (using transaction multiples) or IPO (using trading multiples). Finally, sensitivity analysis on key variables like EBITDA growth, exit multiples, and leverage ratios. The model answers: What's the maximum purchase price to achieve target returns? How does leverage affect returns? What operational improvements are needed? I've built LBO models for case competitions using companies like Starbucks, which helped me understand how operational improvements and multiple expansion drive private equity returns.",
      score: 93,
      breakdown: {
        structuredApproach: "Systematic walkthrough of all major LBO model components",
        academicFoundation: "References Private Equity coursework and practical case competition experience",
        technicalAccuracy: "Correct leverage ratios, debt structure, and cash flow mechanics",
        purposeUnderstanding: "Explains what the model determines (max price, returns, operational needs)",
        practicalApplication: "Uses real company example (Starbucks) to demonstrate hands-on experience",
        returnsFocus: "Shows understanding of IRR and multiple calculations with exit scenario modeling"
      }
    },
    "How would you determine if a company is undervalued or overvalued?": {
      answer: "I'd use a multi-faceted approach combining quantitative analysis, qualitative assessment, and relative comparisons to determine valuation. First, intrinsic value analysis through DCF modeling: I'd build a detailed discounted cash flow model projecting 5-year free cash flows based on historical performance, industry growth rates, and company-specific drivers. Using WACC as the discount rate and calculating terminal value through both perpetuity growth and exit multiple methods. If the DCF value significantly exceeds current market price, it suggests undervaluation. Second, relative valuation using multiple approaches: I'd compare trading multiples (P/E, EV/EBITDA, EV/Sales) to industry peers, adjusting for differences in growth, profitability, and risk. I'd also analyze precedent transaction multiples to understand acquisition values. Consistent trading below peer averages may indicate undervaluation. Third, qualitative factor assessment: management quality, competitive positioning, market share trends, and industry dynamics. A company trading at discount multiples might be justified due to execution risk or competitive pressures. Fourth, technical and market factors: analyst consensus, institutional ownership, and recent price action relative to fundamentals. Sometimes excellent companies trade at discounts due to temporary factors like earnings volatility or sector rotation. Finally, I'd stress-test assumptions through scenario analysis, examining how different growth rates, margin assumptions, or market conditions affect valuation ranges. In my Investment Analysis course, we analyzed Netflix using this framework and found it fairly valued despite appearing expensive on trailing metrics due to its growth trajectory and competitive moat.",
      score: 91,
      breakdown: {
        comprehensiveFramework: "Multi-dimensional approach combining intrinsic and relative valuation methods",
        technicalDepth: "Detailed DCF methodology with appropriate discount rate and terminal value approaches",
        relativeAnalysis: "Uses both trading and transaction comps with peer adjustment considerations",
        qualitativeFactors: "Incorporates management quality and competitive dynamics beyond pure numbers",
        marketContext: "Understands technical factors and temporary vs fundamental discount reasons",
        practicalExample: "Netflix case study demonstrates real-world application of valuation framework"
      }
    },
    "Explain how you would approach acquisition financing for a $2B deal.": {
      answer: "For a $2B acquisition, I'd structure a financing package balancing cost, risk, and strategic flexibility across debt and equity components. First, I'd analyze the target's cash flow profile and debt capacity using metrics like Debt/EBITDA ratios and interest coverage. For a stable business, I'd target 4-5x leverage; for cyclical companies, 3-4x to maintain financial flexibility. The financing structure would typically include: Senior debt ($800M-1B) through term loans and revolving credit facilities with commercial banks, priced at SOFR + 200-400 bps based on leverage and credit quality. Subordinated debt ($300-400M) through high-yield bonds or institutional term loans at higher spreads but providing additional capacity. Remaining $600-800M through equity contribution from the acquirer. For strategic buyers with strong balance sheets, I'd recommend minimizing equity dilution by maximizing debt capacity. For private equity buyers, I'd optimize the debt/equity mix to achieve target IRR thresholds while maintaining covenant flexibility. I'd also consider contingent financing like bridge loans for competitive auction processes, convertible securities for growth companies, or seller financing to enhance deal attractiveness. Key execution considerations include: market timing for debt issuance, covenant negotiations to preserve operational flexibility, and hedging strategies for interest rate exposure. Throughout the process, I'd coordinate with debt capital markets teams for optimal market positioning and pricing. Recent examples like KKR's acquisition of Envision Healthcare show how financing structure affects deal economics and post-acquisition performance.",
      score: 92,
      breakdown: {
        structuredApproach: "Systematic analysis of debt capacity and financing components",
        marketTerms: "Accurate pricing spreads and leverage ratios reflecting current market conditions",
        buyerAwareness: "Distinguishes between strategic vs financial buyer financing optimization",
        riskManagement: "Considers covenant flexibility, hedging, and contingent financing options",
        executionFocus: "Shows understanding of market timing and DCM coordination requirements",
        realWorldExample: "References actual transaction (KKR/Envision) to demonstrate practical knowledge"
      }
    }
  };

  // Student-focused analysis criteria for summer internship recruiting
  const ANALYSIS_CRITERIA = {
    behavioral: {
      criteria: ['Situation Context', 'Task Definition', 'Action Steps', 'Result Achievement', 'Leadership Display'],
      keyElements: ['specific numbers', 'team dynamics', 'problem-solving', 'quantified outcomes', 'personal growth'],
      studentFocus: ['coursework examples', 'internship experiences', 'student organization leadership', 'part-time jobs', 'academic projects'],
      commonMissing: ['timeline specifics', 'team size details', 'quantified results', 'your specific role', 'lessons learned']
    },
    whyIB: {
      criteria: ['Personal Motivation', 'Relevant Experience', 'Industry Knowledge', 'Career Vision', 'Academic Connection'],
      keyElements: ['class experiences', 'internship insights', 'deal knowledge', 'skill development goals', 'networking efforts'],
      studentFocus: ['finance courses', 'student clubs', 'research projects', 'informational interviews', 'case competitions'],
      commonMissing: ['specific class/professor examples', 'recent deal mentions', 'career progression plan', 'skill gap awareness']
    },
    markets: {
      criteria: ['Topic Relevance', 'Mechanism Analysis', 'Data/Examples', 'Academic Foundation', 'Future Outlook'],
      keyElements: ['current events', 'cause-and-effect', 'specific metrics', 'coursework connection', 'sector implications'],
      studentFocus: ['financial markets courses', 'economics classes', 'research papers', 'finance club discussions', 'professor insights'],
      commonMissing: ['recent deal examples', 'specific data points', 'coursework connections', 'multiple market effects']
    },
    technical: {
      criteria: ['Methodology Knowledge', 'Process Detail', 'Technical Accuracy', 'Academic Foundation', 'Practical Application'],
      keyElements: ['DCF steps', 'comparable selection', 'valuation multiples', 'coursework examples', 'case study applications'],
      studentFocus: ['valuation courses', 'corporate finance classes', 'case competitions', 'internship projects', 'Excel/modeling skills'],
      commonMissing: ['WACC calculation', 'terminal value methods', 'course examples', 'step-by-step process']
    }
  };

  // Styles object
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      marginBottom: '32px'
    },
    headerCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '48px 32px',
      textAlign: 'center',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      marginBottom: '32px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#6b7280',
      maxWidth: '768px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '24px',
      color: '#111827'
    },
    grid: {
      display: 'grid',
      gap: '24px'
    },
    gridMd2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    },
    stepCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    stepCardActive: {
      border: '2px solid #2563eb'
    },
    stepCardInactive: {
      border: '1px solid #e5e7eb',
      opacity: '0.6'
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    flexStart: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    iconContainer: {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px'
    },
    button: {
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#4b5563',
      color: 'white'
    },
    buttonDisabled: {
      backgroundColor: '#d1d5db',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      transition: 'width 0.5s ease'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    textarea: {
      width: '100%',
      height: '192px',
      padding: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      resize: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    alertBox: {
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    alertYellow: {
      backgroundColor: '#fefce8',
      border: '1px solid #fde68a',
      color: '#92400e'
    },
    alertGreen: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#166534'
    },
    alertRed: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626'
    },
    alertBlue: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      color: '#1d4ed8'
    }
  };

  // Generate video questions (shorter list, focused on delivery)
  const generateVideoQuestions = (count = 3) => {
    const videoQuestions = [
      { category: 'behavioral', text: "Tell me about a time when you had to lead a team through a challenging project with a tight deadline." },
      { category: 'whyIB', text: "Why are you interested in investment banking specifically?" },
      { category: 'whyIB', text: "What attracts you to our firm over our competitors?" },
      { category: 'markets', text: "What recent market development do you think will most impact M&A activity this year?" },
      { category: 'technical', text: "Walk me through how you would value a company for acquisition." },
      { category: 'behavioral', text: "Tell me about a time when you failed at something important. What did you learn?" }
    ];
    
    const shuffled = [...videoQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((q, index) => ({
      id: Date.now() + index,
      ...q
    }));
  };

  // Analyze video delivery performance
  const analyzeVideoDelivery = (responseTime, preparationUsed, question, transcript = '') => {
    const idealResponseTime = question.category === 'technical' ? 90 : 75; // seconds
    const maxResponseTime = 120;
    
    let deliveryScores = {};
    let contentScores = {};
    let feedback = [];
    let strengths = [];
    let improvements = [];

    // DELIVERY ANALYSIS
    // Timing Analysis
    const timingScore = responseTime <= idealResponseTime ? 95 : 
                       responseTime <= maxResponseTime ? 85 - ((responseTime - idealResponseTime) * 2) :
                       Math.max(60, 85 - ((responseTime - idealResponseTime) * 3));
    
    deliveryScores['Timing & Pace'] = timingScore + (Math.random() * 10 - 5);
    deliveryScores['Clarity & Articulation'] = 75 + Math.random() * 20;
    deliveryScores['Professional Presence'] = 80 + Math.random() * 15;
    deliveryScores['Eye Contact & Engagement'] = 70 + Math.random() * 25;
    deliveryScores['Confidence & Energy'] = 75 + Math.random() * 20;

    // CONTENT ANALYSIS (if transcript available)
    let contentAnalysis = null;
    if (transcript && transcript.trim().length > 20) {
      // Use the same content analysis as written assessment
      contentAnalysis = analyzeContent(transcript, question.category, question.text);
      contentScores = contentAnalysis.scores;
      
      // Merge content strengths and improvements
      if (contentAnalysis.strengths) strengths.push(...contentAnalysis.strengths);
      if (contentAnalysis.improvements) improvements.push(...contentAnalysis.improvements);
    }

    // DELIVERY-SPECIFIC FEEDBACK
    if (responseTime > maxResponseTime) {
      improvements.push("Response exceeded 2-minute limit. Practice concise storytelling and prioritize key points.");
    } else if (responseTime < 45) {
      improvements.push("Response was quite brief. Add more specific details and examples to strengthen your answer.");
    } else if (responseTime <= idealResponseTime) {
      strengths.push("Excellent timing - stayed within optimal response window");
    }

    // Preparation usage feedback
    if (preparationUsed < 15) {
      strengths.push("Efficient preparation time shows good interview readiness");
    } else if (preparationUsed > 25) {
      improvements.push("Consider practicing answers to reduce preparation time needed");
    }

    // Generate category-specific delivery feedback
    if (question.category === 'behavioral') {
      if (responseTime > 90) {
        improvements.push("For behavioral questions, focus on STAR method: Situation (10s), Task (10s), Action (40s), Result (20s)");
      }
      feedback.push("Remember to quantify your impact and show leadership qualities in behavioral responses");
    } else if (question.category === 'technical') {
      if (responseTime < 60) {
        improvements.push("Technical questions benefit from more detailed explanations. Walk through each step clearly.");
      }
      feedback.push("Structure technical responses: methodology overview, then detailed walkthrough with examples");
    }

    // Professional presence feedback (simulated)
    const presenceScore = deliveryScores['Professional Presence'];
    if (presenceScore > 88) {
      strengths.push("Strong professional presence and polished delivery");
    } else if (presenceScore < 75) {
      improvements.push("Focus on posture, clear background, and maintaining steady eye contact with camera");
    }

    // Audio quality feedback
    if (transcript && transcript.trim().length > 0) {
      strengths.push("Clear audio captured - transcript generated successfully");
      if (transcript.split(' ').length < 50) {
        improvements.push("Speak more to fully utilize your response time - aim for 100-200 words");
      }
    } else if (!transcript) {
      improvements.push("Audio unclear - ensure good microphone positioning and speak clearly");
    }

    // Calculate combined scores
    const deliveryScore = Math.round(Object.values(deliveryScores).reduce((a, b) => a + b, 0) / Object.values(deliveryScores).length);
    const contentScore = contentScores && Object.keys(contentScores).length > 0 ? 
                        Math.round(Object.values(contentScores).reduce((a, b) => a + b, 0) / Object.values(contentScores).length) : 
                        null;
    
    // Overall score combines delivery (60%) and content (40%) if transcript available
    const overallScore = contentScore ? 
                        Math.round(deliveryScore * 0.6 + contentScore * 0.4) : 
                        deliveryScore;

    return {
      score: overallScore,
      deliveryScore,
      contentScore,
      responseTime,
      preparationUsed,
      grade: getGrade(overallScore),
      deliveryScores,
      contentScores,
      feedback,
      strengths,
      improvements,
      contentAnalysis,
      timing: {
        responseTime,
        preparationUsed,
        idealTime: idealResponseTime,
        efficiency: responseTime <= idealResponseTime ? 'Excellent' : responseTime <= maxResponseTime ? 'Good' : 'Needs Improvement'
      }
    };
  };

  // Start video assessment
  const startVideoAssessment = () => {
    const questions = generateVideoQuestions(3);
    setVideoAssessmentData({
      questions,
      currentIndex: 0,
      recordings: [],
      isActive: true,
      isComplete: false,
      isRecording: false,
      recordingStartTime: null,
      preparationTime: 30,
      responseTime: 120,
      currentPhase: 'setup',
      results: []
    });
    setCurrentView('videoAssessment');
  };

  // Submit video response
  const submitVideoResponse = (preparationUsed, responseTime, transcript = '') => {
    const currentQuestion = videoAssessmentData.questions[videoAssessmentData.currentIndex];
    const analysis = analyzeVideoDelivery(responseTime, preparationUsed, currentQuestion, transcript);
    
    const newRecording = {
      questionId: currentQuestion.id,
      preparationTime: preparationUsed,
      responseTime: responseTime,
      transcript: transcript,
      wordCount: transcript ? transcript.split(/\s+/).filter(word => word.length > 0).length : 0,
      analysis
    };
    
    const newRecordings = [...videoAssessmentData.recordings, newRecording];
    
    if (videoAssessmentData.currentIndex < videoAssessmentData.questions.length - 1) {
      // Move to next question
      setVideoAssessmentData(prev => ({
        ...prev,
        recordings: newRecordings,
        currentIndex: prev.currentIndex + 1,
        currentPhase: 'setup',
        isRecording: false,
        recordingStartTime: null
      }));
    } else {
      // Complete video assessment
      const overallScore = Math.round(
        newRecordings.reduce((sum, rec) => sum + rec.analysis.score, 0) / newRecordings.length
      );
      
      setVideoAssessmentData(prev => ({
        ...prev,
        recordings: newRecordings,
        isActive: false,
        isComplete: true,
        currentPhase: 'complete'
      }));
      
      // Update user progress - video completion unlocks advanced features
      setUserProgress(prev => ({
        contentMastery: Math.max(prev.contentMastery, (prev.contentMastery + overallScore) / 2),
        hasCompletedWritten: prev.hasCompletedWritten,
        hasCompletedVideo: overallScore >= 75 || prev.hasCompletedVideo,
        totalSessions: prev.totalSessions + 1
      }));
      
      setCurrentView('videoResults');
    }
  };
  const generateQuestions = (count = 4) => {
    const categories = Object.keys(QUESTION_BANKS);
    const questions = [];
    
    categories.forEach(category => {
      const categoryQuestions = QUESTION_BANKS[category];
      const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
      questions.push({
        id: Date.now() + Math.random(),
        category,
        text: randomQuestion
      });
    });
    
    return questions.slice(0, count);
  };

  // Enhanced answer analysis with detailed feedback
  const analyzeAnswer = (answer, category, questionText) => {
    const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
    const criteria = ANALYSIS_CRITERIA[category];
    const modelAnswer = MODEL_ANSWERS[questionText];
    
    // Detailed content analysis
    const contentAnalysis = analyzeContent(answer, category, questionText);
    const scores = contentAnalysis.scores;
    const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
    
    return {
      score: overallScore,
      wordCount,
      grade: getGrade(overallScore),
      scores: scores,
      feedback: generateDetailedFeedback(answer, category, questionText, contentAnalysis),
      strengths: contentAnalysis.strengths,
      improvements: contentAnalysis.improvements,
      missingElements: contentAnalysis.missingElements,
      modelAnswer: modelAnswer
    };
  };

  // Enhanced content analysis for student recruiting context
  const analyzeContent = (answer, category, questionText) => {
    const answerLower = answer.toLowerCase();
    const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    let scores = {};
    let strengths = [];
    let improvements = [];
    let missingElements = [];

    if (category === 'behavioral') {
      // STAR method analysis for students
      const hasSituation = /during|when|while|in my|for my|at my/.test(answerLower) && wordCount >= 50;
      const hasTask = /led|managed|responsible|tasked|assigned|organized/.test(answerLower);
      const hasAction = /i (decided|created|implemented|organized|established|built|coordinated|taught)/.test(answerLower);
      const hasResult = /result|outcome|achieved|completed|won|placed|improved|earned|learned/.test(answerLower);
      const hasNumbers = /\d+/.test(answer);
      const hasStudentContext = /class|course|club|society|competition|internship|project|team|group/.test(answerLower);
      
      scores['Situation Context'] = hasSituation && hasStudentContext ? 85 + Math.random() * 10 : 65 + Math.random() * 15;
      scores['Task Definition'] = hasTask ? 80 + Math.random() * 15 : 60 + Math.random() * 20;
      scores['Action Steps'] = hasAction ? 82 + Math.random() * 13 : 58 + Math.random() * 22;
      scores['Result Achievement'] = hasResult ? 88 + Math.random() * 10 : 55 + Math.random() * 25;
      scores['Leadership Display'] = (hasTask && hasAction) ? 85 + Math.random() * 12 : 62 + Math.random() * 18;

      if (hasStudentContext) strengths.push("Uses relevant student experience (coursework, clubs, internships)");
      if (hasNumbers) strengths.push("Includes quantified details and specific metrics");
      if (hasAction && hasResult) strengths.push("Shows clear action-to-result connection");
      
      // Leadership-specific feedback
      if (questionText.includes('lead a team')) {
        if (!answerLower.includes('team') || !/\d+/.test(answer)) {
          improvements.push("Specify team composition: 'I led a 4-person study group with 2 finance majors and 2 economics students'");
          missingElements.push("Team size and member backgrounds");
        }
        if (!hasAction) {
          improvements.push("Detail specific leadership actions: 'I organized weekly meetings,' 'I delegated research tasks,' 'I mentored struggling members'");
          missingElements.push("Concrete leadership behaviors");
        }
      }
      
      if (!hasStudentContext) {
        improvements.push("Use relevant student experiences: class projects, internships, student organizations, case competitions");
        missingElements.push("Student-relevant context (courses, clubs, internships)");
      }
      if (!hasNumbers) {
        improvements.push("Add specific metrics: team size, timeline, GPA improvement, competition ranking, budget managed");
        missingElements.push("Quantified details (numbers, percentages, rankings)");
      }

    } else if (category === 'whyIB') {
      const hasPersonalMotivation = /interested|drawn|passionate|excited|fascinated/.test(answerLower);
      const hasAcademicConnection = /class|course|professor|finance|economics|accounting|valuation/.test(answerLower);
      const hasExperience = /internship|experience|worked|project|research|club/.test(answerLower);
      const hasIBKnowledge = /investment banking|m&a|ipo|deals|transactions|dcf|modeling|pitch/.test(answerLower);
      const hasCareerVision = /future|career|years|grow|develop|learn|skills/.test(answerLower);
      const hasRecentDeals = /microsoft|activision|twitter|elon|acquisition|merger/.test(answerLower);
      
      scores['Personal Motivation'] = hasPersonalMotivation ? 85 + Math.random() * 12 : 60 + Math.random() * 20;
      scores['Relevant Experience'] = hasExperience ? 80 + Math.random() * 15 : 55 + Math.random() * 25;
      scores['Industry Knowledge'] = hasIBKnowledge ? 88 + Math.random() * 10 : 50 + Math.random() * 30;
      scores['Career Vision'] = hasCareerVision ? 78 + Math.random() * 17 : 52 + Math.random() * 28;
      scores['Academic Connection'] = hasAcademicConnection ? 82 + Math.random() * 15 : 45 + Math.random() * 25;

      if (hasAcademicConnection) strengths.push("Connects coursework to IB interest");
      if (hasExperience) strengths.push("References relevant experience (internships, projects, clubs)");
      if (hasRecentDeals) strengths.push("Shows awareness of current market activity");
      
      if (!hasAcademicConnection) {
        improvements.push("Reference specific courses: 'In my Corporate Finance class, we analyzed the Disney-Fox merger' or 'My Valuation course taught me DCF modeling'");
        missingElements.push("Connection to finance coursework or professors");
      }
      if (!hasExperience) {
        improvements.push("Mention relevant experiences: finance club leadership, internships, research projects, case competitions");
        missingElements.push("Concrete student experiences (internships, clubs, projects)");
      }
      if (!hasRecentDeals) {
        improvements.push("Reference recent transactions: 'I was fascinated by Microsoft's $69B Activision acquisition' or 'The Twitter buyout showed me...'");
        missingElements.push("Knowledge of recent major deals or transactions");
      }

    } else if (category === 'markets') {
      const hasCurrentEvent = /2024|2025|recent|current|fed|interest|rate|inflation|recession/.test(answerLower);
      const hasSpecificData = /\d+%|\$\d+|basis points|billion|bps/.test(answer);
      const hasDealExample = /deal|acquisition|merger|ipo|transaction|microsoft|twitter/.test(answerLower);
      const hasAcademicConnection = /class|course|professor|learned|studied|economics|finance/.test(answerLower);
      const hasAnalysis = /because|impact|effect|result|cause|leads to|drives/.test(answerLower);
      
      scores['Topic Relevance'] = hasCurrentEvent ? 90 + Math.random() * 8 : 55 + Math.random() * 25;
      scores['Mechanism Analysis'] = hasAnalysis ? 85 + Math.random() * 12 : 60 + Math.random() * 20;
      scores['Data/Examples'] = (hasSpecificData || hasDealExample) ? 88 + Math.random() * 10 : 50 + Math.random() * 30;
      scores['Academic Foundation'] = hasAcademicConnection ? 80 + Math.random() * 15 : 55 + Math.random() * 25;
      scores['Future Outlook'] = /will|expect|likely|predict|outlook|next/.test(answerLower) ? 82 + Math.random() * 15 : 58 + Math.random() * 22;

      if (hasAcademicConnection) strengths.push("Connects to academic learning (courses, professors, research)");
      if (hasSpecificData) strengths.push("Uses concrete data points and specific metrics");
      if (hasDealExample) strengths.push("References real transactions to support analysis");
      
      if (!hasAcademicConnection) {
        improvements.push("Connect to coursework: 'In my Financial Markets class, we studied how interest rates affect...' or 'My Economics professor explained...'");
        missingElements.push("Academic foundation or coursework connection");
      }
      if (!hasSpecificData) {
        improvements.push("Include specific data: 'Fed funds rate rose from 0.25% to 5.25%' or 'M&A volume dropped 30% year-over-year'");
        missingElements.push("Concrete statistics and quantified trends");
      }
      if (!hasDealExample) {
        improvements.push("Reference recent deals: 'Microsoft's Activision deal,' 'Elon's Twitter acquisition,' or other major transactions");
        missingElements.push("Real transaction examples to illustrate points");
      }

    } else if (category === 'technical') {
      const hasDCF = /dcf|discounted cash flow|free cash flow|terminal value|wacc/.test(answerLower);
      const hasComparables = /comparable|comps|trading multiples|ev\/ebitda|p\/e/.test(answerLower);
      const hasPrecedent = /precedent|transaction|deal multiples/.test(answerLower);
      const hasAcademicConnection = /class|course|learned|valuation|corporate finance|professor/.test(answerLower);
      const hasProcess = /first|second|then|next|finally|step/.test(answerLower);
      
      scores['Methodology Knowledge'] = (hasDCF && hasComparables) ? 90 + Math.random() * 8 : 60 + Math.random() * 20;
      scores['Process Detail'] = hasProcess ? 85 + Math.random() * 12 : 55 + Math.random() * 25;
      scores['Technical Accuracy'] = hasDCF && /wacc|discount|terminal/.test(answerLower) ? 88 + Math.random() * 10 : 65 + Math.random() * 20;
      scores['Academic Foundation'] = hasAcademicConnection ? 82 + Math.random() * 15 : 50 + Math.random() * 25;
      scores['Practical Application'] = hasPrecedent ? 80 + Math.random() * 15 : 58 + Math.random() * 22;

      if (hasDCF && hasComparables && hasPrecedent) strengths.push("Covers all three standard valuation methodologies");
      if (hasAcademicConnection) strengths.push("References relevant coursework and academic learning");
      if (hasProcess) strengths.push("Provides clear, step-by-step methodology");
      
      if (!hasAcademicConnection) {
        improvements.push("Reference coursework: 'In my Valuation class, we learned to build DCF models' or 'My Corporate Finance course covered...'");
        missingElements.push("Academic foundation (courses, projects, case studies)");
      }
      if (!hasDCF) {
        improvements.push("Walk through DCF components: revenue projections, free cash flow calculation, WACC determination, terminal value");
        missingElements.push("DCF methodology and technical components");
      }
      if (!hasComparables) {
        improvements.push("Explain comparable selection: 'I'd find 6-8 similar companies and calculate EV/EBITDA and P/E multiples'");
        missingElements.push("Comparable company analysis process");
      }
    }

    // Word count adjustments
    if (wordCount < 75) {
      Object.keys(scores).forEach(key => scores[key] = Math.max(scores[key] - 15, 40));
      improvements.push("Expand your response - aim for 150-250 words with specific examples and details");
    } else if (wordCount > 300) {
      Object.keys(scores).forEach(key => scores[key] = Math.max(scores[key] - 8, 50));
      improvements.push("Be more concise - focus on the most impactful details for maximum effect");
    }

    return { scores, strengths, improvements, missingElements };
  };

  // Grade calculation
  const getGrade = (score) => {
    if (score >= 93) return { letter: 'A', description: 'Elite IB Ready', color: '#059669' };
    if (score >= 87) return { letter: 'B+', description: 'Top Firm Ready', color: '#0891b2' };
    if (score >= 80) return { letter: 'B', description: 'Good Progress', color: '#7c3aed' };
    if (score >= 70) return { letter: 'C+', description: 'Needs Work', color: '#dc2626' };
    return { letter: 'C', description: 'Major Improvement Needed', color: '#991b1b' };
  };

  // Generate detailed, student-focused feedback
  const generateDetailedFeedback = (answer, category, questionText, contentAnalysis) => {
    const feedback = [];
    const { scores, improvements, missingElements } = contentAnalysis;
    const modelAnswer = MODEL_ANSWERS[questionText];
    
    // Overall assessment
    const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
    
    if (avgScore >= 85) {
      feedback.push("Strong response for summer internship recruiting! You demonstrate good understanding of what bankers are looking for.");
    } else if (avgScore >= 75) {
      feedback.push("Good foundation for recruiting, but there are specific areas to strengthen for top-tier firms.");
    } else {
      feedback.push("This response needs significant improvement to meet summer internship recruiting standards.");
    }

    // Question-specific feedback for students
    if (category === 'behavioral') {
      if (questionText.includes('lead a team')) {
        if (!answer.toLowerCase().includes('team') || !/\d+/.test(answer)) {
          feedback.push("For leadership questions, specify team composition: 'I led our 5-person case competition team with 3 finance majors and 2 economics students.'");
        }
        if (!answer.toLowerCase().includes('deadline') && !answer.toLowerCase().includes('time')) {
          feedback.push("Emphasize the time pressure: 'We had only 48 hours to complete our DCF model and presentation.'");
        }
        if (!answer.toLowerCase().includes('class') && !answer.toLowerCase().includes('club') && !answer.toLowerCase().includes('internship')) {
          feedback.push("Use student-relevant examples: class projects, student organizations, internships, case competitions, or study groups.");
        }
      }
      
      if (scores['Result Achievement'] < 80) {
        feedback.push("Quantify results more specifically for recruiting impact: 'won 1st place out of 15 teams,' 'increased club membership by 40%,' or 'improved group project grade from B+ to A.'");
      }
      
      if (scores['Action Steps'] < 80) {
        feedback.push("Detail specific actions using active language: 'I organized weekly study sessions,' 'I created Excel tracking sheets,' 'I taught DCF modeling to newer members.'");
      }
    } 
    
    else if (category === 'whyIB') {
      if (scores['Academic Connection'] < 80) {
        feedback.push("Connect to specific coursework: 'In Professor Smith's Corporate Finance class, we analyzed the Disney-Fox merger, which sparked my interest in M&A advisory work.'");
      }
      
      if (scores['Relevant Experience'] < 80) {
        feedback.push("Reference student experiences: 'Through my Finance Club's stock pitch competition,' 'During my summer research assistantship,' or 'My internship at [local firm] involved...'");
      }
      
      if (!answer.toLowerCase().includes('deal') && !answer.toLowerCase().includes('transaction')) {
        feedback.push("Reference recent deals to show market awareness: 'Microsoft's $69B Activision acquisition demonstrated the strategic advisory role of investment banks.'");
      }
      
      if (scores['Career Vision'] < 80) {
        feedback.push("Show clear career planning: 'The technical skills I'd develop—financial modeling, valuation, pitch creation—align with my goal of working in private equity after 2-3 years in IB.'");
      }
    } 
    
    else if (category === 'markets') {
      if (scores['Academic Foundation'] < 80) {
        feedback.push("Connect to coursework: 'In my Financial Markets class, we studied how Fed policy affects capital costs,' or 'My Economics professor explained the transmission mechanism...'");
      }
      
      if (scores['Data/Examples'] < 80) {
        feedback.push("Use specific data that students can research: 'Fed funds rate rose from 0.25% to 5.25%,' '2023 M&A volume dropped 30% vs. 2021 peak.'");
      }
      
      if (!answer.includes('M&A') && !answer.includes('deal')) {
        feedback.push("Explicitly connect your market view to deal activity: 'This trend particularly affects leveraged buyouts, where PE firms now face 400-500 bps higher financing costs.'");
      }
      
      if (scores['Future Outlook'] < 80) {
        feedback.push("Show forward-thinking analysis: 'I expect strategic buyers with strong balance sheets to gain advantages over leveraged competitors in 2024.'");
      }
    } 
    
    else if (category === 'technical') {
      if (scores['Academic Foundation'] < 80) {
        feedback.push("Reference relevant coursework: 'In my Valuation class, we built DCF models for companies like Salesforce,' or 'My Corporate Finance course covered these three methodologies.'");
      }
      
      if (scores['Methodology Knowledge'] < 85) {
        feedback.push("Cover all three standard methods: 'I would triangulate value using DCF analysis, comparable company multiples, and precedent transaction analysis.'");
      }
      
      if (!answer.toLowerCase().includes('wacc') && !answer.toLowerCase().includes('discount')) {
        feedback.push("Include technical depth appropriate for students: 'I'd calculate WACC using the CAPM model for cost of equity and market debt costs.'");
      }
      
      if (scores['Practical Application'] < 80) {
        feedback.push("Show practical understanding: 'For acquisition purposes, I'd also consider control premiums of 20-30% and potential synergy values.'");
      }
    }

    // Add specific improvement priorities
    improvements.forEach(improvement => {
      feedback.push(improvement);
    });

    return feedback;
  };

  // Start new assessment
  const startAssessment = () => {
    const questions = generateQuestions(4);
    setAssessmentData({
      questions,
      currentIndex: 0,
      answers: [],
      isActive: true,
      isComplete: false,
      results: []
    });
    setCurrentView('assessment');
  };

  // Submit answer and move to next question
  const submitAnswer = (answer) => {
    const currentQuestion = assessmentData.questions[assessmentData.currentIndex];
    const analysis = analyzeAnswer(answer, currentQuestion.category, currentQuestion.text);
    
    const newAnswer = {
      questionId: currentQuestion.id,
      text: answer,
      analysis
    };
    
    const newAnswers = [...assessmentData.answers, newAnswer];
    
    if (assessmentData.currentIndex < assessmentData.questions.length - 1) {
      // Move to next question
      setAssessmentData(prev => ({
        ...prev,
        answers: newAnswers,
        currentIndex: prev.currentIndex + 1
      }));
    } else {
      // Complete assessment
      const overallScore = Math.round(
        newAnswers.reduce((sum, ans) => sum + ans.analysis.score, 0) / newAnswers.length
      );
      
      setAssessmentData(prev => ({
        ...prev,
        answers: newAnswers,
        isActive: false,
        isComplete: true
      }));
      
      // Update user progress
      setUserProgress(prev => ({
        contentMastery: Math.max(prev.contentMastery, overallScore),
        hasCompletedWritten: overallScore >= 75 || prev.hasCompletedWritten,
        totalSessions: prev.totalSessions + 1
      }));
      
      setCurrentView('results');
    }
  };

  // Dashboard Component
  const Dashboard = () => (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.headerCard}>
          <h1 style={styles.title}>
            Investment Banking Interview Simulator
          </h1>
          <p style={styles.subtitle}>
            Master investment banking recruiting with AI-powered mock interviews. 
            Practice behavioral, technical, and market questions used by top firms.
          </p>
        </div>

        {/* Progress Path */}
        <div style={{marginBottom: '32px'}}>
          <h2 style={styles.sectionTitle}>Your Preparation Path</h2>
          <div style={styles.gridMd2}>
            
            {/* Step 1: Content Mastery */}
            <div 
              style={{
                ...styles.stepCard,
                ...styles.stepCardActive
              }}
              onClick={startAssessment}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{...styles.flexStart, marginBottom: '16px'}}>
                <div style={{
                  ...styles.iconContainer,
                  backgroundColor: '#2563eb'
                }}>
                  <Play style={{width: '24px', height: '24px', color: 'white'}} />
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px'}}>
                    Master Content & Answers
                  </h3>
                  <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                    4 IB questions • Model examples • Detailed feedback
                  </p>
                </div>
              </div>
              
              <p style={{color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px'}}>
                Practice investment banking interview questions from top firms. 
                Get model example answers and question-specific feedback.
              </p>
              
              <div style={{marginBottom: '16px'}}>
                <div style={{...styles.flexBetween, fontSize: '12px', color: '#6b7280', marginBottom: '8px'}}>
                  <span>Content Mastery: {userProgress.contentMastery}%</span>
                  <span>
                    {userProgress.contentMastery >= 85 ? '✅ Ready' : 
                     userProgress.contentMastery >= 75 ? '🎯 Almost ready' : '📈 Keep practicing'}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${Math.min(100, userProgress.contentMastery)}%`
                    }}
                  />
                </div>
              </div>
              
              <button style={{
                ...styles.button,
                ...styles.buttonPrimary,
                width: '100%'
              }}>
                {userProgress.totalSessions === 0 ? 'Start Training →' : 'Continue Training →'}
              </button>
            </div>

            {/* Step 2: Video Practice - Always Available */}
            <div 
              style={{
                ...styles.stepCard,
                ...styles.stepCardActive
              }}
              onClick={startVideoAssessment}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{...styles.flexStart, marginBottom: '16px'}}>
                <div style={{
                  ...styles.iconContainer,
                  backgroundColor: '#059669'
                }}>
                  <Camera style={{width: '24px', height: '24px', color: 'white'}} />
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px'}}>
                    Perfect Video Delivery
                  </h3>
                  <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                    Video questions • Timing • Professional presence
                  </p>
                </div>
              </div>
              
              <p style={{color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px'}}>
                Practice video interview format with timing, delivery analysis, 
                and professional presence feedback.
              </p>
              
              <div style={{...styles.alertBox, ...styles.alertGreen}}>
                <p style={{fontSize: '12px', fontWeight: '500', margin: 0}}>✅ Ready for video practice - develop your delivery skills!</p>
              </div>
              
              <button style={{
                ...styles.button,
                ...styles.buttonPrimary,
                width: '100%'
              }}>
                {userProgress.hasCompletedVideo ? 'Practice More Videos →' : 'Start Video Practice →'}
              </button>
            </div>

            {/* Step 3: Advanced Features */}
            <div style={{
              ...styles.stepCard,
              ...(userProgress.hasCompletedVideo ? styles.stepCardActive : styles.stepCardInactive)
            }}>
              <div style={{...styles.flexStart, marginBottom: '16px'}}>
                <div style={{
                  ...styles.iconContainer,
                  backgroundColor: userProgress.hasCompletedVideo ? '#7c3aed' : '#9ca3af'
                }}>
                  <TrendingUp style={{width: '24px', height: '24px', color: 'white'}} />
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px'}}>
                    Advanced Interview Mastery
                  </h3>
                  <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>
                    Case studies • Group exercises • Final interview prep
                  </p>
                </div>
              </div>
              
              <p style={{color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px'}}>
                Master complex case studies, group interview dynamics, 
                and final round preparation with senior bankers.
              </p>
              
              {!userProgress.hasCompletedVideo ? (
                <div style={{...styles.alertBox, ...styles.alertYellow}}>
                  <p style={{fontSize: '12px', fontWeight: '500', margin: '0 0 4px 0'}}>🔒 Unlock Requirements:</p>
                  <p style={{fontSize: '11px', margin: 0}}>
                    Complete video assessment with 75%+ score
                  </p>
                </div>
              ) : (
                <div style={{...styles.alertBox, ...styles.alertGreen}}>
                  <p style={{fontSize: '12px', fontWeight: '500', margin: 0}}>✅ Coming Soon - Advanced features unlocked!</p>
                </div>
              )}
              
              <button 
                style={{
                  ...styles.button,
                  ...(userProgress.hasCompletedVideo ? styles.buttonPrimary : styles.buttonDisabled),
                  width: '100%'
                }}
                disabled={!userProgress.hasCompletedVideo}
              >
                {userProgress.hasCompletedVideo ? 'Access Advanced Features →' : 'Complete Video Practice First'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {userProgress.totalSessions > 0 && (
          <div style={styles.card}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px'}}>Your Progress</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#2563eb'}}>{userProgress.totalSessions}</div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>Sessions Completed</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#059669'}}>{userProgress.contentMastery}%</div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>Best Score</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', fontWeight: '700', color: '#7c3aed'}}>
                  {userProgress.hasCompletedVideo ? '3/3' : userProgress.hasCompletedWritten ? '2/3' : '1/3'}
                </div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>Steps Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // VideoAssessment Component with Fixed Functionality
  const VideoAssessment = () => {
    const [currentPhase, setCurrentPhase] = useState('setup');
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [preparationTimeUsed, setPreparationTimeUsed] = useState(0);
    const [responseTimeUsed, setResponseTimeUsed] = useState(0);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoBlob, setVideoBlob] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recognitionRef, setRecognitionRef] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState('');
    
    const videoRef = useRef(null);
    const playbackRef = useRef(null);
    const currentQuestion = videoAssessmentData.questions[videoAssessmentData.currentIndex];
    const progress = ((videoAssessmentData.currentIndex + 1) / videoAssessmentData.questions.length) * 100;

    // Initialize camera with better error handling and constraints
    const initializeCamera = async () => {
      try {
        setError('');
        
        // Stop any existing streams first
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
          setMediaStream(null);
        }
        
        // Try different constraint options for better compatibility
        const constraints = {
          video: { 
            width: { ideal: 1280, max: 1920 }, 
            height: { ideal: 720, max: 1080 },
            facingMode: 'user',
            frameRate: { ideal: 30, max: 60 }
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: { ideal: 44100 }
          }
        };
        
        console.log('Requesting media access...');
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Media access granted');
        
        setMediaStream(stream);
        
        // Set video source and ensure it plays
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // Prevent feedback
          
          try {
            await videoRef.current.play();
            console.log('Video started playing');
          } catch (playError) {
            console.log('Auto-play prevented, user interaction needed:', playError);
          }
        }
        
        setCameraReady(true);
        setCurrentPhase('preparation');
        setTimeRemaining(30);
        
        // Log stream info for debugging
        console.log('Video tracks:', stream.getVideoTracks().map(t => ({
          label: t.label,
          settings: t.getSettings(),
          constraints: t.getConstraints()
        })));
        console.log('Audio tracks:', stream.getAudioTracks().map(t => ({
          label: t.label,
          settings: t.getSettings(),
          constraints: t.getConstraints()
        })));
        
      } catch (err) {
        let errorMessage = 'Camera access failed. ';
        console.error('Camera initialization error:', err);
        
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera and microphone access in your browser settings and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera or microphone found. Please connect devices and try again.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage += 'Camera settings not supported. Trying with basic settings...';
          
          // Try with more basic constraints
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true
            });
            setMediaStream(basicStream);
            if (videoRef.current) {
              videoRef.current.srcObject = basicStream;
              videoRef.current.muted = true;
              await videoRef.current.play();
            }
            setCameraReady(true);
            setCurrentPhase('preparation');
            setTimeRemaining(30);
            return;
          } catch (basicError) {
            errorMessage += ' Basic settings also failed.';
          }
        } else {
          errorMessage += 'Please check your camera and microphone settings and try again.';
        }
        
        setError(errorMessage);
      }
    };

    // Enhanced Speech Recognition with better error handling
    const startSpeechRecognition = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return;
      }

      try {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        let finalTranscriptAccumulator = '';
        let restartTimeout;
        
        recognition.onstart = () => {
          setIsTranscribing(true);
          console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
          let interimTranscriptBuffer = '';
          let finalTranscriptBuffer = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptBuffer += transcriptSegment + ' ';
            } else {
              interimTranscriptBuffer += transcriptSegment;
            }
          }

          if (finalTranscriptBuffer) {
            finalTranscriptAccumulator += finalTranscriptBuffer;
            setTranscript(finalTranscriptAccumulator);
          }
          
          setInterimTranscript(interimTranscriptBuffer);
        };

        recognition.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
          
          // Handle specific errors gracefully
          if (event.error === 'no-speech') {
            // Don't restart immediately for no-speech, just continue listening
            return;
          } else if (event.error === 'audio-capture') {
            setIsTranscribing(false);
            console.log('Microphone access issues');
          } else if (event.error === 'not-allowed') {
            setIsTranscribing(false);
            console.log('Microphone permission denied');
          } else {
            // For other errors, try to restart after a brief delay
            setIsTranscribing(false);
            if (currentPhase === 'recording') {
              restartTimeout = setTimeout(() => {
                try {
                  recognition.start();
                } catch (err) {
                  console.log('Could not restart speech recognition:', err);
                }
              }, 1000);
            }
          }
        };

        recognition.onend = () => {
          setIsTranscribing(false);
          setInterimTranscript('');
          
          // Auto-restart if still recording and no error occurred
          if (currentPhase === 'recording' && timeRemaining > 5) {
            restartTimeout = setTimeout(() => {
              try {
                recognition.start();
              } catch (err) {
                console.log('Could not restart speech recognition:', err);
              }
            }, 500);
          }
        };

        recognition.start();
        setRecognitionRef(recognition);
        
        // Cleanup timeout on component unmount
        return () => {
          if (restartTimeout) {
            clearTimeout(restartTimeout);
          }
        };
        
      } catch (err) {
        console.error('Speech recognition setup failed:', err);
        setIsTranscribing(false);
      }
    };

    // Timer management
    useEffect(() => {
      let interval;
      
      if (currentPhase === 'preparation' && timeRemaining > 0) {
        interval = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              setCurrentPhase('ready');
              setPreparationTimeUsed(30);
              return 0;
            }
            setPreparationTimeUsed(30 - prev + 1);
            return prev - 1;
          });
        }, 1000);
      } else if (currentPhase === 'recording' && timeRemaining > 0) {
        interval = setInterval(() => {
          setTimeRemaining(prev => {
            const newTime = prev - 1;
            setResponseTimeUsed(120 - newTime);
            if (newTime <= 0) {
              handleStopRecording();
              return 0;
            }
            return newTime;
          });
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [currentPhase, timeRemaining]);

    // Comprehensive cleanup on unmount
    useEffect(() => {
      return () => {
        console.log('Cleaning up video component...');
        
        // Stop media stream
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped track on unmount:', track.kind);
          });
        }
        
        // Stop speech recognition
        if (recognitionRef) {
          try {
            recognitionRef.stop();
            console.log('Stopped speech recognition on unmount');
          } catch (err) {
            console.log('Error stopping recognition on unmount:', err);
          }
        }
        
        // Revoke blob URLs to prevent memory leaks
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
          console.log('Revoked video URL on unmount');
        }
      };
    }, []);

    const handleSkipPreparation = () => {
      setCurrentPhase('ready');
      setPreparationTimeUsed(30 - timeRemaining);
    };

    const handleStartRecording = async () => {
      if (!mediaStream) return;
      
      try {
        // Clear previous recording data
        setRecordedChunks([]);
        setVideoBlob(null);
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
          setVideoUrl(null);
        }
        setTranscript('');
        setInterimTranscript('');
        
        // Setup MediaRecorder with better options
        let options = { mimeType: 'video/webm;codecs=vp9,opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm;codecs=vp8,opus' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = {}; // Use default
            }
          }
        }
        
        const chunks = [];
        const recorder = new MediaRecorder(mediaStream, options);
        
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        recorder.onstop = () => {
          console.log('Recording stopped, creating blob...');
          if (chunks.length > 0) {
            // Create blob with proper type
            const mimeType = options.mimeType || 'video/webm';
            const blob = new Blob(chunks, { type: mimeType });
            setVideoBlob(blob);
            
            // Create URL and set it
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            console.log('Video blob created:', blob.size, 'bytes');
          } else {
            console.log('No chunks recorded');
            setError('Recording failed - no data captured');
          }
          setCurrentPhase('review');
        };
        
        recorder.onerror = (event) => {
          console.error('MediaRecorder error:', event.error);
          setError('Recording failed: ' + event.error);
        };
        
        setMediaRecorder(recorder);
        
        // Start recording with data collection every 100ms for smoother recording
        recorder.start(100);
        setCurrentPhase('recording');
        setTimeRemaining(120);
        setResponseTimeUsed(0);
        
        // Start speech recognition
        startSpeechRecognition();
        
      } catch (err) {
        setError('Recording failed. Please try again.');
        console.error('Recording error:', err);
      }
    };

    const handleStopRecording = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      
      // Stop speech recognition
      if (recognitionRef) {
        recognitionRef.stop();
        setIsTranscribing(false);
        setRecognitionRef(null);
      }
    };

    const handleReRecord = () => {
      // Clean up previous recording properly
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      
      // Stop any ongoing speech recognition
      if (recognitionRef) {
        try {
          recognitionRef.stop();
        } catch (err) {
          console.log('Error stopping recognition:', err);
        }
      }
      
      // Reset all recording state
      setVideoBlob(null);
      setVideoUrl(null);
      setTranscript('');
      setInterimTranscript('');
      setRecordedChunks([]);
      setIsTranscribing(false);
      setRecognitionRef(null);
      setCurrentPhase('ready');
      setTimeRemaining(120);
      setResponseTimeUsed(0);
      setError(''); // Clear any errors
    };

    const handleSubmitVideo = () => {
      const finalPreparationTime = preparationTimeUsed || 30;
      const finalResponseTime = responseTimeUsed || 120;
      
      submitVideoResponse(finalPreparationTime, finalResponseTime, transcript.trim());
      
      // Comprehensive cleanup for next question
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
      }
      if (recognitionRef) {
        try {
          recognitionRef.stop();
        } catch (err) {
          console.log('Error stopping recognition during submit:', err);
        }
      }
      
      // Reset all state for next question
      setCurrentPhase('setup');
      setTimeRemaining(30);
      setPreparationTimeUsed(0);
      setResponseTimeUsed(0);
      setVideoBlob(null);
      setVideoUrl(null);
      setTranscript('');
      setInterimTranscript('');
      setRecordedChunks([]);
      setIsTranscribing(false);
      setRecognitionRef(null);
      setCameraReady(false);
      setMediaStream(null);
      setMediaRecorder(null);
      setError('');
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div style={styles.container}>
        <div style={{...styles.maxWidth, maxWidth: '1000px'}}>
          <div style={styles.card}>
            {/* Header */}
            <div style={{...styles.flexBetween, marginBottom: '24px'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', margin: 0}}>Video Interview Practice</h2>
              <span style={{color: '#6b7280', fontWeight: '500'}}>
                Question {videoAssessmentData.currentIndex + 1} of {videoAssessmentData.questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{...styles.progressBar, marginBottom: '32px'}}>
              <div style={{...styles.progressFill, width: `${progress}%`}} />
            </div>

            {/* Error Display */}
            {error && (
              <div style={{...styles.alertBox, ...styles.alertRed, marginBottom: '24px'}}>
                <p style={{margin: 0, fontWeight: '500'}}>{error}</p>
                <button 
                  onClick={initializeCamera}
                  style={{...styles.button, ...styles.buttonPrimary, marginTop: '8px'}}
                >
                  Try Again
                </button>
              </div>
            )}

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px'}}>
              {/* Video Section */}
              <div>
                {/* Camera/Video Display */}
                <div style={{
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  aspectRatio: '16/9',
                  marginBottom: '24px',
                  border: currentPhase === 'recording' ? '3px solid #dc2626' : '1px solid #374151',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Live Camera Feed */}
                  {(currentPhase !== 'review') && (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  )}
                  
                  {/* Recorded Video Playback */}
                  {currentPhase === 'review' && videoUrl && (
                    <video
                      ref={playbackRef}
                      controls
                      playsInline
                      preload="metadata"
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      src={videoUrl}
                      onLoadedData={() => {
                        console.log('Video loaded successfully');
                        // Ensure video is ready for playback
                        if (playbackRef.current) {
                          playbackRef.current.currentTime = 0;
                        }
                      }}
                      onError={(e) => {
                        console.error('Video playback error:', e);
                        console.error('Video element error:', playbackRef.current?.error);
                      }}
                      onLoadStart={() => console.log('Video load started')}
                      onCanPlay={() => console.log('Video can play')}
                      onCanPlayThrough={() => console.log('Video can play through')}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Video Loading State */}
                  {currentPhase === 'review' && !videoUrl && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <div style={{fontSize: '14px', opacity: 0.7}}>
                        Processing video...
                      </div>
                    </div>
                  )}
                  
                  {/* Setup Overlay */}
                  {currentPhase === 'setup' && !cameraReady && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <Camera style={{width: '48px', height: '48px', marginBottom: '16px', opacity: 0.7}} />
                      <div style={{fontSize: '14px', opacity: 0.7}}>
                        Click "Enable Camera" to begin
                      </div>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {currentPhase === 'recording' && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%', animation: 'pulse 1s infinite'}}></div>
                      REC {formatTime(timeRemaining)}
                    </div>
                  )}

                  {/* Speech Recognition Indicator */}
                  {isTranscribing && currentPhase === 'recording' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🎙️ Listening...
                    </div>
                  )}
                </div>

                {/* Question Display */}
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <div style={{...styles.flexBetween, marginBottom: '16px'}}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: '#2563eb',
                      color: 'white'
                    }}>
                      {currentQuestion?.category === 'whyIB' ? 'Why Investment Banking' : 
                       currentQuestion?.category === 'behavioral' ? 'Behavioral' :
                       currentQuestion?.category === 'markets' ? 'Markets & Current Events' :
                       currentQuestion?.category === 'technical' ? 'Technical' :
                       currentQuestion?.category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div style={{fontSize: '12px', color: '#6b7280'}}>
                      {currentPhase === 'preparation' && `Prep Time: ${formatTime(timeRemaining)}`}
                      {currentPhase === 'ready' && 'Ready to Record'}
                      {currentPhase === 'recording' && `Recording: ${formatTime(timeRemaining)}`}
                      {currentPhase === 'review' && 'Review Your Response'}
                    </div>
                  </div>
                  <p style={{fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0}}>
                    {currentQuestion?.text}
                  </p>
                </div>

                {/* Enhanced Live Transcript During Recording */}
                {(currentPhase === 'recording') && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px'
                  }}>
                    <div style={{...styles.flexBetween, marginBottom: '8px'}}>
                      <h4 style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#374151'}}>
                        🎙️ Live Transcript:
                      </h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {isTranscribing ? (
                          <span style={{fontSize: '12px', color: '#059669', fontWeight: '500'}}>
                            ● Listening...
                          </span>
                        ) : (
                          <span style={{fontSize: '12px', color: '#dc2626', fontWeight: '500'}}>
                            ○ Not listening
                          </span>
                        )}
                        {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? (
                          <span style={{fontSize: '11px', color: '#6b7280'}}>Ready</span>
                        ) : (
                          <span style={{fontSize: '11px', color: '#dc2626'}}>Not supported</span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      minHeight: '80px',
                      maxHeight: '120px',
                      overflowY: 'auto',
                      padding: '12px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}>
                      <p style={{fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: '1.5'}}>
                        {transcript && (
                          <span>{transcript}</span>
                        )}
                        {interimTranscript && (
                          <span style={{opacity: 0.7, fontStyle: 'italic'}}>{interimTranscript}</span>
                        )}
                        {!transcript && !interimTranscript && (
                          <span style={{color: '#9ca3af'}}>
                            Start speaking... your words will appear here
                            {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && 
                             ' (Speech recognition not supported in this browser)'}
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{fontSize: '12px', color: '#6b7280', marginTop: '8px', display: 'flex', justifyContent: 'space-between'}}>
                      <span>Words: {transcript ? transcript.split(/\s+/).filter(word => word.length > 0).length : 0}</span>
                      <span>
                        {!isTranscribing && transcript.length === 0 && (
                          <span style={{color: '#d97706'}}>Try speaking louder or closer to microphone</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Review Section */}
                {currentPhase === 'review' && (
                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{fontSize: '1.125rem', fontWeight: '700', color: '#1e40af', marginBottom: '16px'}}>
                      📹 Review Your Response
                    </h3>
                    
                    {/* Response Stats */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '14px'}}>
                      <div>📊 Response Time: <strong>{responseTimeUsed}s</strong></div>
                      <div>⏱️ Preparation: <strong>{preparationTimeUsed}s</strong></div>
                      <div>💬 Words Spoken: <strong>{transcript ? transcript.split(/\s+/).filter(word => word.length > 0).length : 0}</strong></div>
                      <div>🎯 Timing: <strong>{responseTimeUsed <= 75 ? 'Excellent' : responseTimeUsed <= 120 ? 'Good' : 'Too Long'}</strong></div>
                    </div>

                    {/* Video Controls Note */}
                    <div style={{fontSize: '13px', color: '#4b5563', marginBottom: '16px'}}>
                      💡 Use the video controls above to replay, pause, or skip through your response.
                    </div>

                    {/* Transcript Display */}
                    {transcript && (
                      <div style={{
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '16px'
                      }}>
                        <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                          📝 Your Response Transcript:
                        </h4>
                        <p style={{fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: '1.5'}}>
                          {transcript}
                        </p>
                      </div>
                    )}

                    {!transcript && (
                      <div style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '16px'
                      }}>
                        <p style={{fontSize: '13px', color: '#92400e', margin: 0}}>
                          ⚠️ No transcript available. This may affect content analysis scoring.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap'}}>
                  {currentPhase === 'setup' && (
                    <button
                      onClick={initializeCamera}
                      style={{...styles.button, ...styles.buttonPrimary, fontSize: '16px', padding: '16px 32px'}}
                    >
                      📷 Enable Camera & Microphone
                    </button>
                  )}
                  
                  {currentPhase === 'preparation' && (
                    <>
                      <div style={{textAlign: 'center', width: '100%', marginBottom: '16px'}}>
                        <div style={{fontSize: '14px', color: '#6b7280'}}>
                          Organize your thoughts. You have <strong>{formatTime(timeRemaining)}</strong> remaining.
                        </div>
                      </div>
                      <button
                        onClick={handleSkipPreparation}
                        style={{...styles.button, ...styles.buttonSecondary}}
                      >
                        Skip to Recording
                      </button>
                    </>
                  )}
                  
                  {currentPhase === 'ready' && (
                    <button
                      onClick={handleStartRecording}
                      style={{...styles.button, ...styles.buttonPrimary, fontSize: '16px', padding: '16px 32px'}}
                    >
                      🎥 Start Recording (2 min max)
                    </button>
                  )}
                  
                  {currentPhase === 'recording' && (
                    <button
                      onClick={handleStopRecording}
                      style={{...styles.button, backgroundColor: '#dc2626', color: 'white', fontSize: '16px', padding: '16px 32px'}}
                    >
                      ⏹️ Stop Recording
                    </button>
                  )}
                  
                  {currentPhase === 'review' && (
                    <>
                      <button
                        onClick={handleReRecord}
                        style={{...styles.button, ...styles.buttonSecondary, fontSize: '16px', padding: '12px 24px'}}
                      >
                        🔄 Re-record
                      </button>
                      <button
                        onClick={handleSubmitVideo}
                        style={{...styles.button, ...styles.buttonPrimary, fontSize: '16px', padding: '12px 24px'}}
                      >
                        ✅ Submit & Continue
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Sidebar */}
              <div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{fontWeight: '600', marginBottom: '12px', fontSize: '14px'}}>Progress</h4>
                  {videoAssessmentData.questions.map((q, index) => (
                    <div 
                      key={q.id}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        fontSize: '12px',
                        backgroundColor: index === videoAssessmentData.currentIndex 
                          ? '#eff6ff' 
                          : index < videoAssessmentData.currentIndex
                          ? '#f0fdf4'
                          : 'white',
                        border: `1px solid ${
                          index === videoAssessmentData.currentIndex 
                            ? '#bfdbfe' 
                            : index < videoAssessmentData.currentIndex
                            ? '#bbf7d0'
                            : '#e5e7eb'
                        }`,
                        color: index === videoAssessmentData.currentIndex 
                          ? '#1d4ed8' 
                          : index < videoAssessmentData.currentIndex
                          ? '#166534'
                          : '#6b7280'
                      }}
                    >
                      <div style={{fontWeight: '500'}}>Q{index + 1}: {q.category === 'whyIB' ? 'Why IB' : 
                                                                              q.category === 'behavioral' ? 'Behavioral' :
                                                                              q.category === 'markets' ? 'Markets' :
                                                                              q.category === 'technical' ? 'Technical' :
                                                                              q.category}</div>
                      {index === videoAssessmentData.currentIndex && (
                        <div style={{fontSize: '10px', marginTop: '4px'}}>
                          {currentPhase === 'setup' ? 'Setting up...' :
                           currentPhase === 'preparation' ? 'Preparing...' :
                           currentPhase === 'ready' ? 'Ready to record' :
                           currentPhase === 'recording' ? 'Recording...' :
                           currentPhase === 'review' ? 'Reviewing...' : 'Current'}
                        </div>
                      )}
                      {index < videoAssessmentData.currentIndex && (
                        <div style={{fontSize: '10px', marginTop: '4px', fontWeight: '500'}}>✅ Completed</div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h4 style={{fontWeight: '600', marginBottom: '12px', fontSize: '14px'}}>Video Tips</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.4'}}>
                    <li style={{marginBottom: '8px'}}>Look directly at the camera</li>
                    <li style={{marginBottom: '8px'}}>Speak clearly for transcription</li>
                    <li style={{marginBottom: '8px'}}>Use your full time (60-90s ideal)</li>
                    <li style={{marginBottom: '8px'}}>Review video AND transcript</li>
                    <li>Get both delivery + content scores</li>
                  </ul>
                  <div style={{fontSize: '11px', color: '#6b7280', marginTop: '12px', fontStyle: 'italic'}}>
                    💡 Analysis combines delivery (60%) + content (40%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // VideoResults Component
  const VideoResults = () => {
    const overallScore = Math.round(
      videoAssessmentData.recordings.reduce((sum, rec) => sum + rec.analysis.score, 0) / videoAssessmentData.recordings.length
    );
    const overallGrade = getGrade(overallScore);
    const avgResponseTime = Math.round(
      videoAssessmentData.recordings.reduce((sum, rec) => sum + rec.responseTime, 0) / videoAssessmentData.recordings.length
    );

    return (
      <div style={styles.container}>
        <div style={{...styles.maxWidth, maxWidth: '1200px'}}>
          <div style={styles.card}>
            {/* Header */}
            <div style={{...styles.flexBetween, marginBottom: '32px'}}>
              <div>
                <h2 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '8px'}}>Video Interview Results</h2>
                <p style={{color: '#6b7280', margin: 0}}>Professional delivery and presentation analysis</p>
              </div>
              <div style={{
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{fontSize: '3rem', fontWeight: '700', marginBottom: '8px', color: overallGrade.color}}>
                  {overallGrade.letter}
                </div>
                <div style={{fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', marginBottom: '4px'}}>{overallScore}%</div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>{overallGrade.description}</div>
              </div>
            </div>

            {/* Overall Performance Summary */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', color: '#374151'}}>
                📊 Video Performance Summary
              </h3>
              <div style={{marginBottom: '16px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                <p style={{fontSize: '14px', color: '#1e40af', margin: 0, lineHeight: '1.5'}}>
                  <strong>Scoring Method:</strong> Your overall score combines delivery presentation (60%) and content analysis (40%) when transcript is available. 
                  Delivery focuses on timing, clarity, and professional presence. Content analyzes the substance of your response using the same criteria as written assessments.
                </p>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#2563eb'}}>{avgResponseTime}s</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Avg Response Time</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#059669'}}>
                    {videoAssessmentData.recordings.filter(r => r.analysis.timing.efficiency === 'Excellent').length}
                  </div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Excellent Timing</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#7c3aed'}}>
                    {Math.round(videoAssessmentData.recordings.reduce((sum, r) => sum + r.preparationTime, 0) / videoAssessmentData.recordings.length)}s
                  </div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Avg Prep Time</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#d97706'}}>
                    {videoAssessmentData.recordings.filter(r => r.wordCount > 0).length}
                  </div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>With Transcript</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#059669'}}>
                    {Math.round(videoAssessmentData.recordings.reduce((sum, r) => sum + (r.analysis.deliveryScore || 0), 0) / videoAssessmentData.recordings.length)}%
                  </div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Avg Delivery</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '700', color: '#7c3aed'}}>
                    {videoAssessmentData.recordings.filter(r => r.analysis.contentScore).length > 0 ? 
                     `${Math.round(videoAssessmentData.recordings.filter(r => r.analysis.contentScore).reduce((sum, r) => sum + r.analysis.contentScore, 0) / videoAssessmentData.recordings.filter(r => r.analysis.contentScore).length)}%` : 
                     'N/A'}
                  </div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>Avg Content</div>
                </div>
              </div>
            </div>

            {/* Individual Video Results */}
            <div style={{marginBottom: '32px'}}>
              {videoAssessmentData.questions.map((question, index) => {
                const recording = videoAssessmentData.recordings[index];
                
                return (
                  <div key={question.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '24px',
                    backgroundColor: 'white'
                  }}>
                    {/* Question Header */}
                    <div style={{...styles.flexBetween, marginBottom: '20px'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: '700', fontSize: '1.25rem', marginBottom: '8px', color: '#111827'}}>
                          Video {index + 1}: {question.category === 'whyIB' ? 'Why Investment Banking' : 
                                                    question.category === 'behavioral' ? 'Behavioral' :
                                                    question.category === 'markets' ? 'Markets & Current Events' :
                                                    question.category === 'technical' ? 'Technical' :
                                                    question.category.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div style={{color: '#4b5563', fontStyle: 'italic', marginBottom: '12px', fontSize: '1rem', lineHeight: '1.5'}}>
                          "{question.text}"
                        </div>
                        <div style={{fontSize: '12px', color: '#6b7280', display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                          <span>Response Time: {recording.responseTime}s</span>
                          <span>Prep Time: {recording.preparationTime}s</span>
                          <span>Efficiency: {recording.analysis.timing.efficiency}</span>
                          {recording.wordCount > 0 && <span>Words: {recording.wordCount}</span>}
                          {recording.analysis.contentScore && <span>Content: {recording.analysis.contentScore}%</span>}
                          <span>Delivery: {recording.analysis.deliveryScore}%</span>
                        </div>
                      </div>
                      <div style={{
                        textAlign: 'center',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '20px',
                        marginLeft: '24px',
                        minWidth: '120px'
                      }}>
                        <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '4px', color: recording.analysis.grade.color}}>
                          {recording.analysis.grade.letter}
                        </div>
                        <div style={{fontSize: '14px', color: '#6b7280', fontWeight: '600'}}>{recording.analysis.score}/100</div>
                        <div style={{fontSize: '10px', color: '#9ca3af', marginTop: '4px'}}>{recording.analysis.grade.description}</div>
                      </div>
                    </div>

                    {/* Transcript Display */}
                    {recording.transcript && (
                      <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px'
                      }}>
                        <h5 style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                          📝 Response Transcript:
                        </h5>
                        <p style={{fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: '1.5'}}>
                          {recording.transcript}
                        </p>
                      </div>
                    )}

                    {/* Detailed Scoring Breakdown */}
                    <div style={{marginBottom: '24px'}}>
                      <h5 style={{fontWeight: '600', marginBottom: '16px', color: '#374151', fontSize: '1rem'}}>
                        🎥 Video Analysis Breakdown:
                      </h5>
                      
                      {/* Delivery Scores */}
                      <div style={{marginBottom: '20px'}}>
                        <h6 style={{fontWeight: '600', fontSize: '14px', color: '#2563eb', marginBottom: '12px'}}>
                          📺 Delivery & Presentation ({recording.analysis.deliveryScore}%):
                        </h6>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                          {Object.entries(recording.analysis.deliveryScores).map(([criterion, score], scoreIndex) => (
                            <div key={scoreIndex} style={{
                              backgroundColor: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '12px'
                            }}>
                              <div style={{fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>
                                {criterion}
                              </div>
                              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div style={{fontSize: '18px', fontWeight: '700', color: score >= 80 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'}}>
                                  {Math.round(score)}%
                                </div>
                                <div style={{width: '60px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden'}}>
                                  <div style={{
                                    width: `${score}%`,
                                    height: '100%',
                                    backgroundColor: score >= 80 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'
                                  }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content Scores (if transcript available) */}
                      {recording.analysis.contentScores && Object.keys(recording.analysis.contentScores).length > 0 && (
                        <div>
                          <h6 style={{fontWeight: '600', fontSize: '14px', color: '#059669', marginBottom: '12px'}}>
                            📝 Content & Substance ({recording.analysis.contentScore}%):
                          </h6>
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                            {Object.entries(recording.analysis.contentScores).map(([criterion, score], scoreIndex) => (
                              <div key={scoreIndex} style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '6px',
                                padding: '12px'
                              }}>
                                <div style={{fontSize: '12px', fontWeight: '600', color: '#166534', marginBottom: '4px'}}>
                                  {criterion}
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                  <div style={{fontSize: '18px', fontWeight: '700', color: score >= 80 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'}}>
                                    {Math.round(score)}%
                                  </div>
                                  <div style={{width: '60px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden'}}>
                                    <div style={{
                                      width: `${score}%`,
                                      height: '100%',
                                      backgroundColor: score >= 80 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'
                                    }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No content analysis note */}
                      {(!recording.analysis.contentScores || Object.keys(recording.analysis.contentScores).length === 0) && (
                        <div style={{
                          backgroundColor: '#fefce8',
                          border: '1px solid #fde68a',
                          borderRadius: '6px',
                          padding: '16px'
                        }}>
                          <p style={{fontSize: '14px', color: '#92400e', margin: 0}}>
                            💡 <strong>Note:</strong> Content analysis unavailable - transcript may be too short or unclear. 
                            For full analysis, ensure clear audio and speak for at least 30 seconds.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Content Analysis Results (if available) */}
                    {recording.analysis.contentAnalysis && (
                      <>
                        {/* Content Missing Elements */}
                        {recording.analysis.contentAnalysis.missingElements && recording.analysis.contentAnalysis.missingElements.length > 0 && (
                          <div style={{marginBottom: '20px'}}>
                            <h5 style={{fontWeight: '600', color: '#dc2626', marginBottom: '12px', fontSize: '1rem'}}>
                              ⚠️ Content Missing from Your Response:
                            </h5>
                            <div style={{display: 'grid', gap: '8px'}}>
                              {recording.analysis.contentAnalysis.missingElements.map((element, mIndex) => (
                                <div key={mIndex} style={{
                                  backgroundColor: '#fef2f2',
                                  border: '1px solid #fecaca',
                                  borderRadius: '6px',
                                  padding: '12px',
                                  fontSize: '14px',
                                  color: '#dc2626'
                                }}>
                                  <span style={{fontWeight: '600'}}>•</span> {element}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Content Improvement Suggestions */}
                        {recording.analysis.contentAnalysis.improvements && recording.analysis.contentAnalysis.improvements.length > 0 && (
                          <div style={{marginBottom: '20px'}}>
                            <h5 style={{fontWeight: '600', color: '#d97706', marginBottom: '12px', fontSize: '1rem'}}>
                              📈 Content Improvement Suggestions:
                            </h5>
                            <div style={{display: 'grid', gap: '10px'}}>
                              {recording.analysis.contentAnalysis.improvements.map((improvement, iIndex) => (
                                <div key={iIndex} style={{
                                  backgroundColor: '#fffbeb',
                                  border: '1px solid #fed7aa',
                                  borderRadius: '6px',
                                  padding: '14px',
                                  fontSize: '14px',
                                  color: '#92400e',
                                  lineHeight: '1.5'
                                }}>
                                  <span style={{fontWeight: '700', marginRight: '8px'}}>{iIndex + 1}.</span>
                                  {improvement}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {recording.analysis.strengths && recording.analysis.strengths.length > 0 && (
                      <div style={{marginBottom: '20px'}}>
                        <h5 style={{fontWeight: '600', color: '#059669', marginBottom: '12px', fontSize: '1rem'}}>
                          ✅ Delivery Strengths:
                        </h5>
                        <div style={{display: 'grid', gap: '8px'}}>
                          {recording.analysis.strengths.map((strength, sIndex) => (
                            <div key={sIndex} style={{
                              backgroundColor: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              borderRadius: '6px',
                              padding: '12px',
                              fontSize: '14px',
                              color: '#166534'
                            }}>
                              <span style={{fontWeight: '600'}}>•</span> {strength}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvement Areas */}
                    {recording.analysis.improvements && recording.analysis.improvements.length > 0 && (
                      <div style={{marginBottom: '20px'}}>
                        <h5 style={{fontWeight: '600', color: '#d97706', marginBottom: '12px', fontSize: '1rem'}}>
                          🎯 Areas for Improvement:
                        </h5>
                        <div style={{display: 'grid', gap: '10px'}}>
                          {recording.analysis.improvements.map((improvement, iIndex) => (
                            <div key={iIndex} style={{
                              backgroundColor: '#fffbeb',
                              border: '1px solid #fed7aa',
                              borderRadius: '6px',
                              padding: '14px',
                              fontSize: '14px',
                              color: '#92400e',
                              lineHeight: '1.5'
                            }}>
                              <span style={{fontWeight: '700', marginRight: '8px'}}>{iIndex + 1}.</span>
                              {improvement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Video-Specific Recommendations */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{fontWeight: '700', fontSize: '1.25rem', marginBottom: '16px', color: '#374151'}}>
                🎥 Complete Video Interview Mastery:
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px'}}>
                <div>
                  <h4 style={{fontWeight: '600', fontSize: '14px', color: '#2563eb', marginBottom: '8px'}}>Delivery Excellence:</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.5'}}>
                    <li>Look at camera, not screen</li>
                    <li>Speak 10-15% slower than normal</li>
                    <li>Use natural hand gestures</li>
                    <li>Maintain professional posture</li>
                    <li>Ensure good lighting and audio</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{fontWeight: '600', fontSize: '14px', color: '#059669', marginBottom: '8px'}}>Content Strategy:</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.5'}}>
                    <li>Use STAR method for behavioral questions</li>
                    <li>Include specific numbers and metrics</li>
                    <li>Reference coursework and experiences</li>
                    <li>Practice key stories beforehand</li>
                    <li>Aim for 100-200 words spoken</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{fontWeight: '600', fontSize: '14px', color: '#7c3aed', marginBottom: '8px'}}>Technical Setup:</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.5'}}>
                    <li>Test camera and microphone first</li>
                    <li>Use stable internet connection</li>
                    <li>Choose quiet, professional environment</li>
                    <li>Have backup recording method ready</li>
                    <li>Close other applications</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '16px'}}>
              <button 
                onClick={startVideoAssessment}
                style={{...styles.button, ...styles.buttonPrimary}}
              >
                Practice More Videos
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')}
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Assessment = () => {
    const [currentAnswer, setCurrentAnswer] = useState('');
    const currentQuestion = assessmentData.questions[assessmentData.currentIndex];
    const progress = ((assessmentData.currentIndex + 1) / assessmentData.questions.length) * 100;

    const handleSubmit = () => {
      if (currentAnswer.trim().length < 10) {
        alert('Please provide a more detailed response (at least 10 words).');
        return;
      }
      submitAnswer(currentAnswer);
      setCurrentAnswer('');
    };

    const handleSkip = () => {
      submitAnswer(''); // Submit empty answer
      setCurrentAnswer('');
    };

    return (
      <div style={styles.container}>
        <div style={{...styles.maxWidth, maxWidth: '1000px'}}>
          <div style={styles.card}>
            {/* Header */}
            <div style={{...styles.flexBetween, marginBottom: '24px'}}>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', margin: 0}}>Investment Banking Assessment</h2>
              <span style={{color: '#6b7280', fontWeight: '500'}}>
                Question {assessmentData.currentIndex + 1} of {assessmentData.questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{...styles.progressBar, marginBottom: '32px'}}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`
                }}
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px'}}>
              {/* Question Section */}
              <div>
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <div style={{...styles.flexBetween, marginBottom: '16px'}}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: '#2563eb',
                      color: 'white'
                    }}>
                      {currentQuestion?.category === 'whyIB' ? 'Why Investment Banking' : 
                       currentQuestion?.category === 'behavioral' ? 'Behavioral' :
                       currentQuestion?.category === 'markets' ? 'Markets & Current Events' :
                       currentQuestion?.category === 'technical' ? 'Technical' :
                       currentQuestion?.category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <button 
                      onClick={handleSkip}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <SkipForward style={{width: '16px', height: '16px', marginRight: '4px'}} />
                      Skip
                    </button>
                  </div>
                  <p style={{fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0}}>
                    {currentQuestion?.text}
                  </p>
                </div>

                {/* Answer Input */}
                <div>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Structure your response with specific examples. Include quantitative details where applicable (timelines, team sizes, dollar amounts, percentages)."
                    style={styles.textarea}
                  />
                  
                  <div style={{...styles.flexBetween, marginTop: '16px'}}>
                    <span style={{fontSize: '12px', color: '#6b7280'}}>
                      Words: {currentAnswer.trim().split(/\s+/).filter(word => word.length > 0).length}
                      <span style={{marginLeft: '16px', color: '#9ca3af'}}>Recommended: 100-250 words</span>
                    </span>
                    <button
                      onClick={handleSubmit}
                      disabled={currentAnswer.trim().length < 10}
                      style={{
                        ...styles.button,
                        ...(currentAnswer.trim().length >= 10 ? styles.buttonPrimary : styles.buttonDisabled)
                      }}
                    >
                      {assessmentData.currentIndex === assessmentData.questions.length - 1 
                        ? 'Complete Assessment' 
                        : 'Next Question'
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Sidebar */}
              <div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{fontWeight: '600', marginBottom: '12px', fontSize: '14px'}}>Progress</h4>
                  {assessmentData.questions.map((q, index) => (
                    <div 
                      key={q.id}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        fontSize: '12px',
                        backgroundColor: index === assessmentData.currentIndex 
                          ? '#eff6ff' 
                          : index < assessmentData.currentIndex
                          ? '#f0fdf4'
                          : 'white',
                        border: `1px solid ${
                          index === assessmentData.currentIndex 
                            ? '#bfdbfe' 
                            : index < assessmentData.currentIndex
                            ? '#bbf7d0'
                            : '#e5e7eb'
                        }`,
                        color: index === assessmentData.currentIndex 
                          ? '#1d4ed8' 
                          : index < assessmentData.currentIndex
                          ? '#166534'
                          : '#6b7280'
                      }}
                    >
                      <div style={{fontWeight: '500'}}>Q{index + 1}: {q.category === 'whyIB' ? 'Why IB' : 
                                                                          q.category === 'behavioral' ? 'Behavioral' :
                                                                          q.category === 'markets' ? 'Markets' :
                                                                          q.category === 'technical' ? 'Technical' :
                                                                          q.category}</div>
                      {index === assessmentData.currentIndex && (
                        <div style={{fontSize: '10px', marginTop: '4px'}}>Current Question</div>
                      )}
                      {index < assessmentData.currentIndex && (
                        <div style={{fontSize: '10px', marginTop: '4px', fontWeight: '500'}}>✓ Completed</div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h4 style={{fontWeight: '600', marginBottom: '12px', fontSize: '14px'}}>Tips</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.4'}}>
                    <li style={{marginBottom: '8px'}}>Use the STAR method (Situation, Task, Action, Result)</li>
                    <li style={{marginBottom: '8px'}}>Include specific numbers and metrics</li>
                    <li style={{marginBottom: '8px'}}>Show leadership and ownership</li>
                    <li>Connect to business impact</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Results Component with detailed analysis
  const Results = () => {
    const overallScore = Math.round(
      assessmentData.answers.reduce((sum, ans) => sum + ans.analysis.score, 0) / assessmentData.answers.length
    );
    const overallGrade = getGrade(overallScore);

    return (
      <div style={styles.container}>
        <div style={{...styles.maxWidth, maxWidth: '1200px'}}>
          <div style={styles.card}>
            {/* Header */}
            <div style={{...styles.flexBetween, marginBottom: '32px'}}>
              <div>
                <h2 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '8px'}}>Detailed Assessment Results</h2>
                <p style={{color: '#6b7280', margin: 0}}>Comprehensive analysis with specific improvement guidance</p>
              </div>
              <div style={{
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{fontSize: '3rem', fontWeight: '700', marginBottom: '8px', color: overallGrade.color}}>
                  {overallGrade.letter}
                </div>
                <div style={{fontSize: '1.25rem', fontWeight: '600', color: '#2563eb', marginBottom: '4px'}}>{overallScore}%</div>
                <div style={{fontSize: '12px', color: '#6b7280'}}>{overallGrade.description}</div>
              </div>
            </div>

            {/* Question Results */}
            <div style={{marginBottom: '32px'}}>
              {assessmentData.questions.map((question, index) => {
                const answer = assessmentData.answers[index];
                const modelAnswer = answer?.analysis?.modelAnswer;
                
                return (
                  <div key={question.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '32px',
                    backgroundColor: 'white'
                  }}>
                    {/* Question Header */}
                    <div style={{...styles.flexBetween, marginBottom: '20px'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: '700', fontSize: '1.25rem', marginBottom: '8px', color: '#111827'}}>
                          Question {index + 1}: {question.category === 'whyIB' ? 'Why Investment Banking' : 
                                                  question.category === 'behavioral' ? 'Behavioral' :
                                                  question.category === 'markets' ? 'Markets & Current Events' :
                                                  question.category === 'technical' ? 'Technical' :
                                                  question.category.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div style={{color: '#4b5563', fontStyle: 'italic', marginBottom: '12px', fontSize: '1rem', lineHeight: '1.5'}}>
                          "{question.text}"
                        </div>
                        {answer && (
                          <div style={{fontSize: '12px', color: '#6b7280'}}>
                            Your Response: {answer.analysis.wordCount} words
                          </div>
                        )}
                      </div>
                      {answer && (
                        <div style={{
                          textAlign: 'center',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          padding: '20px',
                          marginLeft: '24px',
                          minWidth: '120px'
                        }}>
                          <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '4px', color: answer.analysis.grade.color}}>
                            {answer.analysis.grade.letter}
                          </div>
                          <div style={{fontSize: '14px', color: '#6b7280', fontWeight: '600'}}>{answer.analysis.score}/100</div>
                          <div style={{fontSize: '10px', color: '#9ca3af', marginTop: '4px'}}>{answer.analysis.grade.description}</div>
                        </div>
                      )}
                    </div>

                    {answer ? (
                      <>
                        {/* Detailed Scoring Breakdown */}
                        {answer.analysis.scores && (
                          <div style={{marginBottom: '24px'}}>
                            <h5 style={{fontWeight: '600', marginBottom: '16px', color: '#374151', fontSize: '1rem'}}>
                              📊 Detailed Scoring Breakdown:
                            </h5>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                              {Object.entries(answer.analysis.scores).map(([criterion, score], scoreIndex) => (
                                <div key={scoreIndex} style={{
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '12px'
                                }}>
                                  <div style={{fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>
                                    {criterion}
                                  </div>
                                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div style={{fontSize: '18px', fontWeight: '700', color: score >= 80 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'}}>
                                      {Math.round(score)}%
                                    </div>
                                    <div style={{width: '60px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden'}}>
                                      <div style={{
                                        width: `${score}%`,
                                        height: '100%',
                                        backgroundColor: score >= 80 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'
                                      }} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strengths */}
                        {answer.analysis.strengths && answer.analysis.strengths.length > 0 && (
                          <div style={{marginBottom: '20px'}}>
                            <h5 style={{fontWeight: '600', color: '#059669', marginBottom: '12px', fontSize: '1rem'}}>
                              ✅ Strengths Identified:
                            </h5>
                            <div style={{display: 'grid', gap: '8px'}}>
                              {answer.analysis.strengths.map((strength, sIndex) => (
                                <div key={sIndex} style={{
                                  backgroundColor: '#f0fdf4',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '6px',
                                  padding: '12px',
                                  fontSize: '14px',
                                  color: '#166534'
                                }}>
                                  <span style={{fontWeight: '600'}}>•</span> {strength}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Model Answer with Breakdown - ALWAYS SHOW FOR EVERY QUESTION */}
                        <div style={{marginBottom: '24px'}}>
                          <h5 style={{fontWeight: '600', color: '#059669', marginBottom: '12px', fontSize: '1rem'}}>
                            🏆 Model Response (100/100):
                          </h5>
                          <div style={{...styles.alertBox, ...styles.alertGreen, marginBottom: '16px'}}>
                            <p style={{fontStyle: 'italic', margin: '0 0 12px 0', lineHeight: '1.6'}}>"{modelAnswer?.answer || 'Model answer not available for this specific question.'}"</p>
                          </div>
                          
                          {modelAnswer?.breakdown && (
                            <div>
                              <h6 style={{fontWeight: '600', fontSize: '14px', color: '#374151', marginBottom: '12px'}}>
                                Why This Answer Scores 100/100:
                              </h6>
                              <div style={{display: 'grid', gap: '8px'}}>
                                {Object.entries(modelAnswer.breakdown).map(([aspect, explanation], bIndex) => (
                                  <div key={bIndex} style={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    padding: '12px'
                                  }}>
                                    <div style={{fontWeight: '600', fontSize: '12px', color: '#374151', marginBottom: '4px', textTransform: 'capitalize'}}>
                                      {aspect.replace(/([A-Z])/g, ' $1').trim()}:
                                    </div>
                                    <div style={{fontSize: '12px', color: '#4b5563', lineHeight: '1.4'}}>
                                      {explanation}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Missing Elements */}
                        {answer.analysis.missingElements && answer.analysis.missingElements.length > 0 && (
                          <div style={{marginBottom: '20px'}}>
                            <h5 style={{fontWeight: '600', color: '#dc2626', marginBottom: '12px', fontSize: '1rem'}}>
                              ⚠️ Key Elements Missing from Your Response:
                            </h5>
                            <div style={{display: 'grid', gap: '8px'}}>
                              {answer.analysis.missingElements.map((element, mIndex) => (
                                <div key={mIndex} style={{
                                  backgroundColor: '#fef2f2',
                                  border: '1px solid #fecaca',
                                  borderRadius: '6px',
                                  padding: '12px',
                                  fontSize: '14px',
                                  color: '#dc2626'
                                }}>
                                  <span style={{fontWeight: '600'}}>•</span> {element}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Specific Improvement Feedback */}
                        {answer.analysis.feedback && answer.analysis.feedback.length > 0 && (
                          <div style={{marginBottom: '20px'}}>
                            <h5 style={{fontWeight: '600', color: '#d97706', marginBottom: '12px', fontSize: '1rem'}}>
                              🎯 Specific Improvements for Next Time:
                            </h5>
                            <div style={{display: 'grid', gap: '10px'}}>
                              {answer.analysis.feedback.map((feedback, fbIndex) => (
                                <div key={fbIndex} style={{
                                  backgroundColor: '#fffbeb',
                                  border: '1px solid #fed7aa',
                                  borderRadius: '6px',
                                  padding: '14px',
                                  fontSize: '14px',
                                  color: '#92400e',
                                  lineHeight: '1.5'
                                }}>
                                  <span style={{fontWeight: '700', marginRight: '8px'}}>{fbIndex + 1}.</span>
                                  {feedback}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </>
                    ) : (
                      <div style={{color: '#6b7280', fontStyle: 'italic', padding: '20px', textAlign: 'center'}}>
                        This question was skipped - consider practicing it to build comprehensive interview skills
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall Recommendations */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{fontWeight: '700', fontSize: '1.25rem', marginBottom: '16px', color: '#374151'}}>
                📈 Overall Recommendations for Interview Success:
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px'}}>
                <div>
                  <h4 style={{fontWeight: '600', fontSize: '14px', color: '#2563eb', marginBottom: '8px'}}>Priority Focus Areas:</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.5'}}>
                    <li>Practice the STAR method for all behavioral questions</li>
                    <li>Memorize 3-5 recent deals you can reference in any interview</li>
                    <li>Prepare specific examples with quantified outcomes</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{fontWeight: '600', fontSize: '14px', color: '#059669', marginBottom: '8px'}}>Next Steps:</h4>
                  <ul style={{fontSize: '12px', color: '#4b5563', margin: 0, paddingLeft: '16px', lineHeight: '1.5'}}>
                    <li>Practice answers to 2-3 questions per day</li>
                    <li>Research recent transactions in your target industry</li>
                    <li>Record yourself answering questions to improve delivery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '16px'}}>
              <button 
                onClick={startAssessment}
                style={{...styles.button, ...styles.buttonPrimary}}
              >
                Practice More Questions
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')}
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main App Render
  switch (currentView) {
    case 'assessment':
      return <Assessment />;
    case 'results':
      return <Results />;
    case 'videoAssessment':
      return <VideoAssessment />;
    case 'videoResults':
      return <VideoResults />;
    default:
      return <Dashboard />;
  }
};

export default InvestmentBankingInterviewApp;

