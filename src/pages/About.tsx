
import { MainLayout } from "@/components/layouts/MainLayout";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { motion } from "framer-motion";
import { BookOpen, Target, Users, Award, ArrowLeft, Calendar, Globe, Mail, MapPin, Heart, Building2, FileText, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const navigate = useNavigate();
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[30px]">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-primary hover:text-primary-light"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 px-3 sm:px-4">
                À propos d'INFOCHIR/RHCA
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed px-3 sm:px-4 md:px-6 mb-8">
                INFOCHIR/RHCA est une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie en Haïti.
                Notre mission est de faciliter le partage des connaissances médicales et de promouvoir la recherche scientifique.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Calendar className="w-3 h-3 mr-1" />
                  Fondé en 2011
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <FileText className="w-3 h-3 mr-1" />
                  34+ numéros RHCA
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Users className="w-3 h-3 mr-1" />
                  25+ membres
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction and Founding */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Introduction et Fondation</h2>
              </div>
              
              <div className="prose max-w-none text-gray-700 space-y-6">
                <p className="text-lg leading-relaxed">
                  Avant le tremblement de terre du 12 janvier 2010, InfoPed, la revue de la Société haïtienne de pédiatrie, était la seule revue médicale scientifique connue en Haïti. Cette publication accueillait occasionnellement des publications du service de chirurgie de l'Hôpital de l'Université d'État d'Haïti (HUEH). L'idée de créer une revue dédiée à la chirurgie germait déjà.
                </p>
                
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                  <p className="font-medium text-primary mb-3">Réunion fondatrice - 25 avril 2011</p>
                  <p>
                    Suite à l'insistance du Dr Eunice Dérivois, le Dr Louis-Franck Télémaque, alors chef du service de chirurgie de l'HUEH, a convoqué une réunion le lundi 25 avril 2011 avec un groupe de six médecins haïtiens pour discuter de ce sujet.
                  </p>
                </div>
                
                <p>
                  Étaient présents à cette réunion : Dr Télémaque, Dr Eunice Dérivois (chirurgien pédiatre), Dr Denise Fabien (anesthésiste), Dr Jean Alouidor (pédiatre et rédacteur d'InfoPed), et trois chirurgiens : Dr Jean-Marie Eustache, Dr Geissly Kernisan, et Dr Sosthène Pierre. L'ordre du jour portait sur l'établissement d'une organisation nommée Info CHIR, chargée de créer et de publier périodiquement une revue couvrant largement la chirurgie et l'anesthésiologie.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Organizational Structure */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Structure Organisationnelle</h2>
              </div>
              
              <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                  Les sept membres fondateurs ont constitué le conseil d'administration et se sont répartis les rôles : coordinateur, coordinateur adjoint, rédacteur en chef, éditeur, trésorier, responsable des communications, et membre.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4 text-primary">Comité de Lecture Critique</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Dr Fréderic Barau Dejean (interniste)</li>
                      <li>• Dr Claudine Jolicoeur (anesthésiologiste)</li>
                      <li>• Dr Claude Paultre (urologue)</li>
                      <li>• Dr Georges Beauvoir (orthopédiste)</li>
                      <li>• Dr Patrick Dupont (orthopédiste)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4 text-primary">Croissance</h3>
                    <p className="text-sm">
                      Un organigramme et des mandats de membres ont été établis, et l'organisation s'est depuis développée pour inclure plus de vingt-cinq membres.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Mission and Definition */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Mission et Définition de RHCA</h2>
              </div>
              
              <div className="prose max-w-none text-gray-700 space-y-6">
                <p className="text-lg">
                  La mission fondamentale d'Info CHIR était de créer et publier une revue, initialement appelée Info CHIR, qui est devenue plus tard La Revue Haïtienne de Chirurgie et d'Anesthésiologie (RHCA).
                </p>
                
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Objectifs de RHCA</h3>
                  <ul className="space-y-2">
                    <li>• Plateforme d'expression chirurgicale et anesthésiologique universitaire et hospitalière</li>
                    <li>• Ouverte à tous les éducateurs et praticiens désireux de publier des articles scientifiques</li>
                    <li>• Partage d'expériences et diffusion d'informations</li>
                    <li>• Réflexion sur des thèmes généraux ou spécifiques</li>
                    <li>• Référence pour la pratique chirurgicale et anesthésiologique actuelle pour les générations futures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Philosophy and Justification */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Philosophie et Justification</h2>
              </div>
              
              <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                  L'histoire de la chirurgie et de l'anesthésiologie en Haïti est largement méconnue, avec peu de traces des réalisations passées. Les figures marquantes des 50 dernières années sont inconnues de la génération actuelle.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4 text-red-600">Défis Identifiés</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Méconnaissance des procédures médicales disponibles localement</li>
                      <li>• Travail isolé des professionnels</li>
                      <li>• Conditions techniques inadéquates</li>
                      <li>• Manque de littérature médicale haïtienne</li>
                      <li>• "Fuite des cerveaux" vers les publications étrangères</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-lg mb-4 text-green-600">Vision de la Médecine Haïtienne</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Documentation pour les professionnels</li>
                      <li>• Formation des jeunes générations</li>
                      <li>• Information de la société civile</li>
                      <li>• Engagement avec la littérature médicale mondiale</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Periodicals and Sections */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Publications et Sections</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-4 text-primary">RHCA</h3>
                  <p className="text-sm mb-4">Publication trimestrielle (Mars, Juin, Septembre, Décembre)</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Sections :</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Articles Médicaux</li>
                      <li>Diaporamas</li>
                      <li>X trême dias</li>
                      <li>Dossiers</li>
                      <li>Informations</li>
                      <li>Réponse à l'auteur</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-4 text-secondary">IGM</h3>
                  <p className="text-sm mb-4">L'Info Gazette Médicale - Publication mensuelle (lancée décembre 2020)</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Sections :</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Lu Pour Vous</li>
                      <li>Santé Publique</li>
                      <li>Nouvelles Intra-Hospitalières</li>
                      <li>Informations Socio-Culturelles</li>
                      <li>Petites Annonces</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact and Production */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Contact et Production</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="font-semibold text-lg mb-4 text-primary">Coordonnées</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">infochir@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">info-chir.com</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span className="text-sm">Rue Camille Léon, No 30, Turgeau, Port-au-Prince, BP: HT 6113</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="font-semibold text-lg mb-4 text-primary">Production</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Format électronique principalement</p>
                    <p>• Copies papier limitées pour la Bibliothèque Nationale et la bibliothèque de la Faculté de Médecine HUEH</p>
                    <p>• 34 numéros de RHCA publiés (2011-mars 2021)</p>
                    <p>• Production IGM depuis décembre 2020</p>
                    <p>• Exposition permanente disponible dans les locaux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Impact and Perspectives */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">Impact</h2>
                  </div>
                  <div className="prose max-w-none text-gray-700">
                    <p>
                      RHCA et IGM visent à s'établir dans les communautés médicales haïtiennes et internationales pour aider à combler le vide en données médicales locales fiables. Leur accessibilité vise à encourager les organisations, institutions, praticiens, cliniciens et paramédicaux à publier localement et périodiquement.
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">Perspectives</h2>
                  </div>
                  <div className="prose max-w-none text-gray-700">
                    <p>
                      Info CHIR travaille à faire reconnaître RHCA parmi les revues scientifiques nationales et internationales. RHCA et IGM espèrent inspirer la création d'autres revues pour enrichir le paysage de la littérature médicale en Haïti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Financing */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-primary/5"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Financement</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-gray-700 mb-4">
                  Info CHIR est une institution à but non lucratif. Les membres du Conseil d'Administration et des divers comités contribuent sur une base volontaire.
                </p>
                <p className="text-sm text-gray-600">
                  Toutes les contributions pour les services offerts sont les bienvenues, et l'organisation définira sa politique financière à l'avenir.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Founding Members */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="py-12 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-8 h-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">Membres Fondateurs</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Louis-Franck TÉLÉMAQUE", title: "Chirurgien Général", role: "Coordinateur" },
                  { name: "Eunice DÉRIVOIS", title: "Chirurgien Général", role: "Coordinateur Adjoint" },
                  { name: "Sosthène PIERRE", title: "Chirurgien Général", role: "Relations Publiques" },
                  { name: "Jean ALOUIDOR", title: "Pédiatre", role: "Éditeur" },
                  { name: "Geissly KERNISAN", title: "Chirurgien Général", role: "Rédacteur en Chef", note: "Décédé; remplacé par Dr Jean-Robert Antoine" },
                  { name: "Jean-Marie EUSTACHE", title: "Chirurgien Général", role: "Trésorier" },
                  { name: "Denise FABIEN", title: "Anesthésiologiste", role: "Membre" }
                ].map((member, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-primary text-sm">{member.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{member.title}</p>
                    <p className="text-xs font-medium text-secondary">{member.role}</p>
                    {member.note && (
                      <p className="text-xs text-red-600 mt-1 italic">{member.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <FoundersSection />
        <SponsorsSection />
      </div>
    </MainLayout>
  );
};

export default About;
