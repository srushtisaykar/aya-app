
import React, { useState, useEffect } from "react";
import { Intervention } from "@/entities/Intervention";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Heart, Wind, Book, Zap, Moon, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import InterventionDetail from "../components/interventions/InterventionDetail";

const categoryIcons = {
  breathing: Wind,
  grounding: Heart,
  journaling: Book,
  movement: Zap,
  sleep: Moon,
  focus: Target,
  anxiety: Heart,
  stress: Wind
};

const categoryColors = {
  breathing: "from-sky-400 to-cyan-400",
  grounding: "from-green-400 to-emerald-400",
  journaling: "from-purple-400 to-violet-400",
  movement: "from-orange-400 to-amber-400",
  sleep: "from-indigo-400 to-purple-400",
  focus: "from-teal-400 to-green-400",
  anxiety: "from-rose-400 to-pink-400",
  stress: "from-slate-400 to-gray-400"
};

export default function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = async () => {
    try {
      const data = await Intervention.list("title");
      setInterventions(data);
    } catch (error) {
      console.error("Error loading interventions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInterventions = activeCategory === "all" 
    ? interventions 
    : interventions.filter(intervention => intervention.category === activeCategory);

  const categories = [...new Set(interventions.map(i => i.category))];

  if (selectedIntervention) {
    return (
      <InterventionDetail 
        intervention={selectedIntervention}
        onBack={() => setSelectedIntervention(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Wellness Tools
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Quick, science-backed exercises to help you feel more grounded and centered ✨
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-white/90 backdrop-blur-xl shadow-lg border-none rounded-2xl p-2 h-auto">
              <TabsTrigger value="all" className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold">
                All
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-semibold capitalize"
                >
                  {category.replace('_', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Interventions Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredInterventions.map((intervention, index) => {
              const IconComponent = categoryIcons[intervention.category] || Heart;
              const gradientClass = categoryColors[intervention.category] || "from-purple-400 to-pink-400";
              
              return (
                <motion.div
                  key={intervention.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedIntervention(intervention)}
                  className="cursor-pointer group"
                >
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm h-full rounded-3xl overflow-hidden group-hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-4 rounded-3xl bg-gradient-to-r ${gradientClass} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full">
                          <span className="text-sm font-semibold text-gray-700">{intervention.duration_minutes}min</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-purple-700 transition-colors font-bold">
                        {intervention.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                      <p className="text-gray-600 leading-relaxed">
                        {intervention.description}
                      </p>
                      
                      {intervention.benefits && intervention.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {intervention.benefits.slice(0, 2).map((benefit, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                              {benefit}
                            </div>
                          ))}
                        </div>
                      )}

                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Exercise
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredInterventions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No exercises found</h3>
            <p className="text-gray-500 text-lg">
              {activeCategory === "all" 
                ? "Check back soon for wellness exercises ✨" 
                : `No ${activeCategory} exercises available yet 🌸`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
