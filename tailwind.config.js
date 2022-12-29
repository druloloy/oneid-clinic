/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#fdf2f6',
					100: '#fce7f0',
					200: '#fccee1',
					300: '#faa7c8',
					400: '#f670a3',
					500: '#ee4681',
					600: '#dd255d',
					700: '#c01645',
					800: '#9f1539',
					900: '#841733',
				},
			},
			maxHeight: {
				128: '32rem',
			},
		},
	},
	plugins: [],
};
