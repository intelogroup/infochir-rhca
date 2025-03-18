
import React, { useEffect } from 'react';
import { MainLayout } from "@/components/layouts/MainLayout";
import { IGMHeader } from "@/components/igm/components/IGMHeader";
import { IGMSidebar } from "@/components/igm/components/IGMSidebar";
import { IssuesGridLayout } from "@/components/igm/components/layout/IssuesGridLayout";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IGM = () => {
  useEffect(() => {
    // Debug function to check for 2023 articles
    const checkFor2023Articles = async () => {
      try {
        console.log("Checking for 2023 IGM articles...");
        
        // Query all IGM articles from 2023
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq('source', 'IGM')
          .gte('publication_date', '2023-01-01')
          .lte('publication_date', '2023-12-31')
          .order('publication_date', { ascending: false });

        if (error) {
          console.error("Error fetching 2023 IGM articles:", error);
          return;
        }

        console.log(`Found ${data?.length || 0} IGM articles from 2023:`, data);
        
        // Also check how the useIGMIssues hook is filtering data
        const { data: allIGM, error: allIGMError } = await supabase
          .from("articles")
          .select("*")
          .eq('source', 'IGM')
          .order('publication_date', { ascending: false });
          
        if (allIGMError) {
          console.error("Error fetching all IGM articles:", allIGMError);
          return;
        }
        
        // Log year distribution
        const yearDistribution = allIGM?.reduce((acc, article) => {
          const year = new Date(article.publication_date).getFullYear();
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});
        
        console.log("IGM articles year distribution:", yearDistribution);
        
        if (data && data.length > 0) {
          toast.info(`Found ${data.length} IGM articles from 2023`);
        } else {
          toast.warning("No IGM articles from 2023 were found in the database");
        }
      } catch (error) {
        console.error("Error in debug check:", error);
      }
    };

    checkFor2023Articles();
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F1F0FB] pt-[15px]">
        <IGMHeader />

        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1fr,350px] lg:gap-6">
            <div className="order-1">
              <ErrorBoundary name="IGM-IssuesGrid">
                <IssuesGridLayout />
              </ErrorBoundary>
            </div>
            <div className="order-2 lg:order-2">
              <ErrorBoundary name="IGM-Sidebar">
                <IGMSidebar />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IGM;
