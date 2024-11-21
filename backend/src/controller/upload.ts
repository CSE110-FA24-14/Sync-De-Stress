import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Construct the file URL
  const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;

  // Respond with success message and file URL
  return res.status(200).json({
    status: 'success',
    message: 'File uploaded successfully',
    fileUrl,
  });
};
