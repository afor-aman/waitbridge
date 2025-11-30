import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getCurrentUser } from '@/utils/getCurrentUser'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Initialize R2 client
const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await getCurrentUser(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const extension = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const randomId = crypto.randomUUID().slice(0, 8)
    const filename = `${user.id}/${timestamp}-${randomId}.${extension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to R2
    await R2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    )

    // Construct public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`

    return Response.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    )
  }
}

