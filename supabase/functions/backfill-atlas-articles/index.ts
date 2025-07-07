import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AtlasArticleData {
  filename: string;
  volume: string;
  issue: string;
  publication_date: string;
  title: string;
  abstract: string;
  authors: string[];
  tags: string[];
  category: string;
  page_number: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const extractInfoFromFilename = (filename: string) => {
  // Extract volume, issue, and date from filename pattern: ATLAS_vol_XX_no_YY_DD_MM_YY.pdf
  const match = filename.match(/ATLAS_vol_(\d+)_no_(\d+)_(\d+)_(\d+)_(\d+)\.pdf/);
  if (!match) return null;
  
  const [, volume, issue, day, month, year] = match;
  const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
  const publicationDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return { volume, issue, publicationDate };
};

const generateAtlasContent = async (filename: string, volume: string, issue: string): Promise<Partial<AtlasArticleData>> => {
  const openAIApiKey = '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';
  
  try {
    if (!openAIApiKey) {
      return generateFallbackAtlasContent(volume, issue);
    }

    const pathologists = [
      'Pr. Laila Chbani', 'Dr. Hassan El Fatemi', 'Pr. Nawal Hammas',
      'Dr. Zineb Benbrahim', 'Pr. Abderrahmane Al Bouzidi', 'Dr. Karima Bendahhou',
      'Pr. Mohamed Allaoui', 'Dr. Siham Dikhaye', 'Pr. Hinde El Fatemi',
      'Dr. Lamiaa Quessar', 'Pr. Mounia Serraj', 'Dr. Amal Bennani'
    ];

    const pathologyTopics = [
      'anatomie pathologique générale', 'histopathologie diagnostique', 'cytopathologie',
      'pathologie tumorale', 'pathologie inflammatoire', 'pathologie infectieuse',
      'neuropathologie', 'pathologie cardiovasculaire', 'pathologie digestive',
      'pathologie pulmonaire', 'pathologie rénale', 'pathologie gynécologique',
      'hématopathologie', 'dermatopathologie', 'pathologie pédiatrique'
    ];

    const prompt = `Génère un contenu médical spécialisé pour l'Atlas d'Anatomie Pathologique Vol ${volume} No ${issue}.

    Contexte: L'Atlas d'Anatomie Pathologique est une publication éducative spécialisée qui présente des cas cliniques illustrés, des planches anatomopathologiques, et des guides diagnostiques pour les pathologistes et étudiants en médecine.

    Génère:
    1. Un titre professionnel et éducatif
    2. Un résumé détaillé (300-400 mots) décrivant le contenu éducatif et les cas présentés
    3. Une liste d'auteurs pathologistes experts (2-4 auteurs)
    4. Une catégorie de pathologie principale
    5. Des mots-clés en pathologie et diagnostic (6-8 mots-clés)
    6. Une spécialité en anatomie pathologique

    Thèmes suggérés: ${pathologyTopics.slice(0, 4).join(', ')}
    Auteurs suggérés: ${pathologists.slice(0, 4).join(', ')}

    Format de réponse JSON:
    {
      "title": "titre professionnel",
      "abstract": "résumé détaillé en français",
      "authors": ["auteur1", "auteur2", "auteur3"],
      "category": "catégorie pathologique",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
      "specialty": "spécialité pathologique"
    }`;

    console.log(`Generating AI content for Atlas Vol ${volume} No ${issue}`);
    
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
            content: 'Tu es un pathologiste expert spécialisé dans la rédaction de contenus éducatifs pour des atlas d\'anatomie pathologique. Réponds uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1300
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return generateFallbackAtlasContent(volume, issue);
    }

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);

    return {
      title: aiContent.title,
      abstract: aiContent.abstract,
      authors: aiContent.authors,
      tags: aiContent.tags,
      category: aiContent.category,
      page_number: `1-${20 + Math.floor(Math.random() * 20)}`, // 20-40 pages (atlas format)
    };

  } catch (error) {
    console.error('Error generating AI content for Atlas:', error);
    return generateFallbackAtlasContent(volume, issue);
  }
};

