// src/lib/utils/aiCaption.ts

const funnyPrefixes = [
    "When you",
    "That moment when",
    "Nobody:",
    "Me:",
    "My brain at 3am:",
  ];
  
  const funnyScenarios = [
    "try to code without coffee",
    "finally fix that bug",
    "see your code working on the first try",
    "forget to save your work",
    "have too many browser tabs open",
    "debug production code",
    "write documentation",
    "attend morning standups",
  ];
  
  const funnyResponses = [
    "This is fine",
    "What could go wrong?",
    "Success!",
    "Help me",
    "Why am I like this?",
    "Professional developer",
    "Living my best life",
    "No regrets",
  ];
  
  export const generateMemeCaption = (): { topText: string; bottomText: string } => {
    const prefix = funnyPrefixes[Math.floor(Math.random() * funnyPrefixes.length)];
    const scenario = funnyScenarios[Math.floor(Math.random() * funnyScenarios.length)];
    const response = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
  
    return {
      topText: `${prefix} ${scenario}`,
      bottomText: response,
    };
  };