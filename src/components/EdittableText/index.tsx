import React, {useState} from "react";
import clsx from 'clsx';

type Props = {
    text: string;
    onSave: (name: string) => void;
}

export const EdittableText = (props: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(props.text);
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            setIsEditing(false);
            props.onSave(text);
        }
    };
    
    const onBlur = () => {
        // 如果触发失焦事件，将初始化状态和原始数据
        if (isEditing) {
            setIsEditing(false);
            props.onSave(text);
        }
    }

    if (isEditing) {
        return <input 
        className={clsx([
            "w-[10rem]",
            "flex",
            "items-center",
            "h-[2rem]",
            "outline-none",
            "border-0",
        ])}
        type="text" 
        value={text} 
        onChange={onChange} 
        onKeyDown={onKeyDown} 
        onBlur={onBlur} 
        autoFocus />;
    } else {
        return (<div
        className={clsx([
            "leading-9",
            "w-[10rem]",
            "h-[2rem]",
            "overflow-hidden",
            "text-ellipsis",
            "white-space-nowrap",
        ])}
        onDoubleClick={() => setIsEditing(true)}
        >
            {text}
        </div>);
    }
}