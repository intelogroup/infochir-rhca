
import * as React from "react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users as UsersIcon, 
  Shield, 
  Search, 
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { assignAdminRole } from "@/lib/admin-utils";

const UserRow = ({ user }: { user: any }) => (
  <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <UsersIcon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{user.email}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Inscrit le {user.created_at}
          </span>
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
            {user.role}
          </Badge>
          <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs bg-green-600">
            {user.status}
          </Badge>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Mail className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const mockUsers = [
  {
    id: 1,
    email: "jimkalinov@gmail.com",
    role: "admin",
    status: "active",
    created_at: "15 Jan 2024"
  },
  {
    id: 2,
    email: "user@exemple.com",
    role: "user",
    status: "active",
    created_at: "12 Jan 2024"
  },
  {
    id: 3,
    email: "editor@exemple.com",
    role: "editor",
    status: "active",
    created_at: "10 Jan 2024"
  }
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">1,234</CardTitle>
            <CardDescription>Utilisateurs totaux</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">+12 ce mois</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">5</CardTitle>
            <CardDescription>Administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Actifs</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">89</CardTitle>
            <CardDescription>Nouveaux ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">+15%</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">98.5%</CardTitle>
            <CardDescription>Comptes actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="bg-green-600">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des utilisateurs</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <div className="px-6 pb-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="admin">Admins</TabsTrigger>
                    <TabsTrigger value="active">Actifs</TabsTrigger>
                    <TabsTrigger value="inactive">Inactifs</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="divide-y">
                    {mockUsers.map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="mt-0">
                  <div className="divide-y">
                    {mockUsers.filter(u => u.role === "admin").map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="active" className="mt-0">
                  <div className="divide-y">
                    {mockUsers.filter(u => u.status === "active").map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="inactive" className="mt-0">
                  <div className="p-6 text-center">
                    <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur inactif</h3>
                    <p className="text-gray-600">
                      Tous les utilisateurs sont actuellement actifs.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Attribuer un rôle administrateur
              </CardTitle>
              <CardDescription>
                Donner les droits d'administration à un utilisateur
              </CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Dernières actions des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Nouvel utilisateur inscrit</span>
                  <span className="text-gray-400 text-xs">Il y a 2h</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Rôle admin attribué</span>
                  <span className="text-gray-400 text-xs">Il y a 4h</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Utilisateur mis à jour</span>
                  <span className="text-gray-400 text-xs">Il y a 1j</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Users;
