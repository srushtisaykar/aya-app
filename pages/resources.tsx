
import React, { useState, useEffect, useCallback } from "react";
import { Resource } from "@/entities/Resource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Phone, 
  MessageSquare, 
  Video, 
  MapPin, 
  Clock, 
  DollarSign,
  ExternalLink,
  Heart,
  Users,
  Building2,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons = {
  crisis: Phone,
  counseling: Heart,
  peer_support: Users,
  online_therapy: Video,
  helpline: Headphones,
  campus_resource: Building2,
  community_org: MapPin
};

const costColors = {
  free: "bg-green-100 text-green-700 border-green-200",
  low_cost: "bg-blue-100 text-blue-700 border-blue-200",
  sliding_scale: "bg-purple-100 text-purple-700 border-purple-200",
  insurance: "bg-orange-100 text-orange-700 border-orange-200",
  paid: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Memoize filterResources with useCallback
  const filterResources = useCallback(() => {
    let filtered = resources;

    if (activeCategory !== "all") {
      filtered = filtered.filter(resource => resource.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredResources(filtered);
  }, [resources, activeCategory, searchTerm]); // Dependencies for useCallback

  useEffect(() => {
    loadResources();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    filterResources();
  }, [filterResources]); // Depend on the memoized filterResources function

  const loadResources = async () => {
    try {
      const data = await Resource.list("title");
      setResources(data);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(resources.map(r => r.category))];
  const crisisResources = resources.filter(r => r.is_crisis);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-lavender-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Support Resources</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find professional support, peer communities, and helplines. 
            All resources are curated for youth and designed to be accessible and welcoming.
          </p>
        </motion.div>

        {/* Crisis Resources Banner */}
        {crisisResources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-red-200 bg-red-50 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Phone className="w-5 h-5" />
                  Need Immediate Support?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {crisisResources.slice(0, 3).map((resource) => (
                    <div key={resource.id} className="bg-white rounded-lg p-4 border border-red-200">
                      <h3 className="font-medium text-red-800 mb-1">{resource.title}</h3>
                      <p className="text-sm text-red-600 mb-2">{resource.availability}</p>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white w-full"
                        onClick={() => window.open(resource.contact_info.startsWith('http') ? resource.contact_info : `tel:${resource.contact_info}`, '_blank')}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Contact Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="pl-10 rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm"
            />
          </div>
          
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-white/70 backdrop-blur-sm border border-sage-200 rounded-xl p-1">
              <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="rounded-lg capitalize">
                  {category.replace(/_/g, ' ')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Resources Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${searchTerm}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource, index) => {
              const IconComponent = categoryIcons[resource.category] || Heart;
              const costColorClass = costColors[resource.cost] || costColors.free;
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-sage-100 to-lavender-100">
                          <IconComponent className="w-6 h-6 text-sage-600" />
                        </div>
                        {resource.is_crisis && (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            Crisis
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {resource.title}
                      </CardTitle>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Contact Type & Availability */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {resource.contact_type === 'phone' && <Phone className="w-4 h-4" />}
                          {resource.contact_type === 'text' && <MessageSquare className="w-4 h-4" />}
                          {resource.contact_type === 'video' && <Video className="w-4 h-4" />}
                          {resource.contact_type === 'chat' && <MessageSquare className="w-4 h-4" />}
                          {resource.contact_type === 'in_person' && <MapPin className="w-4 h-4" />}
                          {resource.contact_type === 'app' && <ExternalLink className="w-4 h-4" />}
                          <span className="capitalize">{resource.contact_type.replace('_', ' ')}</span>
                        </div>
                        
                        {resource.availability && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{resource.availability}</span>
                          </div>
                        )}
                      </div>

                      {/* Cost & Tags */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${costColorClass} border capitalize`}>
                          <DollarSign className="w-3 h-3 mr-1" />
                          {resource.cost.replace('_', ' ')}
                        </Badge>
                        
                        <Badge variant="outline" className="bg-sage-50 border-sage-200 text-sage-700 capitalize">
                          {resource.category.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Languages */}
                      {resource.language_support && resource.language_support.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Languages: </span>
                          {resource.language_support.join(', ')}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className="w-full bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white rounded-xl"
                        onClick={() => {
                          if (resource.contact_info.startsWith('http')) {
                            window.open(resource.contact_info, '_blank');
                          } else if (resource.contact_type === 'phone') {
                            window.open(`tel:${resource.contact_info}`, '_blank');
                          } else {
                            window.open(resource.contact_info, '_blank');
                          }
                        }}
                      >
                        {resource.contact_type === 'phone' && <Phone className="w-4 h-4 mr-2" />}
                        {resource.contact_type === 'text' && <MessageSquare className="w-4 h-4 mr-2" />}
                        {resource.contact_type === 'video' && <Video className="w-4 h-4 mr-2" />}
                        {resource.contact_type === 'chat' && <MessageSquare className="w-4 h-4 mr-2" />}
                        {resource.contact_type === 'in_person' && <MapPin className="w-4 h-4 mr-2" />}
                        {resource.contact_type === 'app' && <ExternalLink className="w-4 h-4 mr-2" />}
                        
                        {resource.is_crisis ? 'Get Help Now' : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-sage-100 to-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-sage-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No resources match "${searchTerm}"`
                : `No ${activeCategory} resources available yet`}
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
