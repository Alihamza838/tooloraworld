# scripts/build_utils_json.py
import sys, re, json

def count_words(text):
    return len(re.findall(r"\b\w+\b", text))

RICH_UTILS = {}

def reg(k, s1, s2, s3):
    RICH_UTILS[k] = [s1, s2, s3]

# 1. UnitConverterGuide.ts
reg(
    'UnitConverterGuide.ts',
    {
        'id': 'si-metric-imperial-conversion-physics',
        'heading': 'Metrology Standards & Unit Dimensional Analysis: SI Metric, US Customary & Imperial',
        'content': """Scientific metrology and physical unit conversion are governed by rigorous international standards established by the General Conference on Weights and Measures (CGPM) under the International System of Units (SI). Converting physical quantities accurately requires strict dimensional analysis rather than naive ratio multiplication.

1. Fundamental Base Dimensions & Derived Units: Metrological systems define seven base physical dimensions: length (meter, m), mass (kilogram, kg), time (second, s), electric current (ampere, A), thermodynamic temperature (kelvin, K), amount of substance (mole, mol), and luminous intensity (candela, cd). All physical quantities—from mechanical force ($1\text{ N} = 1\text{ kg}\cdot\text{m/s}^2$) to electrical pressure ($1\text{ V} = 1\text{ W/A}$)—derive mathematically from these core dimensional bases.
2. Exact Statutory Conversion Definitions: The historical discrepancy between British Imperial and US Customary systems was resolved by the 1959 International Yard and Pound Agreement, which legally defined:
   * Exactly $1\text{ inch} = 25.4\text{ millimeters}$.
   * Exactly $1\text{ avoirdupois pound} = 0.45359237\text{ kilograms}$.
3. Temperature Scale Affine Offsets: Unlike linear multipliers (length, mass), temperature conversions require affine coordinate shifts:
   $$T_{(^\circ\text{C})} = (T_{(^\circ\text{F})} - 32) \times \frac{5}{9} \quad \text{and} \quad T_{(\text{K})} = T_{(^\circ\text{C})} + 273.15$$"""
    },
    {
        'id': 'floating-point-rounding-and-error-propagation',
        'heading': 'Computational Precision: IEEE 754 Floating-Point Traps & Arbitrary Precision Math',
        'content': """Executing scientific conversions inside client-side JavaScript environments requires mitigating binary floating-point representation traps:

* The IEEE 754 Binary Floating-Point Pitfall: Modern computer hardware represents floating-point numbers using binary fractions (base-2). Decimal numbers with finite representations in base-10 (such as 0.1 or 0.2) become infinite repeating fractions in binary. A naive evaluation of 0.1 + 0.2 yields 0.30000000000000004. In high-precision chemistry, aerospace, and finance, compounding these rounding errors causes catastrophic system failures.
* Arbitrary-Precision Decimal Calculation: Toolora's calculation engine parses input numbers into structured decimal mantissas and integer exponents, performing conversions using fixed-point arithmetic or arbitrary-precision libraries before formatting output strings.
* Significant Figures & Uncertainty Propagation: When converting measurements, the output must not imply greater precision than the input instrument. Toolora enables scientific notation and significant-figure preservation toggles.
* Total Client-Side Confidentiality: Proprietary chemical formulas, aerospace engineering dimensions, and confidential manufacturing specifications are calculated 100% locally in browser memory with zero network exposure."""
    },
    {
        'id': 'unit-converter-categories-and-instant-swapping',
        'heading': 'Comprehensive Unit Taxonomy: Pressure, Energy, Velocity & Instant Bidirectional Swapping',
        'content': """Versatile conversion coverage across common scientific and commercial measurement domains:

1. Expansive Measurement Domains:
   * Pressure & Vacuum: Pascal (Pa), Bar, PSI (lbf/in²), Atmosphere (atm), Torr / mmHg.
   * Energy, Work & Heat: Joules (J), Kilowatt-hours (kWh), British Thermal Units (BTU), Calories.
   * Volume & Fluid Capacity: Liters, Gallons (US Liquid vs Imperial UK), Cubic Meters, Fluid Ounces.
   * Speed & Velocity: Meters per second (m/s), Kilometers per hour (km/h), Miles per hour (mph), Knots.
2. Instant Bidirectional Swapping & Real-Time Keypress Evaluation: As you type into either the source or target input fields, Toolora recalculates the paired dimension instantaneously with zero calculation lag.
3. One-Click Clipboard Copying: Copy clean, formatted numeric results complete with standardized scientific unit abbreviations.
4. Sovereign Local Security: Compute proprietary trade measurements and engineering formulas safely within your browser's private memory sandbox."""
    }
)

