import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { BookOpen, TrendingUp, Heart, Utensils, Dumbbell, Search, Clock, Star, Brain, Target } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'nutrition' | 'exercise' | 'wellness' | 'science';
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  rating: number;
  tags: string[];
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Macronutrients: Your Guide to Balanced Eating',
    excerpt: 'Learn about proteins, carbohydrates, and fats, and how to balance them for optimal health and fitness.',
    category: 'nutrition',
    readTime: 8,
    difficulty: 'beginner',
    rating: 4.8,
    tags: ['macros', 'nutrition basics', 'diet'],
    content: `
# Understanding Macronutrients

Macronutrients are the three main types of nutrients your body needs in large amounts:

## Proteins (4 calories per gram)
- **Function**: Building and repairing tissues, making enzymes and hormones
- **Sources**: Lean meats, fish, eggs, dairy, beans, nuts
- **Daily needs**: 0.8-1.2g per kg body weight for general health, 1.6-2.2g for athletes

## Carbohydrates (4 calories per gram)
- **Function**: Primary energy source for your brain and muscles
- **Sources**: Fruits, vegetables, grains, legumes
- **Daily needs**: 45-65% of total calories

## Fats (9 calories per gram)
- **Function**: Energy storage, hormone production, nutrient absorption
- **Sources**: Avocados, nuts, olive oil, fatty fish
- **Daily needs**: 20-35% of total calories

## How to Balance Them
1. Start with protein at each meal
2. Add complex carbohydrates for energy
3. Include healthy fats for satiety
4. Adjust portions based on your activity level and goals
    `
  },
  {
    id: '2',
    title: 'The Science of Progressive Overload',
    excerpt: 'Discover how to continuously challenge your muscles to grow stronger and build lean mass effectively.',
    category: 'exercise',
    readTime: 6,
    difficulty: 'intermediate',
    rating: 4.9,
    tags: ['strength training', 'muscle growth', 'progressive overload'],
    content: `
# The Science of Progressive Overload

Progressive overload is the gradual increase of stress placed on your muscles during exercise.

## Why It Works
Your body adapts to exercise stress by becoming stronger. Without increasing the challenge, progress stops.

## Methods of Progressive Overload
1. **Increase Weight**: Add more resistance to your exercises
2. **Increase Reps**: Perform more repetitions with the same weight
3. **Increase Sets**: Add more sets to your workout
4. **Improve Form**: Better technique allows for more effective muscle engagement
5. **Increase Frequency**: Train more often (within recovery limits)
6. **Decrease Rest**: Shorter rest periods increase intensity

## Implementation Tips
- Progress gradually (2.5-5% increases)
- Track your workouts to monitor progress
- Allow adequate recovery between sessions
- Focus on compound movements for maximum benefit
    `
  },
  {
    id: '3',
    title: 'Sleep and Recovery: The Missing Piece of Your Fitness Puzzle',
    excerpt: 'Explore how quality sleep impacts muscle growth, fat loss, and overall performance.',
    category: 'wellness',
    readTime: 10,
    difficulty: 'beginner',
    rating: 4.7,
    tags: ['sleep', 'recovery', 'performance', 'hormones'],
    content: `
# Sleep and Recovery

Sleep is when your body repairs, grows, and adapts to exercise stress.

## Why Sleep Matters for Fitness
- **Muscle Recovery**: Growth hormone peaks during deep sleep
- **Metabolism**: Poor sleep disrupts hunger hormones
- **Performance**: Inadequate sleep reduces strength and endurance
- **Mental Health**: Sleep affects motivation and decision-making

## Sleep Optimization Strategies
1. **Consistent Schedule**: Go to bed and wake up at the same time
2. **Sleep Environment**: Dark, cool (65-68°F), and quiet
3. **Pre-sleep Routine**: Wind down 1-2 hours before bed
4. **Limit Screens**: Blue light disrupts melatonin production
5. **Watch Timing**: Avoid large meals, caffeine, and intense exercise 3-4 hours before bed

## Recovery Techniques
- Active recovery (light movement on rest days)
- Stretching and mobility work
- Massage or foam rolling
- Stress management through meditation or yoga
    `
  },
  {
    id: '4',
    title: 'HIIT vs. LISS: Choosing the Right Cardio for Your Goals',
    excerpt: 'Compare high-intensity interval training with low-intensity steady-state cardio to optimize your results.',
    category: 'exercise',
    readTime: 7,
    difficulty: 'intermediate',
    rating: 4.6,
    tags: ['cardio', 'HIIT', 'LISS', 'fat loss'],
    content: `
# HIIT vs. LISS Cardio

Understanding the differences can help you choose the right approach for your goals.

## High-Intensity Interval Training (HIIT)
**Format**: Short bursts of intense exercise followed by rest periods

### Benefits:
- Time-efficient (15-30 minutes)
- Higher calorie burn per minute
- Improves both aerobic and anaerobic fitness
- Creates "afterburn effect" (EPOC)

### Best For:
- Fat loss
- Improving cardiovascular fitness quickly
- Time-constrained schedules

## Low-Intensity Steady State (LISS)
**Format**: Consistent moderate effort for longer duration

### Benefits:
- Lower impact on joints
- Better for active recovery
- Easier to maintain good form
- Less stress on nervous system

### Best For:
- Building aerobic base
- Active recovery days
- Beginners or those with joint issues
- Stress relief

## Combining Both
- Use HIIT 2-3 times per week for efficiency
- Add LISS for active recovery and additional volume
- Match intensity to your recovery capacity
    `
  }
];

