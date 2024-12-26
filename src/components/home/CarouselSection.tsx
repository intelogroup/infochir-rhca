import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    title: "Formation en Chirurgie Laparoscopique",
    description: "Atelier pratique de 3 jours sur les techniques avancées de chirurgie mini-invasive",
    image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=1974&auto=format&fit=crop",
    date: "15-17 Mars 2024",
    type: "formation",
    category: "Formation",
  },
  {
    title: "Congrès International de Chirurgie",
    description: "Rejoignez-nous pour le plus grand événement chirurgical de l'année avec des experts internationaux",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1974&auto=format&fit=crop",
    date: "5-7 Avril 2024",
    type: "event",
    category: "Événement",
  },
  {
    title: "Nouvelle Technique de Transplantation",
    description: "Une équipe de chercheurs développe une approche révolutionnaire pour la transplantation d'organes",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop",
    type: "article",
    category: "Article RHCA",
    author: "Dr. Marie Laurent",
  },
  {
    title: "Message du Président de l'ASHAC",
    description: "Perspectives sur l'avenir de la chirurgie en Haïti et les défis à relever ensemble",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
    type: "message",
    category: "Message",
    author: "Prof. Jean-Robert Pierre",
  },
  {
    title: "Avancées en Chirurgie Robotique",
    description: "Les dernières innovations en matière de chirurgie assistée par robot",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1974&auto=format&fit=crop",
    type: "news",
    category: "Actualité",
    date: "28 Février 2024",
  },
  {
    title: "Webinaire: Innovations en Anesthésie",
    description: "Discussion interactive sur les nouvelles approches en anesthésie régionale",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1974&auto=format&fit=crop",
    type: "webinar",
    category: "Webinaire",
    date: "20 Mars 2024",
    time: "14:00 - 16:00 UTC",
  },
  {
    title: "Étude IGM: Traitement du Cancer Colorectal",
    description: "Résultats prometteurs d'une nouvelle approche thérapeutique combinée",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1978&auto=format&fit=crop",
    type: "article",
    category: "Article IGM",
    author: "Dr. Sophie Dubois",
    date: "1 Mars 2024",
  },
  {
    title: "Atlas ADC: Guide de Chirurgie Pédiatrique",
    description: "Nouvelle publication détaillant les techniques spécialisées en chirurgie pédiatrique",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop",
    type: "publication",
    category: "Atlas ADC",
    author: "Équipe de Chirurgie Pédiatrique",
  },
  {
    title: "Webinaire: Gestion de la Douleur Post-opératoire",
    description: "Experts internationaux partagent les meilleures pratiques en gestion de la douleur",
    image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?q=80&w=2070&auto=format&fit=crop",
    type: "webinar",
    category: "Webinaire",
    date: "25 Mars 2024",
    time: "15:00 - 17:00 UTC",
  },
  {
    title: "RHCA: Techniques Minimalement Invasives",
    description: "Revue systématique des dernières avancées en chirurgie mini-invasive",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop",
    type: "article",
    category: "Article RHCA",
    author: "Prof. Marc Dupont",
  }
];

export const CarouselSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4"
          >
            À la Une
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Découvrez les dernières actualités, événements et formations
          </motion.p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {highlights.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 h-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-2 h-full"
                >
                  <div className="relative group h-full rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {item.date && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            {item.date}
                          </span>
                        )}
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            {item.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};