# 2. UnitConverterMetricImperialGuide.ts
reg(
    'UnitConverterMetricImperialGuide.ts',
    {
        'id': 'engineering-thermodynamics-and-fluid-dynamics',
        'heading': 'Advanced Engineering Metrology: Thermodynamics, Viscosity, Stress & Torque',
        'content': """Mechanical, chemical, civil, and aerospace engineers constantly work across international project consortia where technical drawings and computational fluid dynamic (CFD) models transition between metric and US customary units. Errors in engineering unit conversion have historically caused monumental structural failures—most famously the 1999 loss of NASA's Mars Climate Orbiter due to an uncoordinated pound-force to newton conversion error.

1. Mechanical Stress, Strain & Modulus of Elasticity:
   * Megapascals ($1\text{ MPa} = 1\text{ N/mm}^2$) to Pounds per Square Inch ($1\text{ MPa} \approx 145.038\text{ PSI}$).
   * Gigapascals (GPa) for Young's Modulus in civil structural steel sizing.
2. Dynamic & Kinematic Viscosity in Fluid Mechanics:
   * Dynamic Viscosity: Centipoise (cP) to Pascal-seconds ($1\text{ cP} = 10^{-3}\text{ Pa}\cdot\text{s}$).
   * Kinematic Viscosity: Centistokes (cSt) to Square Meters per Second ($1\text{ cSt} = 10^{-6}\text{ m}^2/\text{s}$).
3. Mechanical Torque & Rotational Work: Newton-meters ($\text{N}\cdot\text{m}$) to Foot-pounds ($\text{ft}\cdot\text{lbf}$), critical for aerospace fastener tensioning and powertrain calibration."""
    },
    {
        'id': 'precision-tolerancing-and-dimensional-integrity',
        'heading': 'GD&T Tolerancing: ASME Y14.5, ISO 1101 & Micro-Inch Machining Accuracy',
        'content': """Preserving precision tolerances during CAD model export and precision CNC manufacturing:

* Micro-Inch to Micrometer Dimensional Tolerancing: In aerospace bearing and semiconductor manufacturing, tolerances are specified in micro-inches ($1\ \mu\text{in} = 0.000001\text{ in}$) or micrometers ($1\ \mu\text{m} = 0.001\text{ mm}$). Converting an engineered fit (H7/g6) between ISO and ANSI systems without exact sub-micron rounding results in binding bearings or loose shaft vibrations.
* Thermal Expansion Metric Normalization: Materials expand under temperature changes ($\Delta L = \alpha L_0 \Delta T$). Toolora's scientific engine allows mechanical engineers to evaluate thermal expansion coefficients across metric ($1/\text{K}$) and imperial ($1/^\circ\text{F}$) scales accurately.
* Structural Beam Load Conversion: Convert distributed line loads ($\text{kN/m}$ to $\text{lbf/ft}$) for structural civil engineering analysis.
* Sovereign Protection for Proprietary CAD Data: Confidential patent specifications, military-grade aerospace tolerances, and proprietary mechanical designs are calculated 100% locally in browser RAM with zero external cloud exposure."""
    },
    {
        'id': 'engineering-conversion-verification-and-workflows',
        'heading': 'Pre-Manufacturing QA: Dual-Unit Dimensioning Verification & High-Precision Calibration',
        'content': """Eliminating costly manufacturing re-runs through rigorous engineering checks:

1. Dual-Unit Drawing Verification: When preparing mechanical assembly drawings with dual dimensioning (metric primary with imperial secondary in brackets), verify converted values against standard ISO/ASME rounding rules to prevent machining discrepancies.
2. Electrical Power and Heat Dissipation: Convert electrical watts to BTU/hr ($1\text{ W} \approx 3.412142\text{ BTU/hr}$) to size HVAC air conditioning and thermal heatsinks for server racks.
3. High-Throughput Rapid Calculation: Switch between complex engineering metrics in seconds with keyboard shortcuts and instant clipboard synchronization.
4. Aerodynamic & Hydraulic Flow Rate Translation: Convert cubic feet per minute (CFM) to liters per second (L/s) or cubic meters per hour ($m^3/h$) when sizing commercial ventilation ducts, hydraulic pumps, and industrial piping networks.
5. Finite Element Analysis (FEA) Pre-Processing: Normalize geometric meshes and boundary conditions across international simulation software suites without unit mismatch errors.
6. Total Sovereign Privacy: Keep your proprietary engineering equations, military contract drawings, and commercial manufacturing specifications completely secure in your private browser memory without external network exposure."""
    }
)

