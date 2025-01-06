import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard, Wallet, Apple, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const DonationAmounts = [10, 25, 50, 100, 250, 500];

export const DonateForm = () => {
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

  return (
    <div className="space-y-6">
      <Card className="shadow-lg backdrop-blur-sm bg-white/80 border-gray-100/20 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Choose Amount (USD)
            </span>
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
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

      <Card className="shadow-lg backdrop-blur-sm bg-white/80 border-gray-100/20 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Payment Method
          </CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
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

            <TabsContent value="bank" className="mt-4">
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

            <TabsContent value="zelle" className="mt-4">
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
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white" 
            disabled={!selectedAmount && !customAmount}
          >
            Complete Donation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};