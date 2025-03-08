
import MainLayout from '@/components/layouts/MainLayout';
import { SubmissionHeader } from '@/components/submission/SubmissionHeader';
import { SubmissionForm } from '@/components/submission/SubmissionForm';
import { GenericErrorBoundary } from '@/components/error-boundary/GenericErrorBoundary';

const Submission = () => {
  return (
    <MainLayout>
      <GenericErrorBoundary errorContext="Submission" showHome={true}>
        <div className="container max-w-4xl py-8">
          <SubmissionHeader />
          <SubmissionForm />
        </div>
      </GenericErrorBoundary>
    </MainLayout>
  );
};

export default Submission;