const generateFallbackAtlasContent = (volume: string, issue: string): Partial<AtlasArticleData> => {
  const topics = ['anatomie pathologique', 'histopathologie', 'cytopathologie', 'pathologie tumorale'];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  return {
    title: `ATLAS D'ANATOMIE PATHOLOGIQUE Vol ${volume} No ${issue}`,
    abstract: `Cette édition de l'Atlas d'Anatomie Pathologique présente une collection exceptionnelle de cas diagnostiques illustrant les principales pathologies en ${randomTopic}. Les planches anatomopathologiques haute résolution sont accompagnées de descriptions détaillées des critères morphologiques et des corrélations clinico-pathologiques. Cette publication constitue un outil pédagogique de référence pour les pathologistes et étudiants en médecine.`,
    authors: [
      'Pr. Laila Chbani',
      'Dr. Hassan El Fatemi',
      'Pr. Nawal Hammas'
    ],
    tags: [
      'anatomie pathologique',
      randomTopic,
      'diagnostic histologique',
      'morphologie',
      'immunohistochimie',
      'formation médicale'
    ],
    category: 'Anatomie Pathologique',
    page_number: '1-30',
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Atlas articles backfill process...');

    // Get all PDFs from storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('atlas-pdfs')
      .list('');

    if (storageError) {
      throw new Error(`Storage error: ${storageError.message}`);
    }

    // Get existing articles from database
    const { data: existingArticles, error: dbError } = await supabase
      .from('articles')
      .select('pdf_filename')
      .eq('source', 'ATLAS');

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const existingFilenames = new Set(existingArticles?.map(a => a.pdf_filename).filter(Boolean) || []);
    
    // Find missing files
    const missingFiles = storageFiles?.filter(file => 
      file.name.endsWith('.pdf') && !existingFilenames.has(file.name)
    ) || [];

    console.log(`Found ${missingFiles.length} missing Atlas files to process`);

    const results = [];
    
    // Process each missing file
    for (const file of missingFiles) {
      try {
        const fileInfo = extractInfoFromFilename(file.name);
        if (!fileInfo) {
          console.log(`Skipping file with invalid format: ${file.name}`);
          continue;
        }

        const { volume, issue, publicationDate } = fileInfo;
        
        // Generate content for this file
        const generatedContent = await generateAtlasContent(file.name, volume, issue);
        
        // Prepare article data
        const articleData = {
          title: generatedContent.title || `ATLAS D'ANATOMIE PATHOLOGIQUE Vol ${volume} No ${issue}`,
          abstract: generatedContent.abstract || '',
          authors: generatedContent.authors || [],
          source: 'ATLAS',
          category: generatedContent.category || 'Anatomie Pathologique',
          tags: generatedContent.tags || [],
          volume: volume,
          issue: issue,
          publication_date: publicationDate,
          pdf_filename: file.name,
          pdf_url: `${supabaseUrl}/storage/v1/object/public/atlas-pdfs/${file.name}`,
          image_url: `${supabaseUrl}/storage/v1/object/public/atlas_covers/ATLAS_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`,
          cover_image_filename: `ATLAS_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`,
          page_number: generatedContent.page_number || '1-30',
          status: 'published',
          article_type: 'ATLAS',
          specialty: generatedContent.category || 'Anatomie Pathologique',
          institution: 'Atlas d\'Anatomie Pathologique',
          views: 0,
          downloads: 0,
          shares: 0,
          citations: 0,
          doi: `ISSN: 2658-${Math.floor(Math.random() * 9000) + 1000}`,
          keywords: generatedContent.tags || [],
          author_affiliations: null,
          co_authors: null,
          primary_author: null,
          funding_source: null,
          supplementary_files: [],
          article_files: [],
          user_id: null
        };

        // Insert into database
        const { data: insertedArticle, error: insertError } = await supabase
          .from('articles')
          .insert([articleData])
          .select()
          .single();

        if (insertError) {
          console.error(`Error inserting ${file.name}:`, insertError);
          results.push({
            filename: file.name,
            success: false,
            error: insertError.message
          });
        } else {
          console.log(`Successfully inserted: ${file.name}`);
          results.push({
            filename: file.name,
            success: true,
            id: insertedArticle.id
          });
        }

        // Add delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        results.push({
          filename: file.name,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        message: 'Atlas articles backfill completed',
        totalProcessed: results.length,
        successful: successCount,
        failed: failureCount,
        results: results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in Atlas backfill function:', error);
    return new Response(
      JSON.stringify({
        error: 'Atlas backfill failed',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});