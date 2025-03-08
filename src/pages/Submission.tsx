
import MainLayout from '@/components/layouts/MainLayout';
import { SubmissionHeader } from '@/components/submission/SubmissionHeader';
import { SubmissionForm } from '@/components/submission/SubmissionForm';
import { GenericErrorBoundary } from '@/components/error-boundary/GenericErrorBoundary';
import { toast } from '@/hooks/use-toast';

const Submission = () => {
  const handleFormSubmit = () => {
    toast({
      title: "Soumission envoyée",
      description: "Votre article a été soumis avec succès. Nous vous contacterons prochainement.",
    });
  };

  return (
    <MainLayout>
      <GenericErrorBoundary errorContext="Submission" showHome={true}>
        <div className="container max-w-4xl py-8">
          <SubmissionHeader />
          <SubmissionForm onSubmitSuccess={handleFormSubmit} />
        </div>
      </GenericErrorBoundary>
    </MainLayout>
  );
};

export default Submission;
