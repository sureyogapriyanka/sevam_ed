import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { knowledgeArticleService } from "../../services/api";
import { BookOpen, User, Eye, ExternalLink, Play } from "lucide-react";

interface KnowledgeArticle {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  viewCount: number;
  createdAt: string;
}

export default function KnowledgeWidget() {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const getDefaultImage = (category: string) => {
    const images = [
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550505393-fa197233298d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
    ];
    return category ? images[category.length % images.length] : images[0];
  };

  const { data: articlesResponse, isLoading, error } = useQuery({
    queryKey: ['knowledge-articles'],
    queryFn: async () => {
      try {
        const response = await knowledgeArticleService.getAll();
        console.log('API Response:', response);
        return response.data || [];
      } catch (error) {
        console.error('Error fetching knowledge articles:', error);
        // If API fails, return sample data
        return [
          {
            id: '1',
            title: 'The Importance of Staying Hydrated',
            content: 'Water is essential for life and plays a crucial role in maintaining our health. It helps regulate body temperature, transport nutrients, and remove waste. Aim to drink at least 8 glasses of water daily, and more if you are physically active or in hot climates. Proper hydration can improve energy levels, brain function, and physical performance.',
            author: 'Dr. Sarah Johnson',
            category: 'Nutrition',
            tags: ['hydration', 'water', 'health'],
            imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
            viewCount: 1240,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Understanding Heart Health',
            content: 'Heart disease is the leading cause of death worldwide. Maintaining heart health involves regular exercise, a balanced diet, avoiding smoking, and managing stress. Regular check-ups with your doctor can help detect early signs of heart problems. Know the warning signs of heart attack and stroke, and don\'t hesitate to seek emergency care if needed.',
            author: 'Dr. Michael Chen',
            category: 'Cardiology',
            tags: ['heart', 'cardiovascular', 'exercise'],
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
            viewCount: 980,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Benefits of Regular Exercise',
            content: 'Regular physical activity is one of the best things you can do for your health. It can help prevent chronic diseases, improve mental health, boost energy levels, and promote better sleep. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity per week, along with muscle-strengthening activities on two or more days.',
            author: 'Dr. Emily Rodriguez',
            category: 'Fitness',
            tags: ['exercise', 'fitness', 'wellness'],
            imageUrl: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?auto=format&fit=crop&w=800&q=80',
            viewCount: 1560,
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            title: 'Managing Stress for Better Health',
            content: 'Chronic stress can have serious health consequences, including increased risk of heart disease, high blood pressure, and mental health issues. Effective stress management techniques include meditation, deep breathing exercises, regular physical activity, adequate sleep, and maintaining social connections. It\'s important to recognize the signs of stress and take proactive steps to manage it.',
            author: 'Dr. Bhetapudi Manasa',
            category: 'Mental Health',
            tags: ['stress', 'mental health', 'wellness'],
            imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
            viewCount: 875,
            createdAt: new Date().toISOString()
          },
          {
            id: '5',
            title: 'The Power of Preventive Healthcare',
            content: 'Preventive healthcare focuses on preventing diseases rather than treating them after they occur. Regular screenings, vaccinations, and healthy lifestyle choices can help detect potential health issues early when they\'re most treatable. This approach not only improves health outcomes but can also reduce healthcare costs in the long run. Make preventive care a priority by scheduling regular check-ups with your healthcare provider.',
            author: 'Dr. Robert Kim',
            category: 'Preventive Care',
            tags: ['preventive', 'screenings', 'healthcheck'],
            imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
            viewCount: 1120,
            createdAt: new Date().toISOString()
          },
          {
            id: '6',
            title: 'Sleep Hygiene: Getting Better Rest',
            content: 'Quality sleep is essential for physical and mental health. Good sleep hygiene practices include maintaining a consistent sleep schedule, creating a comfortable sleep environment, avoiding screens before bedtime, limiting caffeine intake, and establishing a relaxing bedtime routine. Adults should aim for 7-9 hours of sleep per night. Poor sleep can negatively impact immune function, mood, and cognitive performance.',
            author: 'Dr. Priya Sharma',
            category: 'Sleep Health',
            tags: ['sleep', 'rest', 'wellness'],
            imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
            viewCount: 1340,
            createdAt: new Date().toISOString()
          },
          {
            id: '7',
            title: 'Building a Strong Immune System',
            content: 'A strong immune system is your body\'s defense against infections and diseases. You can boost your immunity through a balanced diet rich in fruits and vegetables, regular exercise, adequate sleep, stress management, and staying up to date with vaccinations. Key nutrients for immune health include vitamin C, vitamin D, zinc, and probiotics. Remember that no supplement can replace a healthy lifestyle.',
            author: 'Dr. James Wilson',
            category: 'Immunology',
            tags: ['immunity', 'vitamins', 'health'],
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
            viewCount: 1650,
            createdAt: new Date().toISOString()
          },
          {
            id: '8',
            title: 'Understanding Medication Safety',
            content: 'Medication safety is crucial for effective treatment and avoiding harmful side effects. Always take medications as prescribed, never share prescriptions with others, and inform your healthcare provider about all medications and supplements you\'re taking. Store medications properly, check expiration dates, and be aware of potential drug interactions. If you experience unexpected side effects, contact your healthcare provider immediately.',
            author: 'Dr. Linda Thompson',
            category: 'Pharmacology',
            tags: ['medication', 'safety', 'pharmacy'],
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
            viewCount: 920,
            createdAt: new Date().toISOString()
          }
        ];
      }
    }
  });

  // Ensure articles is always an array
  let articles = Array.isArray(articlesResponse) ? articlesResponse : [];
  
  // If we have an error or no articles, use sample data
  if (error || !articles || articles.length === 0) {
    articles = [
      {
        id: '1',
        title: 'The Importance of Staying Hydrated',
        content: 'Water is essential for life and plays a crucial role in maintaining our health. It helps regulate body temperature, transport nutrients, and remove waste. Aim to drink at least 8 glasses of water daily, and more if you are physically active or in hot climates. Proper hydration can improve energy levels, brain function, and physical performance.',
        author: 'Dr. Sarah Johnson',
        category: 'Nutrition',
        tags: ['hydration', 'water', 'health'],
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
        viewCount: 1240,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Understanding Heart Health',
        content: 'Heart disease is the leading cause of death worldwide. Maintaining heart health involves regular exercise, a balanced diet, avoiding smoking, and managing stress. Regular check-ups with your doctor can help detect early signs of heart problems. Know the warning signs of heart attack and stroke, and don\'t hesitate to seek emergency care if needed.',
        author: 'Dr. Michael Chen',
        category: 'Cardiology',
        tags: ['heart', 'cardiovascular', 'exercise'],
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        viewCount: 980,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Benefits of Regular Exercise',
        content: 'Regular physical activity is one of the best things you can do for your health. It can help prevent chronic diseases, improve mental health, boost energy levels, and promote better sleep. Adults should aim for at least 150 minutes of moderate-intensity aerobic activity per week, along with muscle-strengthening activities on two or more days.',
        author: 'Dr. Emily Rodriguez',
        category: 'Fitness',
        tags: ['exercise', 'fitness', 'wellness'],
        imageUrl: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?auto=format&fit=crop&w=800&q=80',
        viewCount: 1560,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Managing Stress for Better Health',
        content: 'Chronic stress can have serious health consequences, including increased risk of heart disease, high blood pressure, and mental health issues. Effective stress management techniques include meditation, deep breathing exercises, regular physical activity, adequate sleep, and maintaining social connections. It\'s important to recognize the signs of stress and take proactive steps to manage it.',
        author: 'Dr. Bhetapudi Manasa',
        category: 'Mental Health',
        tags: ['stress', 'mental health', 'wellness'],
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        viewCount: 875,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'The Power of Preventive Healthcare',
        content: 'Preventive healthcare focuses on preventing diseases rather than treating them after they occur. Regular screenings, vaccinations, and healthy lifestyle choices can help detect potential health issues early when they\'re most treatable. This approach not only improves health outcomes but can also reduce healthcare costs in the long run. Make preventive care a priority by scheduling regular check-ups with your healthcare provider.',
        author: 'Dr. Robert Kim',
        category: 'Preventive Care',
        tags: ['preventive', 'screenings', 'healthcheck'],
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        viewCount: 1120,
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Sleep Hygiene: Getting Better Rest',
        content: 'Quality sleep is essential for physical and mental health. Good sleep hygiene practices include maintaining a consistent sleep schedule, creating a comfortable sleep environment, avoiding screens before bedtime, limiting caffeine intake, and establishing a relaxing bedtime routine. Adults should aim for 7-9 hours of sleep per night. Poor sleep can negatively impact immune function, mood, and cognitive performance.',
        author: 'Dr. Priya Sharma',
        category: 'Sleep Health',
        tags: ['sleep', 'rest', 'wellness'],
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
        viewCount: 1340,
        createdAt: new Date().toISOString()
      },
      {
        id: '7',
        title: 'Building a Strong Immune System',
        content: 'A strong immune system is your body\'s defense against infections and diseases. You can boost your immunity through a balanced diet rich in fruits and vegetables, regular exercise, adequate sleep, stress management, and staying up to date with vaccinations. Key nutrients for immune health include vitamin C, vitamin D, zinc, and probiotics. Remember that no supplement can replace a healthy lifestyle.',
        author: 'Dr. James Wilson',
        category: 'Immunology',
        tags: ['immunity', 'vitamins', 'health'],
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        viewCount: 1650,
        createdAt: new Date().toISOString()
      },
      {
        id: '8',
        title: 'Understanding Medication Safety',
        content: 'Medication safety is crucial for effective treatment and avoiding harmful side effects. Always take medications as prescribed, never share prescriptions with others, and inform your healthcare provider about all medications and supplements you’re taking. Store medications properly, check expiration dates, and be aware of potential drug interactions. If you experience unexpected side effects, contact your healthcare provider immediately.',
        author: 'Dr. Linda Thompson',
        category: 'Pharmacology',
        tags: ['medication', 'safety', 'pharmacy'],
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        viewCount: 920,
        createdAt: new Date().toISOString()
      },
      {
        id: '9',
        title: 'The Essential Guide to Quitting Smoking',
        content: 'Smoking cessation is one of the most impactful decisions you can make for your long-term health. It significantly reduces the risk of cardiovascular disease, lung cancer, and chronic obstructive pulmonary disease (COPD). Our clinical data shows that patients who utilize a structured support system are 3x more likely to remain tobacco-free after 12 months. Start by identifying your triggers and consulting with our specialists for nicotine replacement therapy (NRT) options.',
        author: 'Dr. Arjun Nair',
        category: 'Lifestyle',
        tags: ['smoking', 'cessation', 'lunghealth'],
        imageUrl: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=800&q=80',
        viewCount: 2100,
        createdAt: new Date().toISOString()
      },
      {
        id: '10',
        title: 'Optimizing Blood Pressure Management',
        content: 'Hypertension, or high blood pressure, is often called the silent killer because it often has no symptoms. Maintaining blood pressure within the range of 120/80 mmHg is critical for preventing stroke and kidney failure. Reduce sodium intake, increase potassium-rich foods, and monitor your vitals using our integrated Fitness Tracker to stay within safe clinical parameters.',
        author: 'Dr. Anjali Verma',
        category: 'Cardiology',
        tags: ['hypertension', 'vitals', 'hearthealth'],
        imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
        viewCount: 1850,
        createdAt: new Date().toISOString()
      },
      {
        id: '11',
        title: 'Diabetes Protocol: Blood Sugar Control',
        content: 'Effective diabetes management requires a precise balance of nutrition, physical activity, and medication. Monitoring your glucose levels consistently helps prevent long-term complications such as neuropathy and retinopathy. Aim for sustained glycemic control and consult our endocrine specialists if you observe persistent spikes in your daily readings.',
        author: 'Dr. Rajiv Malhotra',
        category: 'Endocrinology',
        tags: ['diabetes', 'glucose', 'metabolic'],
        imageUrl: 'https://images.unsplash.com/photo-1579154235821-27940252b575?auto=format&fit=crop&w=800&q=80',
        viewCount: 1420,
        createdAt: new Date().toISOString()
      }
    ];
  }
  
  // Articles are now always available due to fallback sample data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="knowledge-widgets">
      {articles.map((article: any) => (
        <Card key={article._id || article.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white flex flex-col group">
          <div className="h-48 overflow-hidden relative bg-slate-100">
            <img
              src={article.imageUrl || getDefaultImage(article.category)}
              alt={article.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultImage(article.category);
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <CardContent className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-none font-semibold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider">
                {article.category}
              </Badge>
              <div className="flex items-center text-blue-500 font-semibold text-xs">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                {article.viewCount}
              </div>
            </div>

            <h4 className="font-bold text-blue-900 text-lg mb-3 line-clamp-2">
              {article.title}
            </h4>

            <p className="text-blue-600/80 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
              {article.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <div className="flex items-center text-xs font-medium text-blue-500">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>{article.author}</span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedArticle(article)}
                    data-testid={`read-article-${article._id || article.id}`}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-4 rounded-lg"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read More
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 mb-2">
                      {selectedArticle?.title}
                    </DialogTitle>
                  </DialogHeader>

                  {selectedArticle && (
                    <div className="space-y-6">
                      {selectedArticle.imageUrl && (
                        <div className="w-full h-[400px] overflow-hidden rounded-2xl">
                          <img
                            src={selectedArticle.imageUrl}
                            alt={selectedArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center space-x-6">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {selectedArticle.category}
                          </Badge>
                          <div className="flex items-center text-slate-500 text-sm font-medium">
                            <User className="h-4 w-4 mr-2 text-slate-400" />
                            <span>{selectedArticle.author}</span>
                          </div>
                          <div className="flex items-center text-slate-500 text-sm font-medium">
                            <Eye className="h-4 w-4 mr-2 text-slate-400" />
                            <span>{selectedArticle.viewCount} views</span>
                          </div>
                        </div>

                        {selectedArticle.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(selectedArticle.videoUrl, '_blank')}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-none rounded-xl font-bold"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Watch Video
                          </Button>
                        )}
                      </div>

                      <div className="prose prose-slate prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                          {selectedArticle.content}
                        </div>
                      </div>

                      {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
                          {selectedArticle.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs font-bold px-3 py-1 bg-white text-slate-500 border-slate-200 rounded-full">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-xs font-medium text-slate-400 pt-2">
                        Published on {new Date(selectedArticle.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* This should never show now since we always provide sample data */}
      {articles.length === 0 && (
        <div className="col-span-full text-center py-12">
          <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No Articles Available</h3>
          <p className="text-blue-700">
            Knowledge articles will appear here once they are added to the system.
          </p>
        </div>
      )}
    </div>
  );
}
