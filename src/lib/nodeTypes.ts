import { NodeType, NodeTypeConfig } from '@/types/funnel';

export const NODE_TYPES: Record<NodeType, NodeTypeConfig> = {
    sales: {
        type: 'sales',
        label: 'Sales Page',
        icon: 'ShoppingCart',
        color: 'bg-blue-500',
        defaultButtonText: 'Buy Now',
        description: 'Initial sales page where customers land',
    },
    order: {
        type: 'order',
        label: 'Order Page',
        icon: 'FileText',
        color: 'bg-green-500',
        defaultButtonText: 'Complete Order',
        description: 'Order form and checkout page',
    },
    upsell: {
        type: 'upsell',
        label: 'Upsell',
        icon: 'TrendingUp',
        color: 'bg-purple-500',
        defaultButtonText: 'Yes, Add This!',
        description: 'Offer additional products or upgrades',
    },
    downsell: {
        type: 'downsell',
        label: 'Downsell',
        icon: 'TrendingDown',
        color: 'bg-orange-500',
        defaultButtonText: 'Get This Instead',
        description: 'Alternative offer at lower price point',
    },
    'thank-you': {
        type: 'thank-you',
        label: 'Thank You',
        icon: 'CheckCircle',
        color: 'bg-emerald-500',
        defaultButtonText: 'Continue',
        description: 'Final confirmation and thank you page',
    },
};

export const getNodeTypeConfig = (type: NodeType): NodeTypeConfig => {
    return NODE_TYPES[type];
};
