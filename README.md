import streamlit as st

st.set_page_config(page_title="ConceptFlow AI", page_icon="🧠", layout="wide")

# Dark background CSS
st.markdown("""
<style>
    .stApp { background-color: #0e1117; color: white; }
    .stSidebar { background-color: #1a1d27; }
    .stButton>button { background-color: #ff4b4b; color: white; border-radius: 10px; }
    .stSelectbox, .stRadio { color: white; }
    h1, h2, h3, p { color: white; }
</style>
""", unsafe_allow_html=True)

# Session state
if "student_name" not in st.session_state:
    st.session_state.student_name = ""
if "quiz_score" not in st.session_state:
    st.session_state.quiz_score = 0
if "weak_areas" not in st.session_state:
    st.session_state.weak_areas = []
if "language" not in st.session_state:
    st.session_state.language = "English"

# Sidebar
st.sidebar.title("🧠 ConceptFlow AI")
st.sidebar.markdown("*Personalized Math Tutor*")
st.sidebar.markdown("---")

lang = st.sidebar.selectbox("🌐 Language", ["English", "Tamil", "Hindi"])
st.session_state.language = lang

st.sidebar.markdown("---")
menu = st.sidebar.radio("Navigate", [
    "🏠 Home",
    "📋 Diagnostic Quiz",
    "🗺️ Concept Map",
    "📚 Learn",
    "✏️ Practice Test",
    "📊 Dashboard"
])

# Language content
labels = {
    "English": {
        "welcome": "Welcome to ConceptFlow AI 🧠",
        "subheader": "Your Personalized Math Tutor",
        "enter_name": "Enter your name:",
        "welcome_msg": "Welcome! Let's start learning!",
        "submit": "Submit",
        "score": "Your Score",
        "weak": "Weak Areas",
        "focus": "Focus on these topics:",
    },
    "Tamil": {
        "welcome": "ConceptFlow AI-க்கு வரவேற்கிறோம் 🧠",
        "subheader": "உங்கள் தனிப்பட்ட கணித ஆசிரியர்",
        "enter_name": "உங்கள் பெயரை உள்ளிடுக:",
        "welcome_msg": "வரவேற்கிறோம்! கற்கத் தொடங்குவோம்!",
        "submit": "சமர்ப்பிக்கவும்",
        "score": "உங்கள் மதிப்பெண்",
        "weak": "பலவீனமான பகுதிகள்",
        "focus": "இந்த தலைப்புகளில் கவனம் செலுத்துங்கள்:",
    },
    "Hindi": {
        "welcome": "ConceptFlow AI में आपका स्वागत है 🧠",
        "subheader": "आपका व्यक्तिगत गणित शिक्षक",
        "enter_name": "अपना नाम दर्ज करें:",
        "welcome_msg": "स्वागत है! सीखना शुरू करते हैं!",
        "submit": "जमा करें",
        "score": "आपका स्कोर",
        "weak": "कमजोर क्षेत्र",
        "focus": "इन विषयों पर ध्यान दें:",
    }
}

L = labels[st.session_state.language]

# ── HOME ──
if menu == "🏠 Home":
    st.title(L["welcome"])
    st.subheader(L["subheader"])
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.info("📋 **Diagnostic Quiz**\nFind your weak areas with 10 questions")
    with col2:
        st.info("🗺️ **Concept Map**\nSee how topics connect")
    with col3:
        st.info("📊 **Dashboard**\nTrack your progress")
    st.markdown("---")
    name = st.text_input(L["enter_name"])
    if name:
        st.session_state.student_name = name
        st.success(f"{L['welcome_msg']} {name}!")

