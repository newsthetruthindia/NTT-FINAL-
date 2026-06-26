'use client';

import React, { useEffect } from 'react';

export default function WebMCPProvider() {
  useEffect(() => {
    // Check for Model Context Protocol WebMCP API (Imperative API) across standard browser targets
    const mcp = (typeof document !== 'undefined' && (document as any).modelContext) ||
                (typeof navigator !== 'undefined' && (navigator as any).modelContext) ||
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
    <div hidden aria-hidden="true" style={{ display: 'none' }}>
      <form action="/search" method="GET" data-mcp-tool="searchArticles" data-mcp-description="Search investigative journalism articles, breaking news reports, topics, or journalists on NTT.">
        <input type="text" name="q" data-mcp-param="query" data-mcp-description="The search query keyword or topic" />
      </form>
      <form action="/api/proxy/v1/subscribe" method="POST" data-mcp-tool="subscribeNewsletter" data-mcp-description="Subscribe to NTT weekly investigative journalism briefings and breaking news alerts.">
        <input type="email" name="email" data-mcp-param="email" data-mcp-description="Subscriber email address" />
      </form>
    </div>
  );
}
