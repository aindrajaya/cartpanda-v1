import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
    ShoppingCart,
    FileText,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    LucideIcon,
} from 'lucide-react';
import { NodeData } from '@/types/funnel';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
    ShoppingCart,
    FileText,
    TrendingUp,
    TrendingDown,
    CheckCircle,
};

export const CustomNode = memo(({ data, selected }: NodeProps<NodeData>) => {
    const config = {
        sales: { icon: 'ShoppingCart', color: 'bg-blue-500' },
        order: { icon: 'FileText', color: 'bg-green-500' },
        upsell: { icon: 'TrendingUp', color: 'bg-purple-500' },
        downsell: { icon: 'TrendingDown', color: 'bg-orange-500' },
        'thank-you': { icon: 'CheckCircle', color: 'bg-emerald-500' },
    };

    const nodeConfig = config[data.type];
    const Icon = iconMap[nodeConfig.icon];
    const hasWarnings = data.warnings && data.warnings.length > 0;

    return (
        <div
            role="article"
            aria-label={`${data.label} node`}
            className={cn(
                'min-w-[200px] rounded-lg border-2 bg-white shadow-md transition-all',
                selected && 'ring-2 ring-blue-500 ring-offset-2',
                !data.isValid && 'border-red-500',
                hasWarnings && data.isValid && 'border-yellow-500',
                data.isValid && !hasWarnings && 'border-gray-200'
            )}
        >
            {/* Node Header */}
            <div className={cn('flex items-center gap-2 rounded-t-md p-3', nodeConfig.color)}>
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                <span className="font-semibold text-white">{data.label}</span>
            </div>

            {/* Node Body */}
            <div className="p-3">
                <div className="rounded bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-700">
                    {data.buttonText}
                </div>

                {/* Warnings */}
                {hasWarnings && (
                    <div className="mt-2 space-y-1">
                        {data.warnings.map((warning, idx) => (
                            <div
                                key={idx}
                                className="text-xs text-yellow-700"
                                role="alert"
                            >
                                ⚠️ {warning}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Connection Handles */}
            {data.type !== 'thank-you' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!h-3 !w-3 !bg-blue-500"
                    aria-label="Connection point to next node"
                />
            )}
            <Handle
                type="target"
                position={Position.Left}
                className="!h-3 !w-3 !bg-blue-500"
                aria-label="Connection point from previous node"
            />
        </div>
    );
});

CustomNode.displayName = 'CustomNode';
