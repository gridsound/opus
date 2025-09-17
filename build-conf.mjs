export default {
	title:         "Opus by GridSound",
	desc:          "Opus audio encoder",
	favicon:       "assets/ico.svg",
	url:           "https://opus.gridsound.com/",
	ogImage:       "https://opus.gridsound.com/cover.png",
	ogImageW:      1290,
	ogImageH:       624,
	// serviceWorker: "serviceWorker.js",
	// manifest:      "manifest.json",
	// .........................................................................
	cssSrcA: [
		"assets/fonts/fonts.css",
	],
	cssSrcB: [
		"style.css",
	],
	jsSrcB: [
		"run.js",
	],
	// .........................................................................
	cssDep: [
		"gs-ui-components/gsui.css",
		"gs-ui-components/gsuiIcon/gsuiIcon.css",
		"gs-ui-components/gsuiRipple/gsuiRipple.css",
		"gs-ui-components/gsuiComButton/gsuiComButton.css",
	],
	// .........................................................................
	jsDep: [
		"gs-utils/gs-utils.js",
		"gs-utils/gs-utils-dom.js",
		"gs-utils/gs-utils-func.js",
		"gs-utils/gs-utils-files.js",
		"gs-utils/gs-utils-checkType.dev.js",

		// .....................................................................
		"gs-wa-components/gswaOpusConverter/gswaOpusConverter.js",

		// .....................................................................
		"gs-ui-components/gsui0ne/gsui0ne.js",
		"gs-ui-components/gsuiRipple/gsuiRipple.js",
		"gs-ui-components/gsuiComButton/gsuiComButton.js",
	],
};
