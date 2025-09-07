import { Link, LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';

interface ScrollToTopLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export const ScrollToTopLink = ({ children, className, ...props }: ScrollToTopLinkProps) => {
  const handleClick: LinkProps['onClick'] = (event) => {
    // If target URL contains a hash, let the route+hook handle scrolling to the section.
    const toValue = (props.to as string) || '';
    const hasHash = typeof toValue === 'string' && toValue.includes('#');
    if (!hasHash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    // Do not prevent default; allow navigation
    if (typeof props.onClick === 'function') {
      // @ts-expect-error - LinkProps onClick signature
      props.onClick(event);
    }
  };

  return (
    <Link 
      {...props} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}; 