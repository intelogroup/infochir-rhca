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
  // Extract chapter and date from ADC filename pattern: ADC_ch_X_maj_DD_MM_YY.pdf or ADC_intro_maj_DD_MM_YY.pdf
  const chapterMatch = filename.match(/ADC_ch_(\d+)_maj_(\d+)_(\d+)_(\d+)\.pdf/);
  const introMatch = filename.match(/ADC_intro_maj_(\d+)_(\d+)_(\d+)\.pdf/);
  
  if (chapterMatch) {
    const [, chapter, day, month, year] = chapterMatch;
    const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
    const publicationDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return { chapter, publicationDate, isIntro: false };
  } else if (introMatch) {
    const [, day, month, year] = introMatch;
    const fullYear = parseInt(year) < 50 ? `20${year}` : `19${year}`;
    const publicationDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return { chapter: '00', publicationDate, isIntro: true };
  }
  
  return null;
};

const generateAtlasContent = async (filename: string, chapter: string, publicationDate: string, isIntro: boolean): Promise<Partial<AtlasArticleData>> => {
  const openAIApiKey = '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';
  
  try {
    if (!openAIApiKey) {
      return generateFallbackAtlasContent(chapter, isIntro);
    }

    const haitianSurgeons = [
      'Dr. Louis-Franck TÉLÉMAQUE', 'Dr. Michel DODARD', 'Dr. Pierre Marie WOOLLEY',
      'Dr. Patrick Jean-Gilles', 'Dr. Sterman TOUSSAINT', 'Dr. Emmanuel RÉGIS',
      'Dr. Jean-Fritz JACQUES', 'Dr. Edouard BONTEMPS', 'Dr. Wilfine DUPONT',
      'Dr. Maurice DAGHUIL', 'Dr. Grenson JEUNE', 'Dr. Djhonn St CYR',
      'Dr. David NOËL', 'Dr. Eunice DÉRIVOIS', 'Dr. Margareth DÉGAND',
      'Dr. Jacques Maurice JEUDY', 'Dr. Pascale JEAN-BAPTISTE', 'Dr. Carl Renan FAYETTE'
    ];

    const surgicalTopics = [
      'traumatismes et chirurgie d\'urgence', 'pathologies cutanées et chirurgie plastique', 
      'chirurgie du sein et oncologie', 'chirurgie thoracique et cardiovasculaire',
      'ophtalmologie et chirurgie maxillo-faciale', 'chirurgie digestive et hépato-biliaire',
      'chirurgie orthopédique et traumatologie', 'neurochirurgie et spine',
      'urologie et chirurgie génito-urinaire', 'chirurgie vasculaire',
      'chirurgie pédiatrique', 'anesthésie et réanimation'
    ];

    const prompt = isIntro 
      ? `Génère un contenu pour l'introduction de l'Atlas de Diagnostic Chirurgical (ADC) haïtien.
      
      Contexte: L'ADC est un atlas médical haïtien de référence qui présente des cas cliniques chirurgicaux illustrés, des techniques diagnostiques, et des guides thérapeutiques adaptés au contexte haïtien.
      
      Génère:
      1. Un titre pour l'introduction
      2. Un résumé détaillé (400-500 mots) présentant l'atlas, son importance pour la médecine haïtienne
      3. Les auteurs principaux (1-3 auteurs)
      4. Une catégorie médicale
      5. Des mots-clés pertinents (6-8 mots-clés)
      6. Une spécialité médicale
      
      Format de réponse JSON:
      {
        "title": "Atlas de Diagnostic Chirurgical (ADC) - Introduction",
        "abstract": "résumé détaillé en français",
        "authors": ["auteur1", "auteur2"],
        "category": "Introduction",
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
        "specialty": "Chirurgie générale"
      }`
      : `Génère un contenu pour le chapitre ${chapter} de l'Atlas de Diagnostic Chirurgical (ADC) haïtien.
      
      Contexte: L'ADC est un atlas chirurgical haïtien qui présente des cas cliniques illustrés par spécialité médicale. Chaque chapitre couvre une spécialité ou région anatomique différente.
      
      Génère:
      1. Un titre pour ce chapitre (inclure la spécialité/région)
      2. Un résumé détaillé (300-400 mots) décrivant les pathologies et techniques couvertes
      3. Une liste d'auteurs chirurgiens haïtiens (3-6 auteurs)
      4. Une catégorie chirurgicale principale
      5. Des mots-clés médicaux pertinents (6-8 mots-clés)
      6. Une spécialité chirurgicale
      
      Thèmes suggérés: ${surgicalTopics.slice(0, 4).join(', ')}
      Auteurs suggérés: ${haitianSurgeons.slice(0, 6).join(', ')}
      
      Format de réponse JSON:
      {
        "title": "Atlas de Diagnostic Chirurgical (ADC) - [Spécialité]",
        "abstract": "résumé détaillé en français",
        "authors": ["auteur1", "auteur2", "auteur3"],
        "category": "catégorie chirurgicale",
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
        "specialty": "spécialité chirurgicale"
      }`;

    console.log(`Generating AI content for ADC Chapter ${chapter}${isIntro ? ' (Introduction)' : ''}`);
    
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
            content: 'Tu es un chirurgien haïtien expert spécialisé dans la rédaction de contenus médicaux pour l\'Atlas de Diagnostic Chirurgical haïtien. Réponds uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1400
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return generateFallbackAtlasContent(chapter, isIntro);
    }

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);

    return {
      title: aiContent.title,
      abstract: aiContent.abstract,
      authors: aiContent.authors,
      tags: aiContent.tags,
      category: aiContent.category,
      page_number: `1-${isIntro ? '5' : (15 + Math.floor(Math.random() * 25))}`, // 1-5 for intro, 15-40 for chapters
    };

  } catch (error) {
    console.error('Error generating AI content for ADC:', error);
    return generateFallbackAtlasContent(chapter, isIntro);
  }
};

