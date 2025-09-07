import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  Clock,
  AlertTriangle,
  Users,
  Headphones,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const crisisResources = [
  {
    id: 1,
    title: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential support 24/7",
    contact: "988",
    type: "phone",
    availability: "24/7",
    languages: ["English", "Spanish"]
  },
  {
    id: 2,
    title: "Crisis Text Line",
    description: "Text-based crisis support",
    contact: "Text HOME to 741741",
    type: "text",
    availability: "24/7",
    languages: ["English", "Spanish"]
  },
  {
    id: 3,
    title: "National Sexual Assault Hotline",
    description: "RAINN's confidential support line",
    contact: "1-800-656-4673",
    type: "phone",
    availability: "24/7",
    languages: ["English", "Spanish"]
  },
  {
    id: 4,
    title: "LGBT National Hotline",
    description: "Peer support for LGBTQ+ community",
    contact: "1-888-843-4564",
    type: "phone",
    availability: "Mon-Fri 4pm-12am, Sat 12pm-5pm EST",
    languages: ["English"]
  },
  {
    id: 5,
    title: "Teen Line",
    description: "Teens helping teens",
    contact: "1-800-852-8336 or Text TEEN to 839863",
    type: "both",
    availability: "6pm-10pm PST",
    languages: ["English", "Spanish"]
  },
  {
    id: 6,
    title: "Trans Lifeline",
    description: "Support by and for transgender people",
    contact: "877-565-8860",
    type: "phone",
    availability: "24/7",
    languages: ["English", "Spanish"]
  }
];

const selfCareActions = [
  {
    icon: Heart,
    title: "Breathe Deeply",
    description: "Take 5 slow, deep breaths in through your nose and out through your mouth",
    color: "from-rose-400 to-pink-400"
  },
  {
    icon: Users,
    title: "Reach Out",
    description: "Contact a trusted friend, family member, or counselor",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Shield,
    title: "Stay Safe",
    description: "Remove any means of self-harm and go to a safe space",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: Clock,
    title: "Wait",
    description: "These intense feelings are temporary and will pass",
    color: "from-purple-400 to-violet-400"
  }
];

export default function Crisis() {
  const handleContact = (resource) => {
    if (resource.type === 'phone' || resource.type === 'both') {
      const phoneNumber = resource.contact.match(/\d{1}-?\d{3}-?\d{3}-?\d{4}/);
      if (phoneNumber) {
        window.open(`tel:${phoneNumber[0].replace(/-/g, '')}`, '_blank');
      }
    } else if (resource.type === 'text') {
      // For text services, we'll show instructions
      alert(`To text: ${resource.contact}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Emergency Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert className="border-2 border-red-200 bg-red-50 shadow-xl">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-lg font-medium text-red-800">
              <strong>If you are in immediate danger, please call 911 or go to your nearest emergency room.</strong>
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Crisis Support</h1>
          <p className="text-gray-700 max-w-3xl mx-auto">
            You're not alone. If you're having thoughts of self-harm or suicide, 
            or are experiencing a mental health crisis, help is available right now.
          </p>
        </motion.div>

        {/* Immediate Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-red-700">
                <Heart className="w-6 h-6" />
                Right Now: Take These Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selfCareActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access - Most Important Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-red-200 bg-red-50 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">988</h2>
              <p className="text-red-700 mb-4">Suicide & Crisis Lifeline</p>
              <p className="text-sm text-red-600 mb-4">Free, confidential support 24/7</p>
              <Button 
                onClick={() => window.open('tel:988', '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 988
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">741741</h2>
              <p className="text-blue-700 mb-4">Crisis Text Line</p>
              <p className="text-sm text-blue-600 mb-4">Text HOME to 741741</p>
              <Button 
                onClick={() => window.open('sms:741741?body=HOME', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Text Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* All Crisis Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Headphones className="w-6 h-6 text-sage-600" />
                More Crisis Support Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {crisisResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{resource.description}</p>
                      </div>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {resource.type === 'phone' && <Phone className="w-5 h-5 text-gray-600" />}
                        {resource.type === 'text' && <MessageCircle className="w-5 h-5 text-gray-600" />}
                        {resource.type === 'both' && <Globe className="w-5 h-5 text-gray-600" />}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{resource.availability}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Languages:</span> {resource.languages.join(', ')}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-mono text-gray-800">{resource.contact}</p>
                    </div>

                    <Button 
                      onClick={() => handleContact(resource)}
                      className="w-full bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white"
                    >
                      {resource.type === 'phone' && <Phone className="w-4 h-4 mr-2" />}
                      {resource.type === 'text' && <MessageCircle className="w-4 h-4 mr-2" />}
                      {resource.type === 'both' && <Globe className="w-4 h-4 mr-2" />}
                      Connect Now
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border border-sage-200 bg-sage-50 shadow-lg">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-sage-600 mx-auto mb-3" />
              <h3 className="font-semibold text-sage-800 mb-2">Your Privacy & Safety</h3>
              <p className="text-sm text-sage-700 leading-relaxed">
                All crisis support services are confidential. Your conversations won't appear in your 
                Aya chat history. If you're concerned about privacy, consider using a private browser window 
                or clearing your browser history after reaching out for support.
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}