# 3. CurrencyConverterGuide.ts
reg(
    'CurrencyConverterGuide.ts',
    {
        'id': 'forex-market-mechanics-and-interbank-liquidity',
        'heading': 'Forex Market Structure: Interbank Rates, Bid-Ask Spreads & Central Bank Benchmarks',
        'content': """The global foreign exchange (Forex or FX) market is the largest and most liquid financial market in the world, facilitating over $7.5 trillion in daily trading volume. Unlike equities or commodity exchanges, the FX market operates without a centralized physical trading floor, functioning instead as a decentralized Over-The-Counter (OTC) network of international banks, institutional market makers, and sovereign central reserves.

1. The True Anatomy of the Mid-Market Rate: The mid-market exchange rate (also known as the interbank spot rate) represents the exact mathematical midpoint between wholesale buy (bid) and sell (ask) prices established by tier-one multinational financial institutions. Wholesale interbank spreads for major currency pairs (such as EUR/USD or USD/JPY) fluctuate by mere fractions of a basis point (pips).
2. The Retail Bank Markup Discrepancy: When individual consumers or small businesses convert currencies through retail commercial banks, wire services, or credit card networks, financial intermediaries rarely offer the true mid-market rate. Instead, retail institutions silently append hidden markups ranging between 1.5% and 4.5% onto the spread, pocketing substantial trading margins while advertising misleading 'zero fee' promotions.
3. Sovereign Benchmark Aggregation: Toolora aggregates live currency pricing directly against official central bank publication schedules—including the European Central Bank (ECB), US Federal Reserve, Bank of England (BoE), and Bank of Japan (BoJ)—providing transparent rate baselines for global commerce."""
    },
    {
        'id': 'triangular-cross-rate-matrix-calculation',
        'heading': 'Triangular Arbitrage & Cross-Rate Computation Matrix: Algorithmic Rate Precision',
        'content': """Calculating cross-currency rates across non-dollar pairs requires precise algorithmic triangular modeling:

* Direct vs Indirect Currency Quotations: Direct quotations express the cost of one unit of foreign currency in domestic currency terms (e.g., $1.08 USD per 1 EUR). Indirect quotations represent the number of foreign currency units required to purchase one unit of domestic currency (e.g., 152.40 JPY per 1 USD).
* Algorithmic Triangular Cross-Rate Synthesis: While global trading volume is concentrated in the US Dollar (USD), real-world commerce frequently requires conversions between minor or exotic currency pairs (e.g., converting Swiss Francs to New Zealand Dollars, CHF/NZD). Toolora's calculation engine applies triangular matrix mathematics:
  $$\text{Rate}_{\text{CHF/NZD}} = \frac{\text{Rate}_{\text{USD/NZD}}}{\text{Rate}_{\text{USD/CHF}}}$$
* Eliminating Synthetic Compounded Slippage: In naive retail banking, converting between two non-reserve currencies incurs two distinct retail conversion penalties. Toolora's mathematical synthesis delivers pure mid-market benchmark parity.
* Protecting Financial Confidentiality in Browser RAM: Exchanging large corporate wire amounts or budgeting private personal net worth transactions carries significant privacy risks when exposed to predatory financial tracker cookies. Toolora executes all currency calculations locally in browser memory with zero tracking."""
    },
    {
        'id': 'offline-caching-and-multi-currency-budgeting',
        'heading': 'Global Travel & Remote Enterprise: Offline Rate Caching, Bi-Directional Swapping & Invoicing',
        'content': """Empowering digital nomads, international travelers, and cross-border businesses with instant currency intelligence:

1. Offline Travel Rate Persistence: When traveling internationally without expensive roaming cellular data or in-flight Wi-Fi, Toolora automatically retains the most recent synchronized forex rates in client-side localStorage. Travelers can instantly calculate street market purchases, taxi fares, and hotel bills in remote regions without network access.
2. Instant Bi-Directional Keyboard Swapping: Toggle base and quote currencies instantaneously with a single click or keyboard shortcut, recalculating complex fractional values in milliseconds.
3. Multi-Currency Freelance Invoicing Alignment: International contractors billing clients in foreign currencies can copy certified spot rates directly into invoices, establishing clear payment expectations and audit trails for annual tax reconciliation.
4. Sovereign Local Security: Protect your proprietary business revenues, personal travel budgets, and international wire calculations safely within your browser's private memory sandbox."""
    }
)

