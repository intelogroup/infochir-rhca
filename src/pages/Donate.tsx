import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/stripe";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DonationAmountSelector } from "@/components/donate/form/DonationAmountSelector";
import { PageHeader } from "@/components/ui/page-header";
import { SEO } from "@/components/seo/SEO";

const Donate = () => {
  useScrollToTop();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleDonation = async () => {
    try {
      if (!email) {
        toast.error("Veuillez saisir votre adresse e-mail");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Veuillez saisir une adresse e-mail valide");
        return;
      }

      const amount = customAmount ? Number(customAmount) : selectedAmount;
      if (!amount || amount <= 0) {
        toast.error("Veuillez choisir ou saisir un montant");
        return;
      }

      if (amount > 50000) {
        toast.error("Pour les dons importants, veuillez nous contacter directement");
        return;
      }

      setIsProcessing(true);

      await createCheckoutSession(amount, {
        donor_info: {
          name,
          email,
          is_anonymous: !name,
          message: '',
        }
      });

    } catch (error: any) {
      console.error('[Donate] Payment error:', error);
      toast.error(error.message || "Le traitement du don a échoué");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <SEO
        title="Faire un don | Soutenir Info CHIR"
        description="Soutenez la publication scientifique médicale en Haïti : votre don finance la RHCA, l'IGM et l'Atlas de diagnostic."
        path="/donate"
      />
      <PageHeader
        backLink="/"
        align="left"
        variant="brand"
        title="Soutenir INFOCHIR/RHCA"
        description="Votre don finance la publication scientifique médicale haïtienne : la RHCA, l'Info Gazette Médicale et l'Atlas de diagnostic."
      />

      <section className="section">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl space-y-8 rounded-lg border border-border bg-card p-8"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="donor-email" className="mb-1 block text-sm font-medium">
                  E-mail (requis)
                </label>
                <Input
                  id="donor-email"
                  name="donor-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="donor-name" className="mb-1 block text-sm font-medium">
                  Nom (facultatif)
                </label>
                <Input
                  id="donor-name"
                  name="donor-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="custom-amount" className="mb-4 block text-sm font-medium">
                Choisir un montant
              </label>
              <DonationAmountSelector
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                onAmountChange={(amount) => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                onCustomAmountChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
              />
            </div>

            <Button
              onClick={handleDonation}
              disabled={isProcessing}
              size="lg"
              className="w-full"
            >
              {isProcessing ? "Traitement en cours…" : "Continuer vers le paiement"}
            </Button>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Donate;
