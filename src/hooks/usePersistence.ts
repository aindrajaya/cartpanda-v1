import { useEffect } from 'react';
import { useFunnelState } from './useFunnelState';
import { FunnelNode, FunnelEdge } from '@/types/funnel';

const STORAGE_KEY = 'cartpanda-funnel-state';
const DEBOUNCE_MS = 300;

let saveTimeout: NodeJS.Timeout | null = null;

export function usePersistence() {
    const { nodes, edges, importJSON } = useFunnelState();

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                importJSON(savedData);
            } catch (error) {
                console.error('Failed to load saved funnel:', error);
            }
        }
    }, [importJSON]);

    // Save to localStorage on state changes (debounced)
    useEffect(() => {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        saveTimeout = setTimeout(() => {
            const data = {
                version: 1,
                lastModified: new Date().toISOString(),
                nodes,
                edges,
                metadata: {
                    createdAt: new Date().toISOString(),
                },
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }, DEBOUNCE_MS);

        return () => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
        };
    }, [nodes, edges]);
}
