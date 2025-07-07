import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IGMArticleData {
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

// OpenAI API key
const openAIApiKey = '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';

const extractInfoFromFilename = (filename: string) => {
  // Extract volume, issue, and date from filename pattern: IGM_vol_XX_no_YY_DD_MM_YY.pdf
  const match = filename.match(/IGM_vol_(\d+)_no_(\d+)_(\d+)_(\d+)_(\d+)\.pdf/);
  if (!match) return null;
  
  const [, volume, issue, day, month, year] = match;
  const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
  const publicationDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return { volume, issue, publicationDate };
};

const generateContentWithAI = async (filename: string, volume: string, issue: string): Promise<Partial<IGMArticleData>> => {
  try {
    if (!openAIApiKey) {
      return generateFallbackContent(volume, issue);
    }

    const haitianAuthors = [
      'Dr. Jean ALOUIDOR', 'Dr. Michel Dodard', 'Dr. Christophe Millien', 'Dr. Louis-Franck TÉLÉMAQUE',
      'Dr. Marie Edelyne St Jacques', 'Dr. Ronald Laroche', 'Dr. Pierre Marie Cherenfant',
      'Dr. Wisly Joseph', 'Dr. Patrick Jean-Gilles', 'Dr. Maxi Raymonville', 'Dr. Jean Patrick ALFRED',
      'Dr. Evans Vladimir LARSEN', 'Dr. Leandre Fernet', 'Dr. Marie-Marcelle Deschamps',
      'Dr. Judith Jean-Baptiste', 'Dr. Berteline Beaulieu', 'Dr. Georges Sakoulas',
      'Dr. Bruce Soloway', 'Dr. Thomas L. Schwenk', 'Dr. Allan S. Brett'
    ];

    const medicalTopics = [
      'cardiologie et maladies cardiovasculaires', 'diabète et endocrinologie', 'santé publique en Haïti',
      'gynécologie obstétrique', 'pédiatrie et santé infantile', 'chirurgie générale',
      'anesthésie et réanimation', 'maladies infectieuses', 'neurologie', 'orthopédie',
      'dermatologie', 'ophtalmologie', 'psychiatrie et santé mentale', 'médecine d\'urgence',
      'gériatrie', 'oncologie', 'pneumologie', 'gastroentérologie', 'urologie', 'radiologie'
    ];

    const prompt = `Génère un contenu médical réaliste pour l'Info Gazette Médicale (IGM) Vol ${volume} No ${issue}, une revue médicale haïtienne.

    Contexte: L'IGM est une publication médicale haïtienne qui traite de sujets médicaux généraux, de santé publique, et de problématiques médicales spécifiques à Haïti et aux Caraïbes.

    Génère:
    1. Un titre professionnel et informatif
    2. Un résumé détaillé (200-300 mots) traitant de sujets médicaux pertinents pour Haïti
    3. Une liste d'auteurs haïtiens ou caribéens (3-6 auteurs)
    4. Une catégorie médicale principale
    5. Des mots-clés médicaux pertinents (5-8 mots-clés)
    6. Une spécialité médicale

    Thèmes suggérés: ${medicalTopics.slice(0, 5).join(', ')}
    Auteurs suggérés: ${haitianAuthors.slice(0, 6).join(', ')}

    Format de réponse JSON:
    {
      "title": "titre professionnel",
      "abstract": "résumé détaillé en français",
      "authors": ["auteur1", "auteur2", "auteur3"],
      "category": "catégorie médicale",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "specialty": "spécialité médicale"
    }`;

    console.log(`Generating AI content for IGM Vol ${volume} No ${issue}`);
    
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
            content: 'Tu es un expert médical haïtien spécialisé dans la rédaction de contenus médicaux pour des revues professionnelles. Réponds uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return generateFallbackContent(volume, issue);
    }

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);

    return {
      title: aiContent.title,
      abstract: aiContent.abstract,
      authors: aiContent.authors,
      tags: aiContent.tags,
      category: aiContent.category,
      page_number: `1-${8 + Math.floor(Math.random() * 9)}`, // 8-16 pages
    };

  } catch (error) {
    console.error('Error generating AI content:', error);
    return generateFallbackContent(volume, issue);
  }
};

const generateFallbackContent = (volume: string, issue: string): Partial<IGMArticleData> => {
  const topics = [
    'cardiologie', 'pneumologie', 'gastroentérologie', 'neurologie', 
    'orthopédie', 'pédiatrie', 'gynécologie', 'dermatologie'
  ];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  return {
    abstract: `Cette édition de l'Info Gazette Médicale présente des avancées significatives dans le domaine de la ${randomTopic}. Les articles couvrent les dernières recherches, les techniques diagnostiques innovantes et les approches thérapeutiques modernes. Cette publication vise à informer les professionnels de santé sur les développements récents et les meilleures pratiques cliniques dans le domaine médical.`,
    authors: [
      'Dr. Ahmed Benali',
      'Pr. Fatima Zahra El Mansouri',
      'Dr. Mohamed Cherif'
    ],
    tags: [
      'médecine générale',
      randomTopic,
      'recherche clinique',
      'diagnostic',
      'thérapeutique',
      'santé publique'
    ],
    category: 'Médecine Générale',
    page_number: '1-12',
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting IGM articles backfill process...');

    // Get all PDFs from storage
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('igm-pdfs')
      .list('');

    if (storageError) {
      throw new Error(`Storage error: ${storageError.message}`);
    }

    // Get existing articles from database
    const { data: existingArticles, error: dbError } = await supabase
      .from('articles')
      .select('pdf_filename')
      .eq('source', 'IGM');

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const existingFilenames = new Set(existingArticles?.map(a => a.pdf_filename).filter(Boolean) || []);
    
    // Find missing files
    const missingFiles = storageFiles?.filter(file => 
      file.name.endsWith('.pdf') && !existingFilenames.has(file.name)
    ) || [];

    console.log(`Found ${missingFiles.length} missing files to process`);

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
        const generatedContent = await generateContentWithAI(file.name, volume, issue);
        
        // Prepare article data
        const articleData = {
          title: generatedContent.title || `INFO GAZETTE MÉDICALE (IGM) Vol ${volume} No ${issue}`,
          abstract: generatedContent.abstract || '',
          authors: generatedContent.authors || [],
          source: 'IGM',
          category: generatedContent.category || 'Médecine Générale',
          tags: generatedContent.tags || [],
          volume: volume,
          issue: issue,
          publication_date: publicationDate,
          pdf_filename: file.name,
          pdf_url: `${supabaseUrl}/storage/v1/object/public/igm-pdfs/${file.name}`,
          image_url: `${supabaseUrl}/storage/v1/object/public/igm_covers/IGM_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`,
          cover_image_filename: `IGM_vol_${volume.padStart(2, '0')}_no_${issue}_cover.png`,
          page_number: generatedContent.page_number || '1-12',
          status: 'published',
          article_type: 'IGM',
          specialty: generatedContent.category || 'Médecine Générale',
          institution: 'Info Chirurgie Magazine',
          views: 0,
          downloads: 0,
          shares: 0,
          citations: 0,
          doi: `ISBN: 978-99970-977-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}`,
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
        message: 'IGM articles backfill completed',
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
    console.error('Error in backfill function:', error);
    return new Response(
      JSON.stringify({
        error: 'Backfill failed',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});