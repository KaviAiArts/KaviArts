import { supabase } from '@/lib/supabaseClient'

export default async function Gallery() {
  const { data, error } = await supabase
    .from('user_files')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) return <p>Error loading files</p>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {data?.map(file => (
        <div key={file.id} className="text-center">
          <img
            src={file.file_url}
            alt={file.file_name}
            className="rounded-xl shadow-md"
          />
          <p className="mt-2">{file.file_name}</p>
        </div>
      ))}
    </div>
  )
}
