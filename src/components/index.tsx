import { KeyboardEvent, useEffect, useState } from 'react';
import chatService from '@/utils/chatService';
import { ActionIcon, Textarea } from '@mantine/core';
import { MessageList } from '@/types';
import clsx from 'clsx';
import { getChatLogs, updateChatLogs, removeChatLogs } from '@/utils/chatStorage';
import { IconSend, IconSendOff, IconEraser } from '@tabler/icons-react';

const LOCAL_KEY = "ai_demo";

export const Chat = () => {
    
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [chatList, setChatList] = useState<MessageList>([]);

    chatService.actions = {
        onCompleting: (sug) => setSuggestions(sug),
        onCompleted: () => {
            setLoading(false);
        }
    }

    useEffect(() => {
        const logs = getChatLogs(LOCAL_KEY);
        setChatList(logs);
    }, [])

    const onClear = () => {
        removeChatLogs(LOCAL_KEY);
        setChatList([]);
    }

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
        }
    };

    const setSuggestions = (suggestions: string) => {

        if (suggestions === '') return;
        const len = chatList.length;
        const lastMessage = len ? chatList[len - 1] : null;
        let newList: MessageList = [];
        if (lastMessage?.role === 'assistant') {
            newList = [...chatList.slice(0, len - 1), {...lastMessage, content: suggestions}];
        } else {
            newList = [...chatList, {role: 'assistant', content: suggestions}];
        }
        setMessage(newList);
    };

    const setMessage = (msg: MessageList) => {
        setChatList(msg);
        updateChatLogs(LOCAL_KEY, msg);
    };

    const onSubmit = () => {
        if (loading) {
            return chatService.cancel();
        }
        if (!prompt.trim()) return;
        let list: MessageList = [
            ...chatList,
            {
            role: "user",
            content: prompt,
            },
        ];
        setMessage(list);
        setLoading(true);
        chatService.getStream({prompt, history: list.slice(-6)});
        setPrompt("");
    }

    return (
        <div className='h-screen flex flex-col items-center'>
            <div 
                className={clsx([
                    'flex-col',
                    'h-[calc(100vh-10rem)]',
                    'w-full',
                    'overflow-y-auto',
                    'rounded-md',
                    'px-8',
                ])}
            >
                {chatList.map((item, index) => (
                    <div key={`${item.role}-${index}`} className={clsx(
                        {
                            flex: item.role === 'user',
                            'flex-col': item.role === 'user',
                            'items-end': item.role === 'user',
                        },
                        "mt-4",
                    )}>
                        <div>{item.role}</div>
                        <div
                        className={clsx(
                            'rounded-md',
                            'shadow-md',
                            'px-4',
                            'py-2',
                            'mt-1',
                            'w-full',
                            'max-w-4xl',
                        )}
                        >{item.content}</div>
                    </div>
                ))}
            </div>
            <div className='flex items-center w-3/5'>
            <ActionIcon
             className='mr-2'
             disabled={loading}
             onClick={() => onClear()}
             >
                <IconEraser></IconEraser>
            </ActionIcon>
            <Textarea
            className='w-full'
            placeholder='Type a message...'
            value={prompt}
            disabled={loading}
            onKeyDown={(event) => onKeyDown(event)}
            onChange={(event) => setPrompt(event.target.value)}
            >
            </Textarea>
            <ActionIcon
             className='ml-2'
             onClick={() => onSubmit()}
             >
                {
                    loading ? <IconSendOff/> : <IconSend/>
                }
                </ActionIcon>
            </div>
        </div>
    );
};