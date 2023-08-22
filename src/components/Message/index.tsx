import { KeyboardEvent, useEffect, useState } from 'react';
import chatService from '@/utils/chatService';
import { ActionIcon, Textarea, Button, Popover } from '@mantine/core';
import Link from 'next/link';
import { Assistant, MessageList } from '@/types';
import clsx from 'clsx';
import * as chatStorage from '@/utils/chatStorage';
import { IconSend, IconSendOff, IconEraser,IconDotsVertical } from '@tabler/icons-react';
import { AssistantSelect } from '../AssistantSelect';

type Props = {
    sessionId: string;
}

export const Message = ({sessionId}: Props) => {
    
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<MessageList>([]);
    const [assistant, setAssistant] = useState<Assistant>();

    const updateMessage = (msg: MessageList) => {
        setMessage(msg);
        chatStorage.updateMessage(sessionId, msg);
    }

    chatService.actions = {
        onCompleting: (sug) => setSuggestions(sug),
        onCompleted: () => {
            setLoading(false);
        }
    }

    useEffect(() => {
        const msg = chatStorage.getMessage(sessionId);
        const session = chatStorage.getSession(sessionId);
        if (session) {
            setAssistant(session.assistant);
        }

        setMessage(msg);
        if (loading) {
            chatService.cancel();
        }
    }, [sessionId]);

    const onAddAssistantChange = (assistant: Assistant) => {
        setAssistant(assistant);
        chatStorage.updateSession(sessionId, {
            assistant: assistant.id,
        });
    }

    const onClear = () => {
        updateMessage([]);
    }

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
        }
    };

    const setSuggestions = (suggestions: string) => {

        if (suggestions === '') return;
        const len = message.length;
        const lastMessage = len ? message[len - 1] : null;
        let newList: MessageList = [];
        if (lastMessage?.role === 'assistant') {
            newList = [...message.slice(0, len - 1), {...lastMessage, content: suggestions}];
        } else {
            newList = [...message, {role: 'assistant', content: suggestions}];
        }
        setMessages(newList);
    };

    const setMessages = (msg: MessageList) => {
        setMessage(msg);
        chatStorage.updateMessage(sessionId, msg);
    };

    const onSubmit = () => {
        if (loading) {
            return chatService.cancel();
        }
        if (!prompt.trim()) return;
        let list: MessageList = [
            ...message,
            {
            role: "user",
            content: prompt,
            },
        ];
        setMessages(list);
        setLoading(true);
        chatService.getStream({
            prompt, 
            options: assistant,
            history: list.slice(-assistant?.max_log!)
        });
        setPrompt("");
    }

    return (
        <div className='h-screen flex flex-col w-full'>
            <div
                className={clsx([
                    "flex",
                    "justify-between",
                    "items-center",
                    "p-4",
                    "shadow-sm",
                    "h-[6rem]"
                ])}
            >
                <Popover width={100} position="bottom" withArrow shadow="sm">
                    <Popover.Target>
                        <Button 
                        size="sm" 
                        variant="subtle"
                        className='px-1'
                        rightIcon={<IconDotsVertical size="1rem"></IconDotsVertical>}
                        >
                            AI 助理
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Link href="/assistant">助理管理</Link>
                    </Popover.Dropdown>
                </Popover>
                <AssistantSelect 
                value={assistant?.id} 
                onChange={onAddAssistantChange}>
                </AssistantSelect>
            </div>
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
                {message.map((item, index) => (
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