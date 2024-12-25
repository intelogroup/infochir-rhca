import { Header } from "@/components/rhca/admin/Header";
import { ArticleList } from "@/components/rhca/admin/ArticleList";

const RHCA = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header />
        <ArticleList />
      </div>
    </div>
  );
};

export default RHCA;