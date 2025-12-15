'use client';

import { useEffect, useState } from 'react';
import { getBlogCategories } from '@/lib/api/blog';
import { BlogCategory } from '@/lib/mock-data/blog';

export default function TestAPIPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directTest, setDirectTest] = useState<any>(null);

  useEffect(() => {
    async function testDirect() {
      try {
        console.log('🧪 Testing direct fetch...');
        const response = await fetch('http://localhost:3001/categories');
        console.log('📡 Direct response:', response.status, response.statusText);
        const data = await response.json();
        console.log('📦 Direct data:', data);
        setDirectTest({ success: true, data });
      } catch (err) {
        console.error('❌ Direct fetch failed:', err);
        setDirectTest({ success: false, error: err instanceof Error ? err.message : 'Unknown' });
      }
    }
    testDirect();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching categories from API...');
        const data = await getBlogCategories();
        console.log('Categories received:', data);
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="space-y-6">
        {/* Direct Fetch Test */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Direct Fetch Test</h2>
          <p className="text-sm text-muted-foreground mb-4">Testing: fetch('http://localhost:3001/categories')</p>
          {directTest ? (
            directTest.success ? (
              <div className="bg-green-50 p-4 rounded">
                <p className="text-green-700 font-semibold">✅ Direct fetch SUCCESS</p>
                <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto">
                  {JSON.stringify(directTest.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded">
                <p className="text-red-700 font-semibold">❌ Direct fetch FAILED</p>
                <p className="text-red-600 mt-2">{directTest.error}</p>
              </div>
            )
          ) : (
            <p>Testing...</p>
          )}
        </div>

        {/* API Service Test */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">API Service Test</h2>
          <p className="text-sm text-muted-foreground mb-4">Testing: getBlogCategories()</p>

          {loading && (
            <div className="p-4 border rounded">
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="p-4 border border-red-500 rounded bg-red-50">
              <p className="text-red-700 font-semibold">❌ Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="p-4 border rounded bg-green-50">
              <p className="text-green-700 font-semibold mb-2">✅ Success! Found {categories.length} categories:</p>
              <pre className="bg-white p-4 rounded overflow-auto text-xs">
                {JSON.stringify(categories, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

