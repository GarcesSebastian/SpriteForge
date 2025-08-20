"use client"

import { useState } from 'react';
import { Button, Input } from '@/components/common';
import { Copy, Eye, Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ShareFormProps {
  onClose: () => void;
}

export default function ShareForm({ onClose }: ShareFormProps) {
    const { data: session } = useSession();
    const [permission, setPermission] = useState<'view' | 'edit'>('view');
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}?email=${session?.user?.email}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl p-4 z-50">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Share Project</h3>
        <div className="space-y-3">
            <div className="relative">
            <Input
                type="text"
                value={shareUrl}
                readOnly
                fullWidth
                variant="default"
                className="pr-10"
            />
            <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
            >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-400'}`} />
            </Button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => setPermission(permission === 'view' ? 'edit' : 'view')}
                        variant={permission === 'view' ? 'outline' : 'primary'}
                        size="sm"
                    >
                        {permission === 'view' ? <Eye className="w-4 h-4 mr-2" /> : <Pencil className="w-4 h-4 mr-2" />}
                        <span>{permission === 'view' ? 'Can view' : 'Can edit'}</span>
                    </Button>
                </div>
                <Button onClick={onClose} variant="secondary" size="sm">Done</Button>
            </div>
        </div>
        </div>
    );
}
