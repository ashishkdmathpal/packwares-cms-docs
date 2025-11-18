import { defineConfig } from 'vitepress'

export default defineConfig({
  // Site metadata
  title: 'PackWares',
  description: 'PackWares CMS - From Specifications to Quotation. Complete platform for corrugated box manufacturers and sourcing teams.',

  // Clean URLs (remove .html extension)
  cleanUrls: true,

  // Head tags for SEO
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#7C3AED' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: 'PackWares' }],
    ['meta', { name: 'og:image', content: 'https://docs.packwares.com/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.packwares.com/og-image.png' }],

    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap', rel: 'stylesheet' }],
  ],

  // Sitemap generation
  sitemap: {
    hostname: 'https://docs.packwares.com'
  },

  // Theme configuration
  themeConfig: {
    // Site logo
    logo: '/logo.png',
    siteTitle: 'PackWares',

    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tools', link: '/tools' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Docs', link: '/docs/' },
      {
        text: 'CMS Login',
        link: 'https://cms.packwares.com/auth/login',
        target: '_blank'
      }
    ],

    // Sidebar for documentation
    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/docs/' },
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'Customer Management', link: '/docs/customer' },
            { text: 'Deals', link: '/docs/deals' },
            { text: 'Request Costing', link: '/docs/request-costing' },
            { text: 'Quotation Generate', link: '/docs/quotation-generate' },
            { text: 'Quotation Update', link: '/docs/quotation-update' },
            { text: 'Costing Complete', link: '/docs/costing-complete' }
          ]
        },
        {
          text: 'Configuration & Formulas',
          items: [
            { text: 'Formulas', link: '/docs/formula' },
            { text: 'Variables', link: '/docs/variables' },
            { text: 'Constants', link: '/docs/constants' },
            { text: 'Flute Pickup Factor', link: '/docs/flute-pickup-factor' }
          ]
        },
        {
          text: 'System Management',
          items: [
            { text: 'Videos', link: '/docs/videos' },
            { text: 'Tickets', link: '/docs/tickets' }
          ]
        },
        {
          text: 'Settings',
          items: [
            { text: 'Profile Information', link: '/docs/settings-profile' },
            { text: 'Referral System', link: '/docs/settings-referral' },
            { text: 'Team Management', link: '/docs/settings-team' },
            { text: 'User Roles', link: '/docs/settings-user-roles' },
            { text: 'Unit of Measure (UOM)', link: '/docs/settings-uom' },
            { text: 'Naming Convention', link: '/docs/settings-naming-convention' },
            { text: 'Paper Grade', link: '/docs/settings-paper-grade' }
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/blog/' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ashishkdmathpal/packwares-cms-docs' },
      {
        icon: 'youtube',
        link: 'https://www.youtube.com/@packwares'
      }
    ],

    // Footer
    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2025 PackWares. All rights reserved.'
    },

    // Search
    search: {
      provider: 'local',
      options: {
        placeholder: 'Search documentation...',
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search'
          },
          modal: {
            noResultsText: 'No results found',
            resetButtonTitle: 'Clear search',
            footer: {
              selectText: 'to select',
              navigateText: 'to navigate',
              closeText: 'to close'
            }
          }
        }
      }
    },

    // Edit link (optional)
    editLink: {
      pattern: 'https://github.com/ashishkdmathpal/packwares-cms-docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },

    // Last updated
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    }
  },

  // Markdown configuration
  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