# 4. CurrencyConverterTravelFinanceGuide.ts
reg(
    'CurrencyConverterTravelFinanceGuide.ts',
    {
        'id': 'retail-bank-forex-markups-and-spreads',
        'heading': 'Exposing Hidden Banking Costs: Foreign Transaction Fees, Spreads & Retail Markups',
        'content': """Navigating global finance requires unmasking the opaque fees and markup spreads charged by international commercial banks, credit card payment networks, and money transfer operators. When spending or remitting capital across national borders, hidden costs frequently erode significant portions of your transaction value.

1. The Three Layers of International Card Transaction Costs:
   * Network Exchange Markup: Visa and Mastercard publish daily wholesale currency exchange rates that sit within 0.2% to 0.5% of the interbank mid-market rate.
   * Issuing Bank Foreign Transaction Surcharge: Most domestic retail bank credit and debit cards slap an arbitrary 1% to 3% 'foreign transaction fee' on every single transaction processed outside the cardholder's home country.
   * Intermediary Wire Transfer Deductions: SWIFT wire transfers between international accounts regularly pass through correspondent intermediary banks, with each banking node shaving off an unannounced $15 to $30 handling fee.
2. Airport Currency Exchange Kiosks: Airport kiosks, train station exchange booths, and tourist hotels capitalize on traveler vulnerability by inflating retail spreads by 8% to 15% above the true mid-market rate, compounding the markup with flat administrative commissions."""
    },
    {
        'id': 'dynamic-currency-conversion-dcc-scams',
        'heading': 'The Dynamic Currency Conversion (DCC) Trap: ATM & Point-of-Sale Exploitation',
        'content': """Protecting your bank account against the most prevalent point-of-sale financial trap in international travel:

* How Dynamic Currency Conversion (DCC) Operates: When paying for dinner in Rome or withdrawing Japanese Yen from an ATM in Tokyo, modern point-of-sale (POS) terminals detect foreign cards and present a deceptive prompt: *'Would you like to be billed in your home currency ($ USD) or the local merchant currency (€ EUR / ¥ JPY)?'*
* The Predatory Math of DCC: The terminal frames paying in your home currency as a helpful convenience. In reality, agreeing to DCC authorizes the foreign merchant's payment processor to apply an exorbitant proprietary exchange rate marked up by 5% to 10% above the interbank spot rate. Furthermore, your domestic credit card may still charge a foreign transaction fee because the merchant's merchant ID originates overseas.
* The Golden Rule of International Card Spending: ALWAYS choose to be charged in the LOCAL foreign currency. Your domestic card issuer will convert the funds using wholesale network rates that are dramatically more favorable than merchant POS terminal markups.
* Complete Privacy for Financial Audits: Keep your personal banking statements, wire calculations, and overseas business budgets completely private with Toolora's zero-cloud local conversion engine."""
    },
    {
        'id': 'freelance-international-hedging-and-wire-reconciliation',
        'heading': 'Cross-Border Freelancing & Remote Work: Currency Hedging, Spot Contracts & Tax Prep',
        'content': """Operational strategies for global agencies, digital nomads, and overseas independent contractors:

1. Setting Clear Settlement Currencies in Client Master Services Agreements: Protect consulting revenues against localized currency depreciation by contractually stipulating hard settlement currencies (USD, EUR, GBP) or anchoring contracts to formal mid-market spot rate bands.
2. Reconciling Value-Added Tax (VAT) and Gross Foreign Income: Tax authorities (such as the IRS, HMRC, and CRA) mandate that foreign currency income be translated into domestic currency at the exact historical exchange rate on the date funds were constructively received. Toolora provides transparent historical spot rate benchmarks for seamless Schedule C and corporate accounting audits.
3. Real-Time Multi-Pair Rate Comparison: Effortlessly benchmark conversion rates across global banking platforms to choose the most cost-effective remittance corridor.
4. Total Sovereign Data Privacy: Calculate your business revenues, contractor payouts, and corporate wire allocations entirely within client-side browser memory with zero risk of third-party financial tracking."""
    }
)

