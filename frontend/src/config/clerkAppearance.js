export const clerkAppearance = {
	variables: {
		colorPrimary: "#5B4CF5",
		colorBackground: "#FAFAFC",
		colorInputBackground: "#FFFFFF",
		colorInputText: "#1A1B25",
		colorText: "#1A1B25",
		colorTextSecondary: "#5C5D6E",
		borderRadius: "8px",
		fontFamily: "'Inter', sans-serif",
		fontFamilyButtons: "'Inter', sans-serif",
	},
	elements: {
		rootBox: {
			width: "100%",
		},
		card: {
			background: "transparent",
			boxShadow: "none",
			border: "none",
			padding: 0,
		},
		headerTitle: {
			display: "none",
		},
		headerSubtitle: {
			display: "none",
		},
		socialButtonsBlockButton: {
			borderRadius: "8px",
			border: "1px solid #D6D7E4",
			backgroundColor: "#FFFFFF",
			color: "#1A1B25",
		},
		formButtonPrimary: {
			backgroundColor: "#5B4CF5",
			borderRadius: "8px",
			padding: "10px 18px",
			fontWeight: 600,
			"&:hover": {
				backgroundColor: "#4534E0",
			},
		},
		formFieldInput: {
			borderRadius: "8px",
			border: "1px solid #D6D7E4",
			backgroundColor: "#FFFFFF",
			"&:focus": {
				border: "2px solid #5B4CF5",
				boxShadow: "0 0 0 3px #EFEDFF",
			},
		},
		footerAction: {
			display: "none",
		},
		identityPreviewEditButton: {
			color: "#5B4CF5",
		},
		formFieldAction: {
			color: "#5B4CF5",
		},
	},
};
