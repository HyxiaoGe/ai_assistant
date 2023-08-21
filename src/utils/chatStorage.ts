// 存储 chatLogs
import { MessageList, ChatLogsStorageType } from "@/types";
import { getLocalStorage, setLocalStorage } from "./storage";

const CHAT_LOGS_STORAGES_KEY = "ai_chatLogs";

export const getChatLogsContainer = () => {
    let list = getLocalStorage<ChatLogsStorageType>(CHAT_LOGS_STORAGES_KEY);

    if (!list) {
        list = {};
        setLocalStorage(CHAT_LOGS_STORAGES_KEY, list);
    }
    return list;
};

export const getChatLogs = (key: string) => {
    const list = getChatLogsContainer();
    return list[key] || [];
};

export const updateChatLogs = (key: string, logs: MessageList) => {
    const list = getChatLogsContainer();
    list[key] = logs;
    setLocalStorage(CHAT_LOGS_STORAGES_KEY, list);
}

export const removeChatLogs = (key: string) => {
    const list = getChatLogsContainer();
    delete list[key];
    setLocalStorage(CHAT_LOGS_STORAGES_KEY, list);
}