import React, { useState } from 'react';
import {
    Download,
    Upload,
    Trash2,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useFunnelState } from '@/hooks/useFunnelState';
import { downloadJSON } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import { validateFunnel } from '@/lib/validation';

export function Toolbar() {
    const { nodes, edges, exportJSON, importJSON, reset } = useFunnelState();
    const { toast } = useToast();
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    const validation = validateFunnel(nodes, edges);
    const hasErrors = validation.errors.length > 0;
    const hasWarnings = validation.warnings.length > 0;

    const handleExport = () => {
        const json = exportJSON();
        downloadJSON(json);
        toast({
            title: 'Funnel exported',
            description: 'Your funnel has been downloaded as JSON.',
        });
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const json = e.target?.result as string;
            const success = importJSON(json);

            if (success) {
                toast({
                    title: 'Funnel imported',
                    description: 'Your funnel has been successfully loaded.',
                });
                setImportDialogOpen(false);
            } else {
                toast({
                    title: 'Import failed',
                    description: 'The file format is invalid or corrupted.',
                    variant: 'destructive',
                });
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
            reset();
            toast({
                title: 'Canvas cleared',
                description: 'All nodes and connections have been removed.',
            });
        }
    };

    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900">
                    Cartpanda Funnel Builder
                </h1>

                {/* Validation Status */}
                <div className="flex items-center gap-2">
                    {hasErrors && (
                        <div
                            className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                            role="status"
                            aria-live="polite"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <span>{validation.errors.length} error(s)</span>
                        </div>
                    )}
                    {hasWarnings && !hasErrors && (
                        <div
                            className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700"
                            role="status"
                            aria-live="polite"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <span>{validation.warnings.length} warning(s)</span>
                        </div>
                    )}
                    {!hasErrors && !hasWarnings && nodes.length > 0 && (
                        <div
                            className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                            role="status"
                            aria-live="polite"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Valid funnel</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Export Button */}
                <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    disabled={nodes.length === 0}
                >
                    <Download className="h-4 w-4" />
                    Export JSON
                </Button>

                {/* Import Button */}
                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                            Import JSON
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Import Funnel</DialogTitle>
                            <DialogDescription>
                                Select a JSON file to import your funnel. This will replace the
                                current funnel.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Clear Button */}
                <Button
                    onClick={handleReset}
                    variant="destructive"
                    size="sm"
                    disabled={nodes.length === 0}
                >
                    <Trash2 className="h-4 w-4" />
                    Clear Canvas
                </Button>
            </div>
        </header>
    );
}
