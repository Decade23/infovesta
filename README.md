src
├─ app
│  ├─ (auth)
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ admin
│  │  ├─ layout.tsx            # AdminLayout (Header + Sidebar + Footer)
│  │  ├─ page.tsx              # Dashboard/Home
│  │  ├─ users/page.tsx
│  │  ├─ roles/page.tsx
│  │  └─ trainings/page.tsx
│  ├─ api                      # API dummy untuk dev (bisa diganti Go)
│  │  ├─ auth
│  │  │  ├─ login/route.ts
│  │  │  └─ register/route.ts
│  │  ├─ users/route.ts
│  │  ├─ roles/route.ts
│  │  └─ trainings/route.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx               # RootLayout (global font, Recoil, NProgress)
│  └─ page.tsx                 # Landing sederhana (redirect ke /admin jika login)
├─ components
│  ├─ layout/AdminHeader.tsx
│  ├─ layout/AdminSidebar.tsx
│  ├─ layout/AdminFooter.tsx
│  ├─ forms/LoginForm.tsx
│  ├─ forms/RegisterForm.tsx
│  └─ data/SimpleTable.tsx
├─ controllers
│  ├─ AuthController.ts
│  ├─ RoleController.ts
│  ├─ TrainingController.ts
│  └─ UserController.ts
├─ services
│  ├─ ApiClient.ts             # Singleton fetch wrapper
│  ├─ AuthService.ts
│  ├─ RoleService.ts
│  ├─ TrainingService.ts
│  └─ UserService.ts
├─ domain
│  └─ models.ts                # Types/Interfaces
├─ state
│  ├─ authState.ts
│  └─ uiState.ts
├─ lib
│  ├─ nprogress-client.ts      # route progress bar
│  └─ helpers.ts               # util kecil (formatter, cn, etc)
└─ middleware.ts               # proteksi /admin (cek cookie access_token)
