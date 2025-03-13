'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function TestBucketPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBucket = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test/bucket');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du test du bucket');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBucket();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Test de Configuration du Bucket Supabase</h1>
      
      <Button 
        onClick={testBucket} 
        disabled={loading}
        className="mb-6"
      >
        {loading ? 'Test en cours...' : 'Tester à nouveau'}
      </Button>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          <h2 className="font-semibold mb-2">Erreur :</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
          
          {result.success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600 mb-4">
              {result.message}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-600 mb-4">
              {result.message}
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Détails du bucket :</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
          
          {result.publicUrl && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">URL publique de test :</h3>
              <a 
                href={result.publicUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {result.publicUrl}
              </a>
              <p className="mt-2 text-sm">
                Status: {result.urlStatus} ({result.urlAccessible ? 'Accessible' : 'Non accessible'})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 