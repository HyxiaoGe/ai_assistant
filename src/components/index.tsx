import { KeyboardEvent, useEffect, useState } from 'react';
import { getCompletion } from '@/utils/getCompletion';
import { ActionIcon, Textarea } from '@mantine/core';
import { ChatLogsType } from '@/types';
import clsx from 'clsx';
import { getChatLogs, updateChatLogs, removeChatLogs } from '@/utils/chatStorage';
import { IconSend, IconEraser } from '@tabler/icons-react';
import { clear } from 'console';

const LOCAL_KEY = "ai_demo";

export const Chat = () => {
    
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [completion, setCompletion] = useState<string>('');
    const [chatList, setChatList] = useState<ChatLogsType>([]);

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
            getAIResp();
        }
    };

    const setChatLogs = (logs: ChatLogsType) => {
        setChatList(logs);
        updateChatLogs(LOCAL_KEY, logs);
    };

    const getAIResp = async () => {
        setLoading(true);
        const list = [
            ...chatList,
            {
                role: "user",
                content: prompt
            },
        ]
        setChatLogs(list);
        const resp = await getCompletion({
            prompt: prompt
        });
        setPrompt('');
        setCompletion(resp.content);
        setChatLogs([
            ...list,
            {
                role: "assistant",
                content: resp.content
            },
        ]);
        setLoading(false);
    };

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
             loading={loading}
             onClick={() => getAIResp()}
             >
                <IconSend></IconSend>
                </ActionIcon>
            </div>
        </div>
    );
};