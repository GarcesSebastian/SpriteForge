"use client";

import { FC } from "react";

interface FloatingGitHubButtonProps {
    url: string;
}

import Button from "@/components/common/Button";

export const FloatingGitHubButton: FC<FloatingGitHubButtonProps> = ({ url }) => {
    return (
        <div className="group fixed bottom-4 right-4 z-50">
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Contribute on GitHub">
                <Button variant="primary" size="icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                    </svg>
                </Button>
            </a>
            <div className="absolute right-full top-1/2 mr-4 -translate-y-1/2 scale-90 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 hidden md:block">
                ¡Anímate a contribuir!
                <div className="absolute left-full top-1/2 -translate-y-1/2">
                    <div className="h-0 w-0 border-y-4 border-y-transparent border-l-4 border-l-gray-900"></div>
                </div>
            </div>
        </div>
    );
};
