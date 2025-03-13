import { NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClientForServer();
    
    // Récupérer la liste des buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      return NextResponse.json({ error: bucketsError.message }, { status: 500 });
    }
    
    // Vérifier si le bucket 'videos' existe
    const videoBucket = buckets.find(bucket => bucket.name === 'videos');
    
    if (!videoBucket) {
      return NextResponse.json({ 
        error: "Le bucket 'videos' n'existe pas", 
        buckets: buckets.map(b => b.name),
        action: "Créez un bucket 'videos' dans votre projet Supabase"
      }, { status: 404 });
    }
    
    // Tester l'accès au bucket
    const testPath = `test-${Date.now()}/test.txt`;
    const { error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(testPath, new Blob(['Test bucket access']), {
        contentType: 'text/plain',
        upsert: true
      });
      
    if (uploadError) {
      return NextResponse.json({ 
        error: `Erreur d'accès au bucket: ${uploadError.message}`,
        bucket: videoBucket,
        suggestion: "Vérifiez les politiques d'accès (RLS) du bucket"
      }, { status: 500 });
    }
    
    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase
      .storage
      .from('videos')
      .getPublicUrl(testPath);
      
    // Tester l'accès à l'URL publique
    const urlTest = await fetch(publicUrl);
    const urlStatus = urlTest.status;
    
    // Supprimer le fichier de test
    await supabase.storage.from('videos').remove([testPath]);
    
    return NextResponse.json({
      success: true,
      bucket: videoBucket,
      publicUrl,
      urlAccessible: urlTest.ok,
      urlStatus,
      message: urlTest.ok 
        ? "Le bucket 'videos' est correctement configuré" 
        : "L'URL publique n'est pas accessible, vérifiez la configuration du bucket"
    });
    
  } catch (error) {
    console.error('Erreur test bucket:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du test du bucket' },
      { status: 500 }
    );
  }
} 