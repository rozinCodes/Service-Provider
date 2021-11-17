import { typography } from "..";

const BASE = {
	fontFamily: typography.primary,
	fontSize: 14
};
const BASE_BOLD = {
	fontFamily: typography.primary_bold
};
const bold = {
	fontWeight: 'bold'
};

export const presets = {
	default: BASE,
	bold: BASE_BOLD,
	just_bold: bold,
	h1: {
		...BASE_BOLD,
		fontSize: 32
	},
	h2: {
		...BASE_BOLD,
		fontSize: 28
	},
	h3: {
		...BASE_BOLD,
		fontSize: 24
	},
	h4: {
		...BASE_BOLD,
		fontSize: 16
	},
	small: {
		...BASE,
		fontSize: 11
	},
};
