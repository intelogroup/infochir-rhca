import { Building2, CreditCard, Wallet, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

export const PaymentMethodSelector = ({
  selectedPaymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <Tabs value={selectedPaymentMethod} onValueChange={onPaymentMethodChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
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
        <TabsTrigger value="paypal" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          PayPal
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

      <TabsContent value="paypal" className="mt-4">
        <div className="text-center py-8">
          <Button variant="outline" className="w-full max-w-sm">
            <Wallet className="mr-2 h-4 w-4" />
            Pay with PayPal
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};