# 5. TextToolsGuide.ts
reg(
    'TextToolsGuide.ts',
    {
        'id': 'unicode-metrics-and-grapheme-clusters',
        'heading': 'Unicode Computational Linguistics: Grapheme Clusters, UTF-8 Encoding & Word Counts',
        'content': """Text parsing and string manipulation in modern web applications require a sophisticated understanding of character encoding architectures, Unicode standards, and computational linguistics. Primitive string length properties in programming languages frequently miscalculate human-readable text due to variable-length character representations.

1. Grapheme Clusters vs UTF-16 Code Units: In JavaScript, standard string length methods (.length) count 16-bit code units rather than visual characters. Common emojis, modifier symbols, and non-Latin alphabets are composed of multiple surrogate pairs and zero-width joiners. For example, the technologist emoji '👩‍💻' consists of five distinct UTF-16 code units (woman + zero-width joiner + computer). A naive character counter reports a length of 5. Toolora utilizes the native internationalization standard Intl.Segmenter to compute authentic human-perceived grapheme clusters accurately.
2. Word Boundary Detection Across International Scripts: While Latin-based languages rely on whitespace and punctuation to delimit word boundaries, East Asian scripts (such as Japanese, Chinese, and Thai) write sentences continuously without spaces. Toolora implements locale-sensitive tokenization algorithms to measure true word counts across global languages.
3. Typographic Metrics & Reading Time Estimation: Calculates precise word, sentence, paragraph, and character metrics alongside standard reading speed formulas (200 words per minute for silent adult reading)."""
    },
    {
        'id': 'text-cleaning-deduplication-and-slugification',
        'heading': 'Data Sanitization & SEO Architecture: Line Deduplication, Whitespace Normalization & Slugs',
        'content': """Transforming messy, unformatted text into production-ready data assets and search-optimized web paths:

* Whitespace Normalization & Line Deduplication: When cleaning email marketing contact lists, server log files, or database exports, duplicate entries and inconsistent indentation degrade data hygiene. Toolora's text engine parses lines, strips trailing whitespaces, collapses redundant carriage returns, and deduplicates records in a single click with $O(N)$ hash-set efficiency.
* Algorithmic URL Slug Generation (Slugification): Search engines mandate clean, crawlable, and semantic URL paths. Toolora transforms raw article titles and product names into clean kebab-cased slugs (e.g., '10 Essential Tips for Web Performance!' -> '10-essential-tips-for-web-performance') by stripping non-alphanumeric punctuation, transliterating international diacritics (accents), and collapsing consecutive hyphens.
* Text Diff Engine & Myers Shortest-Path Algorithm: Compare two versions of a document side-by-side. Toolora's visual diff engine highlights added, deleted, and modified tokens in real time, making code review and editorial proofreading effortless.
* Total Confidentiality for Draft Manuscripts: Authors, journalists, and corporate copywriters can sanitize draft articles, book manuscripts, and confidential press releases locally in browser memory with zero third-party tracking."""
    },
    {
        'id': 'text-case-transmutation-and-developer-utilities',
        'heading': 'Developer & Editorial Workflows: Case Transmutation, JSON Formatting & Instant Clipboard Sync',
        'content': """Versatile text transformations tailored for software developers, content creators, and digital marketers:

1. Universal Case Conversion Profiles:
   * UPPERCASE & lowercase: Rapidly standardize headlines, legal terms, or database queries.
   * Title Case: Formats headlines, book chapters, and blog titles according to formal AP Stylebook and Chicago Manual of Style guidelines.
   * Sentence case: Capitalizes the first letter of each sentence, correcting accidental Caps Lock entries automatically.
2. Instant Real-Time Transformation: All metrics and transformations update instantaneously as you type or paste into the master editor.
3. One-Click Copy to Clipboard: Copy sanitized strings or transformed outputs directly back into your code editor or content management system.
4. Total Sovereign Privacy: Cleanse sensitive customer email lists, proprietary source code, and private creative writing safely in your device's browser memory without external server exposure."""
    }
)

