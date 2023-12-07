import React, {useState, useEffect, useMemo} from "react";
import { ActionIcon } from "@mantine/core";
import {
    IconMicrophone,
    IconLoader2,
    IconPointer,
    IconCircle,
} from "@tabler/icons-react";

export function Voice() {

    const [isRecording, setIsRecording] = useState(false);
    const [isGranted, setIsGranted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const isDisabled = useMemo(() => {
      return isLoading || !isGranted || isPlaying;
    }, [isLoading, isGranted, isPlaying]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {isLoading ? (
                <div className="flex items-center">
                    <IconLoader2 size="1rem" className="animate-spin mr-2"></IconLoader2>
                    Loading...
                </div>
            ) : isPlaying ? (
                <div className="flex items-center">
                    <IconCircle className="animate-ping mr-2" size="1rem"></IconCircle>
                    Playing
                </div>
            ) : (
                <div className="text-gray-600 flex items-center">
                    <IconPointer className="mr-2" size="1rem"></IconPointer>
                    Hold to ask~
                </div>
            )}

        <ActionIcon
                className="mt-4"
                size="4rem"
                disabled={isDisabled}
            >
            <IconMicrophone color={isRecording ? "red" : "green"}></IconMicrophone>
        </ActionIcon>
        </div>
    );
}