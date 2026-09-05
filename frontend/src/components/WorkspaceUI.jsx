import { Link } from "react-router-dom";
import { getErrorMessage } from "../api/salesRep";

export const PageHeader = ({ eyebrow, title, description, action }) => (
	<div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</div>
);

export const LoadingState = ({ label = "Loading workspace" }) => <div className="loading-state"><span className="loader" />{label}</div>;
export const ErrorState = ({ error }) => <div className="error-state">{getErrorMessage(error)}</div>;
export const EmptyState = ({ title, text, action }) => <div className="empty-state"><div className="empty-icon">+</div><h3>{title}</h3><p>{text}</p>{action}</div>;
export const Button = ({ children, variant = "primary", ...props }) => <button className={`button button-${variant}`} {...props}>{children}</button>;
export const StatusPill = ({ status }) => <span className={`status-pill status-${String(status || "draft").toLowerCase()}`}>{String(status || "DRAFT").replaceAll("_", " ")}</span>;
export const Money = ({ value = 0 }) => <span>₹{Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>;
export const LinkButton = ({ to, children }) => <Link className="button button-secondary" to={to}>{children}</Link>;
