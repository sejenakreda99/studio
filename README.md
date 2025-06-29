# SDS SMAS PGRI NARINGGUL - Sistem Database Siswa

This is a Next.js application built with Firebase Studio for managing student data at SMAS PGRI Naringgul.

## Getting Started

To run the development server, you first need to set up your environment variables.

### Environment Variables

1.  Create a file named `.env.local` in the root of the project.
2.  Copy the content from `.env.example` into your new `.env.local` file.
3.  Fill in the values with your actual Firebase project configuration. You can find these details in your Firebase project settings.

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
# ... and so on
```

### Running the Development Server

Once your environment variables are set, install the dependencies and run the server:

```bash
npm install
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deployment

This application is ready to be deployed on platforms like Vercel.

When deploying to Vercel, make sure to add the same environment variables from your `.env.local` file to the Vercel project settings.
