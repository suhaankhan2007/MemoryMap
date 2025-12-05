import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Play, Check, Star, Zap, Code2, GraduationCap, 
  Building2, ArrowRight, GitBranch, Binary, Cpu,
  BookOpen, Users, Shield, Globe, AlertTriangle,
  Trophy, Target, Sparkles, TrendingUp, Eye,
  Bug, Flame, Award, ChevronRight, ExternalLink,
  Youtube, Twitter, Linkedin, Mail, CheckCircle2
} from "lucide-react";
import { MemoryMapLogo } from "@/components/ui/memory-map-logo";
import { useRef } from "react";

// Animated counter component
function AnimatedNumber({ value, suffix = "" }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-black"
    >
      {value}{suffix}
    </motion.span>
  );
}

// Hero section with animated visualization
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg"
            >
              <AlertTriangle className="w-4 h-4" />
              Stop Losing Points on Memory Leaks!
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-green-400">
                Find Memory Bugs
              </span>
              <br />
              <span className="text-white">Before They Find You</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              The <strong className="text-yellow-400">#1 visual debugger</strong> for C/C++ memory. 
              See your pointers, detect leaks instantly, and <strong className="text-green-400">ace your coding interviews</strong> with 
              our built-in LeetCode trainer.
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Bug className="w-5 h-5 text-red-400" />
                <span><strong className="text-red-400">100%</strong> Leak Detection</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span><strong className="text-yellow-400">50+</strong> LeetCode Problems</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-5 h-5 text-green-400" />
                <span><strong className="text-green-400">Real-time</strong> Visualization</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-8 py-7 rounded-xl shadow-2xl shadow-green-500/30 font-bold">
                  <Play className="w-5 h-5 mr-2" />
                  Try Free — No Signup
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-7 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 font-semibold">
                <Youtube className="w-5 h-5 mr-2" />
                Watch 2-min Demo
              </Button>
            </div>
            
            <p className="text-sm text-blue-200 mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Free tier includes 10 visualizations/day. No credit card required.
            </p>
          </motion.div>

          {/* Right: Animated Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400 font-mono">memory_leak_detector.cpp</span>
              </div>
              
              {/* Code + Visualization */}
              <div className="p-6">
                {/* Memory Leak Alert */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  <div>
                    <p className="text-red-400 font-bold text-sm">Memory Leak Detected!</p>
                    <p className="text-red-300 text-xs">ptr2 at 0x1008 was never freed</p>
                  </div>
                </motion.div>

                {/* Code snippet */}
                <div className="font-mono text-sm space-y-1 mb-4">
                  <div className="text-gray-500">1  <span className="text-purple-400">int*</span> ptr1 = <span className="text-blue-400">new</span> <span className="text-purple-400">int</span>(100);</div>
                  <div className="text-gray-500">2  <span className="text-purple-400">int*</span> ptr2 = <span className="text-blue-400">new</span> <span className="text-purple-400">int</span>(200);</div>
                  <div className="text-gray-500">3  <span className="text-blue-400">delete</span> ptr1;</div>
                  <div className="bg-red-500/20 -mx-6 px-6 py-1 border-l-4 border-red-500">
                    <span className="text-red-300">4  <span className="text-gray-500">// ❌ ptr2 never freed!</span></span>
                  </div>
                </div>

                {/* Mini visualization */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-blue-400 mb-2 font-bold">STACK</div>
                    <div className="space-y-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 text-white text-xs">
                        <div className="font-bold">ptr1</div>
                        <div className="opacity-70">nullptr</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2 text-white text-xs">
                        <div className="font-bold">ptr2 →</div>
                        <div className="opacity-70">0x1008</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-orange-400 mb-2 font-bold">HEAP</div>
                    <div className="space-y-2">
                      <div className="bg-gray-700/50 rounded-lg p-2 text-gray-400 text-xs border border-gray-600 border-dashed">
                        <div className="font-bold line-through">0x1000</div>
                        <div className="opacity-70">FREED ✓</div>
                      </div>
                      <motion.div 
                        animate={{ boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 20px 5px rgba(239, 68, 68, 0.5)', '0 0 0 0 rgba(239, 68, 68, 0)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-2 text-white text-xs ring-2 ring-red-400"
                      >
                        <div className="font-bold flex items-center gap-1">0x1008 <span className="text-yellow-300">⚠️ LEAK</span></div>
                        <div className="opacity-70">200</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-xl"
            >
              🏆 LeetCode Ready
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
            >
              🐛 Bug Hunter
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Social proof section
function SocialProof() {
  const stats = [
    { value: "10,000+", label: "Students Learning" },
    { value: "50+", label: "Schools & Universities" },
    { value: "100K+", label: "Memory Concepts Mastered" },
    { value: "4.9★", label: "Student Rating" },
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by students and educators at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {['Stanford', 'MIT', 'Berkeley', 'CMU', 'Georgia Tech', 'High Schools Nationwide'].map((uni) => (
              <span key={uni} className="text-lg font-bold text-gray-400">{uni}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Problem-Agitation-Solution Section
function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-red-500 font-bold text-sm uppercase tracking-wider">The Learning Gap</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
            Why Memory Is the
            <span className="text-red-500"> #1 Struggle</span> in CS
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pointers and memory are abstract concepts. You can't see them. 
            <strong> Until now.</strong>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🤯",
              title: "Invisible Concepts",
              stat: "#1",
              description: "Memory is the hardest topic in CS because you can't visualize what's actually happening",
              color: "red"
            },
            {
              icon: "📉",
              title: "Lost Exam Points",
              stat: "-15pts",
              description: "Average deduction on exams for memory leaks — points you could save by seeing the bug",
              color: "orange"
            },
            {
              icon: "😵",
              title: "Confusion Spiral",
              stat: "67%",
              description: "of students say they 'kind of get' pointers but can't debug memory issues confidently",
              color: "yellow"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-600 text-center"
            >
              <span className="text-5xl">{item.icon}</span>
              <div className={`text-4xl font-black mt-4 text-${item.color}-500`}>{item.stat}</div>
              <h3 className="text-xl font-bold mt-2 mb-3">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-full text-lg font-bold">
            <Sparkles className="w-5 h-5" />
            MemoryMap makes the invisible visible — and learning stick
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Key Features Section - Focused on differentiation
function FeaturesSection() {
  const features = [
    {
      icon: AlertTriangle,
      title: "Instant Leak Detection",
      description: "Never lose points again. MemoryMap automatically catches memory leaks, dangling pointers, and use-after-free bugs in real-time.",
      color: "from-red-500 to-orange-500",
      badge: "🔥 Most Popular"
    },
    {
      icon: Trophy,
      title: "LeetCode Training Mode",
      description: "Practice 50+ curated interview problems with step-by-step memory visualization. See exactly how two-pointers, linked lists, and trees work.",
      color: "from-yellow-500 to-amber-500",
      badge: "🏆 Interview Prep"
    },
    {
      icon: Eye,
      title: "Real-time Visualization",
      description: "Watch your code execute line-by-line. See stack frames, heap allocations, and pointer arrows update live as you step through.",
      color: "from-blue-500 to-cyan-500",
      badge: null
    },
    {
      icon: GitBranch,
      title: "Data Structure Rendering",
      description: "Linked lists become node diagrams. Binary trees render hierarchically. Finally see what your data structures actually look like.",
      color: "from-green-500 to-emerald-500",
      badge: "✨ New"
    },
    {
      icon: Zap,
      title: "AI Explanations",
      description: "Get instant, beginner-friendly explanations for every line of code. Understand not just what happens, but why.",
      color: "from-purple-500 to-pink-500",
      badge: null
    },
    {
      icon: Users,
      title: "Classroom Ready",
      description: "Export as GIF, share links, or embed in your LMS. Perfect for professors teaching memory management.",
      color: "from-indigo-500 to-blue-500",
      badge: "🎓 Educators"
    }
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">Why MemoryMap</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
            The Ultimate Memory Debugging Toolkit
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Everything you need to understand memory, catch bugs, and crush your interviews.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 group hover:shadow-2xl transition-all"
            >
              {feature.badge && (
                <span className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {feature.badge}
                </span>
              )}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Educational Resources Section
function EducationalSection() {
  const resources = [
    { name: "GeeksforGeeks", logo: "🧠", description: "In-depth articles on every CS concept", url: "https://geeksforgeeks.org" },
    { name: "W3Schools", logo: "📚", description: "Step-by-step C++ tutorials", url: "https://w3schools.com/cpp" },
    { name: "LearnCpp", logo: "🎓", description: "Comprehensive C++ learning path", url: "https://learncpp.com" },
    { name: "Visualgo", logo: "🎮", description: "Interactive algorithm visualizations", url: "https://visualgo.net" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
            <BookOpen className="w-4 h-4" />
            Built for Learning
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Your CS Learning
            <span className="text-blue-600"> Command Center</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            MemoryMap doesn't just visualize — it <strong>teaches</strong>. Every concept links to 
            trusted resources from the sites you already use. Learn by doing, not just reading.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Features */}
          <div className="space-y-6">
            {[
              {
                icon: "📍",
                title: "Context-Aware Resources",
                description: "As you code, MemoryMap detects what concepts you're using (pointers, linked lists, etc.) and shows relevant tutorials automatically."
              },
              {
                icon: "🎯",
                title: "Learn at Your Level",
                description: "Resources tagged by difficulty — whether you're in AP CS or Data Structures 101, find content that matches where you are."
              },
              {
                icon: "✅",
                title: "Track Your Progress",
                description: "Mark resources as complete as you learn. Build your knowledge systematically across all memory concepts."
              },
              {
                icon: "🔗",
                title: "Trusted Sources Only",
                description: "Direct links to GeeksforGeeks, W3Schools, LearnCpp, Visualgo, and other student-approved resources."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Resource Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-lg">Integrated Learning Resources</span>
            </div>
            
            <div className="space-y-3 mb-6">
              {resources.map((resource, i) => (
                <motion.a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer group"
                >
                  <span className="text-3xl">{resource.logo}</span>
                  <div className="flex-1">
                    <div className="font-semibold group-hover:text-blue-600 transition-colors">{resource.name}</div>
                    <div className="text-sm text-gray-500">{resource.description}</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </motion.a>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>🎓 Pro Tip:</strong> Use the "Learn & Resources" panel while coding to get instant access to tutorials for exactly what you're working on!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// LeetCode Mode Highlight Section
function LeetCodeSection() {
  const problems = [
    { id: 206, title: "Reverse Linked List", difficulty: "Easy", pattern: "Two Pointers" },
    { id: 21, title: "Merge Two Sorted Lists", difficulty: "Easy", pattern: "Two Pointers" },
    { id: 141, title: "Linked List Cycle", difficulty: "Easy", pattern: "Fast & Slow" },
    { id: 104, title: "Max Depth of Binary Tree", difficulty: "Easy", pattern: "DFS" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Trophy className="w-4 h-4" />
              LeetCode Training Mode
            </span>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ace Your
              <span className="text-yellow-600"> FAANG Interview</span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Stop blindly memorizing solutions. <strong>See exactly</strong> how linked list reversals, 
              tree traversals, and two-pointer algorithms work in memory. Build true understanding.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "50+ curated interview problems",
                "Step-by-step memory visualization", 
                "Pattern recognition (Two Pointers, DFS, BFS)",
                "Time & space complexity analysis",
                "Progressive hints system"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>

            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold text-lg px-8">
                Start Practicing Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-white" />
                <span className="text-white font-bold text-lg">LeetCode Mode</span>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {problems.map((problem, i) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">#{problem.id}</span>
                    <span className="font-semibold">{problem.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">
                      {problem.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">{problem.pattern}</span>
                  </div>
                </motion.div>
              ))}
              <div className="text-center pt-2">
                <span className="text-sm text-gray-400">+ 46 more problems...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "",
      description: "Perfect for getting started",
      features: [
        "10 visualizations/day",
        "Basic C/C++ support",
        "Memory leak detection",
        "5 LeetCode problems",
        "Community support"
      ],
      cta: "Get Started Free",
      highlighted: false,
      icon: Code2
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "For serious interview prep",
      features: [
        "Unlimited visualizations",
        "All 50+ LeetCode problems",
        "Pattern recognition AI",
        "Export as GIF/MP4",
        "Share & embed links",
        "Priority support",
        "No watermarks"
      ],
      cta: "Start 7-Day Free Trial",
      highlighted: true,
      icon: Zap
    },
    {
      name: "Team",
      price: "$29",
      period: "/month",
      description: "For classrooms & teams",
      features: [
        "Everything in Pro",
        "5 team seats",
        "Instructor dashboard",
        "Student progress tracking",
        "Custom branding",
        "LMS integration",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      highlighted: false,
      icon: Users
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
            Invest in Your CS Career
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Join 10,000+ students who stopped losing points on memory bugs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-purple-500/30 scale-105 z-10'
                  : 'bg-white dark:bg-gray-700 shadow-xl border border-gray-200 dark:border-gray-600'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  ⭐ Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                  <plan.icon className={`w-6 h-6 ${plan.highlighted ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              
              <div className="mb-2">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className={plan.highlighted ? 'text-white/70' : 'text-gray-500'}>{plan.period}</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/80' : 'text-gray-500'}`}>{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${plan.highlighted ? 'text-green-300' : 'text-green-500'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-white/90' : ''}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.highlighted 
                    ? 'bg-white text-purple-600 hover:bg-gray-100' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I was totally lost in my Data Structures class until I found MemoryMap. Being able to SEE how a linked list actually works in memory changed everything. Went from a C to an A!",
      author: "Alex Kim",
      role: "CS Sophomore, UCLA",
      avatar: "AK",
      rating: 5
    },
    {
      quote: "AP CS was kicking my butt with pointers. MemoryMap + the GeeksforGeeks links it provides helped me finally get it. Now I actually enjoy coding in C++.",
      author: "Priya Patel",
      role: "High School Senior, AP CS Student",
      avatar: "PP",
      rating: 5
    },
    {
      quote: "The LeetCode mode helped me visualize what two-pointer algorithms actually do. Landed my dream internship at Microsoft after practicing with MemoryMap!",
      author: "James Liu",
      role: "CS Junior, Georgia Tech",
      avatar: "JL",
      rating: 5
    },
    {
      quote: "As a TA, I recommend MemoryMap to every struggling student. It's like having a debugger that also teaches you. The integrated W3Schools links are a nice touch.",
      author: "Sofia Martinez",
      role: "Graduate TA, UT Austin",
      avatar: "SM",
      rating: 5
    },
    {
      quote: "My professor showed us MemoryMap in lecture and I've been using it ever since. Finally understand why my code was crashing from dangling pointers!",
      author: "Ryan Thompson",
      role: "CS Freshman, Michigan",
      avatar: "RT",
      rating: 5
    },
    {
      quote: "I taught myself C++ online and pointers were a nightmare. MemoryMap made memory management click in a way no YouTube video could.",
      author: "Emma Wilson",
      role: "Self-taught Developer",
      avatar: "EW",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-600 font-bold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
            Loved by 10,000+ CS Students
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA
function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Stop Losing Points.
            <br />Start Visualizing.
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join 10,000+ students who finally understand memory management. 
            Your next A is one visualization away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-7 rounded-xl shadow-2xl font-bold">
                Start Free — No Signup Required
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-6">
            ✓ Free forever plan available  ✓ No credit card required  ✓ Works in browser
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MemoryMapLogo className="w-10 h-10" />
              <span className="text-xl font-bold">MemoryMap</span>
            </div>
            <p className="text-gray-400 text-sm">
              The visual debugger for C/C++ memory. Find leaks. Ace interviews. Get that A.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link to="/app" className="hover:text-white transition-colors">Try Free</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">LeetCode Mode</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Educators</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© 2025 MemoryMap. All rights reserved.</p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Navigation
function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MemoryMapLogo className="w-10 h-10" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MemoryMap
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Pricing</a>
          <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/app">
            <Button variant="ghost" className="font-medium">Log In</Button>
          </Link>
          <Link to="/app">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold">
              Try Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// For Students Section
function ForStudentsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Built By Students,
            <span className="text-purple-600"> For Students</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you're taking AP Computer Science or a college Data Structures course, 
            MemoryMap helps you <strong>actually understand</strong> what's happening in memory.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              level: "🏫 High School",
              title: "AP CS Students",
              description: "Struggling with pointers in AP CS A? See exactly how memory works with visual diagrams that make everything click.",
              topics: ["Basic Pointers", "Arrays", "Stack vs Heap"]
            },
            {
              level: "🎓 Undergrad",
              title: "CS Majors",
              description: "Acing Data Structures requires understanding memory. Visualize linked lists, trees, and graphs as you build them.",
              topics: ["Linked Lists", "Binary Trees", "Memory Leaks"]
            },
            {
              level: "💼 Job Prep",
              title: "Interview Ready",
              description: "LeetCode problems become 10x easier when you can see the memory state. Crush your technical interviews.",
              topics: ["LeetCode Problems", "Time Complexity", "Patterns"]
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm font-bold text-purple-600">{item.level}</span>
              <h3 className="text-2xl font-bold mt-2 mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.topics.map((topic, j) => (
                  <span key={j} className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <FeaturesSection />
      <EducationalSection />
      <ForStudentsSection />
      <LeetCodeSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
