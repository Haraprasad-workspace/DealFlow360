import { Component } from "react";

class FrontendErrorBoundary extends Component {
	state = { error: null };

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error("[ui] render failed", error, info.componentStack);
	}

	handleReload = () => window.location.reload();

	render() {
		if (!this.state.error) return this.props.children;
		return (
			<div className="frontend-error-screen">
				<p className="eyebrow">Workspace interruption</p>
				<h1>This view could not be rendered.</h1>
				<p>Use reload to recover the current session, then try the page again.</p>
				<button className="button button-primary" onClick={this.handleReload}>Reload workspace</button>
			</div>
		);
	}
}

export default FrontendErrorBoundary;