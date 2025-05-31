
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users as UsersIcon, 
  Shield, 
  UserPlus,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { assignAdminRole } from "@/lib/admin-utils";

const UsersList = () => (
  <Card>
    <CardHeader>
      <CardTitle>Utilisateurs</CardTitle>
      <CardDescription>Gérer les utilisateurs et leurs rôles</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { email: "jimkalinov@gmail.com", role: "admin", status: "active" },
          { email: "user@exemple.com", role: "user", status: "active" },
          { email: "editor@exemple.com", role: "editor", status: "active" }
        ].map((user, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-3">
              <UsersIcon className="h-4 w-4" />
              <div>
                <p className="font-medium">{user.email}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AdminRoleAssignment = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignAdminRole = async () => {
    if (!adminEmail) {
      toast.error("Veuillez saisir une adresse email");
      return;
    }

    setIsAssigning(true);
    try {
      const success = await assignAdminRole(adminEmail);
      if (success) {
        toast.success(`Rôle administrateur attribué à ${adminEmail}`);
        setAdminEmail("");
      } else {
        toast.error("Erreur lors de l'attribution du rôle");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'attribution du rôle");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Attribuer un rôle administrateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adminEmail">Email de l'utilisateur</Label>
          <Input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="user@exemple.com"
          />
        </div>
        <Button 
          onClick={handleAssignAdminRole} 
          disabled={isAssigning}
          className="w-full"
        >
          {isAssigning ? "Attribution en cours..." : "Attribuer le rôle admin"}
        </Button>
      </CardContent>
    </Card>
  );
};

const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Gestion des utilisateurs" 
          description="Gérez les utilisateurs et leurs rôles"
        />
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Utilisateurs totaux</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">Actifs</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">1</CardTitle>
            <CardDescription>Administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Actif</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">2</CardTitle>
            <CardDescription>Utilisateurs standard</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Actifs</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersList />
        <AdminRoleAssignment />
      </div>
    </div>
  );
};

export default Users;