# ── DIAGNOSTIC QUIZ ──
elif menu == "📋 Diagnostic Quiz":
    st.title("📋 Diagnostic Quiz")
    st.markdown("10 questions covering different math topics to find your weak areas.")
    st.markdown("---")

    questions = [
        {"q": "What is 15 × 8?", "options": ["100", "120", "110", "130"], "answer": "120", "topic": "Arithmetic"},
        {"q": "Solve: 2x + 5 = 15. Find x.", "options": ["x=4", "x=5", "x=6", "x=3"], "answer": "x=5", "topic": "Algebra"},
        {"q": "Area of a circle with radius 7? (π=22/7)", "options": ["154", "144", "164", "174"], "answer": "154", "topic": "Geometry"},
        {"q": "What is 3/4 + 1/4?", "options": ["1", "3/8", "4/8", "1/2"], "answer": "1", "topic": "Fractions"},
        {"q": "What is √144?", "options": ["11", "12", "13", "14"], "answer": "12", "topic": "Number Theory"},
        {"q": "What is the mean of 2, 4, 6, 8, 10?", "options": ["5", "6", "7", "8"], "answer": "6", "topic": "Statistics"},
        {"q": "sin(90°) = ?", "options": ["0", "0.5", "1", "-1"], "answer": "1", "topic": "Trigonometry"},
        {"q": "What is 20% of 150?", "options": ["25", "30", "35", "40"], "answer": "30", "topic": "Percentages"},
        {"q": "Perimeter of a square with side 6cm?", "options": ["12", "18", "24", "36"], "answer": "24", "topic": "Geometry"},
        {"q": "What is 2³ (2 to the power 3)?", "options": ["6", "8", "9", "12"], "answer": "8", "topic": "Number Theory"},
    ]

    answers = []
    for i, q in enumerate(questions):
        st.markdown(f"**Q{i+1}: {q['q']}**")
        st.caption(f"Topic: {q['topic']}")
        ans = st.radio("Select answer:", q["options"], key=f"dq{i}", index=None)
        answers.append(ans)
        st.markdown("---")

    if st.button(L["submit"]):
        score = 0
        weak = []
        for i, q in enumerate(questions):
            if answers[i] == q["answer"]:
                score += 1
            else:
                weak.append(q["topic"])
        st.session_state.quiz_score = score
        st.session_state.weak_areas = weak
        st.success(f"✅ {L['score']}: {score}/10")
        if weak:
            st.warning(f"⚠️ {L['focus']} {', '.join(set(weak))}")
        else:
            st.balloons()
            st.success("🎉 Perfect score!")

# ── CONCEPT MAP ──
elif menu == "🗺️ Concept Map":
    st.title("🗺️ Concept Map")
    st.markdown("See the learning path — what to learn first before reaching your topic.")
    st.markdown("---")

    topic = st.selectbox("Select a topic:", [
        "Algebra", "Calculus", "Trigonometry", "Statistics",
        "Geometry", "Fractions", "Percentages", "Number Theory",
        "Linear Equations", "Quadratic Equations", "Probability",
        "Matrices", "Differentiation", "Integration"
    ])

    concept_maps = {
        "Algebra": ["Numbers", "Arithmetic", "Variables", "Algebra"],
        "Calculus": ["Algebra", "Functions", "Limits", "Calculus"],
        "Trigonometry": ["Geometry", "Angles", "Triangles", "Trigonometry"],
        "Statistics": ["Arithmetic", "Data", "Mean/Median", "Statistics"],
        "Geometry": ["Numbers", "Shapes", "Area/Perimeter", "Geometry"],
        "Fractions": ["Numbers", "Division", "Fractions"],
        "Percentages": ["Fractions", "Decimals", "Percentages"],
        "Number Theory": ["Numbers", "Factors", "Primes", "Number Theory"],
        "Linear Equations": ["Arithmetic", "Algebra", "Linear Equations"],
        "Quadratic Equations": ["Algebra", "Linear Equations", "Quadratic Equations"],
        "Probability": ["Fractions", "Percentages", "Probability"],
        "Matrices": ["Algebra", "Linear Equations", "Matrices"],
        "Differentiation": ["Algebra", "Functions", "Limits", "Differentiation"],
        "Integration": ["Differentiation", "Integration"],
    }

    steps = concept_maps[topic]
    st.markdown(f"### Learning path to reach **{topic}**:")
    cols = st.columns(len(steps))
    for j, step in enumerate(steps):
        with cols[j]:
            if step == topic:
                st.success(f"🎯 **{step}**")
            else:
                st.info(f"📖 {step}")
            if j < len(steps) - 1:
                st.markdown("⬇️")

