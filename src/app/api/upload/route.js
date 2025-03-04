import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import uniqid from 'uniqid';

export async function POST(req) {
  const data = await req.formData();
  if (data.get('file')) {
    const file = data.get('file');
    
    // Log environment variables (without sensitive data)
    console.log('AWS Config:', {
      region: 'eu-central-1',
      hasAccessKey: !!process.env.AWS_ACCESS_KEY,
      hasSecretKey: !!process.env.AWS_SECRET_KEY,
      secretKeyLength: process.env.AWS_SECRET_KEY?.length,
    });

    const bucket = process.env.AWS_BUCKET || 'food-ordering-images-anton-almishev';
    
    // Create S3 client with endpoint configuration
    const s3Client = new S3Client({
      region: 'eu-central-1',
      endpoint: `https://s3.eu-central-1.amazonaws.com`,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    const ext = file.name.split('.').slice(-1)[0];
    const newFileName = uniqid() + '.' + ext;

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    try {
      console.log('Attempting S3 upload with:', {
        bucket,
        fileName: newFileName,
        contentType: file.type,
        bufferSize: buffer.length,
        endpoint: `https://s3.eu-central-1.amazonaws.com`,
      });

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: newFileName,
        ContentType: file.type,
        Body: buffer,
      });

      const result = await s3Client.send(command);
      console.log('Upload successful:', result);

      const link = `https://${bucket}.s3.eu-central-1.amazonaws.com/${newFileName}`;
      return Response.json(link);
    } catch (error) {
      console.error('S3 upload error:', {
        message: error.message,
        code: error.code,
        requestId: error.$metadata?.requestId,
        cfId: error.$metadata?.cfId,
        stack: error.stack,
      });
      
      return Response.json({ 
        error: error.message,
        code: error.code,
        details: {
          bucket,
          region: 'eu-central-1',
          requestId: error.$metadata?.requestId,
          endpoint: `https://s3.eu-central-1.amazonaws.com`,
        }
      }, { status: 500 });
    }
  }
  return Response.json(true);
}