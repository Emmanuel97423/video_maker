import { HfInference } from '@huggingface/inference'
import { realEstateLabels } from './constants/real-estate-labels'
const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY)

export async function detectRealEstate(imageUrl: string): Promise<boolean> {
  try {
    console.log('🔍 [HuggingFace] Analyse de l\'image...')

    // Convertir l'URL de l'image en Blob
    const response = await fetch(imageUrl)
    const imageBlob = await response.blob()

    // Classifier l'image
    const result = await hf.imageClassification({
      model: 'facebook/detr-resnet-50',
      data: imageBlob,
    })

    // Vérifier si l'une des étiquettes correspond à une propriété immobilière
    const isRealEstate = result.some(prediction => 
      realEstateLabels.includes(prediction.label as any) && 
      prediction.score > 0.3
    )

    console.log('✅ Résultat final:', isRealEstate ? 
      'Image immobilière détectée' : 
      'Aucune propriété immobilière détectée'
    )

    return isRealEstate

  } catch (error) {
    console.error('❌ Erreur lors de la détection:', error)
    return false
  }
} 