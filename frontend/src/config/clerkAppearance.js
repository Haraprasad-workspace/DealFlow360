export const clerkAppearance = {
	variables: {
		colorPrimary: "#BB6B43",
		colorBackground: "#FFFDF8",
		colorInputBackground: "#FFFDF8",
		colorInputText: "#18221F",
		colorText: "#18221F",
		colorTextSecondary: "#737A72",
		borderRadius: "0px",
		fontFamily: "'DM Sans', sans-serif",
		fontFamilyButtons: "'DM Sans', sans-serif",
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
			borderRadius: "0px",
			border: "1px solid #D7D4CA",
			backgroundColor: "#FFFDF8",
			color: "#18221F",
			fontSize: "15px",
		},
		formButtonPrimary: {
			backgroundColor: "#BB6B43",
			borderRadius: "0px",
			padding: "12px 18px",
			fontSize: "16px",
			fontWeight: 600,
			"&:hover": {
				backgroundColor: "#A85C39",
			},
		},
		formFieldInput: {
			borderRadius: "0px",
			border: "1px solid #D7D4CA",
			backgroundColor: "#FFFDF8",
			fontSize: "16px",
			"&:focus": {
				border: "2px solid #60816A",
				boxShadow: "0 0 0 3px #9AAD9830",
			},
		},
		footerAction: {
			display: "none",
		},
		identityPreviewEditButton: {
			color: "#A85C39",
		},
		formFieldAction: {
			color: "#A85C39",
		},
	},
};
