export const MESSAGE_STORE = "ai_assistant_message"
export const SESSION_STORE = "ai_assistant_session"
export const ASSISTANT_STORE = "ai_assistant"

export const ASSISTANT_INIT = [
    {
        name: "AI 助手",
        prompt: "你是一个智能 AI 助手，可以回答一些问题，也可以和用户聊天。",
        temperature: 0.7,
        max_log: 4,
        max_tokens: 800,
    },
];