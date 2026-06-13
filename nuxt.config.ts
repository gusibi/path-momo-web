// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // site: {
  //   url: 'https://momo.gusibi.mobi',
  //   name: '古思乱讲'
  // },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      titleTemplate: "%s - 古思乱讲",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: "古思乱讲" },
        { name: "theme-color", content: "#EE3524" },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "description",
          content:
            "古思乱讲 - 一个关于技术、生活和思考的博客 一个简洁、现代的博客系统，灵感来源于 Path 应用的用户界面。它使用 GitHub Issues 作为 CMS，通过 Cloudflare Workers 提供 API 服务，并使用 Cloudflare Pages 进行静态网站托管。特点包括时间线式博客展示、Markdown 渲染、标签分类、反应统计、夜间模式和响应式设计。| A concise, modern blogging system inspired by the Path app. Using GitHub Issues as CMS and Cloudflare for efficient hosting. Features include timeline display, Markdown rendering, and tag categorization",
        },
        // Open Graph
        {
          property: "og:description",
          content:
            "古思乱讲 - 一个关于技术、生活和思考的博客 简洁现代的博客系统，使用 GitHub Issues 作为 CMS，提供时间线式展示、Markdown 渲染、标签分类等功能。灵感源自 Path 应用，通过 Cloudflare 技术实现高效托管。| A concise, modern blogging system inspired by the Path app. Using GitHub Issues as CMS and Cloudflare for efficient hosting. Features include timeline display, Markdown rendering, and tag categorization",
        },
        { property: "og:type", content: "website" },
        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:description",
          content:
            "古思乱讲 - 一个关于技术、生活和思考的博客 简洁现代的博客系统，使用 GitHub Issues 作为 CMS，提供时间线式展示、Markdown 渲染、标签分类等功能。灵感源自 Path 应用，通过 Cloudflare 技术实现高效托管。| A concise, modern blogging system inspired by the Path app. Using GitHub Issues as CMS and Cloudflare for efficient hosting. Features include timeline display, Markdown rendering, and tag categorization",
        },
        {
          name: "google-site-verification",
          content: "mK8IcUVJNhs8X6Fwy-cJCB9AEIqxFbLOsKvynUoqa3Y",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        { rel: "mask-icon", href: "/pwa-512x512.svg", color: "#3b82f6" },
      ],
    },
  },
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@stefanobartoletti/nuxt-social-share",
    "@nuxtjs/sitemap",
    "@nuxtjs/supabase",
    "nuxt-gtag",
    "nuxt-clarity-analytics",
    "@vite-pwa/nuxt",
  ],

  // PWA 配置
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Path Meme",
      short_name: "Path Meme",
      description: "Path Meme - 一个关于技术、生活和思考的博客",
      theme_color: "#EE3524",
      background_color: "#FBF8F5",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: null, // 禁用 navigateFallback，让 Cloudflare 处理路由
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
      // 排除 API 路由
      navigateFallbackDenylist: [/^\/api\//],
      // 跳过等待，立即激活新 Service Worker
      skipWaiting: true,
      clientsClaim: true,
      // 清理旧缓存
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          // JS/CSS 文件使用 NetworkFirst，确保获取最新版本
          urlPattern: /\.(js|css)$/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "static-resources",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          // 缓存页面导航请求
          urlPattern: ({ request }) => request.mode === "navigate",
          handler: "NetworkFirst",
          options: {
            cacheName: "pages-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
            networkTimeoutSeconds: 3, // 3秒超时后使用缓存
          },
        },
        {
          urlPattern: /^https:\/\/api\.github\.com\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "github-api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/.*\.githubusercontent\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "github-images-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false, // 生产环境关闭
      type: "module",
    },
  },

  // configuration options
  socialShare: {
    baseUrl: "https://momo.gusibi.site", // required!
    // other optional module options
  },

  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: 0 }],
    configPath: "tailwind.config.js",
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },

  plugins: [
    "~/plugins/marked.ts",
    "~/plugins/head.ts",
    "~/plugins/banner-content.ts",
  ],
  routeRules: {
    // 指定只有 /profile 路由需要身份验证
    "/profile": { auth: true },
  },
  // 确保中间件被加载
  hooks: {
    "pages:extend"(pages) {
      pages.forEach((page) => {
        if (page.path === "/profile") {
          page.meta = page.meta || {};
          page.meta.middleware = ["auth"];
        }
      });
    },
  },
  runtimeConfig: {
    // 私有配置（仅服务端可访问）
    allowedPublisherId: process.env.ALLOWED_PUBLISHER_ID,
    private: {
      githubToken: process.env.GITHUB_TOKEN,
      botApiToken: process.env.BOT_API_TOKEN,
    },
    public: {
      apiBaseUrl:
        process.env.API_BASE_URL || "https://path-memo-api.gusibi.site",
      repoOwner: process.env.REPO_OWNER || "gusibi",
      repoName: process.env.REPO_NAME || "path-meme-db",
      perPageSize: process.env.PER_PAGE_SIZE || "10",
      siteTitle: "古思乱讲",
      siteDescription: "古思乱讲 - 一个关于技术、生活和思考的博客",
      siteUrl: process.env.SITE_URL || "https://momo.gusibi.site",
      twitterHandle: "@yourtwitterhandle",
    },
  },
  gtag: {
    id: "G-N7EW8Y4SEF",
  },
  supabase: {
    // Options
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: false, // Redirect automatically to the configured login page if a non authenticated user is trying to access a guarded. You can disable all redirects by setting this option to false.
  },
  // Sitemap configuration
  sitemap: {
    // hostname: 'https://momo.gusibi.site',
    // gzip: true,
    exclude: ["/admin/**"],
    sources: ["/api/__sitemap__/urls"],
  },
  nitro: {
    preset: "cloudflare-pages",
  },
});
