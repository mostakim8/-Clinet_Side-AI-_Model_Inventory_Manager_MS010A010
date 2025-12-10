// postcss.config.js

module.exports = {
  plugins: {
    // 1. **postcss-import**: এটি প্রথমে থাকতে হবে যদি আপনি CSS-এর মধ্যে @import ব্যবহার করেন (যদিও @tailwind এটার দরকার নেই)
    "postcss-import": {}, 
    
    // 2. **tailwindcss/nesting**: যদি আপনি Nesting ব্যবহার করেন, এটি Tailwind এর ঠিক আগে থাকা উচিত
    "tailwindcss/nesting": {}, 
    
    // 3. **tailwindcss**: Tailwind এর মূল প্রক্রিয়া এই ধাপে হয়
    tailwindcss: {},
    
    // 4. **postcss-preset-env**: এটি Tailwind এর পরে আসে, বিশেষ করে nesting-rules ব্যবহার করলে
    "postcss-preset-env": {
        features: { "nesting-rules": true },
    },
    
    // 5. **autoprefixer**: এটি সবচেয়ে শেষে থাকে, আধুনিক CSS এর জন্য
    autoprefixer: {}, 
    
    // 6. **cssnano** (Production Optimization): এটিও শেষে থাকা উচিত
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};