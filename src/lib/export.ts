import { FunnelSchema, FunnelNode, FunnelEdge } from '@/types/funnel';

export function exportFunnelToJSON(
    nodes: FunnelNode[],
    edges: FunnelEdge[],
    metadata?: { name?: string }
): string {
    const schema: FunnelSchema = {
        version: 1,
        lastModified: new Date().toISOString(),
        nodes,
        edges,
        metadata: {
            ...metadata,
            createdAt: metadata?.name ? new Date().toISOString() : new Date().toISOString(),
        },
    };

    return JSON.stringify(schema, null, 2);
}

export function importFunnelFromJSON(json: string): {
    nodes: FunnelNode[];
    edges: FunnelEdge[];
    metadata?: FunnelSchema['metadata'];
} | null {
    try {
        const schema: FunnelSchema = JSON.parse(json);

        // Validate schema version
        if (schema.version !== 1) {
            throw new Error('Unsupported schema version');
        }

        // Validate required fields
        if (!schema.nodes || !schema.edges) {
            throw new Error('Invalid funnel schema');
        }

        return {
            nodes: schema.nodes,
            edges: schema.edges,
            metadata: schema.metadata,
        };
    } catch (error) {
        console.error('Failed to import funnel:', error);
        return null;
    }
}

export function downloadJSON(json: string, filename?: string) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `funnel-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
