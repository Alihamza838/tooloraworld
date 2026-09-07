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

# 2. UnitConverterEngineeringGuide.ts
reg(
    'UnitConverterEngineeringGuide.ts',
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

# 3. JsonFormatterGuide.ts
reg(
    'JsonFormatterGuide.ts',
    {
        'id': 'json-grammar-and-ecma-404-specification',
        'heading': 'Formal Syntax & Grammar: ECMA-404, RFC 8259 & Abstract Syntax Tree (AST) Parsing',
        'content': """JavaScript Object Notation (JSON) is the universal data interchange format of modern computing, formally standardized under ECMA-404 and IETF RFC 8259. Despite its widespread adoption, JSON enforces an unforgiving, strict formal grammar. A single stray trailing comma, unescaped control character, or single-quoted string causes native JSON.parse() methods to throw fatal syntax exceptions.

1. Strict JSON Syntactic Invariants:
   * String Enclosure: All object keys and string values MUST be enclosed in double quotation marks ("key": "value"). Single quotes ('key': 'value') are strictly invalid.
   * Trailing Commas Prohibited: Trailing commas following the final element in an array [1, 2, 3,] or key-value pair {"a": 1,} are forbidden by RFC 8259.
   * Primitive Data Types: JSON supports only six primitive structures: string, number, boolean (true/false), null, array, and object. NaN, Infinity, and undefined cannot be represented.
2. Abstract Syntax Tree (AST) Tokenization: Toolora's formatting engine parses raw text into a recursive Abstract Syntax Tree. This allows the engine to isolate exact character offsets of syntax errors, displaying line and column numbers where a missing brace or unescaped quote broke the document."""
    },
    {
        'id': 'devops-and-enterprise-api-integration',
        'heading': 'DevOps & Enterprise Integration: Slashing Bandwidth with Minification vs Prettification',
        'content': """Balancing human readability against machine network transmission efficiency:

* Prettification (Indentation & Visual Hierarchy): For API debugging, log inspection, and developer documentation, formatting minified single-line JSON payloads with 2-space or 4-space indentation reveals nested object hierarchies and array relationships instantly.
* Minification (Bandwidth & Serialization Speed): Whitespace characters, carriage returns, and indentation tabs consume valuable bytes. In production API pipelines and Redis caching layers, stripping unnecessary whitespace (minification) reduces payload weight by 20% to 40%, cutting cloud networking egress costs and accelerating JSON serialization throughput.
* Tree-View Interactive Navigation: Collapsible object nodes allow software engineers to navigate multi-megabyte API response payloads without scrolling through thousands of lines of raw text.
* Zero-Knowledge Privacy for Sensitive Data: Production database dumps, customer records, and API tokens must NEVER be pasted into unverified online formatters. Toolora parses and formats JSON 100% locally in browser RAM with zero network traffic."""
    },
    {
        'id': 'json-validation-and-developer-workflows',
        'heading': 'Developer Productivity: Syntax Highlighting, Schema Validation & Instant Export',
        'content': """Streamlining daily engineering and debugging operations:

1. Color-Coded Syntax Highlighting: Distinct visual coloring for keys (blue), string values (green), numbers (orange), booleans (purple), and null values (red) accelerates optical scanning of complex responses.
2. Instant Minify / Beautify Toggles: Switch between compressed production payload format and formatted readable layout with a single keystroke.
3. One-Click Copy & Clean File Download: Copy clean JSON to your system clipboard or export directly as a .json file.
4. JSON Schema Draft-07 Validation: Validate incoming data structures against formal JSON Schema definitions to verify required fields, type constraints, and string regex patterns before pushing to production databases.
5. Large File Memory Buffering: Efficiently format multi-megabyte payload logs from server monitoring systems (DataDog, Splunk, ElasticSearch) without freezing browser tabs.
6. Automated Bracket and Quote Repair: Identify common developer typos such as unquoted property names or misplaced commas and repair them intelligently.
7. Total Client Data Security: Sanitize, inspect, and format sensitive database payloads, production configuration files, and internal API keys safely inside your browser's private memory sandbox with zero risk of external data leakage."""
    }
)

# 4. JsonFormatterApiDebuggingGuide.ts
reg(
    'JsonFormatterApiDebuggingGuide.ts',
    {
        'id': 'rest-graphql-json-payload-debugging',
        'heading': 'API Payload Forensics: Debugging REST, GraphQL, Microservices & Webhook Payloads',
        'content': """Modern distributed software architectures—spanning RESTful microservices, GraphQL federations, and asynchronous webhook pipelines—rely heavily on JSON as their primary transport envelope. When API endpoints return unexpected HTTP 400 Bad Request or HTTP 500 Internal Server errors, the root cause is almost invariably a subtle malformation in the JSON request or response payload.

1. Common API Serialization Pitfalls:
   * Type Mismatch Errors (Numbers vs Strings): In loosely typed environments, a numeric identifier serialized as a string ("id": "1042") instead of an integer ("id": 1042) causes strict backend ORMs (such as Prisma, Hibernate, or Go struct decoders) to reject the payload.
   * Floating-Point Precision Loss in 64-Bit Integers: JavaScript represents all numbers as IEEE 754 double-precision floats, which lose integer precision beyond $2^{53} - 1$ (9,007,199,254,740,991). Large database primary keys (such as Twitter Snowflakes or BigInt IDs) must be serialized as strings to prevent bit truncation.
   * Unescaped Special Characters: Raw newline characters (\n) or unescaped backslashes in user-submitted text cause JSON deserializers to crash immediately."""
    },
    {
        'id': 'api-security-and-token-leak-prevention',
        'heading': 'Preventing Credential Leaks: The Severe Security Risks of Public Online Formatters',
        'content': """Protecting enterprise infrastructure from predatory online utility websites:

* The Hidden Danger of Cloud-Based JSON Formatters: Many popular online 'JSON formatters' log and store every pasted snippet on remote cloud servers. Software developers routinely paste raw curl outputs containing live Authorization Bearer JWT tokens, AWS access keys, Stripe secret API keys, and customer personally identifiable information (PII). Malicious operators scrape these databases to execute corporate data breaches and unauthorized API takeovers.
* Ironclad Local Isolation with Toolora: Toolora processes 100% of JSON parsing, tree-node generation, and formatting locally within your browser's sandboxed memory. No network requests are dispatched, ensuring your confidential API tokens and customer database records remain completely secure.
* Sanitizing JWT and Auth Payloads: Inspect decoded JWT headers and claims payloads safely without exposing cryptographic secrets to third parties.
* Immediate Memory Erasure: Refreshing or closing the browser tab purges all parsed JSON structures from RAM instantly."""
    },
    {
        'id': 'api-debugging-tools-and-diff-workflows',
        'heading': 'Advanced API Debugging: Large Payload Handling, Sorting Keys & Structural Validation',
        'content': """Mastering advanced JSON manipulation techniques for enterprise software engineering:

1. Alphabetical Key Sorting: Normalizing JSON payloads by alphabetically sorting object keys allows developers to run accurate text diffs between expected and actual API responses, revealing subtle missing fields instantly.
2. High-Performance Large Payload Parsing: Toolora handles massive multi-megabyte JSON payloads smoothly without freezing the browser interface, utilizing streaming Web Worker parsers.
3. Path Expression Navigation: Easily pinpoint nested properties within complex JSON hierarchies for quick API contract verification.
4. Asynchronous Webhook Inspection: Paste raw webhook notifications from Stripe, GitHub, or Twilio to verify digital HMAC signatures and payload schema integrity before triggering backend automation handlers.
5. Header and Envelope Isolation: Effortlessly extract inner response envelopes from complex GraphQL responses ({ "data": { ... } }) or REST wrappers ({ "status": "success", "results": [ ... ] }).
6. Deep Schema Comparison & Structural Diffing: Visually highlight missing nested keys, unexpected array index reorderings, and unexpected null values between staging and production environments.
7. Total Sovereign Security: Debug production microservices, webhook payloads, customer telemetry logs, and database dumps with complete privacy and zero cloud risk."""
    }
)

# 5. CaseConverterGuide.ts
reg(
    'CaseConverterGuide.ts',
    {
        'id': 'string-parsing-and-unicode-case-mapping',
        'heading': 'Computational Linguistics: Unicode Case Mapping, Word Boundaries & Regex Tokenization',
        'content': """String case conversion is a core text-processing operation that requires understanding computational linguistics, character encoding standards, and language-specific orthography. Transforming a phrase like 'user-authentication-service' into 'UserAuthenticationService' involves far more than simple uppercase and lowercase character substitution.

1. Delimiter Detection & Word Boundary Tokenization: Case conversion engines must identify word boundaries across diverse delimiting schemes:
   * Whitespace Delimiters: Spaces, tabs, carriage returns, and newlines.
   * Punctuation Delimiters: Hyphens (-), underscores (_), periods (.), slashes (/), and colons (:).
   * Casing Transitions: Recognizing transition boundaries where a lowercase letter is immediately followed by an uppercase letter (e.g., 'firstName' -> 'first', 'Name') using lookahead regex assertions: /(?<=[a-z])(?=[A-Z])/.
2. The Complexities of International Unicode Case Folding: In English, mapping between 'a' and 'A' is straightforward. However, in international alphabets, case folding exhibits non-one-to-one relationships. For example, in German, the lowercase 'ß' (Eszett) uppercases to 'SS'. In Turkish, lowercase 'i' uppercases to dotted 'İ', while dotless 'ı' uppercases to 'I'. Toolora applies locale-aware string manipulation methods to preserve orthographic accuracy."""
    },
    {
        'id': 'content-creators-and-seo-copywriting',
        'heading': 'Content Editorial Standards: AP Stylebook vs Chicago Manual for Title Casing',
        'content': """Maintaining consistent typographic capitalization across digital publications and content marketing:

* The Rules of Formal Title Case: Novice writers often capitalize every single word in a headline, which looks jarring and amateurish. Formal editorial style guides (such as The Associated Press Stylebook and The Chicago Manual of Style) mandate lowercasing minor grammatical words:
   * Short Prepositions: in, on, at, by, to, for, of, off, up.
   * Coordinating Conjunctions: and, but, or, nor, yet, so.
   * Articles: a, an, the.
   * The first and last words of the title are ALWAYS capitalized, regardless of part of speech.
* Search Engine Optimization (SEO) Headlines: Capitalizing search page title tags and YouTube video titles in polished Title Case boosts organic click-through rates by up to 14% compared to all-lowercase or unformatted text.
* Sentence Case for Modern Product Design: Leading UX design systems (Apple Human Interface Guidelines, Google Material Design) mandate Sentence case for user interface buttons, menus, and notification modals.
* Complete Privacy for Draft Manuscripts: Authors, journalists, and corporate copywriters can format draft articles, book manuscripts, and confidential press releases locally in browser memory with zero third-party tracking."""
    },
    {
        'id': 'case-converter-modes-and-batch-workflows',
        'heading': 'Comprehensive Casing Taxonomy: UPPERCASE, lowercase, Title Case & Invert Case',
        'content': """Versatile transformation modes for writers, copy editors, and students:

1. Essential Transformation Profiles:
   * UPPERCASE (ALL CAPS): Ideal for legal contract covenants and prominent display banners.
   * lowercase: Standardizes text for file naming, URL slugs, and database queries.
   * Title Case: Formats headlines, book chapters, and blog titles according to formal editorial guidelines.
   * Sentence case: Capitalizes the first letter of each sentence, correcting accidental Caps Lock entries.
   * aLtErNaTiNg cAsE: Playful mocking tone for social media commentary and memes.
2. Real-Time Bidirectional Transformation: Text updates instantaneously as you type or paste into the editor.
3. Word and Character Statistics: Displays live character counts, word counts, and reading time estimates alongside your formatted text.
4. Slugification for Web Publishing: Cleanly transform article titles into URL-friendly kebab-cased slugs (e.g., '10 Tips for Better SEO' -> '10-tips-for-better-seo') with automatic stripping of diacritics and special punctuation.
5. Invert Case Mode: Effortlessly reverse inverted casing caused by accidental typing while Caps Lock is enabled.
6. Sovereign Local Privacy: Transform proprietary company announcements, book drafts, and private creative writing safely in your device's browser memory without external tracking."""
    }
)

# 6. CaseConverterProgrammingGuide.ts
reg(
    'CaseConverterProgrammingGuide.ts',
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

* The Full-Stack Impedance Mismatch: A typical enterprise application queries a PostgreSQL database storing columns in snake_case (e.g., billing_address_line1), transmits records through a Python backend, and delivers JSON payloads to a React frontend expecting camelCase (e.g., billingAddressLine1). Manually renaming dozens of database fields introduces typos and maintenance overhead.
* Automated Model & Type Generator Workflows: Toolora allows developers to paste database schema declarations, SQL dumps, or JSON keys and instantly convert them to TypeScript interfaces or Python Pydantic models in seconds.
* CSS to CSS-in-JS Transpilation: Convert legacy CSS properties (e.g., background-color, border-radius) directly into React style objects (e.g., backgroundColor, borderRadius) with zero manual retyping.
* Zero Cloud Exposure for Proprietary Codebases: Software source code, proprietary algorithms, and internal database schemas represent invaluable intellectual property. Toolora converts code identifiers 100% locally in browser RAM with zero external server exposure."""
    },
    {
        'id': 'developer-productivity-and-batch-refactoring',
        'heading': 'High-Speed Refactoring: Batch Identifier Conversion, Regex Safety & Clipboard Integration',
        'content': """Accelerating day-to-day software development and code refactoring:

1. Multi-Line Batch Processing: Paste hundreds of variable names or database column definitions at once and convert the entire collection to your target casing format simultaneously.
2. Preserving Numeric Suffixes & Special Identifiers: Intelligently handles alphanumeric tokens (e.g., utf8Encoding, sha256Checksum, ipv6Address) without corrupting numbers or splitting technical acronyms inappropriately.
3. Instant Copy to Clipboard: One-click copying allows you to paste converted identifiers directly back into your code editor (VS Code, IntelliJ, Sublime Text).
4. Environment Variable Normalization: Effortlessly convert application configuration keys into uppercase screaming snake case (e.g., databaseUrl -> DATABASE_URL) for Docker and Kubernetes deployment manifests.
5. Protobuf and gRPC Field Mapping: Bridge serialization discrepancies between protocol buffer field definitions and client-side SDK generator stubs in seconds.
6. Total Sovereign Privacy: Refactor sensitive enterprise software codebases, proprietary API contracts, and internal configuration keys safely within local browser memory with zero network exposure."""
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
else:
    print(f"ALL {len(RICH_UTILS)} UTILITY ARTICLES PASS WITH >= 500 WORDS!")
    with open("scripts/rich_utils_articles.json", "w") as f:
        json.dump(RICH_UTILS, f, indent=2)
    print("Saved scripts/rich_utils_articles.json successfully!")
