import "../config.js";
import { api } from "./api.js";
import { topicCatalog } from "./data.js";

const app = document.querySelector("#app");
const state = {
  route: "auth",
  authMode: "login",
  user: null,
  dashboard: null,
  selectedTopic: null,
  lesson: null,
  test: null,
  testLevel: "Beginner",
  answers: {},
  result: null,
  loading: false,
};

const icons = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9 20v-6h6v6"/>',
  topics: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"/>',
  arrow: '<path d="m9 18 6-6-6-6"/>',
  spark: '<path d="m12 3 1.3 4.1L17 9l-3.7 1.9L12 15l-1.3-4.1L7 9l3.7-1.9z"/><path d="m19 15 .7 2.3L22 18.5l-2.3 1.2L19 22l-.7-2.3-2.3-1.2 2.3-1.2z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  brain: '<path d="M9.5 4.5A3 3 0 0 0 4 6v1a3 3 0 0 0-1 5.2A3 3 0 0 0 5 17.8V19a2 2 0 0 0 4 0zM14.5 4.5A3 3 0 0 1 20 6v1a3 3 0 0 1 1 5.2 3 3 0 0 1-2 5.6V19a2 2 0 0 1-4 0zM12 3v18"/>',
};

function icon(name, size = 20) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ""}</svg>`;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.querySelector("#toast-root").append(toast);
  setTimeout(() => toast.remove(), 3000);
}

function setLoading(value) {
  state.loading = value;
  document.querySelectorAll("button[type='submit']").forEach((button) => {
    button.disabled = value;
  });
}

function progressRing(value, label = "Overall") {
  return `
    <div class="progress-ring" style="--progress:${value}">
      <div><strong>${value}%</strong><span>${label}</span></div>
    </div>`;
}

function authView() {
  const signup = state.authMode === "signup";
  return `
    <main class="auth-page">
      <section class="auth-brand">
        <a class="brand brand-light" href="#" aria-label="Infinite Minds home">
          <span class="brand-mark">${icon("brain", 28)}</span>
          <span>Infinite Minds</span>
        </a>
        <div class="auth-copy">
          <p class="eyebrow">LEARN BEYOND LIMITS</p>
          <h1>Mathematics that<br /><em>makes sense.</em></h1>
          <p>Build real understanding with an AI tutor that adapts to your pace, finds your gaps and guides your next step.</p>
          <div class="feature-pills">
            <span>${icon("spark", 17)} Simple explanations</span>
            <span>${icon("check", 17)} Adaptive practice</span>
            <span>${icon("topics", 17)} Personal learning path</span>
          </div>
        </div>
        <div class="math-orbit orbit-one">∫</div>
        <div class="math-orbit orbit-two">π</div>
        <div class="math-orbit orbit-three">x²</div>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <div class="mobile-brand">
            <span class="brand-mark">${icon("brain", 25)}</span><b>Infinite Minds</b>
          </div>
          <p class="eyebrow purple">${signup ? "START YOUR JOURNEY" : "WELCOME BACK"}</p>
          <h2>${signup ? "Create your account" : "Continue learning"}</h2>
          <p class="muted">${signup ? "Tell us a little about yourself." : "Sign in to pick up where you left off."}</p>
          <form id="auth-form" class="auth-form">
            ${signup ? `
              <label>Full name<input name="name" autocomplete="name" placeholder="Enter your full name" required /></label>
              <label>Phone number<input name="phone" type="tel" autocomplete="tel" placeholder="+91 98765 43210" required /></label>
            ` : ""}
            <label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required /></label>
            <label>Password
              <span class="password-field">
                <input name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" placeholder="${signup ? "Minimum 8 characters" : "Enter your password"}" minlength="8" required />
                <button class="text-button" type="button" data-action="toggle-password">Show</button>
              </span>
            </label>
            ${!signup ? '<button class="forgot-link" type="button">Forgot password?</button>' : ""}
            <button class="primary-button full" type="submit">
              ${signup ? "Create account" : "Sign in"} ${icon("arrow", 18)}
            </button>
          </form>
          <p class="auth-switch">${signup ? "Already have an account?" : "New to Infinite Minds?"}
            <button type="button" data-action="switch-auth">${signup ? "Sign in" : "Create account"}</button>
          </p>
          <p class="demo-note">Demo mode: use any valid email and an 8+ character password.</p>
        </div>
      </section>
    </main>`;
}

function sidebar(active = "home") {
  const item = (id, label) => `
    <button class="nav-item ${active === id ? "active" : ""}" data-nav="${id}">
      ${icon(id === "home" ? "home" : id)}<span>${label}</span>
    </button>`;
  return `
    <aside class="sidebar">
      <a class="brand" href="#" data-nav="home"><span class="brand-mark">${icon("brain", 26)}</span><span>Infinite Minds</span></a>
      <nav>
        ${item("home", "Overview")}
        ${item("topics", "Explore topics")}
        ${item("history", "Learning history")}
        ${item("profile", "My profile")}
      </nav>
      <div class="sidebar-bottom">
        <div class="mini-user"><span>${initials(state.user?.name)}</span><div><b>${state.user?.name || "Student"}</b><small>Student account</small></div></div>
        <button class="nav-item" data-action="logout">${icon("logout")}<span>Sign out</span></button>
      </div>
    </aside>`;
}

function mobileHeader(title = "Infinite Minds") {
  return `<header class="mobile-header"><a class="brand" data-nav="home"><span class="brand-mark">${icon("brain", 23)}</span><span>${title}</span></a><button class="avatar-button" data-nav="profile">${initials(state.user?.name)}</button></header>`;
}

function shell(content, active = "home", title) {
  return `<div class="app-shell">${sidebar(active)}${mobileHeader(title)}<main class="main-content">${content}</main>
    <nav class="mobile-nav">
      <button data-nav="home" class="${active === "home" ? "active" : ""}">${icon("home")}<span>Home</span></button>
      <button data-nav="topics" class="${active === "topics" ? "active" : ""}">${icon("topics")}<span>Topics</span></button>
      <button data-nav="history" class="${active === "history" ? "active" : ""}">${icon("history")}<span>History</span></button>
      <button data-nav="profile" class="${active === "profile" ? "active" : ""}">${icon("profile")}<span>Profile</span></button>
    </nav></div>`;
}

function initials(name = "Student") {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function topicCard(topic) {
  return `
    <article class="topic-card" data-topic="${topic.id}">
      <div class="topic-top">
        <span class="topic-icon ${topic.color}">${topic.icon}</span>
        <span class="level-badge">${topic.level}</span>
      </div>
      <h3>${topic.name}</h3>
      <p>${topic.description}</p>
      <div class="topic-meta"><span>${topic.lessons} lessons</span><strong>${topic.progress}%</strong></div>
      <div class="bar"><span style="width:${topic.progress}%"></span></div>
      <div class="topic-actions">
        <button class="secondary-button" data-learn="${topic.id}">Learn</button>
        <button class="primary-button compact" data-test="${topic.id}">Test ${icon("arrow", 16)}</button>
      </div>
    </article>`;
}

function dashboardView() {
  const topics = state.dashboard?.topics || topicCatalog;
  const progress = Math.round(topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length);
  const strong = topics.filter((topic) => topic.progress >= 70);
  const weak = topics.filter((topic) => topic.progress > 0 && topic.progress < 50);
  const firstName = state.user?.name?.split(" ")[0] || "Student";
  const content = `
    <header class="page-header">
      <div><p class="eyebrow purple">YOUR LEARNING SPACE</p><h1>Good afternoon, ${firstName}.</h1><p>Small steps, clear thinking. Let’s make progress today.</p></div>
      <button class="avatar-button desktop-avatar" data-nav="profile">${initials(state.user?.name)}</button>
    </header>
    <section class="overview-grid">
      <article class="hero-progress">
        <div><span class="soft-label">${icon("spark", 17)} WEEKLY MOMENTUM</span><h2>You’re building<br />a strong foundation.</h2><p>You completed 3 learning sessions this week. Keep the rhythm going.</p><button class="light-button" data-nav="topics">Continue learning ${icon("arrow", 17)}</button></div>
        ${progressRing(progress)}
      </article>
      <article class="stat-card"><span class="stat-icon green">${icon("check")}</span><div><strong>${topics.filter((topic) => topic.progress >= 80).length}</strong><span>Topics mastered</span></div><small>+1 this month</small></article>
      <article class="stat-card"><span class="stat-icon violet">${icon("history")}</span><div><strong>12.5h</strong><span>Learning time</span></div><small>Last 30 days</small></article>
    </section>
    <section class="section-block">
      <div class="section-heading"><div><h2>Continue learning</h2><p>Pick up a topic and keep moving forward.</p></div><button class="link-button" data-nav="topics">View all ${icon("arrow", 16)}</button></div>
      <div class="topic-grid">${topics.slice(0, 3).map(topicCard).join("")}</div>
    </section>
    <section class="insights-grid">
      <article class="panel"><div class="panel-title"><span class="stat-icon green">${icon("check")}</span><div><h3>Your strengths</h3><p>Concepts you understand well</p></div></div>
        <div class="concept-list">${strong.length ? strong.map((topic) => `<div><span>${topic.name}</span><strong>${topic.progress}%</strong><div class="bar green"><i style="width:${topic.progress}%"></i></div></div>`).join("") : "<p>Complete a test to discover your strengths.</p>"}</div>
      </article>
      <article class="panel"><div class="panel-title"><span class="stat-icon orange">${icon("spark")}</span><div><h3>Needs attention</h3><p>Your recommended focus</p></div></div>
        <div class="concept-list">${weak.length ? weak.map((topic) => `<div><span>${topic.name}</span><strong>${topic.progress}%</strong><div class="bar orange"><i style="width:${topic.progress}%"></i></div></div>`).join("") : "<p>No weak areas detected yet.</p>"}</div>
      </article>
    </section>`;
  return shell(content, "home");
}

function topicsView() {
  const topics = state.dashboard?.topics || topicCatalog;
  const content = `
    <header class="page-header"><div><p class="eyebrow purple">TOPIC LIBRARY</p><h1>What will you explore?</h1><p>Learn a concept first, then test your understanding without guesswork.</p></div></header>
    <div class="search-row"><label class="search-box"><span>⌕</span><input id="topic-search" placeholder="Search mathematics topics..." /></label><span>${topics.length} topics available</span></div>
    <section class="topic-grid full-grid" id="topic-list">${topics.map(topicCard).join("")}</section>`;
  return shell(content, "topics", "Topics");
}

function learnView() {
  const topic = topicCatalog.find((item) => item.id === state.selectedTopic);
  const lesson = state.lesson;
  const content = `
    <button class="back-button" data-nav="topics">‹ Back to topics</button>
    <header class="lesson-header"><span class="topic-icon ${topic.color} large">${topic.icon}</span><div><p class="eyebrow purple">${topic.name.toUpperCase()} · BEGINNER</p><h1>${lesson.concept}</h1><p>Learn the idea, connect it to real life, then try it yourself.</p></div></header>
    <div class="learning-layout">
      <article class="lesson-content">
        <section class="lesson-section"><span class="step-number">01</span><div><h2>The idea, simply</h2><p>${lesson.explanation}</p></div></section>
        <section class="intuition-card"><span class="bulb">✦</span><div><p class="eyebrow">REAL-LIFE INTUITION</p><h3>Picture it this way</h3><p>${lesson.intuition}</p></div></section>
        <section class="lesson-section"><span class="step-number">02</span><div><h2>Worked example</h2><div class="math-card"><strong>${lesson.example}</strong></div><ol class="solution-steps">${lesson.steps.map((step) => `<li>${step}</li>`).join("")}</ol></div></section>
        <section class="practice-card"><div><p class="eyebrow purple">QUICK PRACTICE</p><h2>Your turn</h2><p>${lesson.practice}</p></div><form id="practice-form"><input name="answer" placeholder="Type your final answer" autocomplete="off" required /><button class="primary-button" type="submit">Check answer</button></form><div id="practice-feedback"></div></section>
      </article>
      <aside class="learning-sidebar"><div class="panel"><p class="eyebrow purple">YOUR PATH</p><div class="path-step done"><span>${icon("check", 15)}</span><div><b>Explanation</b><small>Concept made simple</small></div></div><div class="path-step done"><span>${icon("check", 15)}</span><div><b>Intuition</b><small>Connect to real life</small></div></div><div class="path-step active"><span>3</span><div><b>Practice</b><small>Try it yourself</small></div></div><div class="path-step"><span>4</span><div><b>Test</b><small>Prove your mastery</small></div></div></div><button class="primary-button full" data-test="${topic.id}">Start topic test ${icon("arrow", 17)}</button></aside>
    </div>`;
  return shell(content, "topics", topic.name);
}

function testView() {
  const topic = topicCatalog.find((item) => item.id === state.selectedTopic);
  if (state.result) return resultView(topic);
  const questions = state.test || [];
  const content = `
    <button class="back-button" data-nav="topics">‹ Leave test</button>
    <header class="test-header"><div><p class="eyebrow purple">${topic.name.toUpperCase()} ASSESSMENT</p><h1>${state.testLevel} concept test</h1><p>Work it out in your notebook, then enter only your final answer.</p></div><div class="test-count"><strong>${questions.length}</strong><span>Questions</span></div></header>
    <div class="level-track"><span class="active">Beginner</span><i></i><span class="${state.testLevel !== "Beginner" ? "active" : ""}">Moderate</span><i></i><span class="${state.testLevel === "Advanced" ? "active" : ""}">Advanced</span></div>
    <form id="test-form" class="test-layout">
      <section class="question-list">${questions.map((question, index) => `
        <article class="question-card">
          <div class="question-number">${String(index + 1).padStart(2, "0")}</div>
          <div><p class="question-label">QUESTION ${index + 1} OF ${questions.length}</p><h2>${question.question}</h2><label>Final answer<input name="${question.id}" placeholder="Enter your answer" autocomplete="off" required /></label></div>
        </article>`).join("")}</section>
      <aside class="submit-panel panel"><span class="stat-icon violet">${icon("brain")}</span><h3>Ready to submit?</h3><p>Check that every answer is complete. You’ll receive concept-level feedback.</p><button class="primary-button full" type="submit">Submit test ${icon("arrow", 17)}</button><small>Passing score: 70%</small></aside>
    </form>`;
  return shell(content, "topics", "Test");
}

function resultView(topic) {
  const result = state.result;
  const nextLevel = state.testLevel === "Beginner" ? "Moderate" : state.testLevel === "Moderate" ? "Advanced" : "Mastered";
  const weakNames = result.weakConcepts.map((id) => topicCatalog.find((item) => item.id === id)?.name || id);
  const content = `
    <header class="result-hero ${result.passed ? "passed" : "retry"}">
      <div>${progressRing(result.score, "Score")}</div>
      <div><p class="eyebrow">${result.passed ? "ASSESSMENT PASSED" : "KEEP BUILDING"}</p><h1>${result.passed ? "Excellent understanding." : "You’re closer than you think."}</h1><p>${result.passed ? `You’re ready for the ${nextLevel} level in ${topic.name}.` : "Review the recommended concepts and try again when you feel ready."}</p></div>
    </header>
    <section class="result-grid">
      <article class="panel"><h2>Answer review</h2><div class="answer-review">${result.results.map((item, index) => `<div class="${item.correct ? "correct" : "incorrect"}"><span>${item.correct ? "✓" : "×"}</span><div><b>${index + 1}. ${item.question}</b><small>Your answer: ${item.studentAnswer || "No answer"}${item.correct ? "" : ` · Correct: ${item.answer}`}</small></div></div>`).join("")}</div></article>
      <aside>
        <article class="panel recommendation"><span class="stat-icon orange">${icon("spark")}</span><h3>Recommended path</h3>${weakNames.length ? `<p>Strengthen these foundations before retesting:</p><div class="path-tags">${weakNames.map((name, i) => `<span>${i + 1}. ${name}</span>`).join("")}<span>${weakNames.length + 1}. ${topic.name}</span></div>` : "<p>No weak concepts detected. Great work.</p>"}</article>
        <div class="result-actions">${result.passed && nextLevel !== "Mastered" ? `<button class="primary-button full" data-next-level="${nextLevel}">Start ${nextLevel} level</button>` : `<button class="primary-button full" data-learn="${topic.id}">Review lesson</button>`}<button class="secondary-button full" data-nav="home">Back to dashboard</button></div>
      </aside>
    </section>`;
  return shell(content, "topics", "Results");
}

function historyView() {
  const history = state.dashboard?.history || [];
  const content = `<header class="page-header"><div><p class="eyebrow purple">YOUR ACTIVITY</p><h1>Learning history</h1><p>A clear record of the work you’ve put in.</p></div></header>
    <section class="panel history-panel">${history.map((item) => `<div class="history-row"><span class="history-icon">${item.score === null ? icon("topics") : icon("check")}</span><div><b>${item.topic}</b><small>${item.action}</small></div><strong>${item.score === null ? "Completed" : `${item.score}%`}</strong><time>${item.date}</time></div>`).join("")}</section>`;
  return shell(content, "history", "History");
}

function profileView() {
  const user = state.user;
  const content = `<header class="page-header"><div><p class="eyebrow purple">YOUR ACCOUNT</p><h1>Profile information</h1><p>Your personal details and learning identity.</p></div></header>
    <section class="profile-layout"><article class="panel profile-card"><span class="large-avatar">${initials(user.name)}</span><h2>${user.name}</h2><p>Mathematics learner</p><div class="profile-stats"><div><strong>7</strong><span>Topics</span></div><div><strong>12.5h</strong><span>Learning</span></div><div><strong>3</strong><span>Mastered</span></div></div></article>
    <article class="panel details-card"><h2>Personal details</h2><div class="detail-row"><span>Name</span><strong>${user.name}</strong></div><div class="detail-row"><span>Email address</span><strong>${user.email}</strong></div><div class="detail-row"><span>Phone number</span><strong>${user.phone || "Not provided"}</strong></div><div class="detail-row"><span>Account type</span><strong>Student</strong></div><button class="secondary-button">Edit profile</button></article></section>`;
  return shell(content, "profile", "Profile");
}

function loadingView() {
  return `<div class="loading-screen"><span class="brand-mark">${icon("brain", 32)}</span><div class="loading-dots"><i></i><i></i><i></i></div></div>`;
}

function render() {
  if (state.loading && !state.dashboard) app.innerHTML = loadingView();
  else if (state.route === "auth") app.innerHTML = authView();
  else if (state.route === "home") app.innerHTML = dashboardView();
  else if (state.route === "topics") app.innerHTML = topicsView();
  else if (state.route === "learn") app.innerHTML = learnView();
  else if (state.route === "test") app.innerHTML = testView();
  else if (state.route === "history") app.innerHTML = historyView();
  else if (state.route === "profile") app.innerHTML = profileView();
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function loadDashboard() {
  state.loading = true;
  render();
  try {
    state.dashboard = await api.getDashboard();
    state.user = state.dashboard.user;
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    state.loading = false;
    state.route = "home";
    render();
  }
}

async function openLesson(topicId) {
  state.selectedTopic = topicId;
  state.loading = true;
  try {
    state.lesson = await api.getLesson(topicId);
    state.route = "learn";
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    state.loading = false;
    render();
  }
}

async function openTest(topicId, level = "Beginner") {
  state.selectedTopic = topicId;
  state.testLevel = level;
  state.result = null;
  state.answers = {};
  state.loading = true;
  try {
    state.test = await api.getTest(topicId, level);
    state.route = "test";
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    state.loading = false;
    render();
  }
}

app.addEventListener("click", async (event) => {
  const target = event.target.closest("button, a, article[data-topic]");
  if (!target) return;
  if (target.matches("[data-action='switch-auth']")) {
    state.authMode = state.authMode === "login" ? "signup" : "login";
    render();
  } else if (target.matches("[data-action='toggle-password']")) {
    const input = document.querySelector("input[name='password']");
    input.type = input.type === "password" ? "text" : "password";
    target.textContent = input.type === "password" ? "Show" : "Hide";
  } else if (target.matches("[data-action='logout']")) {
    sessionStorage.removeItem("infinite-minds-session");
    state.route = "auth";
    state.dashboard = null;
    render();
  } else if (target.dataset.nav) {
    event.preventDefault();
    state.route = target.dataset.nav;
    render();
  } else if (target.dataset.learn) {
    await openLesson(target.dataset.learn);
  } else if (target.dataset.test) {
    await openTest(target.dataset.test);
  } else if (target.dataset.nextLevel) {
    await openTest(state.selectedTopic, target.dataset.nextLevel);
  } else if (target.dataset.topic && !event.target.closest("button")) {
    await openLesson(target.dataset.topic);
  }
});

app.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "auth-form") {
    const data = Object.fromEntries(new FormData(event.target));
    setLoading(true);
    try {
      const response = state.authMode === "login" ? await api.login(data.email, data.password) : await api.signup(data);
      sessionStorage.setItem("infinite-minds-session", response.token);
      state.user = response.user;
      await loadDashboard();
      showToast(`Welcome${state.authMode === "signup" ? "" : " back"}, ${state.user.name.split(" ")[0]}!`);
    } catch (error) {
      showToast(error.message, "error");
      setLoading(false);
    }
  } else if (event.target.id === "practice-form") {
    const answer = new FormData(event.target).get("answer").toLowerCase().replace(/\s/g, "");
    const expected = state.lesson.answer.toLowerCase().replace(/\s/g, "");
    const feedback = document.querySelector("#practice-feedback");
    feedback.className = answer === expected ? "practice-feedback correct" : "practice-feedback incorrect";
    feedback.textContent = answer === expected ? "Correct. You’ve got the idea." : `Not quite. Review the worked example and try again.`;
  } else if (event.target.id === "test-form") {
    const formData = new FormData(event.target);
    state.answers = Object.fromEntries(formData);
    setLoading(true);
    try {
      state.result = await api.submitTest(state.selectedTopic, state.testLevel, state.answers, state.test);
      state.dashboard = await api.getDashboard();
      render();
    } catch (error) {
      showToast(error.message, "error");
      setLoading(false);
    }
  }
});

app.addEventListener("input", (event) => {
  if (event.target.id === "topic-search") {
    const query = event.target.value.toLowerCase();
    document.querySelectorAll("#topic-list .topic-card").forEach((card) => {
      card.hidden = !card.textContent.toLowerCase().includes(query);
    });
  }
});

if (sessionStorage.getItem("infinite-minds-session")) loadDashboard();
else render();
