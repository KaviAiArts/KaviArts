import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { file_name, file_url, is_public } = req.body

  const { data, error } = await supabaseAdmin
    .from('user_files')
    .insert([{ file_name, file_url, is_public }])

  if (error) return res.status(400).json({ error })

  res.status(200).json({ success: true, data })
}
