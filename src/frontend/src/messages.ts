// ─── All lovey-dovey messages for Bloom. ───────────────────────────────────

export const TASK_COMPLETE_MESSAGES = [
  "Kiddo is sooooo proud of youuu 🥺",
  "You did so well today my honeyyy pieee 💗",
  "That's my good girl! 🌸",
  "Look at you gooo 💕 so proud!!",
  "Yayyyy one more down 🥹 you're amazing",
];

export const MORNING_GREETINGS = [
  "Good morning my sweetie pieee ☀️ you got this today",
  "Rise and shine my love 🌸 today is going to be beautiful",
  "Good morning! ☀️ I believe in everything you're going to do today",
];

export const AFTERNOON_GREETINGS = [
  "Hey my dear 🌸 don't forget to take a little break!",
  "Heyy 💗 you're doing so well today, keep going!",
  "Midday check-in 🌿 have you had water? Have you breathed?",
];

export const EVENING_GREETINGS = [
  "You did so well today my honeyyy 💗 rest up now",
  "Evening, love 🌙 time to slow down and be gentle with yourself",
  "Look at everything you did today 🥹 I'm so proud of you",
];

export const COMFORT_MESSAGES = [
  "It's okay my jaanuuu, I know you're giving your best 🥺 I'm so proud of youuuu",
  "The effort you give every single day makes me feel so blessed 💗",
  "I'm always here for you, always 🌸 no matter what",
  "You don't have to be perfect. Just being you is more than enough 🥹",
  "Take a breath. You are doing so much better than you think 💕",
  "Some days are hard. That's okay. You're still here, still trying 🥺",
];

export const MOTIVATION_MESSAGES = [
  "I'm always rooting for you mommyyyyyyy 💗",
  "Don't forget to smile okay? You're my good girl babyyyy 😌",
  "Every small step you take makes me so proud 🥺",
  "You are so so loved, always remember that 💕",
  "You've already come so far 🌸 look how much you've grown",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getDailyGreeting(): string {
  const hour = new Date().getHours();
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  if (hour < 12) {
    return MORNING_GREETINGS[dayOfYear % MORNING_GREETINGS.length];
  }
  if (hour < 17) {
    return AFTERNOON_GREETINGS[dayOfYear % AFTERNOON_GREETINGS.length];
  }
  return EVENING_GREETINGS[dayOfYear % EVENING_GREETINGS.length];
}

export function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
