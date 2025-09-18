import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AtlasArticleData {
  title: string;
  abstract: string;
  authors: string[];
  source: string;
  category: string;
  tags: string[];
  pdf_url: string;
  image_url: string;
  status: string;
  institution: string;
  volume: string;
  issue: string;
  page_number: string;
  specialty: string;
  article_type: string;
  primary_author: string;
  co_authors: string[];
  author_affiliations: string[];
  keywords: string[];
  pdf_filename: string;
  cover_image_filename: string;
  publication_date: string;
}

interface BackfillResult {
  filename: string;
  success: boolean;
  error?: string;
  id?: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Extracts chapter information from ADC filename
 */
function extractInfoFromFilename(filename: string) {
  try {
    // Clean filename by removing extra spaces and double dots
    const cleanFilename = filename.replace(/\s+/g, '_').replace(/\.{2,}/g, '.');
    
    // Match pattern: ADC_ch_X_... (case insensitive)
    const chapterMatch = cleanFilename.match(/ADC_ch_(\d+)/i);
    if (!chapterMatch) {
      throw new Error(`Could not extract chapter number from filename: ${filename}`);
    }
    
    const chapterNumber = parseInt(chapterMatch[1]);
    
    // Extract date patterns if available (various formats)
    const dateMatch = cleanFilename.match(/(\d{1,2}_\d{1,2}_\d{2,4})/);
    let publicationDate = new Date().toISOString();
    
    if (dateMatch) {
      const dateParts = dateMatch[1].split('_');
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        const fullYear = year.length === 2 ? `20${year}` : year;
        try {
          publicationDate = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).toISOString();
        } catch (dateError) {
          console.warn(`[Atlas Backfill] Invalid date format in ${filename}, using current date`);
          publicationDate = new Date().toISOString();
        }
      }
    }
    
    // Check if this is an introduction file
    const isIntro = cleanFilename.toLowerCase().includes('intro');
    
    console.log(`[Atlas Backfill] Extracted info from ${filename}: Chapter ${chapterNumber}, Date: ${publicationDate}, Intro: ${isIntro}`);
    
    return {
      chapter: chapterNumber,
      publicationDate,
      isIntro,
      cleanFilename
    };
  } catch (error) {
    console.error('[Atlas Backfill] Error extracting info from filename:', error);
    return null;
  }
}

/**
 * Generates content for Atlas articles using OpenAI
 */
async function generateAtlasContent(filename: string, chapter: number, publicationDate: string, isIntro: boolean) {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.log('[Atlas Backfill] OpenAI API key not found, using fallback content');
      return generateFallbackAtlasContent(chapter, isIntro);
    }

    // Define surgical specialties and topics for Haiti
    const haitianSurgeons = [
      "Dr. Jean-Claude Moïse", "Dr. Marie-Claire Pierre", "Dr. Jacques Bourgeois",
      "Dr. Anne-Marie Destin", "Dr. Pierre-Louis Jean", "Dr. Micheline Auguste",
      "Dr. Ronald François", "Dr. Carole Bernadel", "Dr. Emmanuel Saint-Vil"
    ];

    const surgicalTopics = [
      "Trauma Surgery in Resource-Limited Settings",
      "Pediatric Surgery Techniques", "Orthopedic Procedures",
      "General Surgery Principles", "Emergency Surgical Interventions",
      "Minimally Invasive Surgery", "Surgical Education and Training",
      "Post-operative Care in Haiti", "Surgical Equipment Management",
      "Community Health Surgery"
    ];

    const prompt = isIntro 
      ? `Generate content for Chapter ${chapter} Introduction of the Atlas Digital de Chirurgie (ADC) - a Haitian surgical atlas. This should be an introductory overview.`
      : `Generate content for Chapter ${chapter} of the Atlas Digital de Chirurgie (ADC) - a comprehensive surgical atlas for Haiti. Focus on practical surgical techniques relevant to Haitian healthcare.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are creating content for the Atlas Digital de Chirurgie (ADC), a surgical education resource for Haiti. Generate realistic but educational content. Use appropriate medical terminology in French when relevant.`
          },
          {
            role: 'user',
            content: `${prompt}

Please provide:
1. A title in French
2. An abstract (150-200 words) in French
3. Primary author (choose from: ${haitianSurgeons.slice(0, 3).join(', ')})
4. 2-3 co-authors (from: ${haitianSurgeons.slice(3).join(', ')})
5. Keywords (5-7 relevant surgical terms in French)
6. A relevant surgical topic (from: ${surgicalTopics.join(', ')})

Format as JSON with keys: title, abstract, primary_author, co_authors (array), keywords (array), topic`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    return {
      title: content.title,
      abstract: content.abstract,
      primary_author: content.primary_author,
      co_authors: content.co_authors || [],
      keywords: content.keywords || [],
      category: content.topic || surgicalTopics[0]
    };
  } catch (error) {
    console.error('[Atlas Backfill] Error generating content with OpenAI:', error);
    return generateFallbackAtlasContent(chapter, isIntro);
  }
}

/**
 * Generates fallback content when OpenAI is not available
 */
