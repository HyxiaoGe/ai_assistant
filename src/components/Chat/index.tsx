import React, {useState, useEffect} from "react";
import * as chatStorage from "@/utils/chatStorage";
import { Message } from "@/components/Message";
import { Session } from "@/components/Session";

export const Chat = () => {
    const [sessionId, setSessionId] = useState<string>("")
    useEffect(() => {
        const init = async () => {
            const list = await chatStorage.getSessionStore();
            const id = list[0]?.id;
            setSessionId(id);
        };
        init();
    }, []);

    return <div className="h-screen flex w-screen">
        <Session sessionId={sessionId} onChange={setSessionId}></Session>
        <Message sessionId={sessionId}></Message>
    </div>;
};