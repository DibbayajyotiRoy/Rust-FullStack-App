import { useRef, useState } from 'react';
import EmailEditor, { type EditorRef, type EmailEditorProps } from 'react-email-editor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface Template {
    id: string;
    name: string;
    updatedAt: string;
    json: any;
}

const mockTemplates: Template[] = [
    { id: '1', name: 'Standard Monthly Payslip', updatedAt: '2026-01-10', json: {} }
];

export default function PayslipTemplateEditor() {
    const emailEditorRef = useRef<EditorRef>(null);
    const [templates, setTemplates] = useState<Template[]>(mockTemplates);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

    const exportHtml = () => {
        const unlayer = emailEditorRef.current?.editor;

        unlayer?.exportHtml((data) => {
            const { design, html } = data;
            console.log('exportHtml', html);
            console.log('design', design);

            if (currentTemplate) {
                // Update existing
                setTemplates(prev => prev.map(t =>
                    t.id === currentTemplate.id ? { ...t, json: design, updatedAt: new Date().toISOString().split('T')[0] } : t
                ));
                toast.success("Template saved successfully");
            } else {
                // Save new
                const newTemplate: Template = {
                    id: Date.now().toString(),
                    name: newTemplateName || "Untitled Template",
                    updatedAt: new Date().toISOString().split('T')[0],
                    json: design
                };
                setTemplates([...templates, newTemplate]);
                setCurrentTemplate(newTemplate);
                toast.success("New template created");
            }
        });
    };

    const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
        console.log('Context: Editor loaded');
        if (currentTemplate && currentTemplate.json && Object.keys(currentTemplate.json).length > 0) {
            unlayer.loadDesign(currentTemplate.json);
        }
    };

    const handleCreateNew = () => {
        setNewTemplateName("");
        setIsNameDialogOpen(true);
    };

    const startNewEditor = () => {
        setCurrentTemplate(null);
        setIsNameDialogOpen(false);
        setIsEditorOpen(true);
    };

    const handleEdit = (template: Template) => {
        setCurrentTemplate(template);
        setIsEditorOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            {!isEditorOpen ? (
                <>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold type-header">Payslip Templates</h1>
                            <p className="type-secondary">Manage email templates for employee payslips</p>
                        </div>
                        <Button size="sm" className="gap-2" onClick={handleCreateNew}>
                            <Plus className="h-4 w-4" />
                            Create Template
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(template => (
                            <Card key={template.id} className="p-6 flex flex-col justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{template.name}</h3>
                                    <p className="text-sm text-muted-foreground">Last updated: {template.updatedAt}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={() => handleEdit(template)}>
                                        Edit Design
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Name Your Template</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    placeholder="e.g., Annual Bonus Payslip"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsNameDialogOpen(false)}>Cancel</Button>
                                <Button onClick={startNewEditor} disabled={!newTemplateName.trim()}>Start Designing</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                <div className="flex flex-col h-[calc(100vh-100px)]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>
                                &larr; Back
                            </Button>
                            <div>
                                <h2 className="font-semibold">{currentTemplate?.name || newTemplateName}</h2>
                                <p className="text-xs text-muted-foreground">Editing Mode</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={exportHtml} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save Template
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 border rounded-lg overflow-hidden bg-background">
                        <EmailEditor
                            ref={emailEditorRef}
                            onLoad={onLoad}
                            minHeight="100%"
                            options={{
                                displayMode: 'email',
                                appearance: {
                                    theme: 'modern_light', // Unlayer handles its own theming, forcing light for consistency or 'modern_dark' if paid plan
                                    panels: {
                                        tools: {
                                            dock: 'left'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
