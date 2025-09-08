export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "note" | "tip" | "warning"; text: string };

export type HelpArticle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: "guide" | "video" | "tutorial";
  content: ContentBlock[];
};

export type HelpResource = {
  slug: string;
  title: string;
  description: string;
  content: ContentBlock[];
};

export const helpArticles: HelpArticle[] = [{
    id: 1,
    slug: "getting-started-with-getindexednow",
    title: "Getting Started with GetIndexedNow",
    description:
      "Learn the basics of using our platform to index your websites faster.",
    category: "getting-started",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "What is GetIndexedNow?" },
      { type: "paragraph", text: "GetIndexedNow is a powerful platform designed to accelerate the discovery and indexing of your web pages by major search engines like Google, Bing, and others. When you publish new content or update existing pages, search engines need to find and process these changes. Our service ensures your URLs are submitted directly to search engines, significantly reducing the time it takes for your content to appear in search results." },
      { type: "paragraph", text: "Unlike traditional sitemap submissions that can take weeks to process, GetIndexedNow provides immediate submission with real-time tracking and detailed analytics. This is especially valuable for time-sensitive content, product launches, or when you need to ensure your latest updates are discoverable quickly." },
      { type: "heading", level: 2, text: "How It Works" },
      { type: "paragraph", text: "The process is straightforward but powerful. When you submit a URL through our platform, we immediately notify multiple search engines about your content. Our system then tracks the submission status, providing you with detailed insights into the indexing process." },
      { type: "list", items: [
        "Submit URLs through our web interface or API",
        "Our system validates and processes your submission",
        "Search engines receive immediate notification of your content",
        "Real-time tracking shows submission status and results",
        "Detailed analytics help you understand indexing performance"
      ] },
      { type: "heading", level: 2, text: "Prerequisites" },
      { type: "paragraph", text: "Before you begin using GetIndexedNow, ensure you have the following in place:" },
      { type: "list", items: [
        "A valid email address for account creation and notifications",
        "Ownership or administrative access to at least one domain or URL",
        "Modern web browser (Chrome, Edge, Firefox, Safari) for optimal experience",
        "Basic understanding of your website's structure and content"
      ] },
      { type: "note", text: "You don't need technical expertise to use GetIndexedNow. Our platform is designed to be user-friendly for marketers, content creators, and business owners." },
      { type: "heading", level: 2, text: "Creating Your Account" },
      { type: "paragraph", text: "Getting started with GetIndexedNow is quick and easy. Follow these steps to create your account:" },
      { type: "steps", items: [
        "Visit our homepage and click the 'Sign Up' button in the top navigation",
        "Enter your email address and create a strong password",
        "Complete the verification process by clicking the link sent to your email",
        "Log in to your new account and complete your profile setup"
      ] },
      { type: "tip", text: "Use a business email address for your account to ensure you receive important notifications and can easily manage team access later." },
      { type: "heading", level: 3, text: "Profile Setup" },
      { type: "paragraph", text: "After creating your account, take a few minutes to complete your profile:" },
      { type: "list", items: [
        "Add your full name and company information",
        "Set your preferred timezone for accurate reporting",
        "Configure notification preferences",
        "Enable two-factor authentication for enhanced security"
      ] },
      { type: "heading", level: 2, text: "Understanding Your Dashboard" },
      { type: "paragraph", text: "Your dashboard is the central hub for monitoring your indexing activities. It provides a comprehensive overview of your account status, recent submissions, and key metrics." },
      { type: "heading", level: 3, text: "Key Dashboard Elements" },
      { type: "list", items: [
        "Credit Balance: Shows your remaining and consumed credits for the current billing cycle",
        "Submission Status: Displays counts of successful, pending, and failed submissions",
        "Recent Activity: Lists your latest submissions with real-time status updates",
        "Top Domains: Shows your most active domains for quick access and filtering"
      ] },
      { type: "tip", text: "Pin your most frequently used domains to the favorites section for quick access and filtering." },
      { type: "heading", level: 3, text: "Using Dashboard Filters" },
      { type: "paragraph", text: "The dashboard includes powerful filtering capabilities to help you focus on specific data:" },
      { type: "list", items: [
        "Date Range: Filter by specific time periods (last 7 days, 30 days, custom range)",
        "Domain Filter: Focus on submissions from specific domains",
        "Status Filter: View only successful, pending, or failed submissions",
        "Tag Filter: Filter by custom tags you've applied to submissions"
      ] },
      { type: "heading", level: 2, text: "Your First URL Submission" },
      { type: "paragraph", text: "Now that you're familiar with the dashboard, let's submit your first URL. This process is straightforward and will give you immediate experience with our platform." },
      { type: "steps", items: [
        "Navigate to the 'Tasks' section in the left sidebar",
        "Click 'New Submission' to open the submission form",
        "Paste your URL into the input field (ensure it includes the full protocol, e.g., https://example.com/page)",
        "Optionally add tags to help organize your submissions (e.g., 'blog', 'product', 'landing-page')",
        "Set the priority level if needed (normal is recommended for most submissions)",
        "Click 'Submit' to add the URL to your submission queue",
        "Monitor the submission status in real-time through the queue interface"
      ] },
      { type: "warning", text: "Ensure your URL is accessible and returns a 200 status code before submission. URLs that are blocked by robots.txt or return errors will fail validation." },
      { type: "heading", level: 3, text: "Understanding Submission Status" },
      { type: "paragraph", text: "After submitting a URL, you'll see it progress through different statuses:" },
      { type: "list", items: [
        "Pending: URL is queued and waiting to be processed",
        "Processing: URL is being submitted to search engines",
        "Success: URL has been successfully submitted to all target search engines",
        "Failed: Submission encountered an error (check the error details for resolution)"
      ] },
      { type: "note", text: "Submission credits are only consumed when a task is successfully queued. If a task fails validation or encounters an error, credits are not deducted." },
      { type: "heading", level: 2, text: "Next Steps" },
      { type: "paragraph", text: "Congratulations! You've successfully created your account and submitted your first URL. Here are some recommended next steps to maximize your use of GetIndexedNow:" },
      { type: "list", items: [
        "Explore bulk submission features for multiple URLs",
        "Set up API integration for automated submissions",
        "Configure custom reports and alerts",
        "Invite team members to collaborate on submissions",
        "Review your submission analytics to optimize performance"
      ] },
      { type: "tip", text: "Start with a few test submissions to familiarize yourself with the process before scaling up to larger volumes." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for getting started with getindexednow with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 2,
    slug: "how-to-submit-your-first-url",
    title: "How to Submit Your First URL",
    description:
      "Step-by-step guide to submitting your first URL for indexing.",
    category: "getting-started",
    type: "video",
    content: [
      { type: "heading", level: 2, text: "Preparing Your URL for Submission" },
      { type: "paragraph", text: "Before submitting any URL to GetIndexedNow, it's crucial to ensure your page is ready for search engine discovery. This preparation phase can significantly impact the success rate of your submissions." },
      { type: "heading", level: 3, text: "Technical Requirements" },
      { type: "paragraph", text: "Your URL must meet several technical criteria to be successfully submitted and indexed:" },
      { type: "list", items: [
        "HTTP Status 200: The page must return a successful response code",
        "Public Accessibility: The page should be accessible to anonymous users",
        "Robots.txt Compliance: Ensure the page isn't blocked by robots.txt directives",
        "Valid HTML: The page should contain properly formatted HTML content",
        "Fast Loading: Pages should load within reasonable time limits (under 5 seconds)"
      ] },
      { type: "warning", text: "Pages that return 404, 500, or other error codes will be rejected during validation. Always test your URLs before submission." },
      { type: "heading", level: 3, text: "Content Quality Checklist" },
      { type: "paragraph", text: "While not strictly required, ensuring your content meets quality standards will improve indexing success:" },
      { type: "list", items: [
        "Unique, valuable content that provides value to users",
        "Proper meta title and description tags",
        "Relevant headings (H1, H2, H3) that describe the content",
        "Internal links to related pages on your site",
        "Mobile-friendly responsive design"
      ] },
      { type: "tip", text: "Use tools like Google's Mobile-Friendly Test and PageSpeed Insights to optimize your pages before submission." },
      { type: "heading", level: 2, text: "Submitting via Web Interface" },
      { type: "paragraph", text: "The web interface provides the most user-friendly way to submit URLs, especially for beginners or occasional users. It offers real-time validation and immediate feedback." },
      { type: "steps", items: [
        "Log in to your GetIndexedNow account and navigate to the Dashboard",
        "Click on 'Tasks' in the left sidebar to access the task management area",
        "Click the 'New Submission' button to open the submission form",
        "Enter your URL in the input field, ensuring it includes the full protocol (https://example.com/page)",
        "Optionally add descriptive tags to help organize your submissions (e.g., 'blog-post', 'product-page', 'landing-page')",
        "Set the priority level: Normal (default), High (for urgent content), or Low (for less critical pages)",
        "Review your submission details and click 'Submit' to add the URL to your queue",
        "Monitor the submission status in real-time through the queue interface"
      ] },
      { type: "heading", level: 3, text: "Understanding the Submission Form" },
      { type: "paragraph", text: "The submission form includes several fields to help you organize and prioritize your submissions:" },
      { type: "list", items: [
        "URL Field: Enter the complete URL including protocol (http:// or https://)",
        "Tags: Add multiple tags separated by commas to categorize your submissions",
        "Priority: Choose from Normal, High, or Low priority levels",
        "Notes: Optional field for additional context or reminders"
      ] },
      { type: "note", text: "Tags are particularly useful for filtering and reporting. Use consistent naming conventions for better organization." },
      { type: "heading", level: 2, text: "Submitting via API" },
      { type: "paragraph", text: "For developers and power users, the API provides programmatic access to submit URLs. This is ideal for automated workflows, bulk submissions, or integration with existing systems." },
      { type: "heading", level: 3, text: "API Authentication" },
      { type: "paragraph", text: "First, you'll need to generate an API key from your account settings:" },
      { type: "steps", items: [
        "Go to User Settings → API Keys",
        "Click 'Generate New Key'",
        "Copy the generated key and store it securely",
        "Use this key in the Authorization header of your API requests"
      ] },
      { type: "warning", text: "Keep your API key secure and never expose it in client-side code or public repositories." },
      { type: "heading", level: 3, text: "Basic API Submission" },
      { type: "paragraph", text: "Here's a basic example of submitting a URL via API:" },
      { type: "code", language: "bash", code: "curl -X POST https://api.getindexednow.com/v1/submit \\\n  -H 'Authorization: Bearer YOUR_API_KEY_HERE' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"url\": \"https://example.com/page\",\n    \"priority\": \"normal\",\n    \"tags\": [\"blog\", \"tutorial\"]\n  }'" },
      { type: "heading", level: 3, text: "Advanced API Usage" },
      { type: "paragraph", text: "For more advanced scenarios, you can include additional parameters:" },
      { type: "code", language: "json", code: "{\n  \"url\": \"https://example.com/product-page\",\n  \"priority\": \"high\",\n  \"tags\": [\"product\", \"featured\"],\n  \"notes\": \"New product launch - urgent indexing needed\",\n  \"callback_url\": \"https://your-domain.com/webhook\"\n}" },
      { type: "heading", level: 3, text: "Error Handling" },
      { type: "paragraph", text: "The API returns structured responses that you should handle appropriately:" },
      { type: "code", language: "json", code: "{\n  \"success\": true,\n  \"task_id\": \"task_12345\",\n  \"status\": \"queued\",\n  \"message\": \"URL successfully queued for submission\"\n}" },
      { type: "paragraph", text: "For errors:" },
      { type: "code", language: "json", code: "{\n  \"success\": false,\n  \"error\": \"INVALID_URL\",\n  \"message\": \"The provided URL is not valid\",\n  \"details\": \"URL must be absolute and include protocol\"\n}" },
      { type: "heading", level: 2, text: "Monitoring Submission Status" },
      { type: "paragraph", text: "After submitting a URL, you can monitor its progress through various status indicators. Understanding these statuses helps you track the submission lifecycle." },
      { type: "heading", level: 3, text: "Status Types" },
      { type: "list", items: [
        "Queued: URL is waiting in the submission queue",
        "Processing: URL is being submitted to search engines",
        "Success: URL has been successfully submitted to all target search engines",
        "Failed: Submission encountered an error (check error details for resolution)",
        "Retrying: System is attempting to resubmit after a temporary failure"
      ] },
      { type: "heading", level: 3, text: "Checking Status via API" },
      { type: "paragraph", text: "You can check the status of a submission using the task ID returned from the submission API:" },
      { type: "code", language: "bash", code: "curl -H 'Authorization: Bearer YOUR_API_KEY_HERE' \\\n  https://api.getindexednow.com/v1/tasks/task_12345" },
      { type: "heading", level: 2, text: "Best Practices" },
      { type: "paragraph", text: "Following these best practices will help you maximize the success rate of your URL submissions and optimize your workflow." },
      { type: "heading", level: 3, text: "Submission Timing" },
      { type: "list", items: [
        "Submit URLs during off-peak hours for faster processing",
        "Avoid submitting the same URL multiple times in short periods",
        "Space out bulk submissions to avoid rate limiting",
        "Submit time-sensitive content immediately upon publication"
      ] },
      { type: "heading", level: 3, text: "URL Quality" },
      { type: "list", items: [
        "Ensure URLs are canonical (avoid duplicate content issues)",
        "Submit only publicly accessible pages",
        "Verify mobile-friendliness before submission",
        "Check that pages load quickly and without errors"
      ] },
      { type: "tip", text: "Use the URL validation tool in the web interface to check your URLs before submission. This can save time and credits by catching issues early." },
      { type: "heading", level: 2, text: "Troubleshooting Common Issues" },
      { type: "paragraph", text: "Even with proper preparation, you may encounter issues during submission. Here are common problems and their solutions." },
      { type: "heading", level: 3, text: "Validation Errors" },
      { type: "list", items: [
        "INVALID_URL: Ensure the URL is absolute and includes the protocol",
        "BLOCKED_BY_ROBOTS: Check your robots.txt file and meta robots tags",
        "HTTP_ERROR: Verify the page returns a 200 status code",
        "TIMEOUT: Check if the page loads within reasonable time limits"
      ] },
      { type: "heading", level: 3, text: "Rate Limiting" },
      { type: "paragraph", text: "If you encounter rate limiting:" },
      { type: "list", items: [
        "Reduce the frequency of submissions",
        "Upgrade your plan for higher rate limits",
        "Use bulk submission features for multiple URLs",
        "Contact support if you need temporary rate limit increases"
      ] },
      { type: "note", text: "Most rate limiting issues can be resolved by adjusting your submission patterns or upgrading your plan tier." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for how to submit your first url with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 3,
    slug: "understanding-your-dashboard",
    title: "Understanding Your Dashboard",
    description:
      "Navigate your dashboard and understand all the metrics and features available.",
    category: "getting-started",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Dashboard Overview" },
      { type: "paragraph", text: "The GetIndexedNow dashboard is your command center for monitoring and managing all your URL submission activities. It provides real-time insights into your account performance, submission status, and key metrics that help you optimize your indexing strategy." },
      { type: "paragraph", text: "The dashboard is designed to give you immediate visibility into your account health and submission performance, allowing you to make data-driven decisions about your indexing efforts." },
      { type: "heading", level: 2, text: "Key Dashboard Widgets" },
      { type: "paragraph", text: "Your dashboard contains several important widgets that provide different perspectives on your account activity. Understanding each widget helps you monitor your performance effectively." },
      { type: "heading", level: 3, text: "Credit Management Widget" },
      { type: "paragraph", text: "The credit management widget shows your current credit status and usage patterns:" },
      { type: "list", items: [
        "Remaining Credits: Shows how many credits you have left in the current billing cycle",
        "Consumed Credits: Displays how many credits you've used so far",
        "Usage Percentage: Visual indicator of your credit consumption",
        "Reset Date: Shows when your credits will be replenished"
      ] },
      { type: "tip", text: "Monitor your credit usage regularly to avoid running out during important submission periods. Consider upgrading your plan if you consistently use most of your credits." },
      { type: "heading", level: 3, text: "Submission Status Overview" },
      { type: "paragraph", text: "This widget provides a comprehensive view of your submission performance:" },
      { type: "list", items: [
        "Successful Submissions: Count of URLs successfully submitted to search engines",
        "Pending Submissions: URLs currently in the processing queue",
        "Failed Submissions: URLs that encountered errors during submission",
        "Success Rate: Percentage of successful submissions vs. total attempts"
      ] },
      { type: "note", text: "A high failure rate may indicate issues with your URLs or submission patterns. Review failed submissions regularly to identify and resolve problems." },
      { type: "heading", level: 3, text: "Recent Activity Feed" },
      { type: "paragraph", text: "The recent activity feed shows your latest submission activities in real-time:" },
      { type: "list", items: [
        "Latest Submissions: Shows the most recent URLs you've submitted",
        "Status Updates: Real-time updates on submission progress",
        "Error Notifications: Immediate alerts for failed submissions",
        "Timestamps: When each activity occurred"
      ] },
      { type: "heading", level: 3, text: "Top Domains Widget" },
      { type: "paragraph", text: "This widget helps you understand which domains are most active in your submissions:" },
      { type: "list", items: [
        "Domain List: Shows your most frequently submitted domains",
        "Submission Counts: Number of URLs submitted per domain",
        "Success Rates: Performance metrics for each domain",
        "Quick Access: Click to filter dashboard data by specific domains"
      ] },
      { type: "tip", text: "Use the top domains widget to identify your most active sites and focus your optimization efforts accordingly." },
      { type: "heading", level: 2, text: "Advanced Filtering and Search" },
      { type: "paragraph", text: "The dashboard includes powerful filtering capabilities that help you focus on specific data and identify patterns in your submission activities." },
      { type: "heading", level: 3, text: "Date Range Filtering" },
      { type: "paragraph", text: "Filter your dashboard data by specific time periods:" },
      { type: "list", items: [
        "Last 24 Hours: View only today's activities",
        "Last 7 Days: See activity from the past week",
        "Last 30 Days: Monthly overview of your performance",
        "Custom Range: Select specific start and end dates",
        "This Month: Current billing cycle data",
        "Last Month: Previous billing cycle for comparison"
      ] },
      { type: "heading", level: 3, text: "Domain Filtering" },
      { type: "paragraph", text: "Focus on specific domains or groups of domains:" },
      { type: "list", items: [
        "Single Domain: Filter to one specific domain",
        "Multiple Domains: Select several domains to compare",
        "All Domains: Remove domain filters to see all data",
        "Favorites: Quick access to your pinned domains"
      ] },
      { type: "heading", level: 3, text: "Status Filtering" },
      { type: "paragraph", text: "Filter by submission status to focus on specific outcomes:" },
      { type: "list", items: [
        "All Statuses: View all submissions regardless of status",
        "Successful Only: Focus on successful submissions",
        "Failed Only: Review and troubleshoot failed submissions",
        "Pending Only: Monitor submissions still in progress"
      ] },
      { type: "heading", level: 3, text: "Tag Filtering" },
      { type: "paragraph", text: "If you use tags to organize your submissions, you can filter by them:" },
      { type: "list", items: [
        "Single Tag: View all submissions with a specific tag",
        "Multiple Tags: Combine tags for more specific filtering",
        "No Tags: Show only untagged submissions"
      ] },
      { type: "note", text: "Filters persist across navigation during your session, so you can move between different sections while maintaining your filtered view." },
      { type: "heading", level: 2, text: "Dashboard Customization" },
      { type: "paragraph", text: "You can customize your dashboard experience to better suit your workflow and preferences." },
      { type: "heading", level: 3, text: "Widget Arrangement" },
      { type: "paragraph", text: "While the basic layout is fixed, you can customize how you interact with the dashboard:" },
      { type: "list", items: [
        "Expand Widgets: Click to expand widgets for more detailed views",
        "Collapse Widgets: Minimize widgets to focus on specific areas",
        "Refresh Data: Manually refresh dashboard data when needed"
      ] },
      { type: "heading", level: 3, text: "Favorites Management" },
      { type: "paragraph", text: "Pin your most important domains for quick access:" },
      { type: "steps", items: [
        "Find the domain in the Top Domains widget",
        "Click the star icon next to the domain name",
        "The domain will appear in your Favorites section",
        "Use the Favorites filter for quick access to these domains"
      ] },
      { type: "heading", level: 2, text: "Performance Metrics and Insights" },
      { type: "paragraph", text: "Beyond the basic widgets, your dashboard provides valuable insights into your submission performance and trends." },
      { type: "heading", level: 3, text: "Success Rate Analysis" },
      { type: "paragraph", text: "Monitor your overall success rate and identify trends:" },
      { type: "list", items: [
        "Daily Success Rate: Track performance over time",
        "Domain-Specific Rates: Identify which domains perform best",
        "Error Pattern Analysis: Spot recurring issues",
        "Seasonal Trends: Understand performance variations"
      ] },
      { type: "heading", level: 3, text: "Volume Analysis" },
      { type: "paragraph", text: "Understand your submission patterns and volume:" },
      { type: "list", items: [
        "Daily Submission Volume: Track your submission frequency",
        "Peak Usage Times: Identify when you submit most URLs",
        "Domain Distribution: See how submissions are spread across domains",
        "Growth Trends: Monitor increasing or decreasing usage"
      ] },
      { type: "tip", text: "Use volume analysis to optimize your submission timing and identify opportunities for bulk submissions." },
      { type: "heading", level: 2, text: "Dashboard Best Practices" },
      { type: "paragraph", text: "To get the most value from your dashboard, follow these best practices:" },
      { type: "heading", level: 3, text: "Regular Monitoring" },
      { type: "list", items: [
        "Check your dashboard daily to monitor submission status",
        "Review failed submissions weekly to identify patterns",
        "Monitor credit usage to avoid running out unexpectedly",
        "Track success rates monthly to measure performance improvements"
      ] },
      { type: "heading", level: 3, text: "Proactive Management" },
      { type: "list", items: [
        "Set up alerts for unusual activity or high failure rates",
        "Use filters to focus on specific campaigns or time periods",
        "Export data regularly for external analysis and reporting",
        "Share dashboard insights with your team for collaborative optimization"
      ] },
      { type: "heading", level: 3, text: "Troubleshooting" },
      { type: "list", items: [
        "Use the dashboard to identify and resolve submission issues quickly",
        "Filter by failed submissions to focus on problem URLs",
        "Check domain-specific performance to identify site-wide issues",
        "Monitor recent activity to catch problems early"
      ] },
      { type: "note", text: "The dashboard is your primary tool for monitoring and optimizing your GetIndexedNow usage. Regular review and analysis will help you maximize the value of your submissions." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for understanding your dashboard with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 4,
    slug: "managing-your-subscription",
    title: "Managing Your Subscription",
    description:
      "Learn how to upgrade, downgrade, or cancel your subscription.",
    category: "account-management",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Overview" },
      { type: "paragraph", text: "You can upgrade, downgrade, or cancel your plan at any time from the Plans & Billing section. Changes typically take effect at the start of your next billing cycle unless otherwise stated." },
      { type: "heading", level: 2, text: "Changing Plans" },
      { type: "steps", items: [
        "Go to Plans & Billing from the main navigation.",
        "Click Change Plan to open the plan selector.",
        "Compare tiers, monthly credits, and rate limits.",
        "Confirm your selection and review any proration details."
      ] },
      { type: "heading", level: 3, text: "Upgrade vs. Downgrade" },
      { type: "list", items: [
        "Upgrades: May apply immediately or at the next cycle depending on your plan. Proration may occur.",
        "Downgrades: Usually scheduled for the next billing cycle to avoid feature disruption."
      ] },
      { type: "heading", level: 3, text: "Proration" },
      { type: "paragraph", text: "When switching plans mid-cycle, charges may be prorated for the remaining period. Your invoice will reflect any credits or additional amounts due." },
      { type: "tip", text: "If you anticipate a usage spike, consider upgrading before high-traffic events to avoid rate limits." },
      { type: "heading", level: 2, text: "Canceling Your Subscription" },
      { type: "paragraph", text: "Cancellation takes effect at the end of your current billing cycle. You retain access until the cycle ends, and can re-activate later without losing account data." },
      { type: "steps", items: [
        "Open Plans & Billing.",
        "Click Cancel Subscription.",
        "Provide optional feedback and confirm."
      ] },
      { type: "warning", text: "After cancellation, submissions may be blocked once remaining credits are consumed. API access will be disabled at term end." },
      { type: "heading", level: 2, text: "Reactivation" },
      { type: "paragraph", text: "You can re-activate from Plans & Billing at any time. Choose a plan and resume usage immediately or at the next cycle depending on the plan rules." },
      { type: "heading", level: 2, text: "Roles & Permissions" },
      { type: "list", items: [
        "Only Owners/Admins can change plans and cancel subscriptions.",
        "Editors and Members cannot access billing changes."
      ] },
      { type: "note", text: "Invoices and historical usage remain available for your records even if you cancel." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for managing your subscription with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 5,
    slug: "updating-billing-information",
    title: "Updating Billing Information",
    description:
      "Step-by-step instructions for updating your payment methods and billing details.",
    category: "account-management",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Payment Methods" },
      { type: "steps", items: [
        "Open Plans & Billing → Payment Methods.",
        "Click Add Payment Method and enter your card details.",
        "Set a default card for future renewals.",
        "Remove expired cards to prevent charge failures."
      ] },
      { type: "note", text: "We use PCI-compliant providers. Card details are tokenized and not stored on our servers." },
      { type: "heading", level: 2, text: "Billing Address & Tax Information" },
      { type: "steps", items: [
        "Go to Plans & Billing → Billing Details.",
        "Update company name, billing address, and contact email.",
        "Enter VAT/GST or tax ID if applicable for your region.",
        "Save changes and verify on your next invoice."
      ] },
      { type: "tip", text: "Ensure the billing address matches bank records to reduce payment declines." },
      { type: "heading", level: 2, text: "Invoices & Receipts" },
      { type: "steps", items: [
        "Open Plans & Billing → Invoices.",
        "Click any invoice to view details and download PDF.",
        "Set a billing email alias (e.g., billing@yourcompany.com) to auto-forward receipts."
      ] },
      { type: "heading", level: 2, text: "Payment Failures" },
      { type: "list", items: [
        "If a renewal fails, we will retry automatically over several days.",
        "Update your card or contact your bank to lift restrictions.",
        "Service limitations may apply until payment is resolved."
      ] },
      { type: "warning", text: "Multiple failed charges may temporarily limit submissions and API access until payment is completed." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for updating billing information with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 6,
    slug: "understanding-credit-usage",
    title: "Understanding Credit Usage",
    description: "Learn how credits are consumed for different operations.",
    category: "account-management",
    type: "video",
    content: [
      { type: "heading", level: 2, text: "Credit Model" },
      { type: "paragraph", text: "Credits represent the unit cost of submitting URLs for indexing. In most plans, each successfully queued URL consumes one credit." },
      { type: "heading", level: 3, text: "What Consumes Credits" },
      { type: "list", items: [
        "Single URL submissions accepted into the queue.",
        "Bulk submissions: one credit per valid row submitted.",
        "API-triggered submissions that pass validation."
      ] },
      { type: "heading", level: 3, text: "What Does Not Consume Credits" },
      { type: "list", items: [
        "Validation failures prior to queueing (e.g., invalid URL).",
        "Automatic retries due to transient platform errors.",
        "Viewing reports, exports, and dashboard analytics."
      ] },
      { type: "heading", level: 3, text: "Discounts & Bulk Efficiency" },
      { type: "paragraph", text: "Certain plans may include discounted credit usage for large batches or monthly volume commitments. Check your plan details for specifics." },
      { type: "heading", level: 2, text: "Monitoring Credits" },
      { type: "steps", items: [
        "Check remaining and consumed credits on your Dashboard.",
        "Open Reports → Usage to view historical consumption by day and domain.",
        "Set alerts to notify you when remaining credits drop below custom thresholds."
      ] },
      { type: "heading", level: 2, text: "Rollover & Expiration" },
      { type: "paragraph", text: "Standard plans reset credits at the start of each billing cycle with no rollover. Some premium plans may include partial rollover of unused credits—review your plan for exact terms." },
      { type: "heading", level: 2, text: "Best Practices" },
      { type: "list", items: [
        "Group submissions into thoughtful batches to reduce overhead.",
        "Validate URLs ahead of time to avoid wasting attempts.",
        "Schedule large submissions during off-peak hours for faster throughput."
      ] },
      { type: "note", text: "If you frequently exhaust credits, consider upgrading your plan or purchasing add-on credits if available." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for understanding credit usage with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 7,
    slug: "bulk-url-submission-guide",
    title: "Bulk URL Submission Guide",
    description:
      "Learn how to efficiently submit multiple URLs at once using our bulk tools.",
    category: "features",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "What is Bulk Submission?" },
      { type: "paragraph", text: "Bulk URL submission allows you to submit hundreds or thousands of URLs simultaneously, making it ideal for large websites, content migrations, or when you need to index multiple pages quickly. This feature is especially valuable for e-commerce sites, news websites, or any platform with extensive content catalogs." },
      { type: "paragraph", text: "Unlike individual submissions, bulk uploads provide batch processing, comprehensive validation, and detailed reporting on the entire submission set. This approach is more efficient and cost-effective for large-scale indexing needs." },
      { type: "heading", level: 2, text: "Preparing Your Data" },
      { type: "paragraph", text: "Proper preparation of your URL data is crucial for successful bulk submissions. Taking time to organize and validate your data upfront will save time and reduce errors during the submission process." },
      { type: "heading", level: 3, text: "Data Collection" },
      { type: "paragraph", text: "Before creating your CSV file, gather all the URLs you want to submit:" },
      { type: "list", items: [
        "Export URLs from your content management system",
        "Extract URLs from your sitemap files",
        "Compile URLs from your analytics platform",
        "Create a list of manually identified important pages"
      ] },
      { type: "heading", level: 3, text: "Data Validation" },
      { type: "paragraph", text: "Validate your URLs before submission to ensure they meet our requirements:" },
      { type: "list", items: [
        "Ensure all URLs are absolute (include http:// or https://)",
        "Verify URLs return 200 status codes",
        "Check that URLs are not blocked by robots.txt",
        "Confirm URLs are publicly accessible",
        "Remove any duplicate URLs from your list"
      ] },
      { type: "tip", text: "Use online URL validators or browser developer tools to test a sample of your URLs before bulk submission." },
      { type: "heading", level: 2, text: "CSV File Format" },
      { type: "paragraph", text: "GetIndexedNow uses a simple CSV format for bulk submissions. The file should contain specific columns to provide all necessary information for each URL." },
      { type: "heading", level: 3, text: "Required Columns" },
      { type: "paragraph", text: "Your CSV file must include these essential columns:" },
      { type: "list", items: [
        "url: The complete URL including protocol (required)",
        "domain: The domain name for organizational purposes (optional but recommended)"
      ] },
      { type: "heading", level: 3, text: "Optional Columns" },
      { type: "paragraph", text: "You can enhance your submissions with additional metadata:" },
      { type: "list", items: [
        "tags: Comma-separated tags for categorization",
        "priority: Submission priority (normal, high, low)",
        "notes: Additional context or reminders"
      ] },
      { type: "heading", level: 3, text: "CSV Example" },
      { type: "paragraph", text: "Here's an example of a properly formatted CSV file:" },
      { type: "code", language: "csv", code: "url,domain,tags,priority,notes\nhttps://example.com/blog-post-1,example.com,blog,normal,Featured article\nhttps://example.com/product-page,example.com,product,high,New product launch\nhttps://example.com/about-us,example.com,about,normal,Company information\nhttps://example.com/contact,example.com,contact,normal,Contact page" },
      { type: "heading", level: 3, text: "CSV Best Practices" },
      { type: "list", items: [
        "Use UTF-8 encoding to handle special characters",
        "Include a header row with column names",
        "Use commas to separate values",
        "Enclose values in quotes if they contain commas",
        "Keep file sizes manageable (5,000-10,000 rows per file)",
        "Use consistent formatting throughout the file"
      ] },
      { type: "warning", text: "Large CSV files (over 50,000 rows) may take longer to process and validate. Consider splitting very large files into smaller chunks." },
      { type: "heading", level: 2, text: "Uploading Your CSV File" },
      { type: "paragraph", text: "The upload process includes validation and preview steps to ensure your data is ready for submission." },
      { type: "steps", items: [
        "Navigate to the Tasks section in your GetIndexedNow dashboard",
        "Click on 'Bulk Upload' to access the bulk submission interface",
        "Click 'Choose File' and select your prepared CSV file",
        "Review the file information displayed (row count, file size, etc.)",
        "Click 'Upload and Validate' to begin the validation process"
      ] },
      { type: "heading", level: 3, text: "Validation Process" },
      { type: "paragraph", text: "During validation, our system checks each URL for common issues:" },
      { type: "list", items: [
        "URL Format: Ensures URLs are properly formatted and absolute",
        "Accessibility: Verifies URLs are publicly accessible",
        "Status Codes: Checks that URLs return appropriate HTTP status codes",
        "Robots.txt: Confirms URLs are not blocked by robots.txt",
        "Duplicates: Identifies duplicate URLs within your file"
      ] },
      { type: "heading", level: 3, text: "Validation Results" },
      { type: "paragraph", text: "After validation, you'll see a summary of your results:" },
      { type: "list", items: [
        "Valid URLs: Number of URLs ready for submission",
        "Invalid URLs: Number of URLs with issues that need fixing",
        "Duplicates: Number of duplicate URLs found",
        "Total Rows: Total number of rows in your CSV file"
      ] },
      { type: "note", text: "Only valid URLs will be submitted. Invalid URLs will be listed separately for your review and correction." },
      { type: "heading", level: 2, text: "Reviewing and Fixing Issues" },
      { type: "paragraph", text: "If validation finds issues with some URLs, you'll have the opportunity to review and fix them before proceeding with the submission." },
      { type: "heading", level: 3, text: "Common Validation Errors" },
      { type: "list", items: [
        "INVALID_URL_FORMAT: URL is not properly formatted",
        "HTTP_ERROR: URL returns an error status code",
        "BLOCKED_BY_ROBOTS: URL is blocked by robots.txt",
        "TIMEOUT: URL takes too long to respond",
        "DUPLICATE_URL: URL appears multiple times in the file"
      ] },
      { type: "heading", level: 3, text: "Fixing Issues" },
      { type: "paragraph", text: "For each error type, you can take appropriate action:" },
      { type: "list", items: [
        "Correct URL formatting issues in your CSV file",
        "Remove or fix URLs that return errors",
        "Update robots.txt to allow access to blocked URLs",
        "Remove duplicate entries from your file",
        "Re-upload the corrected CSV file"
      ] },
      { type: "tip", text: "Use the validation results to identify patterns in your data issues. This can help you improve your data collection process for future bulk submissions." },
      { type: "heading", level: 2, text: "Submitting Your Batch" },
      { type: "paragraph", text: "Once validation is complete and you're satisfied with the results, you can proceed with the bulk submission." },
      { type: "steps", items: [
        "Review the validation summary to confirm the number of valid URLs",
        "Check that the estimated credit usage is within your available balance",
        "Click 'Submit Batch' to begin the submission process",
        "Monitor the submission progress in real-time",
        "Review the final submission report"
      ] },
      { type: "heading", level: 3, text: "Submission Progress" },
      { type: "paragraph", text: "During submission, you can monitor progress through several indicators:" },
      { type: "list", items: [
        "Progress Bar: Shows overall submission completion percentage",
        "Status Counts: Real-time counts of successful, failed, and pending submissions",
        "Processing Speed: Number of URLs processed per minute",
        "Estimated Completion: Time remaining until all URLs are processed"
      ] },
      { type: "heading", level: 3, text: "Credit Consumption" },
      { type: "paragraph", text: "Credits are consumed as URLs are successfully submitted:" },
      { type: "list", items: [
        "One credit per successfully submitted URL",
        "Failed submissions do not consume credits",
        "Credits are deducted in real-time as submissions complete",
        "You can monitor credit usage during the submission process"
      ] },
      { type: "warning", text: "Ensure you have sufficient credits before starting a large bulk submission. The system will stop processing if you run out of credits." },
      { type: "heading", level: 2, text: "Monitoring and Reporting" },
      { type: "paragraph", text: "After submission, you can track the performance of your bulk submission through various monitoring tools." },
      { type: "heading", level: 3, text: "Submission Report" },
      { type: "paragraph", text: "A comprehensive report is generated after bulk submission completion:" },
      { type: "list", items: [
        "Total URLs Submitted: Number of URLs successfully queued",
        "Success Rate: Percentage of URLs successfully submitted",
        "Failed Submissions: List of URLs that encountered errors",
        "Processing Time: Total time taken to process all URLs",
        "Credit Usage: Total credits consumed during submission"
      ] },
      { type: "heading", level: 3, text: "Ongoing Monitoring" },
      { type: "paragraph", text: "Track the status of your bulk submissions over time:" },
      { type: "list", items: [
        "Use the Tasks section to view individual submission status",
        "Filter by submission date to focus on your bulk submission",
        "Monitor success rates and identify any patterns in failures",
        "Export data for external analysis and reporting"
      ] },
      { type: "heading", level: 2, text: "Best Practices for Bulk Submissions" },
      { type: "paragraph", text: "Following these best practices will help you maximize the success of your bulk submissions and optimize your workflow." },
      { type: "heading", level: 3, text: "File Organization" },
      { type: "list", items: [
        "Split large datasets into manageable files (5,000-10,000 URLs per file)",
        "Use descriptive filenames that include date and content type",
        "Keep backup copies of your original CSV files",
        "Organize files by domain, content type, or submission priority"
      ] },
      { type: "heading", level: 3, text: "Timing and Scheduling" },
      { type: "list", items: [
        "Submit during off-peak hours for faster processing",
        "Avoid submitting the same URLs multiple times in short periods",
        "Space out large bulk submissions to avoid overwhelming the system",
        "Consider the timing of your content updates when scheduling submissions"
      ] },
      { type: "heading", level: 3, text: "Quality Control" },
      { type: "list", items: [
        "Always validate your URLs before bulk submission",
        "Use consistent tagging conventions for better organization",
        "Review failed submissions to identify and fix recurring issues",
        "Monitor success rates to optimize your submission strategy"
      ] },
      { type: "tip", text: "Start with smaller bulk submissions to familiarize yourself with the process before scaling up to larger datasets." },
      { type: "heading", level: 2, text: "Troubleshooting Bulk Submissions" },
      { type: "paragraph", text: "Even with proper preparation, you may encounter issues during bulk submissions. Here are common problems and solutions." },
      { type: "heading", level: 3, text: "Common Issues" },
      { type: "list", items: [
        "File Upload Errors: Check file format and size limits",
        "Validation Failures: Review and fix URL issues before resubmitting",
        "Processing Delays: Large files may take longer to process",
        "Credit Shortages: Ensure sufficient credits before starting"
      ] },
      { type: "heading", level: 3, text: "Solutions" },
      { type: "list", items: [
        "Verify CSV format and encoding before upload",
        "Fix validation errors and re-upload corrected files",
        "Split large files into smaller chunks for faster processing",
        "Monitor credit usage and upgrade your plan if needed"
      ] },
      { type: "note", text: "If you encounter persistent issues with bulk submissions, contact our support team for assistance. We can help optimize your submission process and resolve technical problems." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for bulk url submission guide with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 8,
    slug: "setting-up-api-integration",
    title: "Setting Up API Integration",
    description:
      "Technical guide for developers to integrate our API with your systems.",
    category: "features",
    type: "tutorial",
    content: [
      { type: "heading", level: 2, text: "Create API Key" },
      { type: "steps", items: ["Open User Settings → API Keys.","Generate a new key and copy securely."] },
      { type: "heading", level: 3, text: "Submit Endpoint" },
      { type: "code", language: "bash", code: "curl -X POST https://api.getindexednow.com/v1/submit \\\n  -H 'Authorization: Bearer <API_KEY>' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n  \"url\": \"https://example.com\",\n  \"priority\": \"normal\"\n}'" },
      { type: "tip", text: "Use exponential backoff when polling task status." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for setting up api integration with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 9,
    slug: "advanced-indexing-strategies",
    title: "Advanced Indexing Strategies",
    description:
      "Advanced techniques for optimizing your indexing success rate.",
    category: "features",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Technical Foundations" },
      { type: "list", items: [
        "Fast Responses: Target <300ms TTFB and <2.5s LCP for critical pages.",
        "Canonicalization: Use <link rel=\"canonical\"> consistently to avoid duplicates.",
        "Structured Data: Implement JSON-LD for articles, products, FAQs, breadcrumbs.",
        "HTTP Hygiene: Prefer HTTPS, avoid redirect chains, ensure 200 for key pages."
      ] },
      { type: "heading", level: 3, text: "Crawl Budget Management" },
      { type: "paragraph", text: "Large sites must optimize for efficient crawling so important URLs are discovered and processed first." },
      { type: "list", items: [
        "Sitemaps: Split into topical or freshness-based shards; keep <50k URLs or 50MB.",
        "Priority Feeds: Maintain a 'fresh content' sitemap to surface new/updated pages.",
        "Internal Linking: Link from high-authority pages to fresh or deep content.",
        "Thin/Low-Value Pages: Noindex or consolidate to reduce crawl waste."
      ] },
      { type: "heading", level: 3, text: "Content Strategy" },
      { type: "list", items: [
        "Topical Clusters: Build pillar pages with supporting cluster content.",
        "E-E-A-T Signals: Show expertise via author bios, citations, and transparency pages.",
        "Freshness: Update evergreen content periodically; add lastmod where relevant.",
        "Media Optimization: Provide alt text, captions, and optimized images/videos."
      ] },
      { type: "heading", level: 3, text: "Log & Metrics Analysis" },
      { type: "paragraph", text: "Use server logs and analytics to monitor crawler behavior, indexation, and performance." },
      { type: "list", items: [
        "Identify Crawl Traps: Infinite calendars/facets; add rules to prevent loops.",
        "Error Monitoring: Track 4xx/5xx spikes by URL pattern and fix promptly.",
        "Render Parity: Ensure client-side rendering exposes key content to crawlers.",
        "Measure Impact: Correlate submissions with impressions/clicks over time."
      ] },
      { type: "tip", text: "Link new or updated content from pages with strong internal or external authority to accelerate discovery." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for advanced indexing strategies with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 10,
    slug: "troubleshooting-failed-submissions",
    title: "Troubleshooting Failed Submissions",
    description:
      "Common reasons for submission failures and how to fix them.",
    category: "troubleshooting",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Diagnosis Checklist" },
      { type: "steps", items: [
        "Validate URL format (absolute, http/https, no spaces).",
        "Fetch the URL as an anonymous user; confirm HTTP 200.",
        "Check robots.txt and meta robots for disallow/noindex.",
        "Inspect TLS/redirects; avoid loops and mixed content.",
        "Review server logs for 4xx/5xx or timeouts."
      ] },
      { type: "heading", level: 3, text: "Frequent Failure Reasons" },
      { type: "list", items: [
        "INVALID_URL: Malformed or relative URL.",
        "HTTP_ERROR: Target returns 4xx/5xx; fix upstream causes.",
        "BLOCKED_BY_ROBOTS: robots.txt or meta robots prevents access.",
        "TIMEOUT: Slow responses; optimize backend or CDN caching.",
        "RATE_LIMITED: Too many submissions in a short window."
      ] },
      { type: "heading", level: 3, text: "Fix by Category" },
      { type: "paragraph", text: "Apply targeted remedies based on the detected failure category." },
      { type: "list", items: [
        "URL Issues: Ensure absolute URL, correct scheme, and proper encoding.",
        "Server Errors: Stabilize application, add caching, fix upstream dependencies.",
        "Robots: Update robots.txt and meta robots to allow crawling of target paths.",
        "Performance: Reduce TTFB and payloads; use compression and CDNs.",
        "Rate Limits: Stagger submissions, add jitter, or upgrade your plan."
      ] },
      { type: "heading", level: 3, text: "Tools" },
      { type: "list", items: [
        "URL Validator: Built-in checker in Tasks → New Submission.",
        "cURL/Wget: Test headers, redirects, and TLS.",
        "Lighthouse/WebPageTest: Diagnose performance bottlenecks.",
        "Server Logs/APM: Correlate failures with infrastructure events."
      ] },
      { type: "heading", level: 2, text: "Prevention" },
      { type: "list", items: [
        "Automated tests to catch 4xx/5xx after deploys.",
        "SLOs for TTFB and uptime; alert on regressions.",
        "Content checks to avoid orphaned/blocked important pages.",
        "Rate-aware batching to respect plan and platform limits."
      ] },
      { type: "note", text: "If failures persist, include timestamps and request IDs when contacting support for faster resolution." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for troubleshooting failed submissions with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 11,
    slug: "resolving-account-access-issues",
    title: "Resolving Account Access Issues",
    description: "Steps to take if you're having trouble accessing your account.",
    category: "troubleshooting",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Password Issues" },
      { type: "steps", items: [
        "Use the Forgot Password link on the sign-in page.",
        "Check your inbox (and spam) for the reset email.",
        "Choose a strong, unique password and complete reset."
      ] },
      { type: "heading", level: 2, text: "Two-Factor Authentication (2FA)" },
      { type: "paragraph", text: "Time-based one-time passwords (TOTP) require your device clock to be accurate." },
      { type: "list", items: [
        "Ensure your phone and computer use automatic time sync.",
        "Try backup codes provided during 2FA setup.",
        "If you rotated secrets, re-scan the QR code in your authenticator app."
      ] },
      { type: "heading", level: 3, text: "Lost 2FA Device" },
      { type: "steps", items: [
        "Attempt login with a backup code.",
        "If unavailable, contact support and verify identity (billing email, recent invoice details).",
        "Request 2FA reset; we will confirm ownership before disabling."
      ] },
      { type: "heading", level: 2, text: "Email/Account Lock" },
      { type: "paragraph", text: "Too many failed attempts may temporarily lock your account as a security precaution." },
      { type: "list", items: [
        "Wait 15 minutes before retrying.",
        "Reset your password to clear potential credential issues.",
        "Contact support if the lock persists or you suspect compromise."
      ] },
      { type: "heading", level: 2, text: "Security Best Practices" },
      { type: "list", items: [
        "Enable 2FA and store backup codes securely.",
        "Use a password manager for unique, strong passwords.",
        "Review active sessions and revoke suspicious devices from settings."
      ] },
      { type: "note", text: "For urgent access issues related to billing or service continuity, reference your last invoice ID to expedite support verification." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for resolving account access issues with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 12,
    slug: "understanding-error-messages",
    title: "Understanding Error Messages",
    description:
      "Detailed explanations of common error messages and how to resolve them.",
    category: "troubleshooting",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "How to Read Error Responses" },
      { type: "paragraph", text: "Our platform returns structured errors that include a code, human-readable message, and sometimes a request ID for tracing. Use the code to determine the category and follow the recommended fix." },
      { type: "heading", level: 3, text: "Common Error Codes" },
      { type: "list", items: [
        "INVALID_URL: The provided URL is malformed, relative, or missing protocol.",
        "AUTH_REQUIRED: Missing or invalid authentication token.",
        "FORBIDDEN: Your plan or role does not allow this action.",
        "RATE_LIMITED: You exceeded your request rate; slow down and retry later.",
        "HTTP_ERROR: The target URL returned a 4xx/5xx response.",
        "BLOCKED_BY_ROBOTS: robots.txt or meta robots prevents crawling.",
        "TIMEOUT: The URL took too long to respond and was aborted."
      ] },
      { type: "heading", level: 3, text: "Fix by Error Code" },
      { type: "list", items: [
        "INVALID_URL → Ensure absolute URL (https://example.com/page) and proper encoding.",
        "AUTH_REQUIRED → Re-authenticate; include a valid token in Authorization header.",
        "FORBIDDEN → Verify plan/role permissions or contact your workspace admin.",
        "RATE_LIMITED → Add client backoff, reduce bursts, consider plan upgrade.",
        "HTTP_ERROR → Fix upstream app errors; confirm stable 200 responses.",
        "BLOCKED_BY_ROBOTS → Update robots.txt/meta tags to allow crawling of the path.",
        "TIMEOUT → Improve TTFB via caching/CDN and reduce payload size."
      ] },
      { type: "heading", level: 2, text: "Request IDs & Support" },
      { type: "paragraph", text: "Include the request ID and timestamp when contacting support. This accelerates log tracing and resolution." },
      { type: "note", text: "Copy the error banner details or API response body that contains the request ID." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for understanding error messages with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 13,
    slug: "interpreting-your-indexing-reports",
    title: "Interpreting Your Indexing Reports",
    description:
      "How to read and gain insights from your indexing performance reports.",
    category: "reports",
    type: "video",
    content: [
      { type: "heading", level: 2, text: "Overview" },
      { type: "paragraph", text: "Reports aggregate submission outcomes, latency, and usage to help you monitor performance and uncover optimization opportunities." },
      { type: "heading", level: 2, text: "Key Metrics" },
      { type: "list", items: [
        "Success Rate: Share of submissions that complete successfully.",
        "Processing Latency: Time from queue to completion.",
        "Failures by Reason: Distribution across error categories.",
        "Volume by Domain/Tag: Concentration by property or campaign.",
        "Credit Usage: Consumption over time for budgeting."
      ] },
      { type: "heading", level: 2, text: "Segmentation & Filters" },
      { type: "paragraph", text: "Slice reports by domain, tag, date range, and status to compare cohorts and campaigns." },
      { type: "list", items: [
        "Domains: Contrast performance across your sites.",
        "Tags: Evaluate initiatives (e.g., blog vs. product).",
        "Time: Identify seasonal spikes and anomalies.",
        "Status: Focus on failures to drive remediation."
      ] },
      { type: "heading", level: 2, text: "Interpreting Trends" },
      { type: "list", items: [
        "Failure Spikes → Check recent deploys, robots.txt changes, DNS/TLS issues.",
        "Latency Drift → Investigate backend performance or rate limiting.",
        "Volume Surges → Correlate with launches/PR; ensure credits suffice.",
        "Credit Burn → Adjust pacing or upgrade to maintain throughput."
      ] },
      { type: "heading", level: 2, text: "Next Actions" },
      { type: "list", items: [
        "Prioritize top failure categories by impact.",
        "Schedule submissions during low-latency windows.",
        "Improve structured data and internal linking.",
        "Align credit budgets with high-ROI campaigns."
      ] },
      { type: "tip", text: "Save filtered views and export regularly to track KPIs with your stakeholders." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for interpreting your indexing reports with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 14,
    slug: "exporting-and-sharing-reports",
    title: "Exporting and Sharing Reports",
    description:
      "Learn how to export reports in different formats and share them with your team.",
    category: "reports",
    type: "guide",
    content: [
      { type: "heading", level: 2, text: "Export Formats" },
      { type: "list", items: [
        "CSV: Raw data for spreadsheets and BI tools.",
        "PDF: Presentation-ready summaries for sharing.",
        "JSON (API): For automation via your pipelines."
      ] },
      { type: "heading", level: 2, text: "Exporting a Report" },
      { type: "steps", items: [
        "Open Reports and set filters (date range, domains, tags, status).",
        "Click Export and select CSV or PDF.",
        "Confirm scope and download or send via email."
      ] },
      { type: "heading", level: 2, text: "Scheduling & Sharing" },
      { type: "steps", items: [
        "Go to Reports → Schedules.",
        "Create a schedule (daily/weekly/monthly).",
        "Add recipients and choose format (CSV/PDF).",
        "Save to start automated delivery."
      ] },
      { type: "heading", level: 2, text: "API Exports" },
      { type: "paragraph", text: "Use the API for programmatic exports to your data lake or dashboards." },
      { type: "code", language: "bash", code: "curl -H 'Authorization: Bearer <API_KEY>' 'https://api.getindexednow.com/v1/reports?from=2025-01-01&to=2025-01-31&format=csv' -o report.csv" },
      { type: "heading", level: 2, text: "Best Practices" },
      { type: "list", items: [
        "Exports reflect current filters—save presets for consistency.",
        "Use descriptive filenames with date ranges.",
        "Share only with relevant stakeholders to reduce noise."
      ] },
      { type: "note", text: "Large exports may be delivered via email with a secure download link for performance." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for exporting and sharing reports with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 15,
    slug: "setting-up-custom-report-alerts",
    title: "Setting Up Custom Report Alerts",
    description:
      "Configure automated alerts based on your indexing performance metrics.",
    category: "reports",
    type: "guide",
    content: [
      { type: "steps", items: [
        "Go to Reports → Alerts.",
        "Create thresholds for failure rate and latency.",
        "Choose destinations: email, webhook, Slack."
      ] }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for setting up custom report alerts with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 16,
    slug: "understanding-your-invoice",
    title: "Understanding Your Invoice",
    description:
      "A guide to reading and understanding your monthly invoice details.",
    category: "payments",
    type: "guide",
    content: [
      { type: "paragraph", text: "Invoices include subscription charges, taxes, adjustments, and proration when applicable." },
      { type: "tip", text: "Download PDF invoices from Plans & Billing → Invoices." }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for understanding your invoice with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 17,
    slug: "managing-payment-methods",
    title: "Managing Payment Methods",
    description: "How to add, update, or remove payment methods from your account.",
    category: "payments",
    type: "guide",
    content: [
      { type: "steps", items: [
        "Navigate to Plans & Billing → Payment Methods.",
        "Add a card and set as default.",
        "Remove stale cards to prevent declines."
      ] }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for managing payment methods with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  },
{
    id: 18,
    slug: "subscription-plan-comparison",
    title: "Subscription Plan Comparison",
    description:
      "Detailed comparison of different subscription plans and their features.",
    category: "payments",
    type: "guide",
    content: [
      { type: "paragraph", text: "Plans differ by monthly credits, concurrency, API rate limits, and support SLAs." },
      { type: "list", ordered: true, items: [
        "Basic: Best for testing and low volume.",
        "Pro: Balanced credits and features for growing teams.",
        "Business: High throughput and priority support."
      ] }
    
      ,{ type: "heading", level: 2, text: "Who Is This Guide For?" }
      ,{ type: "paragraph", text: "This guide is ideal for marketers, SEO specialists, founders, and developers who want a reliable, repeatable process for subscription plan comparison with minimal friction." }
      ,{ type: "heading", level: 2, text: "Prerequisites" }
      ,{ type: "list", items: [
        "An active GetIndexedNow account",
        "A modern web browser (Chrome, Edge, Firefox, Safari)",
        "Owner or editor access to your website or CMS",
        "Basic familiarity with URLs and sitemaps"
      ] }
      ,{ type: "heading", level: 2, text: "Detailed Steps" }
      ,{ type: "steps", items: [
        "Open your GetIndexedNow dashboard and verify your project/website is selected.",
        "Navigate to the relevant module for this task (Dashboard, URL Submitter, Sitemaps, or API).",
        "Complete the input fields carefully—double‑check domain, protocol (http/https), and trailing slashes.",
        "Click the primary action (Submit / Validate / Sync) and wait for a confirmation response.",
        "Review status badges, logs, or activity feed to confirm successful processing.",
        "If you see warnings, use the Troubleshooting section below to resolve them immediately.",
        "Document your process so your team can repeat it consistently."
      ] }
      ,{ type: "heading", level: 2, text: "Best Practices" }
      ,{ type: "list", items: [
        "Keep URLs clean, canonical, and accessible (no login walls for public pages).",
        "Use concise, descriptive titles and meta descriptions for faster search understanding.",
        "Batch similar actions (e.g., submit a set of new pages together).",
        "Avoid resubmitting unchanged URLs too frequently to prevent throttling.",
        "Maintain a changelog of edits and submissions to support audits."
      ] }
      ,{ type: "heading", level: 2, text: "Troubleshooting" }
      ,{ type: "list", items: [
        "403/401 errors: The destination blocks automated access—confirm robots and firewall settings.",
        "404/410 errors: The URL doesn’t exist—fix the path or update internal links.",
        "5xx errors: The site/server is unstable—retry after stabilizing hosting or CDN settings.",
        "Mixed content: Ensure all assets load over HTTPS to avoid blocked indexing.",
        "Slow responses: Optimize server performance or use a CDN to reduce TTFB."
      ] }
      ,{ type: "heading", level: 2, text: "FAQs" }
      ,{ type: "list", items: [
        "How long does indexing take? It varies by search engine, crawl budget, and site authority. Many see results within hours to days.",
        "Can I undo a submission? No, but you can update or remove the page and submit changes.",
        "Is there a daily limit? Rate limits may apply—batch and prioritize important URLs."
      ] }
      ,{ type: "heading", level: 2, text: "Glossary" }
      ,{ type: "list", items: [
        "Canonical URL: The preferred version of a page for indexing.",
        "Crawl Budget: The number of pages a crawler is willing to fetch on your site.",
        "Sitemap: A machine‑readable file listing URLs for discovery."
      ] }
      ,{ type: "note", text: "Tip: Bookmark this guide and share it with your team. Consistency beats intensity for long‑term indexing success." }
    ],
  }];

export const helpResources: HelpResource[] = [
  {
    slug: "user-guide",
    title: "User Guide",
    description:
      "Complete documentation for using all features of our platform.",
    content: [
      { type: "heading", level: 2, text: "Getting Started" },
      { type: "steps", items: [
        "Create your account and verify your email.",
        "Complete profile and security (enable 2FA).",
        "Explore the Dashboard and key widgets."
      ] },
      { type: "heading", level: 2, text: "Navigation Overview" },
      { type: "list", items: [
        "Dashboard: Overview of credits, status, and recent activity.",
        "Tasks: New Submission, Bulk Upload, Queue, and Task Details.",
        "Reports: Performance metrics, exports, and schedules.",
        "Plans & Billing: Subscription, invoices, payment methods.",
        "Settings: Profile, API keys, notifications, 2FA."
      ] },
      { type: "heading", level: 2, text: "Submitting URLs" },
      { type: "steps", items: [
        "Go to Tasks → New Submission.",
        "Paste the full URL and add tags/priority.",
        "Submit and track progress in the queue."
      ] },
      { type: "tip", text: "Use tags (e.g., blog, product) for powerful filtering in Reports." },
      { type: "heading", level: 2, text: "Bulk Uploads" },
      { type: "paragraph", text: "Upload a CSV for large batches with validation, progress monitoring, and reporting." },
      { type: "code", language: "csv", code: "url,domain,tags\nhttps://example.com/a,example.com,blog\nhttps://example.com/b,example.com,product" },
      { type: "heading", level: 2, text: "Reports & Insights" },
      { type: "list", items: [
        "Track success rate, latency, failures by reason.",
        "Segment by domain, tag, date range, and status.",
        "Export CSV/PDF and schedule recurring reports."
      ] },
      { type: "heading", level: 2, text: "Account & Billing" },
      { type: "steps", items: [
        "Change plans and review proration details.",
        "Manage payment methods and billing address.",
        "Download invoices and set billing email alias."
      ] },
      { type: "heading", level: 2, text: "Security" },
      { type: "list", items: [
        "Enable 2FA and store backup codes securely.",
        "Rotate API keys regularly and use a secrets manager.",
        "Review active sessions and revoke suspicious devices."
      ] },
      { type: "heading", level: 2, text: "FAQ Quick Answers" },
      { type: "list", items: [
        "Why did a submission fail? Check robots.txt, HTTP status, and URL format.",
        "How do I increase throughput? Upgrade plan or schedule off-peak.",
        "Can I automate? Yes—use API keys and webhooks."
      ] }
    ],
  },
  {
    slug: "api-documentation",
    title: "API Documentation",
    description:
      "Technical documentation for developers integrating with our API.",
    content: [
      { type: "heading", level: 2, text: "Base URL & Auth" },
      { type: "list", items: [
        "Base URL: https://api.getindexednow.com",
        "Auth: Bearer token via 'Authorization: Bearer <API_KEY>'",
        "Content-Type: application/json"
      ] },
      { type: "heading", level: 2, text: "Public & Health" },
      { type: "list", items: [
        "GET /api/health — Service health check",
        "GET /api/test-email — Test email delivery (dev)",
        "GET /api/test-url-validation/:taskId — URL validation check (dev)"
      ] },
      { type: "heading", level: 2, text: "Auth" },
      { type: "list", items: [
        "GET /api/auth/check-email",
        "POST /api/auth/register",
        "POST /api/auth/login",
        "POST /api/auth/refresh",
        "POST /api/auth/validate-token",
        "GET /api/auth/me",
        "POST /api/auth/change-password",
        "POST /api/auth/logout",
        "GET /api/auth/google",
        "GET /api/auth/google/callback",
        "POST /api/auth/google/onetap",
        "GET /api/auth/verify-email",
        "POST /api/auth/forgot-password",
        "POST /api/auth/validate-reset-token",
        "POST /api/auth/reset-password"
      ] },
      { type: "heading", level: 2, text: "User" },
      { type: "list", items: [
        "GET /api/user/credits",
        "GET /api/user/credits/summary",
        "GET /api/user/tasks",
        "GET /api/user/profile",
        "PUT /api/user/profile",
        "GET /api/user/subscription",
        "POST /api/user/subscription/change",
        "GET /api/user/subscription/confirm",
        "POST /api/user/subscription/cancel",
        "GET /api/user/subscription/history",
        "GET /api/user/credits/usage",
        "GET /api/user/credits/usage/monthly",
        "GET /api/user/credits/holds",
        "GET /api/user/credits/debug",
        "GET /api/user/email/validate",
        "POST /api/user/email/initiate-change",
        "POST /api/user/email/verify-2fa",
        "GET /api/user/email/confirm-change",
        "GET /api/user/email/change-status",
        "POST /api/user/email/cancel-change",
        "GET /api/user/bonus-credits"
      ] },
      { type: "heading", level: 2, text: "Indexing (SpeedyIndex Proxy)" },
      { type: "list", items: [
        "POST /api/proxy/speedyindex/counter",
        "POST /api/proxy/speedyindex/",
        "POST /api/proxy/speedyindex/status/:type",
        "GET /api/proxy/speedyindex/status/:type",
        "POST /api/proxy/speedyindex/check-indexing/:taskId",
        "GET /api/proxy/speedyindex/urls/:taskId",
        "GET /api/proxy/speedyindex/debug/tasks",
        "POST /api/proxy/speedyindex/refresh/:taskId",
        "GET /api/proxy/speedyindex/report/:taskId",
        "POST /api/proxy/speedyindex/sync-vip/:taskId",
        "GET /api/proxy/speedyindex/url-validation/status/:taskId",
        "GET /api/proxy/speedyindex/url-validation/details/:taskId",
        "GET /api/proxy/speedyindex/account",
        "POST /api/proxy/speedyindex/task/:type/status",
        "POST /api/proxy/speedyindex/task/:type/fullreport"
      ] },
      { type: "heading", level: 2, text: "VIP Tasks" },
      { type: "list", items: [
        "POST /api/vip/create",
        "GET /api/vip/status/:taskId",
        "GET /api/vip/queue/status",
        "POST /api/vip/retry/:taskId",
        "GET /api/vip/delayed",
        "GET /api/vip/failed",
        "POST /api/vip/bulk-retry",
        "GET /api/vip/health/speedyindex",
        "GET /api/vip/stats"
      ] },
      { type: "heading", level: 2, text: "Public & Blog" },
      { type: "list", items: [
        "GET /api/public/seo-pages/:slug",
        "GET /api/public/sitemap.xml",
        "GET /api/blog/posts",
        "GET /api/blog/featured",
        "GET /api/blog/popular",
        "GET /api/blog/categories",
        "GET /api/blog/tags",
        "GET /api/blog/posts/:slug"
      ] },
      { type: "heading", level: 2, text: "Invoices & Reports" },
      { type: "list", items: [
        "GET /api/invoices/",
        "GET /api/invoices/:invoiceId/download",
        "GET /api/invoices/:invoiceId/html",
        "GET /api/invoices/:invoiceId",
        "GET /api/reportDownload/download"
      ] },
      { type: "heading", level: 2, text: "Two-Factor Auth (2FA)" },
      { type: "list", items: [
        "POST /api/twoFactor/request-enablement",
        "GET /api/twoFactor/verify-enablement/:token",
        "POST /api/twoFactor/generate-setup",
        "POST /api/twoFactor/enable",
        "POST /api/twoFactor/disable",
        "GET /api/twoFactor/status",
        "GET /api/twoFactor/backup-codes",
        "POST /api/twoFactor/backup-codes/generate",
        "POST /api/twoFactor/verify-login"
      ] },
      { type: "tip", text: "Use backoff for 429s, handle 401/403 gracefully, and log request IDs for error tracing." }
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Recommendations for optimizing your indexing strategy.",
    content: [
      { type: "heading", level: 2, text: "Performance & Technical SEO" },
      { type: "list", items: [
        "Improve Core Web Vitals (LCP, INP, CLS).",
        "Return fast 200 responses, reduce redirect chains.",
        "Use HTTPS everywhere and consistent canonical tags."
      ] },
      { type: "heading", level: 2, text: "Discovery & Structure" },
      { type: "list", items: [
        "Maintain fresh, well-structured sitemaps.",
        "Build topical clusters with strong internal linking.",
        "Avoid crawl traps (infinite filters/pagination)."
      ] },
      { type: "heading", level: 2, text: "Content Quality" },
      { type: "list", items: [
        "Unique value, clear headings, and media with alt text.",
        "Add JSON-LD where applicable (Article, Product, FAQ).",
        "Keep content updated; reflect lastmod accurately."
      ] },
      { type: "heading", level: 2, text: "Operational Excellence" },
      { type: "list", items: [
        "Automate submissions on publish/update events.",
        "Schedule bulk uploads off-peak and monitor failures.",
        "Review reports weekly; act on failure spikes and latency drifts."
      ] },
      { type: "tip", text: "Tag submissions by campaign to measure ROI and iterate faster." }
    ],
  },
  {
    slug: "glossary",
    title: "Glossary",
    description:
      "Definitions of common terms used in website indexing.",
    content: [
      { type: "heading", level: 2, text: "Core Terms" },
      { type: "list", items: [
        "Crawl Budget: The number of URLs a crawler will fetch within a period.",
        "Canonical URL: Preferred URL when multiple pages have similar content.",
        "Sitemap: XML file listing discoverable URLs and metadata (lastmod).",
        "Robots.txt: File instructing crawlers which paths to allow/disallow.",
        "Meta Robots: Per-page directives for indexing and following links.",
        "Structured Data: Machine-readable JSON-LD describing page content.",
        "TTFB (Time to First Byte): Time from request to first byte received.",
        "Indexing: Process of adding a URL to a search engine’s index."
      ] },
      { type: "heading", level: 2, text: "GetIndexedNow Concepts" },
      { type: "list", items: [
        "Submission: Request to notify search engines of a URL.",
        "Credit: Unit consumed per successfully queued URL.",
        "Queue: Pipeline where tasks await processing and track status.",
        "Tag: Label applied to submissions for organization and reporting."
      ] }
    ],
  },
];

export function findArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}

export function findResourceBySlug(slug: string): HelpResource | undefined {
  return helpResources.find((r) => r.slug === slug);
}