# ── LEARN ──
elif menu == "📚 Learn":
    st.title("📚 Learn")
    st.markdown("Simple explanations with examples for every topic.")
    st.markdown("---")

    topic = st.selectbox("Choose a topic:", [
        "Arithmetic", "Fractions", "Percentages", "Algebra",
        "Linear Equations", "Quadratic Equations", "Geometry",
        "Trigonometry", "Statistics", "Probability",
        "Number Theory", "Matrices"
    ])

    content = {
        "Arithmetic": {
            "what": "Arithmetic is the foundation of all math. It covers addition, subtraction, multiplication, and division.",
            "example": "12 + 8 = 20 | 15 × 4 = 60 | 100 ÷ 5 = 20",
            "tip": "Practice multiplication tables from 1 to 20."
        },
        "Fractions": {
            "what": "A fraction shows a part of a whole. Top number = numerator, Bottom number = denominator.",
            "example": "1/2 + 1/3 = 3/6 + 2/6 = 5/6",
            "tip": "Find the LCM of denominators before adding or subtracting."
        },
        "Percentages": {
            "what": "Percentage means 'out of 100'. It shows how much out of a total.",
            "example": "20% of 80 = (20/100) × 80 = 16",
            "tip": "To find percentage: (part/whole) × 100"
        },
        "Algebra": {
            "what": "Algebra uses letters (variables) to represent unknown numbers and solve equations.",
            "example": "2x + 3 = 11 → 2x = 8 → x = 4",
            "tip": "Always perform the same operation on both sides of the equation."
        },
        "Linear Equations": {
            "what": "A linear equation has one variable and forms a straight line when graphed.",
            "example": "3x - 6 = 9 → 3x = 15 → x = 5",
            "tip": "Move numbers to one side and variables to the other."
        },
        "Quadratic Equations": {
            "what": "A quadratic equation has x² (x squared) as the highest power.",
            "example": "x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x=2 or x=3",
            "tip": "Use factoring, completing the square, or quadratic formula."
        },
        "Geometry": {
            "what": "Geometry studies shapes, sizes, angles, and properties of figures.",
            "example": "Area of rectangle = L×W = 5×3 = 15 sq units | Circle area = πr² = 22/7 × 7² = 154",
            "tip": "Always draw a diagram before solving geometry problems."
        },
        "Trigonometry": {
            "what": "Trigonometry studies the relationship between angles and sides in triangles.",
            "example": "sin(30°) = 0.5 | cos(60°) = 0.5 | tan(45°) = 1",
            "tip": "Remember: SOH = sin=opposite/hypotenuse, CAH = cos=adjacent/hypotenuse, TOA = tan=opposite/adjacent"
        },
        "Statistics": {
            "what": "Statistics involves collecting, organizing, and analyzing data.",
            "example": "Data: 2,4,6,8,10 → Mean = 30/5 = 6 | Median = 6 | Mode = none",
            "tip": "Always arrange data in order before finding median."
        },
        "Probability": {
            "what": "Probability measures how likely an event is to happen. Range: 0 to 1.",
            "example": "Tossing a coin: P(heads) = 1/2 = 0.5",
            "tip": "P(event) = Favorable outcomes ÷ Total outcomes"
        },
        "Number Theory": {
            "what": "Number theory studies properties of numbers like factors, multiples, primes.",
            "example": "Factors of 12: 1,2,3,4,6,12 | Prime numbers: 2,3,5,7,11,13...",
            "tip": "A prime number has exactly 2 factors: 1 and itself."
        },
        "Matrices": {
            "what": "A matrix is a rectangular array of numbers arranged in rows and columns.",
            "example": "[1 2] + [3 4] = [4 6] | Multiply each element",
            "tip": "For matrix multiplication, columns of first must equal rows of second."
        },
    }

    c = content[topic]
    st.markdown(f"## 📖 {topic}")
    st.markdown("---")
    st.markdown(f"### 🤔 What is {topic}?")
    st.markdown(c["what"])
    st.markdown("---")
    st.markdown("### 📝 Example:")
    st.code(c["example"])
    st.markdown("---")
    st.info(f"💡 **Pro Tip:** {c['tip']}")

