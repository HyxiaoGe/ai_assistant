import { useState } from 'react';
import { getCompletion } from '@/utils/getCompletion';
import { Textarea, Button } from '@mantine/core';

export const Chat = () => {
    
    const [prompt, setPrompt] = useState('');

    const getAIResp = async () => {
        const resp = await getCompletion({
            prompt: prompt
        });
        setCompletion(resp.content);
        console.log(resp);
    };

    const [completion, setCompletion] = useState('');

    return (
        <div className='h-screen flex flex-col items-center'>
            <div>
                {completion}
            </div>
            <div className='flex items-center w-3/5'>
            <Textarea
            className='w-full'
            placeholder='Type a message...'
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            >
            </Textarea>
            <Button onClick={ () => getAIResp() }>Send</Button>
            </div>
        </div>
    );
};