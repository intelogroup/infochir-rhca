import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  File, 
  Upload, 
  CheckSquare, 
  AlertCircle 
} from "lucide-react";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  publicationType: z.enum(["RHCA", "IGM"]),
  title: z.string().min(1, "Le titre est requis"),
  authors: z.string().min(1, "Les auteurs sont requis"),
  institution: z.string().min(1, "L'institution est requise"),
  correspondingAuthor: z.object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(1, "Le téléphone est requis"),
    address: z.string().min(1, "L'adresse est requise"),
  }),
  abstract: z.string().min(1, "Le résumé est requis").max(250, "Le résumé ne doit pas dépasser 250 mots"),
  keywords: z.string().min(1, "Les mots clés sont requis"),
  ethicsApproval: z.boolean(),
  noConflict: z.boolean(),
  originalWork: z.boolean(),
});

const Submission = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ethicsApproval: false,
      noConflict: false,
      originalWork: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      toast.success("Votre soumission a été envoyée avec succès!");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de votre soumission");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Soumettre un Article
            </h1>
            <p className="text-lg text-gray-600">
              Veuillez remplir ce formulaire pour soumettre votre article à la RHCA ou à l'IGM
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="publicationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de publication</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="RHCA" id="rhca" />
                          <Label htmlFor="rhca">RHCA - Revue Haïtienne de Chirurgie et d'Anesthésiologie</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="IGM" id="igm" />
                          <Label htmlFor="igm">IGM - Info Gazette Médicale</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'article</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez le titre de votre article" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auteurs</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Noms des auteurs (séparés par des virgules)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Incluez le degré académique le plus élevé pour chaque auteur
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nom du département ou de l'institution" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Auteur correspondant</h3>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="correspondingAuthor.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="correspondingAuthor.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="correspondingAuthor.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="correspondingAuthor.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="abstract"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Résumé</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Entrez le résumé de votre article (max 250 mots)" 
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Le résumé doit inclure le problème, la méthode, les résultats et la conclusion
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mots clés</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="3 à 5 mots clés séparés par des virgules" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Correspondant à la liste des titres de sujets médicaux de l'Index Medicus
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Document principal</h3>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button type="button" variant="outline">
                        Sélectionner le fichier
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Format Word ou PDF, max 10MB
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Déclarations</h3>
                  <FormField
                    control={form.control}
                    name="ethicsApproval"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Approbation éthique
                          </FormLabel>
                          <FormDescription>
                            Cette recherche a reçu l'approbation éthique nécessaire
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noConflict"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Absence de conflit d'intérêt
                          </FormLabel>
                          <FormDescription>
                            Je déclare n'avoir aucun conflit d'intérêt
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originalWork"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Travail original
                          </FormLabel>
                          <FormDescription>
                            Je confirme que cet article est original et n'est pas en considération avec un autre journal
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Sauvegarder comme brouillon
                </Button>
                <Button type="submit">
                  Soumettre l'article
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Submission;