const tips = [
  {
    id: '1',
    title: 'Hydration Timing',
    content: 'Drink 16-24 oz of water 2-3 hours before exercise, and 8 oz every 15-20 minutes during workouts.',
    category: 'performance',
    icon: '💧'
  },
  {
    id: '2',
    title: 'Post-Workout Nutrition Window',
    content: 'Consume protein within 2 hours after training for optimal muscle protein synthesis.',
    category: 'nutrition',
    icon: '🍗'
  },
  {
    id: '3',
    title: 'Progressive Overload',
    content: 'Increase weight by 2.5-5% when you can complete all sets with perfect form.',
    category: 'training',
    icon: '💪'
  },
  {
    id: '4',
    title: 'Recovery Signs',
    content: 'Good recovery includes: stable resting heart rate, good sleep quality, and positive mood.',
    category: 'wellness',
    icon: '😴'
  }
];

export const Learn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArticles(filtered);
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === category));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'exercise': return <Dumbbell className="h-4 w-4" />;
      case 'wellness': return <Heart className="h-4 w-4" />;
      case 'science': return <Brain className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-4">
        <Header 
          title={selectedArticle.title}
          subtitle="Fitness Knowledge"
        />
        
        <main className="px-4 py-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setSelectedArticle(null)}>
                  ← Back to Articles
                </Button>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                    {selectedArticle.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedArticle.readTime} min
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {selectedArticle.rating}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getCategoryIcon(selectedArticle.category)}
                <span className="capitalize text-sm text-muted-foreground">
                  {selectedArticle.category}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedArticle.content}
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t">
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header 
        title="Learn" 
        subtitle="Fitness knowledge & insights"
      />
      
      <main className="px-4 py-6 space-y-6">
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="tips">Quick Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => filterByCategory('all')}
                  >
                    All
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => filterByCategory('nutrition')}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Utensils className="h-3 w-3" />
                    Nutrition
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => filterByCategory('exercise')}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Dumbbell className="h-3 w-3" />
                    Exercise
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => filterByCategory('wellness')}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Heart className="h-3 w-3" />
                    Wellness
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => filterByCategory('science')}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Brain className="h-3 w-3" />
                    Science
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Articles */}
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedArticle(article)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(article.category)}
                      </div>
                    </div>
                    <CardDescription>{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(article.difficulty)}>
                          {article.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {article.rating}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Daily Fitness Tips
                </CardTitle>
                <CardDescription>
                  Quick, actionable tips to improve your fitness journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <div>
                        <h4 className="font-medium mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.content}</p>
                        <Badge variant="outline" className="mt-2 text-xs capitalize">
                          {tip.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Your Progress Insights
                </CardTitle>
                <CardDescription>
                  Personalized insights based on your fitness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-medium text-primary mb-2">💡 Consistency Tip</h4>
                    <p className="text-sm text-muted-foreground">
                      You've been logging meals regularly! Consider tracking your water intake next 
                      to optimize hydration for better performance.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                    <h4 className="font-medium text-secondary mb-2">🎯 Goal Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      Your protein intake has been consistent. Try adding more variety with 
                      plant-based proteins like quinoa and lentils.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h4 className="font-medium text-accent mb-2">⚡ Performance Boost</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider adding 10 minutes of stretching after workouts to improve 
                      flexibility and reduce recovery time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNavigation />
    </div>
  );
};
