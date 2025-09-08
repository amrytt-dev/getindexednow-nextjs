import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { LucideArrowLeft } from "lucide-react";
import { findResourceBySlug, ContentBlock } from "./content";

const ResourceDetail = () => {
  const router = useRouter();
  const slug = router.query.slug as string | undefined;
  const resource = slug ? findResourceBySlug(slug) : undefined;

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Resource not found</h1>
          <Link
            href="/help-center"
            className="text-primary hover:underline inline-flex items-center"
          >
            <LucideArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
          </Link>
        </div>
      </div>
    );
  }

  const renderBlock = (block: ContentBlock, idx: number) => {
    switch (block.type) {
      case "heading":
        if (block.level === 2)
          return (
            <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">
              {block.text}
            </h2>
          );
        return (
          <h3 key={idx} className="text-xl font-semibold mt-6 mb-3">
            {block.text}
          </h3>
        );
      case "paragraph":
        return (
          <p key={idx} className="text-foreground/80 leading-relaxed mb-4">
            {block.text}
          </p>
        );
      case "list":
        return block.ordered ? (
          <ol key={idx} className="list-decimal pl-6 space-y-1 mb-4">
            {block.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
        ) : (
          <ul key={idx} className="list-disc pl-6 space-y-1 mb-4">
            {block.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      case "steps":
        return (
          <ol
            key={idx}
            className="list-decimal pl-6 space-y-2 bg-muted/30 rounded-lg p-4 mb-4"
          >
            {block.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
        );
      case "code":
        return (
          <pre
            key={idx}
            className="bg-muted/40 border border-border rounded-lg p-4 overflow-x-auto text-sm mb-4"
          >
            <code>{block.code}</code>
          </pre>
        );
      case "note":
        return (
          <div
            key={idx}
            className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20 text-foreground/90"
          >
            {block.text}
          </div>
        );
      case "tip":
        return (
          <div
            key={idx}
            className="mb-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20 text-foreground/90"
          >
            {block.text}
          </div>
        );
      case "warning":
        return (
          <div
            key={idx}
            className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
          >
            {block.text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-3xl mx-auto">
              <Link
                href="/help-center"
                className="text-primary hover:underline inline-flex items-center mb-6"
              >
                <LucideArrowLeft className="h-4 w-4 mr-1" /> Back to Help Center
              </Link>
              <h1 className="text-3xl font-bold mb-3">{resource.title}</h1>
              <p className="text-foreground/70 mb-8">{resource.description}</p>
              <div className="max-w-none">
                {resource.content.map((block, idx) => renderBlock(block, idx))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResourceDetail;
