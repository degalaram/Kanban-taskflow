// NavLink component - wrapper around React Router's NavLink
// Provides a simpler API with activeClassName prop

import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// NavLink with active/pending class name support
const NavLink = forwardRef(function NavLink(props, ref) {
  const { className, activeClassName, pendingClassName, to, ...rest } = props;
  
  return (
    <RouterNavLink
      ref={ref}
      to={to}
      className={({ isActive, isPending }) =>
        cn(className, isActive && activeClassName, isPending && pendingClassName)
      }
      {...rest}
    />
  );
});

NavLink.displayName = "NavLink";

export { NavLink };
