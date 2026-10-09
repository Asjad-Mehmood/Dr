import { CrossMark } from "../vectors";

// Shown on the login and create-account screens.
export function Logo() {
  return (
    <div className="dr-logo">
      <CrossMark className="dr-logo__mark" />
      <div>
        <p className="dr-logo__name">Naima Asjad</p>
        <p className="dr-logo__sub">Portfolio admin</p>
      </div>
    </div>
  );
}

// The small mark in the admin navigation and breadcrumbs.
export function Icon() {
  return <CrossMark className="dr-icon" />;
}

export function LoginWelcome() {
  return (
    <div className="dr-login-welcome">
      <p>
        Welcome back. Sign in to add events, certificates, camps and photos, or
        to change any text on the website.
      </p>
    </div>
  );
}
