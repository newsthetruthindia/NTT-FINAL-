'use client';

import React, { useEffect } from 'react';

export default function WebMCPProvider() {
  useEffect(() => {
    const mcp = (typeof navigator !== 'undefined' && (navigator as any).modelContext) ||
                (typeof document !== 'undefined' && (document as any).modelContext) ||
                (typeof window !== 'undefined' && (window as any).modelContext);

    if (mcp && typeof mcp.registerTool === 'function') {
      const tools = [
        {
          name: 'get_latest_news',
          description: 'Fetch the latest breaking news articles and investigative reports from NTT.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Number of articles to return (default 5)' }
            }
          },
          execute: async ({ limit = 5 }: { limit?: number }) => {
            const res = await fetch(`https://backend.newsthetruth.com/api/posts?limit=${limit}`);
            return await res.json();
          }
        },
        {
          name: 'search_articles',
          description: 'Search investigative news articles, reports, and breaking news on NTT.',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search keywords or topic' }
            },
            required: ['query']
          },
          execute: async ({ query }: { query: string }) => {
            const res = await fetch(`https://backend.newsthetruth.com/api/posts?search=${encodeURIComponent(query)}`);
            return await res.json();
          }
        },
        {
          name: 'get_categories',
          description: 'Get all available news sections and categories on NTT.',
          inputSchema: {
            type: 'object',
            properties: {}
          },
          execute: async () => {
            return [
              { name: 'India News', slug: 'india' },
              { name: 'World News', slug: 'world' },
              { name: 'Politics', slug: 'politics' },
              { name: 'West Bengal', slug: 'bengal' }
            ];
          }
        }
      ];

      tools.forEach(tool => {
        try { mcp.registerTool(tool); } catch (e) {}
      });
    }
  }, []);

  return (
    <>
      {/* Synchronous inline script to register WebMCP tools before React hydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var mcp = (typeof navigator !== 'undefined' && navigator.modelContext) ||
                          (typeof document !== 'undefined' && document.modelContext) ||
                          (typeof window !== 'undefined' && window.modelContext);
                if (mcp && typeof mcp.registerTool === 'function') {
                  mcp.registerTool({
                    name: 'get_latest_news',
                    description: 'Fetch the latest breaking news articles from NTT.',
                    inputSchema: { type: 'object', properties: { limit: { type: 'number' } } },
                    execute: async function({ limit }) {
                      var res = await fetch('https://backend.newsthetruth.com/api/posts?limit=' + (limit || 5));
                      return await res.json();
                    }
                  });
                  mcp.registerTool({
                    name: 'search_articles',
                    description: 'Search investigative news articles on NTT.',
                    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
                    execute: async function({ query }) {
                      var res = await fetch('https://backend.newsthetruth.com/api/posts?search=' + encodeURIComponent(query));
                      return await res.json();
                    }
                  });
                }
              } catch(e) {}
            })();
          `
        }}
      />

      {/* Screen-reader accessible declarative form registry (guaranteed in DOM accessibility tree for Lighthouse) */}
      <div className="sr-only" aria-label="WebMCP Declarative Tool Registry">
        <form
          action="/search"
          method="GET"
          data-toolname="search_articles"
          data-mcp-tool="search_articles"
          data-tooldescription="Search investigative news reports, breaking articles, topics, or journalists on NTT."
          data-mcp-description="Search investigative news reports, breaking articles, topics, or journalists on NTT."
        >
          <input
            type="text"
            name="q"
            data-paramname="query"
            data-mcp-param="query"
            data-paramdescription="Search query keywords"
            data-mcp-description="Search query keywords"
          />
          <button type="submit">Search</button>
        </form>

        <form
          action="/api/proxy/v1/subscribe"
          method="POST"
          data-toolname="subscribe_newsletter"
          data-mcp-tool="subscribe_newsletter"
          data-tooldescription="Subscribe to NTT weekly investigative journalism briefings and breaking news alerts."
          data-mcp-description="Subscribe to NTT weekly investigative journalism briefings and breaking news alerts."
        >
          <input
            type="email"
            name="email"
            data-paramname="email"
            data-mcp-param="email"
            data-paramdescription="Subscriber email address"
            data-mcp-description="Subscriber email address"
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </>
  );
}
