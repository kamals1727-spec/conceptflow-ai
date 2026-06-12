import { lessons, testQuestions, topicCatalog } from "./data.js";

const config = window.INFINITE_MINDS_CONFIG || {};
const STORAGE_KEY = "infinite-minds-state-v1";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultState = {
  user: {
    id: "student-1",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
  },
  progress: Object.fromEntries(topicCatalog.map((topic) => [topic.id, topic.progress])),
  history: [
    { topic: "Integration", action: "Advanced test", score: 85, date: "Today" },
    { topic: "Trigonometry", action: "Learn session", score: null, date: "Yesterday" },
    { topic: "Algebra", action: "Moderate test", score: 78, date: "2 days ago" },
  ],
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeAnswer(value) {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replaceAll("²", "^2")
    .replaceAll("³", "^3")
    .replace(/\+c$/, "+c");
}

async function request(path, options = {}) {
  if (config.USE_MOCK_API !== false || !config.API_BASE_URL) {
    throw new Error("MOCK_REQUEST");
  }

  const response = await fetch(`${config.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Request failed");
  }

  return response.json();
}

export const api = {
  async login(email, password) {
    try {
      return await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      if (error.message !== "MOCK_REQUEST") throw error;
      await delay();
      if (!email || !password) throw new Error("Email and password are required.");
      const state = loadState();
      state.user.email = email;
      saveState(state);
      return { token: "mock-session-token", user: state.user };
    }
  },

  async signup(payload) {
    try {
      return await request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (error.message !== "MOCK_REQUEST") throw error;
      await delay();
      const state = loadState();
      state.user = { id: `student-${Date.now()}`, ...payload };
      delete state.user.password;
      saveState(state);
      return { token: "mock-session-token", user: state.user };
    }
  },

  async getDashboard() {
    try {
      return await request("/dashboard");
    } catch (error) {
      if (error.message !== "MOCK_REQUEST") throw error;
      await delay(120);
      const state = loadState();
      return { ...state, topics: topicCatalog.map((topic) => ({ ...topic, progress: state.progress[topic.id] ?? 0 })) };
    }
  },

  async getLesson(topicId) {
    try {
      return await request(`/topics/${topicId}/learn`);
    } catch (error) {
      if (error.message !== "MOCK_REQUEST") throw error;
      await delay(150);
      return lessons[topicId];
    }
  },

  async getTest(topicId, level) {
    try {
      return await request(`/topics/${topicId}/test?level=${level}`);
    } catch (error) {
      if (error.message !== "MOCK_REQUEST") throw error;
      await delay(150);
      return testQuestions[topicId].map(([question, answer], index) => ({
        id: `${topicId}-${index + 1}`,
        question,
        answer,
        concept: index === 0 ? topicId : index === 1 ? "functions" : "foundations",
      }));
    }
  },

  async submitTest(topicId, level, answers, questions) {
    try {
      return await request(`/topics/${topicId}/test`, {
        method: "POST",
        body: JSON.stringify({ level, answers }),
      });
    } catch (error) {
      if (error.message !== "MOCK_REQUEST") throw error;
      await delay(350);
      const results = questions.map((question) => {
        const correct = normalizeAnswer(answers[question.id]) === normalizeAnswer(question.answer);
        return { ...question, studentAnswer: answers[question.id] || "", correct };
      });
      const correctCount = results.filter((result) => result.correct).length;
      const score = Math.round((correctCount / results.length) * 100);
      const weakConcepts = [...new Set(results.filter((result) => !result.correct).map((result) => result.concept))];
      const state = loadState();
      state.progress[topicId] = Math.max(state.progress[topicId] || 0, score);
      state.history.unshift({
        topic: topicCatalog.find((topic) => topic.id === topicId)?.name || topicId,
        action: `${level} test`,
        score,
        date: "Just now",
      });
      saveState(state);
      return { score, correctCount, total: results.length, passed: score >= 70, weakConcepts, results };
    }
  },
};
