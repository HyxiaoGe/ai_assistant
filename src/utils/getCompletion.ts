import { type } from "os"
import { ChatLogType } from "../types"

type Props = {
    prompt: string;
    history?: ChatLogType[];
    options?: {
        temperature?: number;
        max_tokens?: number;
    };
}

export const getCompletion = async (params: Props) => {
    const resp = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(params),
    });

    if (!resp.ok) {
        throw new Error(resp.statusText);
    }
    const data = resp.json();
    return data;
}