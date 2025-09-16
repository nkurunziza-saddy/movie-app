import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // ⚠️ Authenticate and authorize users before generating the token
        // For now, we're allowing all uploads
        
        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/ogg',
            'video/avi',
            'video/mov',
            'video/wmv',
            'video/flv',
            'video/mkv'
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB limit
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
            // Add user ID or other metadata here
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs after successful upload
        console.log('Video upload completed:', blob);
        
        try {
          // Here you can:
          // - Save blob info to your database
          // - Send notifications
          // - Process the video (thumbnails, etc.)
          
          const payload = JSON.parse(tokenPayload);
          console.log('Upload metadata:', payload);
          
        } catch (error) {
          console.error('Error processing upload completion:', error);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
