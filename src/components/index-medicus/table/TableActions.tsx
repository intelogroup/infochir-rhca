import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, Edit, MoreHorizontal, RotateCcw, Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

interface TableActionsProps<TData> {
  row: {
    original: TData;
  };
}

export function TableActions<TData extends { id: string; title: string }>(
  props: TableActionsProps<TData>
) {
  const { row } = props;
  const router = useRouter();
  const id = row.original.id;
  const title = row.original.title;

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copié!",
      description: "L'ID de l'article a été copié dans le presse-papier.",
    });
  };

  const handleEdit = () => {
    router.push(`/dashboard/articles/edit/${id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Delete related records in article_authors table
      const { error: authorError } = await supabase
        .from("article_authors")
        .delete()
        .eq("article_id", id);

      if (authorError) {
        console.error("Error deleting article authors:", authorError);
        toast({
          title: "Erreur!",
          description:
            "Une erreur est survenue lors de la suppression des auteurs de l'article.",
        });
        return;
      }

      // Delete the article itself
      const { error: articleError } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (articleError) {
        console.error("Error deleting article:", articleError);
        toast({
          title: "Erreur!",
          description:
            "Une erreur est survenue lors de la suppression de l'article.",
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "L'article a été supprimé avec succès.",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erreur!",
        description: "Une erreur inattendue est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-md hover:bg-secondary">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="w-4 h-4 mr-2" />
          Copier l'ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/20">
              <Trash className="w-4 h-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L'article "{title}" sera
                définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                {loading ? (
                  <RotateCcw className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  <Trash className="w-4 h-4 mr-2" />
                )}
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
