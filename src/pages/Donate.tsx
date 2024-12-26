import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard, Wallet, Apple, Bitcoin, DollarSign } from "lucide-react";
import { useState } from "react";

const DonationAmounts = [10, 25, 50, 100, 250, 500];

const DonateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const currentAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  return (
    <DonateLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            Soutenez INFOCHIR/RHCA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre don aide à maintenir et améliorer la qualité de la recherche médicale en Haïti. 
            Ensemble, nous pouvons faire progresser les soins de santé dans notre communauté.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Choose Amount (USD)
                </CardTitle>
                <CardDescription>Select a preset amount or enter a custom amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {DonationAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className="h-16 text-lg relative overflow-hidden group"
                      onClick={() => handleAmountSelect(amount)}
                    >
                      <span className="relative z-10">${amount}</span>
                      <div className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Or enter a custom amount</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="pl-8 text-lg"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid grid-cols-6 w-full">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="bank" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank
                    </TabsTrigger>
                    <TabsTrigger value="zelle" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Zelle
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      PayPal
                    </TabsTrigger>
                    <TabsTrigger value="apple" className="flex items-center gap-2">
                      <Apple className="h-4 w-4" />
                      Apple
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="flex items-center gap-2">
                      <Bitcoin className="h-4 w-4" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <Input placeholder="Card number" />
                      <div className="grid grid-cols-3 gap-4">
                        <Input placeholder="MM/YY" className="col-span-1" />
                        <Input placeholder="CVC" className="col-span-1" />
                        <Input placeholder="ZIP" className="col-span-1" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank" className="space-y-4 mt-4">
                    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="space-y-2">
                        <p className="font-medium">Bank Account Details:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Bank Name:</span>
                          <span>INFOCHIR Bank</span>
                          <span className="text-gray-600">Account Number:</span>
                          <span>XXXX-XXXX-XXXX</span>
                          <span className="text-gray-600">Routing Number:</span>
                          <span>XXX-XXX-XXX</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="zelle" className="space-y-4 mt-4">
                    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="space-y-2">
                        <p className="font-medium">Zelle Payment Details:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Email:</span>
                          <span>donate@infochir.org</span>
                          <span className="text-gray-600">Phone:</span>
                          <span>+1 (XXX) XXX-XXXX</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wallet" className="mt-4">
                    <div className="text-center py-8">
                      <Button variant="outline" className="w-full max-w-sm">
                        <Wallet className="mr-2 h-4 w-4" />
                        Pay with PayPal
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="apple" className="mt-4">
                    <div className="text-center py-8">
                      <Button variant="outline" className="w-full max-w-sm">
                        <Apple className="mr-2 h-4 w-4" />
                        Pay with Apple Pay
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="crypto" className="mt-4">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <Button variant="outline" className="w-full">
                        <Bitcoin className="mr-2 h-4 w-4" />
                        Bitcoin
                      </Button>
                      <Button variant="outline" className="w-full">
                        Ethereum
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white" 
                  disabled={!currentAmount}
                >
                  Donate ${currentAmount}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Donation</span>
                  <span className="font-medium">${currentAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">${(currentAmount * 0.029).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(currentAmount * 1.029).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-gray-500 bg-secondary/10 rounded-b-lg">
                <div className="space-y-2 w-full">
                  <p className="font-medium text-primary">Why donate?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Support medical research in Haiti</li>
                    <li>Improve healthcare quality</li>
                    <li>Train the next generation of doctors</li>
                    <li>Contribute to medical innovation</li>
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DonateLayout>
  );
};

export default Donate;