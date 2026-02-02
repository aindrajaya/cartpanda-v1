import {
    FunnelNode,
    FunnelEdge,
    ValidationResult,
    ValidationError,
    ValidationWarning,
} from '@/types/funnel';

export function validateFunnel(
    nodes: FunnelNode[],
    edges: FunnelEdge[]
): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for Thank You nodes with outgoing edges
    nodes.forEach((node) => {
        if (node.data.type === 'thank-you') {
            const outgoingEdges = edges.filter((edge) => edge.source === node.id);
            if (outgoingEdges.length > 0) {
                errors.push({
                    nodeId: node.id,
                    message: 'Thank You pages cannot have outgoing connections',
                });
            }
        }
    });

    // Check for disconnected nodes (except the first one)
    if (nodes.length > 1) {
        const connectedNodeIds = new Set<string>();

        edges.forEach((edge) => {
            connectedNodeIds.add(edge.source);
            connectedNodeIds.add(edge.target);
        });

        nodes.forEach((node) => {
            if (!connectedNodeIds.has(node.id)) {
                warnings.push({
                    nodeId: node.id,
                    message: 'This node is not connected to the funnel',
                });
            }
        });
    }

    // Check for nodes without outgoing edges (except Thank You nodes)
    nodes.forEach((node) => {
        if (node.data.type !== 'thank-you') {
            const outgoingEdges = edges.filter((edge) => edge.source === node.id);
            if (outgoingEdges.length === 0 && nodes.length > 1) {
                warnings.push({
                    nodeId: node.id,
                    message: 'This node has no next step in the funnel',
                });
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
