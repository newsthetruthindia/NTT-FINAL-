import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || !Array.isArray(items)) {
    return (
      <nav className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-gray-600 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-gray-600 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link href="/" className="hover:text-primary transition-colors">Home</Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
