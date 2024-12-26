import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Paypal, Apple, Bitcoin } from "lucide-react";

const DonationAmounts = [10, 25, 50, 100, 250, 500];

const Donate = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Encouragement Message */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Soutenez RHCA</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre don aide à maintenir et améliorer la qualité de la recherche médicale en Haïti. 
            Ensemble, nous pouvons faire progresser les soins de santé dans notre communauté.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Amount Selection */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Choisissez un montant</CardTitle>
                <CardDescription>Sélectionnez un montant prédéfini ou entrez un montant personnalisé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {DonationAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-16 text-lg hover:bg-primary hover:text-white"
                    >
                      {amount}€
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ou entrez un montant personnalisé</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8 text-lg"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
                <CardDescription>Choisissez votre méthode de paiement préférée</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Carte
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex items-center gap-2">
                      <Paypal className="h-4 w-4" />
                      PayPal
                    </TabsTrigger>
                    <TabsTrigger value="apple" className="flex items-center gap-2">
                      <Apple className="h-4 w-4" />
                      Apple Pay
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="flex items-center gap-2">
                      <Bitcoin className="h-4 w-4" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-4">
                    <Input placeholder="Numéro de carte" />
                    <div className="grid grid-cols-3 gap-4">
                      <Input placeholder="MM/YY" className="col-span-1" />
                      <Input placeholder="CVC" className="col-span-1" />
                      <Input placeholder="Code postal" className="col-span-1" />
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="mt-4">
                    <div className="text-center py-8 text-gray-600">
                      Vous serez redirigé vers PayPal pour finaliser votre don.
                    </div>
                  </TabsContent>

                  <TabsContent value="apple" className="mt-4">
                    <div className="text-center py-8 text-gray-600">
                      Cliquez sur le bouton ci-dessous pour payer avec Apple Pay.
                    </div>
                  </TabsContent>

                  <TabsContent value="crypto" className="mt-4">
                    <div className="text-center py-8 text-gray-600">
                      Choisissez votre crypto-monnaie préférée pour faire un don.
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary-light">
                  Faire un don
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Résumé du don</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Don</span>
                  <span className="font-medium">0.00€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de traitement</span>
                  <span className="font-medium">0.00€</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>0.00€</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Votre don est sécurisé et crypté
              </CardFooter>
            </Card>

            <div className="mt-6 bg-muted rounded-lg p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Pourquoi faire un don ?</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Soutenir la recherche médicale en Haïti</li>
                <li>Améliorer la qualité des soins</li>
                <li>Former la prochaine génération de médecins</li>
                <li>Contribuer à l'innovation médicale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Donate;