# data.py

# ---------------------------------------------------------------------------
# O*NET Interest Profiler Short Form (60 items), U.S. Department of Labor,
# Employment and Training Administration (USDOL/ETA), National Center for
# O*NET Development. Verbatim text from the official instrument
# (onetcenter.org/dl_tools/ipsf/Interest_Profiler.pdf).
# Used under the O*NET Tools Developer License:
# https://www.onetcenter.org/license_tools.html
#
# CareerPath AI has modified the response/scoring format and the downstream
# purpose (feeding a DepEd SHS track/cluster matcher). USDOL/ETA has not
# approved, endorsed, or tested these modifications. A formal validation
# study for this adapted purpose/audience has not yet been conducted.
# ---------------------------------------------------------------------------

ONET_ATTRIBUTION = (
    "This application includes information from the O*NET Career "
    "Exploration Tools by the U.S. Department of Labor, Employment and "
    "Training Administration (USDOL/ETA). Used under the O*NET Tools "
    "Developer License (onetcenter.org/license_tools.html). O*NET(R) is a "
    "trademark of USDOL/ETA. CareerPath AI has modified all or some of "
    "this information. USDOL/ETA has not approved, endorsed, or tested "
    "these modifications."
)

ONET_MODIFICATION_NOTICE = (
    "CareerPath AI has modified all of, a portion of, or the purpose of "
    "the O*NET Career Exploration Tools. USDOL/ETA has not approved, "
    "endorsed, or tested these modifications. As such, USDOL/ETA will not "
    "be liable to any third party or end-user for any damages arising out "
    "of or from the use or misuse of the modified O*NET Career Exploration "
    "Tools. A formal validation study for this adapted purpose (DepEd SHS "
    "track/cluster matching) and audience (Filipino Grade 10 completers) "
    "has not yet been conducted — treat results as preliminary and "
    "exploratory pending that study, and always confirm with a licensed "
    "Guidance Counselor."
)

ONET_QUESTIONS = {
    "Realistic": [
        "Build kitchen cabinets",
        "Lay brick or tile",
        "Repair household appliances",
        "Raise fish in a fish hatchery",
        "Assemble electronic parts",
        "Drive a truck to deliver packages to offices and homes",
        "Test the quality of parts before shipment",
        "Repair and install locks",
        "Set up and operate machines to make products",
        "Put out forest fires",
    ],
    "Investigative": [
        "Develop a new medicine",
        "Study ways to reduce water pollution",
        "Conduct chemical experiments",
        "Study the movement of planets",
        "Examine blood samples using a microscope",
        "Investigate the cause of a fire",
        "Develop a way to better predict the weather",
        "Work in a biology lab",
        "Invent a replacement for sugar",
        "Do laboratory tests to identify diseases",
    ],
    "Artistic": [
        "Write books or plays",
        "Play a musical instrument",
        "Compose or arrange music",
        "Draw pictures",
        "Create special effects for movies",
        "Paint sets for plays",
        "Write scripts for movies or television shows",
        "Perform jazz or tap dance",
        "Sing in a band",
        "Edit movies",
    ],
    "Social": [
        "Teach an individual an exercise routine",
        "Help people with personal or emotional problems",
        "Give career guidance to people",
        "Perform rehabilitation therapy",
        "Do volunteer work at a non-profit organization",
        "Teach children how to play sports",
        "Teach sign language to people who are deaf or hard of hearing",
        "Help conduct a group therapy session",
        "Take care of children at a day-care center",
        "Teach a high-school class",
    ],
    "Enterprising": [
        "Buy and sell stocks and bonds",
        "Manage a retail store",
        "Operate a beauty salon or barber shop",
        "Manage a department within a large company",
        "Start your own business",
        "Negotiate business contracts",
        "Represent a client in a lawsuit",
        "Market a new line of clothing",
        "Sell merchandise at a department store",
        "Manage a clothing store",
    ],
    "Conventional": [
        "Develop a spreadsheet using computer software",
        "Proofread records or forms",
        "Install software across computers on a large network",
        "Operate a calculator",
        "Keep shipping and receiving records",
        "Calculate the wages of employees",
        "Inventory supplies using a hand-held computer",
        "Record rent payments",
        "Keep inventory records",
        "Stamp, sort, and distribute mail for an organization",
    ],
}