# ── PRACTICE TEST ──
elif menu == "✏️ Practice Test":
    st.title("✏️ Practice Test")
    st.markdown("Test your knowledge with topic-specific questions.")
    st.markdown("---")

    topic = st.selectbox("Select topic:", [
        "Arithmetic", "Algebra", "Geometry",
        "Fractions", "Percentages", "Trigonometry",
        "Statistics", "Number Theory"
    ])

    practice = {
        "Arithmetic": [
            {"q": "144 ÷ 12 = ?", "answer": "12", "options": ["10", "11", "12", "13"]},
            {"q": "17 × 6 = ?", "answer": "102", "options": ["96", "98", "102", "108"]},
            {"q": "256 - 128 = ?", "answer": "128", "options": ["118", "128", "138", "148"]},
        ],
        "Algebra": [
            {"q": "Solve: 3x - 6 = 9", "answer": "x=5", "options": ["x=3", "x=4", "x=5", "x=6"]},
            {"q": "If x=3, find 4x + 2", "answer": "14", "options": ["12", "13", "14", "15"]},
            {"q": "Solve: x/2 = 8", "answer": "x=16", "options": ["x=4", "x=8", "x=16", "x=32"]},
        ],
        "Geometry": [
            {"q": "Perimeter of square with side 6?", "answer": "24", "options": ["18", "20", "24", "36"]},
            {"q": "Area of triangle: base=8, height=5?", "answer": "20", "options": ["13", "20", "40", "80"]},
            {"q": "Angles in a triangle add up to?", "answer": "180°", "options": ["90°", "180°", "270°", "360°"]},
        ],
        "Fractions": [
            {"q": "1/2 + 1/4 = ?", "answer": "3/4", "options": ["1/2", "2/4", "3/4", "1"]},
            {"q": "Simplify 8/12", "answer": "2/3", "options": ["1/2", "2/3", "3/4", "4/6"]},
            {"q": "2/3 × 3/4 = ?", "answer": "1/2", "options": ["1/3", "1/2", "2/3", "3/4"]},
        ],
        "Percentages": [
            {"q": "20% of 200 = ?", "answer": "40", "options": ["20", "30", "40", "50"]},
            {"q": "What % is 25 out of 100?", "answer": "25%", "options": ["20%", "25%", "30%", "35%"]},
            {"q": "50% of 90 = ?", "answer": "45", "options": ["40", "45", "50", "55"]},
        ],
        "Trigonometry": [
            {"q": "sin(0°) = ?", "answer": "0", "options": ["0", "0.5", "1", "-1"]},
            {"q": "cos(0°) = ?", "answer": "1", "options": ["0", "0.5", "1", "-1"]},
            {"q": "tan(45°) = ?", "answer": "1", "options": ["0", "0.5", "1", "√3"]},
        ],
        "Statistics": [
            {"q": "Mean of 10, 20, 30 = ?", "answer": "20", "options": ["15", "20", "25", "30"]},
            {"q": "Median of 3, 7, 1, 9, 5 = ?", "answer": "5", "options": ["3", "5", "7", "9"]},
            {"q": "Mode of 2,3,3,4,4,4,5 = ?", "answer": "4", "options": ["2", "3", "4", "5"]},
        ],
        "Number Theory": [
            {"q": "Is 17 a prime number?", "answer": "Yes", "options": ["Yes", "No"]},
            {"q": "LCM of 4 and 6 = ?", "answer": "12", "options": ["6", "8", "12", "24"]},
            {"q": "HCF of 12 and 18 = ?", "answer": "6", "options": ["2", "3", "6", "9"]},
        ],
    }

    questions = practice[topic]
    answers = []

    for i, q in enumerate(questions):
        st.markdown(f"**Q{i+1}: {q['q']}**")
        ans = st.radio("", q["options"], key=f"pt{topic}{i}", index=None)
        answers.append(ans)
        st.markdown("---")

    if st.button(L["submit"]):
        score = sum(1 for i, q in enumerate(questions) if answers[i] == q["answer"])
        st.success(f"✅ Score: {score}/{len(questions)}")
        for i, q in enumerate(questions):
            if answers[i] == q["answer"]:
                st.success(f"Q{i+1}: ✅ Correct!")
            else:
                st.error(f"Q{i+1}: ❌ Wrong! Correct answer: {q['answer']}")
        if score == len(questions):
            st.balloons()

# ── DASHBOARD ──
elif menu == "📊 Dashboard":
    st.title("📊 Dashboard")
    st.markdown("---")

    name = st.session_state.student_name or "Student"
    score = st.session_state.quiz_score
    weak = st.session_state.weak_areas

    st.markdown(f"### 👤 {name}")
    st.markdown("---")

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("📋 Quiz Score", f"{score}/10")
    with col2:
        st.metric("⚠️ Weak Areas", len(set(weak)))
    with col3:
        percentage = (score/10)*100
        st.metric("📈 Percentage", f"{percentage}%")

    st.markdown("---")

    if weak:
        st.warning(f"**{L['focus']}** {', '.join(set(weak))}")
        st.markdown("### 📚 Recommended Topics:")
        for w in set(weak):
            st.markdown(f"- 👉 Go to **Learn** page and study: **{w}**")
    else:
        st.success("🎉 Excellent! No weak areas found!")

    st.markdown("---")
    st.markdown("### 📊 Performance:")
    if score >= 8:
        st.success("🌟 Excellent Performance!")
    elif score >= 5:
        st.warning("📚 Good — Keep Practicing!")
    else:
        st.error("💪 Needs Improvement — Don't give up!")
