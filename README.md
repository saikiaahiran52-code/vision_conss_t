   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
   *Note: This project relies on Tailwind CSS v3.*
3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application in action.
## 📂 Project Structure
```
VISION-CONSTRUC/
├── src/
│   ├── components/      # Reusable UI components (Layout, Toast)
│   ├── context/         # React Context providers (Auth, Theme)
│   ├── features/        # Feature-based modules (Auth, Dashboard, Profile, Projects)
│   ├── hooks/           # Custom React hooks (useProjects)
│   ├── lib/             # Utility libraries (Tailwind cn utility)
│   ├── styles/          # Global styles (Tailwind base)
│   ├── utils/           # Helper functions (Material calculations, Exports)
│   ├── App.jsx          # Main application routing
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── tailwind.config.js   # Tailwind CSS configuration (v3)
└── postcss.config.js    # PostCSS configuration
```
## 📝 License
This project is licensed under the MIT License.