# ---------------------------------------------------------------------------
# Track / Cluster data aligned to DepEd Memorandum No. 012, s. 2026
# (Strengthened SHS Curriculum). Two tracks only: Academic and Technical
# Professional (TechPro, replacing TVL). Former strands (STEM/ABM/HUMSS/GAS)
# are elective clusters within Academic, not locked-in strands. Arts &
# Design and Sports move from standalone tracks to Academic electives.
# TechPro keeps the same specialization sectors as former TVL.
# ---------------------------------------------------------------------------

SHS_PATHWAYS = {
    "STEM": {
        "track": "Academic",
        "cluster_label": "STEM Cluster",
        "degrees": ["BS Computer Science", "BS Civil/Electrical/Mechanical Engineering",
                    "BS Nursing", "BS Biology / Medical Technology", "BS Architecture"],
        "tesda": ["Computer Systems Servicing NC II", "Electrical Installation & Maintenance NC II",
                  "Shielded Metal Arc Welding NC II"],
        "scholarships": ["DOST-SEI S&T Undergraduate Scholarship", "CHED Merit Scholarship Program",
                          "UniFAST Tertiary Education Subsidy"],
        "careers": ["Junior Software Developer", "Engineering Technician",
                    "Laboratory Assistant", "Research Aide"],
    },
    "ABM": {
        "track": "Academic",
        "cluster_label": "ABM Cluster",
        "degrees": ["BS Accountancy", "BS Business Administration", "BS Entrepreneurship",
                    "BS Economics", "BS Office Administration"],
        "tesda": ["Bookkeeping NC III", "Financial Management Training (TWSP)",
                  "Events Management Services NC II"],
        "scholarships": ["CHED Merit Scholarship Program", "TESDA TWSP",
                          "LGU-sponsored local scholarship grants"],
        "careers": ["Bookkeeping Clerk", "Sales Associate / Account Executive Trainee",
                    "Junior Business Analyst", "Administrative Assistant"],
    },
    "HUMSS": {
        "track": "Academic",
        "cluster_label": "HUMSS Cluster",
        "degrees": ["BS Psychology", "AB Communication", "BA Political Science",
                    "Bachelor of Elementary/Secondary Education", "BA Sociology"],
        "tesda": ["Events Management Services NC II", "Social Work Aide Training",
                  "Communication & Media Skills Training (TWSP)"],
        "scholarships": ["CHED Merit Scholarship Program", "UniFAST Tertiary Education Subsidy",
                          "DSWD/LGU Social Work Assistance Grants"],
        "careers": ["Community Development Aide", "Media/Content Production Assistant",
                    "HR/Admin Assistant", "Teacher's Aide"],
    },
    "GAS": {
        "track": "Academic",
        "cluster_label": "General Academic (GAS) Cluster",
        "degrees": ["Any bachelor's degree requiring general prerequisites",
                    "BA/BS Liberal Arts", "BS Social Work", "Pre-Law / Pre-Med preparatory programs"],
        "tesda": ["Basic ICT Skills Training (TWSP)", "Events Management Services NC II",
                  "Bookkeeping NC III"],
        "scholarships": ["CHED Merit Scholarship Program", "UniFAST Tertiary Education Subsidy",
                          "LGU-sponsored local scholarship grants"],
        "careers": ["Administrative Aide", "Customer Service Representative",
                    "Utility/General Office Staff", "Call Center Agent Trainee"],
    },
    "ARTS": {
        "track": "Academic",
        "cluster_label": "Arts & Design Electives",
        "degrees": ["BS Fine Arts", "BS Multimedia Arts", "BS Interior Design", "BA Film / Broadcasting"],
        "tesda": ["Visual Graphic Design NC III", "Photography NC II", "Animation NC II"],
        "scholarships": ["CHED Merit Scholarship Program", "NCCA grants",
                          "UniFAST Tertiary Education Subsidy"],
        "careers": ["Junior Graphic Designer", "Illustrator/Layout Assistant",
                    "Photography Assistant", "Production Design Aide"],
    },
    "SPORTS": {
        "track": "Academic",
        "cluster_label": "Sports Track Electives",
        "degrees": ["BS Exercise & Sports Science", "BS Physical Education", "BS Sports Management"],
        "tesda": ["First Aid NC II", "Fitness Training (TWSP)", "Events Management Services NC II"],
        "scholarships": ["Philippine Sports Commission (PSC) Scholarship", "CHED Merit Scholarship Program",
                          "LGU athletic scholarship grants"],
        "careers": ["Fitness Program Assistant", "Sports Program Aide",
                    "Recreation Officer Trainee", "PE Teacher's Aide"],
    },
    "TECHPRO-ICT": {
        "track": "TechPro",
        "cluster_label": "ICT Specialization",
        "degrees": ["BS Information Technology", "BS Computer Science", "BS Information Systems"],
        "tesda": ["Computer Systems Servicing NC II", "Web Development NC III", "Animation NC II"],
        "scholarships": ["TESDA TWSP", "DICT Digital Jobs / Tech4ED programs", "CHED Merit Scholarship Program"],
        "careers": ["IT Support Technician", "Junior Web Developer",
                    "Computer Systems Technician", "Data Entry Specialist"],
    },
    "TECHPRO-IA": {
        "track": "TechPro",
        "cluster_label": "Industrial Arts Specialization",
        "degrees": ["BS Industrial Technology", "BS Civil/Electrical Engineering", "BS Architecture"],
        "tesda": ["Electrical Installation & Maintenance NC II", "Shielded Metal Arc Welding NC I/II",
                  "Automotive Servicing NC I/II"],
        "scholarships": ["TESDA TWSP", "Private-industry apprenticeship grants", "CHED Merit Scholarship Program"],
        "careers": ["Electrician's Assistant", "Automotive Technician",
                    "Welding Technician", "Construction Skilled Worker"],
    },
    "TECHPRO-HE": {
        "track": "TechPro",
        "cluster_label": "Home Economics Specialization",
        "degrees": ["BS Hotel & Restaurant Management", "BS Tourism Management", "BS Fashion & Textile Design"],
        "tesda": ["Cookery NC II", "Bread & Pastry Production NC II", "Housekeeping NC II", "Dressmaking NC II"],
        "scholarships": ["TESDA TWSP", "DOT-affiliated tourism training grants", "CHED Merit Scholarship Program"],
        "careers": ["Kitchen/Pastry Assistant", "Front Office/Housekeeping Staff",
                    "Dressmaking & Tailoring Assistant", "Tourism Service Crew"],
    },
    "TECHPRO-AFA": {
        "track": "TechPro",
        "cluster_label": "Agri-Fishery Arts Specialization",
        "degrees": ["BS Agriculture", "BS Fisheries", "BS Agribusiness", "BS Forestry"],
        "tesda": ["Organic Agriculture Production NC II", "Aquaculture NC II", "Agricultural Crops Production NC II"],
        "scholarships": ["DA-ATI Agricultural Scholarships", "TESDA TWSP", "CHED Merit Scholarship Program"],
        "careers": ["Farm Technician", "Aquaculture Technician",
                    "Agribusiness Assistant", "Agricultural Extension Aide"],
    },
}

