import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Avati SEO Studio',

  projectId: 'bv8ffbbk',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:5173'
          : 'https://avati-safe-storage.pages.dev',
        preview: '/',
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

