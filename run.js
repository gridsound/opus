"use strict";

// problem with MP3...

$body.$append(
	GSUcreateDiv( { id: "main" },
		GSUcreateDiv( { id: "head" },
			GSUcreateDiv( { id: "title", class: "gsui-ellipsis" },
				GSUcreateSpan( null, "Ogg/Opus encoder" ),
				GSUcreateSpan( null, "by GridSound" ),
			),
		),
		GSUcreateDiv( { id: "body" },
			GSUcreateInput( { id: "inputfile", type: "file" } ),
			GSUcreateButton( { id: "droparea" },
				GSUcreateSpan( null, "Drop your audio file" ),
				GSUcreateSpan( null, "or click to open a dialog window" ),
			),
			GSUcreateDiv( { id: "file" },
				GSUcreateDiv( { class: "fileLine" }, GSUcreateSpan( null, "name: " ), GSUcreateSpan() ),
				GSUcreateDiv( { class: "fileLine" }, GSUcreateSpan( null, "MIME: " ), GSUcreateSpan() ),
				GSUcreateDiv( { class: "fileLine" }, GSUcreateSpan( null, "size: " ), GSUcreateSpan() ),
				GSUcreateButton( { id: "fileCancel", icon: "close" } ),
			),
			GSUcreateDiv( { id: "convert" },
				GSUcreateDiv( { id: "convertBtns" },
					GSUcreateElement( "gsui-com-button", { id: "convertBtn", text: "Convert", type: "submit" } ),
					GSUcreateElement( "gsui-com-button", { id: "downloadBtn", text: "Download" } ),
				),
				GSUcreateDiv( { id: "progress" },
					GSUcreateDiv( { id: "progressIn" } ),
				),
			),
		),
	),
	GSUcreateDiv( { id: "foot" },
		GSUcreateDiv( { id: "readme" },
			GSUcreateSpan( null, "Thanks to Rillke and its repo " ),
			GSUcreateAExt( { href: "https://github.com/Rillke/opusenc.js" }, "github.com/Rillke/opusenc.js" ),
		),
		GSUcreateSpan( { id: "copyright" },
			`© ${ new Date().getFullYear() } `,
			GSUcreateA( { href: "https://gridsound.com" }, "gridsound.com" ),
			" all rights reserved",
		),
	),
);

const elMain = $( "#main" );
const elBtnArea = $( "#droparea" );
const elInputFile = $( "#inputfile" );
const elFileName = $( ".fileLine:nth-child(1) span:last-child" );
const elFileType = $( ".fileLine:nth-child(2) span:last-child" );
const elFileSize = $( ".fileLine:nth-child(3) span:last-child" );
const elFileCancel = $( "#fileCancel" );
const elConvertBtn = $( "#convertBtn" );
const elDownloadBtn = $( "#downloadBtn" );
const elProgress = $( "#progressIn" );
let file;
let newBlob;
let newBlobName;
const waOpus = new gswaOpusConverter( "worker/EmsWorkerProxy.js" );

function progress( p ) {
	elProgress.$width( p * 100, "%" );
}

function download() {
	if ( newBlob ) {
		GSUdownloadBlob( newBlobName, newBlob );
	}
}

function setFile( f ) {
	if ( !f || !waOpus.$isConverting() ) {
		file = f;
		elMain.$togClass( "loaded", !!f );
		elFileName.$text( f?.name );
		elFileType.$text( f?.type );
		elFileSize.$text( f?.size );
	}
}

function convert() {
	if ( !waOpus.$isConverting() ) {
		elConvertBtn.$addAttr( "loading" );
		waOpus.$convert( file, file.name )
			.then( ( [ blob, name ] ) => {
				newBlob = blob;
				newBlobName = name;
				elConvertBtn.$addAttr( "disabled" ).$rmAttr( "loading" );
				elMain.$addClass( "ready" );
			} );
	}
}

waOpus.$onprogress = p => progress( p );
elBtnArea.$onclick( () => elInputFile.$click() );
elInputFile.$onchange( () => setFile( elInputFile.$get( 0 ).files[ 0 ] ) );
elConvertBtn.$onclick( convert );
elDownloadBtn.$onclick( download );
elFileCancel.$onclick( () => {
	setFile();
	progress( 0 );
	elMain.$rmClass( "loaded", "ready" );
	elConvertBtn.$rmAttr( "disabled", "loading" );
} );

$body.$on( {
	dragover: GSUnoopFalse,
	dragstart: GSUnoopFalse,
	drop( e ) {
		GSUgetFilesDataTransfert( e.dataTransfer.items ).then( f => setFile( f[ 0 ] ) );
		return false;
	},
} );