# ---------------------------------------------------------------------------
# Starter institution reference list. This is intentionally a small, manually
# curated sample of well-known national institutions per cluster/specialization
# — NOT a comprehensive or verified national/regional directory. Specific
# institution names and locations are exactly the kind of long-tail factual
# detail an LLM is most likely to get wrong (outdated campus info, invented
# programs, wrong region), so we deliberately ground the AI on this fixed list
# rather than letting it generate institution names freely. Before using this
# for real student guidance, your team should expand it using CHED's public
# list of HEIs with government-recognized programs and TESDA's UTPRAS registry
# of accredited training providers, ideally filtered to your own region/
# province so the suggestions are actually locally actionable.
# ---------------------------------------------------------------------------
INSTITUTIONS = {
    "STEM": ["University of the Philippines (multiple campuses)", "Mapua University",
             "Philippine Normal University", "De La Salle University"],
    "ABM": ["Polytechnic University of the Philippines", "University of Santo Tomas",
            "De La Salle University", "Ateneo de Manila University"],
    "HUMSS": ["Philippine Normal University", "University of the Philippines (multiple campuses)",
              "Polytechnic University of the Philippines"],
    "GAS": ["Polytechnic University of the Philippines", "State universities and colleges (SUCs) nationwide"],
    "ARTS": ["University of the Philippines College of Fine Arts", "Technological University of the Philippines",
             "Philippine Women's University School of Fine Arts and Design"],
    "SPORTS": ["University of the Philippines Diliman (Sports Science)", "Philippine Normal University"],
    "TECHPRO-ICT": ["Technological University of the Philippines", "TESDA Regional Training Centers (nationwide)",
                    "Mapua University"],
    "TECHPRO-IA": ["Technological University of the Philippines", "TESDA Regional Training Centers (nationwide)"],
    "TECHPRO-HE": ["TESDA Regional Training Centers (nationwide)", "Philippine Women's University"],
    "TECHPRO-AFA": ["Central Luzon State University", "Visayas State University",
                     "TESDA Agri-Fishery Training Centers (regional)"],
}