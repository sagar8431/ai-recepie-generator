import React, { useState, useEffect } from "react";
// We load Tailwind via the <script> tag in the HTML, so no import is needed.

// Enhanced notification component with better animations
function Notification({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slideInRight">
      <div className="max-w-sm w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-2xl p-4 border border-red-500/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium animate-pulse-once">{message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-white text-2xl leading-none font-bold hover:text-red-100 transition-all duration-200 hover:scale-125"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulseOnce {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-pulse-once { animation: pulseOnce 2s ease-in-out; }
      `}</style>
    </div>
  );
}

// Enhanced spinner with cooking-themed animation
function Spinner() {
  return (
    <div className="relative">
      <div className="text-2xl animate-chopping">🔪</div>
      <div className="absolute inset-0 animate-ping opacity-20">
        <div className="h-5 w-5 rounded-full bg-white"></div>
      </div>
    </div>
  );
}

// Cooking-themed loading component
function CookingLoader({ type }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative mb-4">
        {type === "recipe" ? (
          <div className="text-6xl animate-mixing">🍳</div>
        ) : (
          <div className="text-6xl animate-chopping">🥗</div>
        )}
        {/* Steam effect */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            <div className="w-2 h-8 bg-white/30 rounded-full animate-steam" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-10 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-8 bg-white/30 rounded-full animate-steam" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Format recipe text with better styling
function formatRecipeText(text) {
  if (!text) return '';
  
  let formatted = text
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Sections with emojis (do this first to catch emoji headings)
  formatted = formatted.replace(/^([🍳🥗🍽️👨‍🍳🥘🍕🌮🍜🥑🍅🥕🧅🌶️🥬💚🔥⭐].+?):\s*$/gm, '<h3 class="recipe-section">$1:</h3>');
  
  // Bold headings (lines ending with : but not already formatted)
  formatted = formatted.replace(/^(?![<])(.*?):\s*$/gm, (match, p1) => {
    if (!match.includes('<h3') && !match.includes('<div')) {
      return `<h3 class="recipe-heading">${p1}:</h3>`;
    }
    return match;
  });
  
  // Numbered steps
  formatted = formatted.replace(/^(\d+[\.\)])\s+(.+)$/gm, '<div class="recipe-step"><span class="step-number">$1</span><span class="step-content">$2</span></div>');
  
  // Bullet points
  formatted = formatted.replace(/^[-•*]\s+(.+)$/gm, '<div class="recipe-bullet">• $1</div>');
  
  // Bold text between **
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="recipe-bold">$1</strong>');
  
  // Line breaks - preserve double line breaks for paragraphs
  formatted = formatted.split('\n\n').map(para => {
    if (para.trim() && !para.includes('<h3') && !para.includes('<div')) {
      return `<p class="recipe-paragraph">${para.replace(/\n/g, '<br>')}</p>`;
    }
    return para;
  }).join('\n\n');
  
  // Single line breaks
  formatted = formatted.replace(/(?<!<br>)\n(?!<)/g, '<br>');
  
  return formatted;
}

// Format diet plan text with better styling
function formatDietText(text) {
  if (!text) return '';
  
  let formatted = text
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Meal titles (Breakfast, Lunch, Dinner, Snacks) - do this first
  formatted = formatted.replace(/^(Breakfast|Lunch|Dinner|Snack[s]?|Meal|🌅|🌞|🌙|🍎|🥗|🥙|🌮|🍲|🥘|🍜|🍱|🍽️).*?:/gmi, '<h3 class="diet-meal-title">$&</h3>');
  
  // Numbered items
  formatted = formatted.replace(/^(\d+[\.\)])\s+(.+)$/gm, '<div class="diet-item"><span class="item-number">$1</span><span class="item-content">$2</span></div>');
  
  // Bullet points
  formatted = formatted.replace(/^[-•*]\s+(.+)$/gm, '<div class="diet-bullet">• $1</div>');
  
  // Calories info
  formatted = formatted.replace(/(\d+)\s*(calories?|kcal|Cal)/gi, '<span class="diet-calories">$1 $2</span>');
  
  // Bold text between **
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="diet-bold">$1</strong>');
  
  // Line breaks - preserve double line breaks for paragraphs
  formatted = formatted.split('\n\n').map(para => {
    if (para.trim() && !para.includes('<h3') && !para.includes('<div')) {
      return `<p class="diet-paragraph">${para.replace(/\n/g, '<br>')}</p>`;
    }
    return para;
  }).join('\n\n');
  
  // Single line breaks
  formatted = formatted.replace(/(?<!<br>)\n(?!<)/g, '<br>');
  
  return formatted;
}

// Main App Component
function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notification, setNotification] = useState("");
  const [dark, setDark] = useState(false);
  const [modelUsed, setModelUsed] = useState("");
  const MAX_CHARS = 280;
  const presets = [
    "chicken, rice, spinach",
    "paneer, tomato, peas",
    "eggs, avocado, toast",
    "oats, banana, peanut butter",
  ];

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification("");
      }, 3000); // Clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // 🍳 Generate Recipe
  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setNotification("Please enter some ingredients!");
      return;
    }

    setLoading("recipe");
    setRecipe("");
    setDietPlan("");
    setImageUrl("");

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const generated = data.recipe || "No recipe generated.";
      setRecipe(generated);
      setModelUsed(data.modelUsed || "");
      const imagePrompt = `Photorealistic plated dish inspired by these ingredients: ${ingredients}. Professional food photography, soft natural light, shallow depth of field, high detail, no text, no watermark.`;
      generateImage(imagePrompt);
    } catch (err) {
      console.error("Recipe generation error:", err);
      setNotification("Failed to generate recipe. Please check your server.");
    }

    setLoading("");
  };

  // 🥦 Generate Healthy Diet Plan
  const generateDietPlan = async () => {
    if (!ingredients.trim()) {
      setNotification("Please enter some ingredients!");
      return;
    }

    setLoading("diet");
    setDietPlan("");
    setRecipe("");
    setImageUrl("");

    try {
      const response = await fetch("/api/healthy-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json(); 
      if (!response.ok || data.error) {
        const errorMessage = data?.error || data?.details || `Server responded with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const plan = data.dietPlan || "No diet plan generated.";
      setDietPlan(plan);
      setModelUsed(data.modelUsed || data.provider || "");
      const imagePrompt = `Balanced healthy meal based on these ingredients: ${ingredients}. Vibrant vegetables, lean protein, whole grains. Professional food photography, soft light, shallow depth of field, no text.`;
      generateImage(imagePrompt);
    } catch (err) {
      console.error("Diet plan generation error:", err);
      setNotification(`Failed to generate diet plan: ${err.message}`);
    }

    setLoading("");
  };

  // 🖼️ Generate Image
  const generateImage = async (prompt) => {
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error(`Image server error: ${res.status}`);
      }

      const data = await res.json();
      if (data?.image) {
        setImageUrl(data.image);
      }
    } catch (e) {
      console.error("Image generation failed", e);
      setNotification("Failed to generate image.");
    }
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen font-sans p-4 md:p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950 transition-all duration-500 relative overflow-hidden cooking-background">
      {/* Cooking-themed background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Animated cooking-themed background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Warm cooking colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-300 dark:bg-amber-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        
        {/* Floating cooking utensils */}
        <div className="absolute top-20 left-10 text-6xl opacity-10 dark:opacity-5 animate-float-utensil" style={{ animationDelay: '0s' }}>🔪</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 dark:opacity-5 animate-float-utensil" style={{ animationDelay: '2s' }}>🥄</div>
        <div className="absolute bottom-32 left-20 text-4xl opacity-10 dark:opacity-5 animate-float-utensil" style={{ animationDelay: '4s' }}>🍴</div>
        <div className="absolute top-60 right-40 text-5xl opacity-10 dark:opacity-5 animate-float-utensil" style={{ animationDelay: '1s' }}>👨‍🍳</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 dark:opacity-5 animate-float-utensil" style={{ animationDelay: '3s' }}>🍳</div>
        <div className="absolute top-32 left-1/3 text-4xl opacity-10 dark:opacity-5 animate-float-utensil" style={{ animationDelay: '5s' }}>🥣</div>
        
        {/* Floating ingredients */}
        <div className="absolute top-1/4 right-1/4 text-3xl opacity-10 dark:opacity-5 animate-float-ingredient" style={{ animationDelay: '0.5s' }}>🥕</div>
        <div className="absolute bottom-1/3 left-1/4 text-3xl opacity-10 dark:opacity-5 animate-float-ingredient" style={{ animationDelay: '2.5s' }}>🍅</div>
        <div className="absolute top-1/2 right-1/3 text-3xl opacity-10 dark:opacity-5 animate-float-ingredient" style={{ animationDelay: '4.5s' }}>🧅</div>
        <div className="absolute bottom-1/4 right-1/2 text-3xl opacity-10 dark:opacity-5 animate-float-ingredient" style={{ animationDelay: '1.5s' }}>🥬</div>
        <div className="absolute top-3/4 left-1/2 text-3xl opacity-10 dark:opacity-5 animate-float-ingredient" style={{ animationDelay: '3.5s' }}>🌶️</div>
      </div>

      <Notification message={notification} onClose={() => setNotification("")} />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-8 animate-fadeInDown">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <div className="text-5xl animate-bounce-slow group-hover:animate-mixing cursor-pointer transition-transform duration-300 hover:scale-110 relative">
                🍳
                <div className="absolute -top-1 -right-1 text-2xl animate-wiggle">👨‍🍳</div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 dark:from-orange-400 dark:via-red-400 dark:to-amber-400 bg-clip-text text-transparent">
                  SmartChef<span className="text-orange-700 dark:text-orange-300">AI</span>
                </h1>
                <p className="text-sm md:text-base text-orange-700 dark:text-orange-300 mt-1 font-medium">
                  Your AI Kitchen Assistant for Recipes and Healthy Diets
                </p>
              </div>
            </div>
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark(d => !d)}
              className="px-4 py-2 rounded-xl border text-sm font-medium shadow-lg bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-3"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border-2 border-orange-200/50 dark:border-orange-800/30 animate-fadeInUp hover:shadow-3xl transition-all duration-500 relative overflow-hidden cooking-card">
          {/* Subtle kitchen texture overlay */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f97316' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}></div>
          <div className="mb-6 animate-slideInLeft">
            <label className="flex items-center text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3 relative z-10">
              <span className="text-2xl mr-2 animate-pulse-slow">🥘</span>
              What ingredients do you have?
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients separated by commas (e.g., rice, chicken, spinach, tomatoes, olive oil)"
              maxLength={MAX_CHARS}
              className="w-full h-32 p-4 border-2 border-orange-300 dark:border-orange-700 rounded-xl text-gray-700 dark:text-gray-100 focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 dark:focus:border-orange-400 resize-none text-base dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-orange-400 dark:hover:border-orange-600 shadow-inner bg-orange-50/30 dark:bg-orange-950/20 relative z-10"
            />
            <div className="mt-3 flex items-center justify-between text-sm text-orange-700 dark:text-orange-300 relative z-10">
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button 
                    key={p} 
                    onClick={() => setIngredients(p)} 
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 hover:from-orange-200 hover:to-amber-200 dark:hover:from-orange-800 dark:hover:to-amber-800 text-orange-800 dark:text-orange-200 font-medium text-xs transition-all duration-300 hover:scale-110 hover:shadow-lg animate-fadeIn border border-orange-200 dark:border-orange-800"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="font-semibold text-orange-600 dark:text-orange-400">{ingredients.length}/{MAX_CHARS}</div>
            </div>
            <div className="mt-3 flex gap-2 relative z-10">
              <button 
                onClick={() => setIngredients("")} 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 hover:from-red-200 hover:to-red-300 dark:hover:from-red-800 dark:hover:to-red-700 text-red-700 dark:text-red-300 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md border border-red-200 dark:border-red-800"
              >
                🗑️ Clear
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(ingredients)} 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-800 dark:hover:to-orange-700 text-orange-700 dark:text-orange-300 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md border border-orange-200 dark:border-orange-800"
              >
                📋 Copy
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slideInRight">
            <button
              className="group flex-1 flex justify-center items-center p-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:via-orange-500 hover:to-red-500 relative overflow-hidden border-2 border-orange-400/50"
              onClick={generateRecipe}
              disabled={loading === "recipe"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {loading === "recipe" ? (
                <Spinner />
              ) : (
                <span className="text-2xl mr-2 group-hover:animate-mixing">🍳</span>
              )}
              <span className="btn-text relative z-10">
                {loading === "recipe" ? "Cooking..." : "Generate Recipe"}
              </span>
            </button>

            <button
              className="group flex-1 flex justify-center items-center p-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-400 hover:via-emerald-500 hover:to-teal-500 relative overflow-hidden border-2 border-green-400/50"
              onClick={generateDietPlan}
              disabled={loading === "diet"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {loading === "diet" ? (
                <Spinner />
              ) : (
                <span className="text-2xl mr-2 group-hover:animate-chopping">🥗</span>
              )}
              <span className="btn-text relative z-10">
                {loading === "diet" ? "Planning..." : "Generate Diet Plan"}
              </span>
            </button>
          </div>

          {loading && !recipe && !dietPlan && (
            <div className="text-center p-12 animate-fadeIn">
              <CookingLoader type={loading} />
              <p className="text-orange-700 dark:text-orange-300 mt-6 text-lg font-semibold animate-pulse">
                {loading === "recipe" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-wiggle">👨‍🍳</span>
                    Cooking up your delicious recipe...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-wiggle">🥗</span>
                    Preparing your personalized healthy diet plan...
                  </span>
                )}
              </p>
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="mt-4 text-sm text-orange-600 dark:text-orange-400 font-medium">
                {loading === "recipe" ? "Gathering ingredients..." : "Calculating nutrition..."}
              </div>
            </div>
          )}

          {recipe && (
            <div className="mt-8 border-2 border-orange-200 dark:border-orange-800 rounded-2xl overflow-hidden shadow-2xl animate-slideInUp bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10 relative">
              {/* Decorative steam effect */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-6 bg-orange-300/30 dark:bg-orange-700/30 rounded-full animate-steam" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-8 bg-orange-300/40 dark:bg-orange-700/40 rounded-full animate-steam" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-3 h-6 bg-orange-300/30 dark:bg-orange-700/30 rounded-full animate-steam" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
              <div className="flex items-center p-5 bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-700 dark:to-red-800 relative">
                <span className="text-3xl mr-3 animate-bounce-slow">🍽️</span>
                <h2 className="text-xl font-bold text-white drop-shadow-lg">Recipe Suggestion</h2>
                <div className="ml-auto text-2xl animate-wiggle">👨‍🍳</div>
              </div>
              <div className="p-6">
                {imageUrl && (
                  <div className="mb-6 animate-fadeIn">
                    <img 
                      className="w-full max-w-md mx-auto h-auto rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 transform hover:scale-105 transition-transform duration-500" 
                      src={imageUrl} 
                      alt="Generated dish" 
                    />
                  </div>
                )}
                <div className="bg-gradient-to-br from-white/90 to-orange-50/50 dark:from-gray-800/90 dark:to-orange-950/30 rounded-xl p-8 backdrop-blur-sm border-2 border-orange-200/50 dark:border-orange-800/30 shadow-inner recipe-content">
                  <div 
                    className="text-gray-800 dark:text-gray-100 leading-relaxed text-base animate-fadeIn recipe-text"
                    dangerouslySetInnerHTML={{ __html: formatRecipeText(recipe) }}
                  />
                </div>
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => navigator.clipboard.writeText(recipe)} 
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 hover:from-orange-200 hover:to-amber-200 dark:hover:from-orange-800 dark:hover:to-amber-800 text-orange-700 dark:text-orange-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 border border-orange-200 dark:border-orange-800"
                  >
                    📋 Copy Recipe
                  </button>
                </div>
              </div>
            </div>
          )}

          {dietPlan && (
            <div className="mt-8 border-2 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden shadow-2xl animate-slideInUp bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-900/10 relative">
              {/* Decorative leaf effect */}
              <div className="absolute -top-2 right-4 text-2xl opacity-20 dark:opacity-10 animate-float-ingredient">🥬</div>
              <div className="absolute -bottom-2 left-4 text-2xl opacity-20 dark:opacity-10 animate-float-ingredient" style={{ animationDelay: '1s' }}>🥕</div>
              <div className="flex items-center p-5 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800 relative">
                <span className="text-3xl mr-3 animate-pulse-slow">🥗</span>
                <h2 className="text-xl font-bold text-white drop-shadow-lg">Healthy Diet Plan</h2>
                <div className="ml-auto text-2xl animate-wiggle">💚</div>
              </div>
              <div className="p-6">
                {imageUrl && (
                  <div className="mb-6 animate-fadeIn">
                    <img 
                      className="w-full max-w-md mx-auto h-auto rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 transform hover:scale-105 transition-transform duration-500" 
                      src={imageUrl} 
                      alt="Healthy meal" 
                    />
                  </div>
                )}
                <div className="bg-gradient-to-br from-white/90 to-green-50/50 dark:from-gray-800/90 dark:to-green-950/30 rounded-xl p-8 backdrop-blur-sm border-2 border-green-200/50 dark:border-green-800/30 shadow-inner diet-content">
                  <div 
                    className="text-gray-800 dark:text-gray-100 leading-relaxed text-base animate-fadeIn diet-text"
                    dangerouslySetInnerHTML={{ __html: formatDietText(dietPlan) }}
                  />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button 
                    onClick={() => navigator.clipboard.writeText(dietPlan)} 
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800 dark:hover:to-emerald-800 text-green-700 dark:text-green-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 border border-green-200 dark:border-green-800"
                  >
                    📋 Copy Plan
                  </button>
                  {modelUsed && (
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1.5 rounded-full font-medium border border-green-200 dark:border-green-800">
                      Model: {modelUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <footer className="text-center text-sm text-orange-600 dark:text-orange-400 mt-8 animate-fadeIn font-medium">
          Made with <span className="animate-pulse text-red-500">❤️</span> and <span className="animate-wiggle">🍳</span> by SmartChef AI
        </footer>
      </div>
    </div>
  );
}

export default App;