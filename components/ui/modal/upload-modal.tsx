'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import Image from 'next/image';
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UploadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ file: File; preview: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = useCallback((file: File) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Veuillez sélectionner une image')
                return
            }
            const preview = URL.createObjectURL(file)
            setSelectedFile({ file, preview })
        }
    }, [])

    const handleRemoveFile = useCallback(() => {
        if (selectedFile) {
            URL.revokeObjectURL(selectedFile.preview)
            setSelectedFile(null)
        }
    }, [selectedFile])

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open && selectedFile) {
            URL.revokeObjectURL(selectedFile.preview)
            setSelectedFile(null)
        }
        onOpenChange(open)
    }, [selectedFile, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">Importer votre photo</DialogTitle>
                </DialogHeader>

                {/* Upload Zone */}
                <div className="mt-4">
                    {selectedFile ? (
                        // Aperçu de l'image
                        <div className="relative">
                            <Image 
                                src={selectedFile.preview}
                                alt="Aperçu"
                                className="w-full rounded-lg object-cover"
                                style={{ maxHeight: '300px' }}
                                width={500}
                                height={300}
                            />
                      
                            <div className="mt-4 flex justify-center">
                                <Button 
                                    variant="outline"
                                    onClick={handleRemoveFile}
                                >
                                    Changer l'image
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Zone de drop
                        <label className="cursor-pointer block">
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileSelect(file)
                                }}
                            />
                            <div 
                                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                                    isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                                } p-12 transition-colors hover:bg-gray-50`}
                                onDragEnter={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsDragging(true)
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (e.currentTarget.contains(e.relatedTarget as Node)) return
                                    setIsDragging(false)
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsDragging(false)
                                    const file = e.dataTransfer.files?.[0]
                                    if (file) handleFileSelect(file)
                                }}
                            >
                                <Upload className="mb-4 h-8 w-8 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium">Déposez ou parcourez vos photos</h3>
                                <p className="mb-4 text-sm text-gray-500">
                                    Formats: JPG, PNG, GIF Max size: 5MB
                                </p>
                            </div>
                        </label>
                    )}
                </div>

                {/* Sample Video Section */}
                <div className="mt-6">
                    <p className="mb-4 text-center text-sm text-gray-500">Or try this sample video</p>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                            <Image 
                                src="/welcome-thumbnail.jpg" 
                                alt="Welcome video thumbnail"
                                className="h-full w-full object-cover"
                                width={48}
                                height={48}
                            />
                        </div>
                        <div>
                            <h4 className="font-medium">Welcome to Submagic</h4>
                            <p className="text-sm text-gray-500">32s</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 