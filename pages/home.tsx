
import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/entities/MoodEntry";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Sparkles, MessageCircle, Activity, TrendingUp, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Really struggling" },
  { value: 2, emoji: "😔", label: "Having a tough time" },
  { value: 3, emoji: "😕", label: "Not great" },
  { value: 4, emoji: "😐", label: "Meh" },
  { value: 5, emoji: "😌", label: "Okay" },
  { value: 6, emoji: "🙂", label: "Pretty good" },
  { value: 7, emoji: "😊", label: "Good" },
  { value: 8, emoji: "😄", label: "Really good" },
  { value: 9, emoji: "🤗", label: "Great" },
  { value: 10, emoji: "✨", label: "Amazing" }
];

const moodTags = [
  "stressed", "anxious", "calm", "tired", "energized", "hopeful", 
  "overwhelmed", "grateful", "lonely", "supported", "motivated", "confused"
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [moodLevel, setMoodLevel] = useState([5]);
  const [energyLevel, setEnergyLevel] = useState([3]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadUser();
    loadRecentMoods();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadRecentMoods = async () => {
    try {
      const entries = await MoodEntry.list("-created_date", 7);
      setRecentEntries(entries);
    } catch (error) {
      console.error("Error loading mood entries:", error);
    }
  };

  const handleSubmitMood = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const currentMoodEmoji = moodEmojis.find(m => m.value === moodLevel[0]);
      
      await MoodEntry.create({
        mood_level: moodLevel[0],
        mood_emoji: currentMoodEmoji.emoji,
        energy_level: energyLevel[0],
        reflection: reflection.trim() || null,
        tags: selectedTags
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setReflection("");
      setSelectedTags([]);
      
      // Reload recent entries
      loadRecentMoods();
      
    } catch (error) {
      console.error("Error saving mood:", error);
    }
    setIsSubmitting(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const currentMoodEmoji = moodEmojis.find(m => m.value === moodLevel[0]);
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.full_name?.split(' ')[0] || 'friend';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              {new Date().getHours() < 12 ? <Sun className="w-7 h-7 text-white" /> : <Moon className="w-7 h-7 text-white" />}
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            {user ? getGreeting() : "Welcome to Aya"}
          </h1>
          <p className="text-gray-600 text-lg">How are you feeling today?</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-3xl p-6 text-center shadow-lg"
            >
              <div className="flex items-center justify-center gap-3 text-green-700">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-lg">Thanks for checking in!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Check-in Card */}
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Daily Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* Mood Slider */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-8xl mb-4">{currentMoodEmoji.emoji}</div>
                <p className="text-xl font-semibold text-gray-700">{currentMoodEmoji.label}</p>
              </div>
              
              <div className="px-6">
                <Slider
                  value={moodLevel}
                  onValueChange={setMoodLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-3">
                  <span>😢 Struggling</span>
                  <span>✨ Amazing</span>
                </div>
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-4">
              <label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                Energy Level
              </label>
              <div className="px-6">
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-3">
                  <span>😴 Drained</span>
                  <span>🚀 Energized</span>
                </div>
              </div>
            </div>

            {/* Mood Tags */}
            <div className="space-y-4">
              <label className="text-base font-semibold text-gray-700">What's on your mind?</label>
              <div className="flex flex-wrap gap-3">
                {moodTags.map(tag => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full transition-all border-2 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-700 shadow-md'
                        : 'hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Optional Reflection */}
            <div className="space-y-4">
              <label className="text-base font-semibold text-gray-700">
                Want to share more? (optional)
              </label>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What's going on in your world today? Remember, this stays private..."
                className="resize-none rounded-2xl border-2 border-gray-200 focus:border-purple-300 focus:ring-purple-200 bg-gray-50 focus:bg-white"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmitMood}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white rounded-2xl py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? "Saving..." : "💾 Save Check-in"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6">
          <Link to={createPageUrl("Chat")}>
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-cyan-100 cursor-pointer group rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-blue-800 text-lg mb-2">Chat with Aya</h3>
                <p className="text-blue-600 text-sm">Talk through what's on your mind</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("Interventions")}>
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-100 to-emerald-100 cursor-pointer group rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-green-800 text-lg mb-2">Wellness Tools</h3>
                <p className="text-green-600 text-sm">Quick exercises to feel better</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Mood Trend */}
        {recentEntries.length > 0 && (
          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Your Week
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-between items-end gap-4">
                {recentEntries.slice(0, 7).reverse().map((entry, index) => (
                  <div key={entry.id} className="text-center flex-1">
                    <div className="text-4xl mb-3 hover:scale-110 transition-transform cursor-pointer">{entry.mood_emoji}</div>
                    <div className="text-sm text-gray-500 font-medium">
                      {new Date(entry.created_date).getDate()}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-6 bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-2xl">
                ✨ Keep checking in to see your progress over time
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
