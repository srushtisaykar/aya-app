
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Although Badge is mostly replaced, it's still imported. I will keep it as it doesn't cause harm.
import { Progress } from "@/components/ui/progress"; // Progress is removed from usage, but keeping the import is harmless.
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Volume2,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterventionDetail({ intervention, onBack }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // This state variable is not used in the provided outline for the new UI. It was likely for a "steps" feature not present here. Keeping it doesn't break anything.
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Calculate total time based on instructions
    const calculatedTime = intervention.duration_minutes * 60;
    setTotalTime(calculatedTime);
    setTimeRemaining(calculatedTime);
  }, [intervention]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const handleStart = () => {
    setIsActive(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStep(0); // Resetting currentStep, even if not explicitly used in new UI logic for display.
    setTimeRemaining(totalTime);
    setIsCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0; // Added check for totalTime > 0 to prevent division by zero.

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6"
        >
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onBack}
            className="rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white border-none shadow-lg w-14 h-14"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {intervention.title}
            </h1>
            <p className="text-gray-600 text-lg mt-2">{intervention.description}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Exercise Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timer Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="relative w-56 h-56 mx-auto mb-8">
                    {/* Circular Progress */}
                    <div className="w-full h-full rounded-full border-8 border-gray-100 relative">
                      <div 
                        className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
                        style={{
                          background: `conic-gradient(from 0deg, #8b5cf6 0%, #ec4899 ${progress}%, transparent ${progress}%)`
                        }}
                      />
                      <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <div className="text-center">
                          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            {formatTime(timeRemaining)}
                          </div>
                          <div className="text-gray-500 font-medium">
                            {isCompleted ? "✨ Complete!" : isActive ? "🎯 In Progress" : "💫 Ready to Start"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-6">
                    {!isActive && !isCompleted && (
                      <Button 
                        onClick={handleStart}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <Play className="w-6 h-6 mr-3" />
                        Start Exercise
                      </Button>
                    )}
                    
                    {isActive && (
                      <Button 
                        onClick={handlePause}
                        variant="outline"
                        className="px-10 py-4 rounded-2xl text-lg font-semibold bg-white/70 border-none shadow-lg"
                      >
                        <Pause className="w-6 h-6 mr-3" />
                        Pause
                      </Button>
                    )}

                    {isCompleted && (
                      <Button 
                        onClick={handleReset}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl"
                      >
                        <CheckCircle className="w-6 h-6 mr-3" />
                        Well Done! 🎉
                      </Button>
                    )}

                    {(isActive || isCompleted) && (
                      <Button 
                        onClick={handleReset}
                        variant="outline"
                        size="icon"
                        className="rounded-2xl bg-white/70 border-none shadow-lg w-16 h-16"
                      >
                        <RotateCcw className="w-6 h-6" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 p-8">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    Exercise Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {intervention.instructions?.map((instruction, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">{instruction}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Audio Script (if available) */}
            {intervention.audio_script && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-8">
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-white" />
                      </div>
                      Guided Audio Script
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl p-8">
                      <p className="text-gray-700 leading-relaxed text-lg italic">
                        {intervention.audio_script}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Exercise Info */}
            <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{intervention.duration_minutes} minutes</span>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full inline-block">
                  <span className="text-purple-700 font-semibold capitalize">{intervention.category}</span>
                </div>

                {intervention.difficulty && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-medium">Difficulty:</span>
                    <div className={`px-4 py-2 rounded-full font-semibold capitalize ${
                      intervention.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      intervention.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {intervention.difficulty}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            {intervention.benefits && intervention.benefits.length > 0 && (
              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <CardTitle className="text-xl font-bold">✨ Benefits</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {intervention.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Mood Tags */}
            {intervention.mood_tags && intervention.mood_tags.length > 0 && (
              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
                  <CardTitle className="text-xl font-bold">🎯 Helpful For</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {intervention.mood_tags.map((tag, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
