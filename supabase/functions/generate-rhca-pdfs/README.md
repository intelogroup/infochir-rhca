
# Generate RHCA PDFs Function

This Edge Function generates and uploads PDF files for RHCA articles to the rhca-pdfs bucket.

## Functionality

- Generates 4 PDF files with mock content for RHCA articles
- Uploads the generated PDFs to the rhca-pdfs bucket
- Uses pdfMake for PDF generation
- Includes proper formatting and styling

## Usage

The function can be invoked to generate and upload all PDFs at once:

```typescript
const { data, error } = await supabase.functions.invoke('generate-rhca-pdfs')
```

