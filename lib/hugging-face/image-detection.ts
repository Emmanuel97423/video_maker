import { HfInference } from '@huggingface/inference'
import { realEstateLabels } from './constants/real-estate-labels'
const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY)

export async function detectRealEstate(imageUrl: string): Promise<boolean> {
  try {

    // Convertir l'URL de l'image en Blob
    const response = await fetch(imageUrl)
    const imageBlob = await response.blob()
    
    // Convertir le Blob en ArrayBuffer
    const arrayBuffer = await imageBlob.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)

    // Classifier l'image avec les données binaires
    const result = await hf.imageClassification({
      model: 'facebook/detr-resnet-50',  // Changement du modèle
      data: data.buffer,
    })


    const isRealEstate = result.some(prediction => 
      realEstateLabels.includes(prediction.label.toLowerCase() as any) && 
      prediction.score > 0.5
    )

    return isRealEstate

  } catch (error) {
    console.error('❌ Erreur lors de la détection:', error)
    throw error
  }
} 