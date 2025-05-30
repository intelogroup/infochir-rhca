
import * as React from "react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users as UsersIcon, UserPlus, Shield, Settings, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { assignAdminRole } from "@/lib/admin-utils";

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role?: string;
}

const Users = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningRole, setAssigningRole] = useState(false);
  const [emailToPromote, setEmailToPromote] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // This would typically require admin privileges to access auth.users
      // For now, we'll show a placeholder and instructions
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        toast.error("Erreur lors du chargement des rôles utilisateurs");
        return;
      }

      // For demonstration, we'll show the roles we can access
      setUsers(userRoles?.map(role => ({
        id: role.user_id,
        email: 'utilisateur@example.com', // We can't access auth.users directly
        created_at: new Date().toISOString(),
        last_sign_in_at: null,
        role: role.role
      })) || []);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdminRole = async () => {
    if (!emailToPromote) {
      toast.error("Veuillez saisir un email");
      return;
    }

    try {
      setAssigningRole(true);
      const success = await assignAdminRole(emailToPromote);
      
      if (success) {
        toast.success(`Rôle administrateur assigné à ${emailToPromote}`);
        setEmailToPromote("");
        fetchUsers(); // Refresh the users list
      } else {
        toast.error("Échec de l'attribution du rôle administrateur. L'utilisateur existe-t-il ?");
      }
    } catch (error) {
      console.error('Error assigning admin role:', error);
      toast.error("Erreur lors de l'attribution du rôle administrateur");
    } finally {
      setAssigningRole(false);
    }
  };

  const adminCount = users.filter(user => user.role === 'admin').length;
  const totalUsers = users.length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des utilisateurs" 
        description="Gérez les utilisateurs, leurs rôles et leurs permissions"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalUsers}</CardTitle>
            <CardDescription>Utilisateurs totaux</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              {loading ? "Chargement..." : "Actif"}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{adminCount}</CardTitle>
            <CardDescription>Administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="default">
              {adminCount > 0 ? "Configuré" : "Aucun"}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalUsers - adminCount}</CardTitle>
            <CardDescription>Utilisateurs standards</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              {loading ? "Chargement..." : "Actif"}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Actifs ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">À venir</Badge>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Attribuer un rôle administrateur
            </CardTitle>
            <CardDescription>
              Donnez les droits d'administrateur à un utilisateur existant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de l'utilisateur</Label>
              <Input
                id="email"
                type="email"
                placeholder="utilisateur@exemple.com"
                value={emailToPromote}
                onChange={(e) => setEmailToPromote(e.target.value)}
                disabled={assigningRole}
              />
            </div>
            
            <Button 
              onClick={handleAssignAdminRole}
              disabled={assigningRole || !emailToPromote}
              className="w-full"
            >
              <Shield className="h-4 w-4 mr-2" />
              {assigningRole ? "Attribution en cours..." : "Attribuer le rôle admin"}
            </Button>

            <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
              <strong>Instructions :</strong>
              <br />
              1. L'utilisateur doit d'abord créer un compte via la page de connexion
              <br />
              2. Saisissez son email ci-dessus et cliquez sur "Attribuer le rôle admin"
              <br />
              3. L'utilisateur pourra ensuite accéder au dashboard administrateur
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Utilisateurs avec rôles
            </CardTitle>
            <CardDescription>
              Liste des utilisateurs avec leurs rôles assignés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Chargement des utilisateurs...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucun utilisateur avec rôle assigné</p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium truncate block">
                        ID: {user.id.substring(0, 8)}...
                      </span>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-md">
              <strong>Note :</strong> Pour des raisons de sécurité, les emails des utilisateurs 
              ne sont pas affichés ici. Utilisez l'outil d'attribution de rôle ci-contre.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions pour le premier administrateur</CardTitle>
          <CardDescription>
            Voici comment configurer le premier compte administrateur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Créer un compte
              </h4>
              <p className="text-sm text-gray-600">
                Allez sur <code>/admin/login</code> et créez un nouveau compte avec vos identifiants.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Attribuer le rôle admin
              </h4>
              <p className="text-sm text-gray-600">
                Utilisez l'outil ci-dessus pour vous attribuer le rôle d'administrateur.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm">
              <strong>Email suggéré :</strong> jimkalinov@gmail.com
              <br />
              <strong>Mot de passe suggéré :</strong> Jimkali90#
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