const generateFallbackAtlasContent = (chapter: string, isIntro: boolean): Partial<AtlasArticleData> => {
  const specialties = ['Traumatismes', 'Peau et tissu Sous-cutané', 'Le Sein', 'Thorax', 
                      'Ophtalmologie', 'Digestif', 'Orthopédie', 'Neurochirurgie'];
  const randomSpecialty = specialties[Math.floor(Math.random() * specialties.length)];
  
  if (isIntro) {
    return {
      title: 'Atlas de Diagnostic Chirurgical (ADC) - Introduction',
      abstract: `L'Atlas de Diagnostic Chirurgical haïtien représente une avancée majeure dans la documentation médicale nationale, offrant un panorama complet des pathologies chirurgicales rencontrées et traitées en Haïti. Cette ressource de référence rassemble le savoir et l'expertise des chirurgiens haïtiens à travers des images cliniques authentiques et des explications détaillées couvrant l'ensemble des spécialités chirurgicales.`,
      authors: ['Dr. Louis-Franck TÉLÉMAQUE'],
      tags: ['atlas chirurgical', 'diagnostic', 'médecine haïtienne', 'formation médicale', 'chirurgie', 'cas cliniques'],
      category: 'Introduction',
      page_number: '1-5',
    };
  }
  
  return {
    title: `Atlas de Diagnostic Chirurgical (ADC) - ${randomSpecialty}`,
    abstract: `Ce chapitre de l'Atlas de Diagnostic Chirurgical couvre les pathologies et techniques chirurgicales liées au domaine ${randomSpecialty.toLowerCase()}. Il présente des cas cliniques illustrés, des techniques diagnostiques et des approches thérapeutiques adaptées au contexte haïtien. Les images cliniques authentiques sont accompagnées d'explications détaillées pour faciliter l'apprentissage et la pratique chirurgicale.`,
    authors: [
      'Dr. Louis-Franck TÉLÉMAQUE',
      'Dr. Michel DODARD',
      'Dr. Pierre Marie WOOLLEY'
    ],
    tags: [
      'chirurgie',
      randomSpecialty.toLowerCase(),
      'diagnostic chirurgical',
      'cas cliniques',
      'techniques chirurgicales',
      'atlas médical'
    ],
    category: 'Chirurgie',
    page_number: '1-25',
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
      .eq('source', 'ADC');

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const existingFilenames = new Set(existingArticles?.map(a => a.pdf_filename).filter(Boolean) || []);
    
    // Find missing files
    const missingFiles = storageFiles?.filter(file => 
      file.name.endsWith('.pdf') && !existingFilenames.has(file.name)
    ) || [];

    console.log(`Found ${missingFiles.length} missing ADC files to process`);

    const results = [];
    
    // Process each missing file
    for (const file of missingFiles) {
      try {
        const fileInfo = extractInfoFromFilename(file.name);
        if (!fileInfo) {
          console.log(`Skipping file with invalid format: ${file.name}`);
          continue;
        }

        const { chapter, publicationDate, isIntro } = fileInfo;
        
        // Generate content for this file
        const generatedContent = await generateAtlasContent(file.name, chapter, publicationDate, isIntro);
        
        // Prepare article data
        const articleData = {
          title: generatedContent.title || `Atlas de Diagnostic Chirurgical (ADC) - Chapitre ${chapter}`,
          abstract: generatedContent.abstract || '',
          authors: generatedContent.authors || [],
          source: 'ADC',
          category: generatedContent.category || 'Chirurgie',
          tags: generatedContent.tags || [],
          volume: null, // ADC doesn't use volumes
          issue: chapter.padStart(2, '0'), // Use chapter as issue
          publication_date: publicationDate,
          pdf_filename: file.name,
          pdf_url: `${supabaseUrl}/storage/v1/object/public/atlas-pdfs/${file.name}`,
          image_url: `${supabaseUrl}/storage/v1/object/public/atlas_covers/ADC_ch_${chapter.padStart(2, '0')}_cover.png`,
          cover_image_filename: `ADC_ch_${chapter.padStart(2, '0')}_cover.png`,
          page_number: generatedContent.page_number || '1-25',
          status: 'published',
          article_type: 'ADC',
          specialty: generatedContent.category || 'Chirurgie',
          institution: 'Atlas de Diagnostic Chirurgical',
          views: 0,
          downloads: 0,
          shares: 0,
          citations: 0,
          doi: `ADC-${chapter.padStart(2, '0')}-${new Date(publicationDate).getFullYear()}`,
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
            message: 'ADC articles backfill completed',
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
            error: 'ADC backfill failed',
            message: error.message
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
  }
});