function generateFallbackAtlasContent(chapter: number, isIntro: boolean) {
  const fallbackData = {
    title: isIntro 
      ? `Atlas Digital de Chirurgie - Chapitre ${chapter} : Introduction`
      : `Atlas Digital de Chirurgie - Chapitre ${chapter}`,
    abstract: isIntro
      ? `Introduction au chapitre ${chapter} de l'Atlas Digital de Chirurgie. Ce chapitre présente les concepts fondamentaux et les techniques chirurgicales essentielles pour la pratique médicale en Haïti. L'atlas vise à fournir aux professionnels de santé haïtiens des ressources éducatives de qualité adaptées au contexte local.`
      : `Chapitre ${chapter} de l'Atlas Digital de Chirurgie présentant des techniques chirurgicales avancées et des procédures médicales spécialisées. Ce contenu éducatif est conçu pour les professionnels de santé travaillant dans le système de santé haïtien, avec un focus sur les meilleures pratiques et les innovations en chirurgie.`,
    primary_author: "Dr. Jean-Claude Moïse",
    co_authors: ["Dr. Marie-Claire Pierre", "Dr. Jacques Bourgeois"],
    keywords: ["chirurgie", "atlas", "éducation médicale", "Haïti", "techniques chirurgicales"],
    category: "Chirurgie Générale"
  };

  return fallbackData;
}

serve(async (req) => {
  console.log('[Atlas Backfill] Function called with method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Atlas Backfill] Starting Atlas articles backfill process...');

    // Get all files from the atlas-pdfs bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('atlas-pdfs')
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (filesError) {
      console.error('[Atlas Backfill] Error fetching files:', filesError);
      throw new Error(`Failed to fetch files from storage: ${filesError.message}`);
    }

    console.log(`[Atlas Backfill] Found ${files?.length || 0} files in atlas-pdfs bucket`);

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({
        message: 'No files found in atlas-pdfs bucket',
        totalProcessed: 0,
        successful: 0,
        failed: 0,
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Get existing articles with source 'ADC' to avoid duplicates
    const { data: existingArticles, error: articlesError } = await supabase
      .from('articles')
      .select('pdf_filename')
      .eq('source', 'ADC');

    if (articlesError) {
      console.error('[Atlas Backfill] Error fetching existing articles:', articlesError);
      throw new Error(`Failed to fetch existing articles: ${articlesError.message}`);
    }

    const existingFilenames = new Set(existingArticles?.map(a => a.pdf_filename) || []);
    console.log(`[Atlas Backfill] Found ${existingFilenames.size} existing ADC articles`);

    // Filter out existing files and non-PDF files
    const pdfFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.pdf') && 
      !existingFilenames.has(file.name)
    );

    console.log(`[Atlas Backfill] Processing ${pdfFiles.length} new PDF files...`);

    const results: BackfillResult[] = [];
    let successful = 0;
    let failed = 0;

    // Process each PDF file
    for (const file of pdfFiles) {
      try {
        console.log(`[Atlas Backfill] Processing file: ${file.name}`);

        // Extract information from filename
        const fileInfo = extractInfoFromFilename(file.name);
        if (!fileInfo) {
          throw new Error('Could not extract chapter information from filename');
        }

        const { chapter, publicationDate, isIntro, cleanFilename } = fileInfo;

        // Generate content for the article
        const content = await generateAtlasContent(file.name, chapter, publicationDate, isIntro);

        // Prepare article data
        const articleData: AtlasArticleData = {
          title: content.title,
          abstract: content.abstract,
          authors: [content.primary_author, ...content.co_authors],
          source: 'ADC',
          category: content.category,
          tags: content.keywords,
          pdf_url: `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/atlas-pdfs/${file.name}`,
          image_url: '',
          status: 'published',
          institution: 'Association Haïtienne de Chirurgie',
          volume: '1',
          issue: chapter.toString(),
          page_number: chapter.toString(),
          specialty: 'Chirurgie',
          article_type: 'ADC',
          primary_author: content.primary_author,
          co_authors: content.co_authors,
          author_affiliations: ['Association Haïtienne de Chirurgie'],
          keywords: content.keywords,
          pdf_filename: file.name,
          cover_image_filename: `ADC_ch_${chapter}_cover.png`,
          publication_date: publicationDate
        };

        // Insert into database
        const { data: insertedArticle, error: insertError } = await supabase
          .from('articles')
          .insert([articleData])
          .select('id')
          .single();

        if (insertError) {
          throw insertError;
        }

        results.push({
          filename: file.name,
          success: true,
          id: insertedArticle.id
        });

        successful++;
        console.log(`[Atlas Backfill] Successfully processed: ${file.name}`);

        // Add a small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`[Atlas Backfill] Error processing ${file.name}:`, error);
        results.push({
          filename: file.name,
          success: false,
          error: error.message
        });
        failed++;
      }
    }

    const response = {
      message: `Atlas backfill completed. Processed ${pdfFiles.length} files.`,
      totalProcessed: pdfFiles.length,
      successful,
      failed,
      results
    };

    console.log('[Atlas Backfill] Process completed:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('[Atlas Backfill] Unexpected error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});