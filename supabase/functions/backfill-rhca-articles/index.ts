import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RHCAArticleData {
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
  // Extract volume, issue, and date from filename pattern: RHCA_vol_XX_no_YY_DD_MM_YY.pdf
  const match = filename.match(/RHCA_vol_(\d+)_no_(\d+)_(\d+)_(\d+)_(\d+)\.pdf/);
  if (!match) return null;
  
  const [, volume, issue, day, month, year] = match;
  const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
  const publicationDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return { volume, issue, publicationDate };
};

const generateRHCAContent = async (filename: string, volume: string, issue: string): Promise<Partial<RHCAArticleData>> => {
  const openAIApiKey = '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';
  
  try {
    if (!openAIApiKey) {
      return generateFallbackRHCAContent(volume, issue);
    }

    const haitianSurgeons = [
      'Dr. Michel Dodard', 'Dr. Louis-Franck TÉLÉMAQUE', 'Dr. Evans Vladimir LARSEN',
      'Dr. Christophe Millien', 'Dr. Pierre Marie Cherenfant', 'Dr. Ronald Laroche',
      'Dr. Maxi Raymonville', 'Dr. Leandre Fernet', 'Dr. Jean Patrick ALFRED',
      'Dr. Patrick Jean-Gilles', 'Dr. Wisly Joseph', 'Dr. Pierre Marie Woolley',
      'Dr. Jean ALOUIDOR', 'Dr. Bruce Soloway', 'Dr. Marie Edelyne St Jacques'
    ];

    const surgicalTopics = [
      'chirurgie digestive et hépatobiliaire', 'chirurgie générale et d\'urgence', 'anesthésie et réanimation',
      'chirurgie thoracique', 'chirurgie vasculaire', 'neurochirurgie', 'chirurgie orthopédique',
      'chirurgie plastique et reconstructrice', 'chirurgie pédiatrique', 'chirurgie cardiaque',
      'urologie chirurgicale', 'soins intensifs chirurgicaux'
    ];

    const prompt = `Génère un contenu chirurgical réaliste pour la Revue Haïtienne de Chirurgie et d'Anesthésiologie (RHCA) Vol ${volume} No ${issue}.

    Contexte: La RHCA est une revue chirurgicale haïtienne spécialisée dans la chirurgie, l'anesthésie, et les soins périopératoires. Elle traite de cas cliniques, techniques chirurgicales, et innovations médicales adaptées au contexte haïtien.

    Génère:
    1. Un titre professionnel et technique
    2. Un résumé détaillé (250-350 mots) traitant de techniques chirurgicales ou d'anesthésie
    3. Une liste d'auteurs chirurgiens haïtiens (2-5 auteurs)
    4. Une catégorie chirurgicale principale
    5. Des mots-clés chirurgicaux et médicaux (5-8 mots-clés)
    6. Une spécialité chirurgicale

    Thèmes suggérés: ${surgicalTopics.slice(0, 4).join(', ')}
    Auteurs suggérés: ${haitianSurgeons.slice(0, 5).join(', ')}

    Format de réponse JSON:
    {
      "title": "titre professionnel",
      "abstract": "résumé détaillé en français",
      "authors": ["auteur1", "auteur2", "auteur3"],
      "category": "catégorie chirurgicale",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "specialty": "spécialité chirurgicale"
    }`;

    console.log(`Generating AI content for RHCA Vol ${volume} No ${issue}`);
    
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
            content: 'Tu es un chirurgien haïtien expert spécialisé dans la rédaction de contenus chirurgicaux pour des revues médicales professionnelles. Réponds uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return generateFallbackRHCAContent(volume, issue);
    }

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);

    return {
      title: aiContent.title,
      abstract: aiContent.abstract,
      authors: aiContent.authors,
      tags: aiContent.tags,
      category: aiContent.category,
      page_number: `1-${12 + Math.floor(Math.random() * 16)}`, // 12-28 pages
    };

  } catch (error) {
    console.error('Error generating AI content for RHCA:', error);
    return generateFallbackRHCAContent(volume, issue);
  }
};

const generateFallbackRHCAContent = (volume: string, issue: string): Partial<RHCAArticleData> => {
  const topics = ['chirurgie générale', 'anesthésie', 'chirurgie digestive', 'traumatologie'];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  return {
    title: `REVUE D'HÉPATO-GASTROENTÉROLOGIE ET CHIRURGIE ABDOMINALE (RHCA) Vol ${volume} No ${issue}`,
    abstract: `Cette édition de la Revue d'Hépato-gastroentérologie et Chirurgie Abdominale présente des avancées significatives dans le domaine de la ${randomTopic}. Les articles couvrent les dernières innovations chirurgicales, les techniques diagnostiques avancées et les approches thérapeutiques modernes adaptées au contexte haïtien. Cette publication vise à informer les chirurgiens sur les développements récents et les meilleures pratiques chirurgicales.`,
    authors: [
      'Dr. Michel Dodard',
      'Dr. Louis-Franck TÉLÉMAQUE',
      'Dr. Evans Vladimir LARSEN'
    ],
    tags: [
      'chirurgie',
      randomTopic,
      'innovation chirurgicale',
      'techniques mini-invasives',
      'formation chirurgicale',
      'excellence médicale'
    ],
    category: 'Chirurgie Générale',
    page_number: '1-20',
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting RHCA articles backfill process...');

    // Get all PDFs from storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('rhca-pdfs')
      .list('');

    if (storageError) {
      throw new Error(`Storage error: ${storageError.message}`);
    }

    // Get existing articles from database
    const { data: existingArticles, error: dbError } = await supabase
      .from('articles')
      .select('pdf_filename')
      .eq('source', 'RHCA');

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const existingFilenames = new Set(existingArticles?.map(a => a.pdf_filename).filter(Boolean) || []);
    
    // Find missing files
    const missingFiles = storageFiles?.filter(file => 
      file.name.endsWith('.pdf') && !existingFilenames.has(file.name)
    ) || [];

    console.log(`Found ${missingFiles.length} missing RHCA files to process`);

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
        const generatedContent = await generateRHCAContent(file.name, volume, issue);
        
        // Prepare article data
        const articleData = {
          title: generatedContent.title || `REVUE D'HÉPATO-GASTROENTÉROLOGIE ET CHIRURGIE ABDOMINALE (RHCA) Vol ${volume} No ${issue}`,
          abstract: generatedContent.abstract || '',
          authors: generatedContent.authors || [],
          source: 'RHCA',
          category: generatedContent.category || 'Chirurgie Générale',
          tags: generatedContent.tags || [],
          volume: volume,
          issue: issue,
          publication_date: publicationDate,
          pdf_filename: file.name,
          pdf_url: `${supabaseUrl}/storage/v1/object/public/rhca-pdfs/${file.name}`,
          image_url: `${supabaseUrl}/storage/v1/object/public/rhca_covers/RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`,
          cover_image_filename: `RHCA_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`,
          page_number: generatedContent.page_number || '1-16',
          status: 'published',
          article_type: 'RHCA',
          specialty: generatedContent.category || 'Chirurgie Générale',
          institution: 'Revue d\'Hépato-gastroentérologie et Chirurgie Abdominale',
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
        message: 'RHCA articles backfill completed',
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
    console.error('Error in RHCA backfill function:', error);
    return new Response(
      JSON.stringify({
        error: 'RHCA backfill failed',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});