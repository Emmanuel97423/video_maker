'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import { detectRealEstate } from "../lib/hugging-face/image-detection"
import { useVideoGeneration } from "@/hooks/useVideoGeneration"
import { VIDEO_GENERATION_STATUS } from "@/lib/types/kling"
import { VideoServiceProvider } from "@/lib/types/video-service"
import { UnifiedVideoService } from "@/lib/video-service"
import Image from "next/image"

interface UploadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ file: File; preview: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [provider, setProvider] = useState<VideoServiceProvider>('kling');
    const { generateVideo, status, error, isLoading, progress, message, downloadUrl } = useVideoGeneration();

    const handleProviderChange = useCallback((newProvider: VideoServiceProvider) => {
        UnifiedVideoService.setProvider(newProvider);
        setProvider(newProvider);
    }, []);

    const handleFileSelect = useCallback(async (file: File) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Veuillez sélectionner une image')
                return
            }

            setIsProcessing(true)
            const preview = URL.createObjectURL(file)

            try {
                // Vérification si c'est une image immobilière
                const isRealEstate = await detectRealEstate(preview)
                
                if (!isRealEstate) {
                    toast.error("L'image ne semble pas être une propriété immobilière")
                    URL.revokeObjectURL(preview)
                    return
                }

                setSelectedFile({ file, preview })
                toast.success("Image immobilière détectée avec succès")
            } catch (error) {
                console.error(error)
                toast.error("Une erreur s'est produite lors de l'analyse de l'image")
                URL.revokeObjectURL(preview)
            } finally {
                setIsProcessing(false)
            }
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

    const handleGenerateVideo = useCallback(async () => {
        if (!selectedFile) return;
        
        try {
            const prompt = "Camera pullforward";
            await generateVideo(selectedFile.preview, prompt);
        } catch (error) {
            toast.error("Erreur lors de la génération de la vidéo");
        }
    }, [selectedFile, generateVideo]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">Importer votre photo</DialogTitle>
                </DialogHeader>

                {/* Sélection du Provider */}
                <div className="flex justify-center gap-2 mb-4">
                    <Button
                        variant={provider === 'kling' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleProviderChange('kling')}
                        className="w-24"
                    >
                        Kling
                    </Button>
                    <Button
                        variant={provider === 'minimax' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleProviderChange('minimax')}
                        className="w-24"
                    >
                        Minimax
                    </Button>
                </div>

                {/* Upload Zone */}
                <div className="mt-4">
                    {selectedFile ? (
                        // Aperçu de l'image
                        <div className="relative">
                            <Image 
                                src={selectedFile.preview}
                                alt="Aperçu"
                                className="w-full rounded-lg object-cover"
                                width={600}
                                height={300}
                                style={{ maxHeight: '300px' }}
                            />
                          
                            <div className="mt-4 flex justify-center gap-4">
                                <Button 
                                    variant="outline"
                                    onClick={handleRemoveFile}
                                    disabled={isLoading}
                                >
                                    Changer l&apos;image
                                </Button>
                                <Button 
                                    variant="default"
                                    onClick={handleGenerateVideo}
                                    disabled={isLoading}
                                    className="min-w-[150px] relative"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>{progress}%</span>
                                        </div>
                                    ) : (
                                        'Générer une vidéo'
                                    )}
                                    {isLoading && (
                                        <div 
                                            className="absolute bottom-0 left-0 h-1 bg-primary-foreground/20"
                                            style={{ 
                                                width: `${progress}%`,
                                                transition: 'width 0.5s ease-in-out'
                                            }}
                                        />
                                    )}
                                </Button>
                            </div>

                            {/* Statut de la génération */}
                            {isLoading && (
                                <div className="mt-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>{progress}%</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {status === VIDEO_GENERATION_STATUS.SUBMITTED && "Initialisation de la génération..."}
                                            {status === VIDEO_GENERATION_STATUS.PROCESSING && "Création de votre vidéo en cours..."}
                                            {status === VIDEO_GENERATION_STATUS.SUCCESS && "Finalisation de votre vidéo..."}
                                            {status === VIDEO_GENERATION_STATUS.FAILED && "Échec de la génération"}
                                        </p>
                                        {message && (
                                            <p className="text-sm text-gray-500 text-center">
                                                {message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                status === VIDEO_GENERATION_STATUS.FAILED ? 'bg-red-500' : 'bg-primary'
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Erreur */}
                            {error && (
                                <p className="mt-2 text-center text-sm text-red-500">
                                    {error}
                                </p>
                            )}

                            {/* Vidéo générée */}
                            {downloadUrl && (
                                <div className="mt-4">
                                    <p className="mb-2 text-center text-sm text-green-600">
                                        Vidéo générée avec succès !
                                    </p>
                                    <video controls className="w-full rounded-lg">
                                        <source src={downloadUrl} type="video/mp4" />
                                        Votre navigateur ne supporte pas la lecture de vidéos.
                                    </video>
                                </div>
                            )}
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
                                disabled={isProcessing}
                            />
                            <div 
                                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                                    isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                                } p-12 transition-colors hover:bg-gray-50 ${
                                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
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
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-400" />
                                        <h3 className="mb-2 text-lg font-medium">Analyse de l'image en cours...</h3>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mb-4 h-8 w-8 text-gray-400" />
                                        <h3 className="mb-2 text-lg font-medium">Déposez ou parcourez vos photos</h3>
                                        <p className="mb-4 text-sm text-gray-500">
                                            Formats: JPG, PNG, GIF Max size: 5MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </label>
                    )}
                </div>

                {/* Sample Video Section */}
                {/* <div className="mt-6">
                    <p className="mb-4 text-center text-sm text-gray-500">Or try this sample video</p>
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                            <img 
                                src="/welcome-thumbnail.jpg" 
                                alt="Welcome video thumbnail"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-medium">Welcome to Submagic</h4>
                            <p className="text-sm text-gray-500">32s</p>
                        </div>
                    </div>
                </div> */}
            </DialogContent>
        </Dialog>
    )
} 