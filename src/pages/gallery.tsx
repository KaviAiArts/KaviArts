'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Gallery() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) setError(error.message);
        else setFiles(data);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading gallery...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {files.map(file => (
        <div key={file.id} className="text-center border rounded-lg p-2 shadow-sm">
          <img
            src={file.file_url}
            alt={file.file_name}
            className="rounded-lg shadow-md w-full h-48 object-cover"
          />
          <p className="mt-2 font-semibold">{file.file_name}</p>
          <p className="text-sm text-gray-500">
            {new Date(file.created_at).toLocaleString()}
          </p>
          <a
            href={file.file_url}
            download
            className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