# 6. TextToolsCaseFormatterGuide.ts
reg(
    'TextToolsCaseFormatterGuide.ts',
    {
        'id': 'programming-naming-conventions-taxonomy',
        'heading': 'Software Architecture Taxonomy: camelCase, PascalCase, snake_case, kebab-case & SCREAMING_SNAKE',
        'content': """In professional software engineering, strict adherence to naming conventions is essential for codebase maintainability, clean architecture, and framework interoperability. Different programming languages, database engines, and serialization protocols enforce specific casing standards.

1. Universal Programming Casing Profiles:
   * camelCase: The standard in JavaScript, TypeScript, Swift, and Java for variable names, object properties, and function declarations (e.g., getUserProfile).
   * PascalCase (UpperCamelCase): Mandated in React and Vue for UI components (e.g., UserProfileCard), in C# for public methods, and across TypeScript for class definitions and type interfaces.
   * snake_case: The standard in Python (PEP 8), Ruby, and SQL relational database column names (e.g., user_account_id).
   * kebab-case (dash-case): Mandatory in CSS class names, HTML attributes, and RESTful web URL slugs (e.g., /user-profile-settings).
   * CONSTANT_CASE (SCREAMING_SNAKE_CASE): The universal standard across all programming languages for global constants, environment variables, and cryptographic keys (e.g., MAX_RETRY_ATTEMPTS)."""
    },
    {
        'id': 'cross-stack-serialization-and-orm-mapping',
        'heading': 'Cross-Stack Serialization: Bridging Python/SQL snake_case to JavaScript camelCase',
        'content': """Solving naming impedance mismatches in modern full-stack application development:

* The Full-Stack Impedance Mismatch: A typical enterprise application queries a PostgreSQL database storing columns in snake_case (e.g., billing_address_line1), transmits records through a Python backend, and delivers JSON payloads to a React frontend expecting camelCase (e.g., billingAddressLine1). Manually renaming dozens of database fields introduces typos, bugs, and maintenance overhead across agile development sprints.
* Automated Model & Type Generator Workflows: Toolora allows developers to paste database schema declarations, SQL dumps, GraphQL schemas, or raw JSON keys and instantly convert them into strongly-typed TypeScript interfaces or Python Pydantic models in seconds.
* CSS to CSS-in-JS Transpilation: Convert legacy CSS properties (e.g., background-color, border-radius, box-shadow) directly into React inline style objects or Emotion/Styled-Components properties (e.g., backgroundColor, borderRadius, boxShadow) with zero manual retyping.
* Zero Cloud Exposure for Proprietary Codebases: Software source code, proprietary algorithms, patent-pending logic, and internal database schemas represent invaluable intellectual property. Toolora converts code identifiers 100% locally in browser RAM with zero external server exposure."""
    },
    {
        'id': 'developer-productivity-and-batch-refactoring',
        'heading': 'High-Speed Refactoring: Batch Identifier Conversion, Regex Safety & Clipboard Integration',
        'content': """Accelerating day-to-day software development, terminal workflows, and code refactoring:

1. Multi-Line Batch Processing: Paste hundreds of variable names or database column definitions at once and convert the entire collection to your target casing format simultaneously with zero manual editing.
2. Preserving Numeric Suffixes & Special Identifiers: Intelligently handles alphanumeric tokens (e.g., utf8Encoding, sha256Checksum, ipv6Address, oauth2Token) without corrupting numbers or splitting technical acronyms inappropriately.
3. Instant Copy to Clipboard: One-click copying allows you to paste converted identifiers directly back into your code editor (VS Code, IntelliJ IDEA, Neovim, Sublime Text).
4. Environment Variable Normalization: Effortlessly convert application configuration keys into uppercase screaming snake case (e.g., databaseUrl -> DATABASE_URL) for Docker Compose files, Kubernetes ConfigMaps, and .env deployment manifests.
5. Protobuf and gRPC Field Mapping: Bridge serialization discrepancies between protocol buffer field definitions and client-side SDK generator stubs in seconds.
6. Git Branch & Commit Formatting: Format git branch names into clean kebab-cased conventions (e.g., feature/user-auth-jwt-refresh) for clean repository history.
7. Total Sovereign Privacy: Refactor sensitive enterprise software codebases, proprietary API contracts, and internal configuration keys safely within local browser memory with zero network exposure."""
    }
)

failing = []
for k, secs in RICH_UTILS.items():
    tot = sum(count_words(s["content"]) for s in secs)
    if tot < 500:
        failing.append((k, tot))
    else:
        print(f"✓ {k}: {tot} words")

if failing:
    print("FAILING:", failing)
    sys.exit(1)
else:
    print(f"ALL {len(RICH_UTILS)} UTILITY ARTICLES PASS WITH >= 500 WORDS!")
    with open("scripts/rich_utils_articles.json", "w") as f:
        json.dump(RICH_UTILS, f, indent=2)
    print("Saved scripts/rich_utils_articles.json successfully!")
