"use strict";

// problem with MP3...
// disabled gsuiComButton can still be clicked...

document.body.append(
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
			`© ${ ( new Date() ).getFullYear() } `,
			GSUcreateA( { href: "https://gridsound.com" }, "gridsound.com" ),
			" all rights reserved",
		),
	),
);

const elMain = GSUdomQS( "#main" );
const elBtnArea = GSUdomQS( "#droparea" );
const elInputFile = GSUdomQS( "#inputfile" );
const elFileName = GSUdomQS( ".fileLine:nth-child(1) span:last-child" );
const elFileType = GSUdomQS( ".fileLine:nth-child(2) span:last-child" );
const elFileSize = GSUdomQS( ".fileLine:nth-child(3) span:last-child" );
const elFileCancel = GSUdomQS( "#fileCancel" );
const elConvertBtn = GSUdomQS( "#convertBtn" );
const elDownloadBtn = GSUdomQS( "#downloadBtn" );
const elProgress = GSUdomQS( "#progressIn" );

const worker = new Worker( "worker/EmsWorkerProxy.js" );
let file;
let newBlob;
let convertStarted = false;

elBtnArea.onclick = () => elInputFile.click();
elInputFile.onchange = () => setFile( elInputFile.files[ 0 ] );
elConvertBtn.onclick = () => convert();
elDownloadBtn.onclick = () => download();
elFileCancel.onclick = () => {
	setFile();
	progress( 0 );
	convertStarted = false;
	elMain.classList.remove( "loaded", "ready" );
	GSUdomRmAttr( elConvertBtn, "disabled", "loading" );
};

document.body.ondragover = GSUnoopFalse;
document.body.ondragstart = GSUnoopFalse;
document.body.ondrop = e => {
	GSUgetFilesDataTransfert( e.dataTransfer.items ).then( f => setFile( f[ 0 ] ) );
	return false;
};

worker.onmessage = e => {
	if ( e.data ) {
		const val = e.data.values;

		switch( e.data.reply ) {
			case "progress":
				if ( val[ 1 ] ) {
					progress( val[ 0 ] / val[ 1 ] );
				}
				break;
			case "done":
				for ( const fileName in val ) {
					newBlob = val[ fileName ].blob;
				}
				GSUdomSetAttr( elConvertBtn, "disabled" );
				GSUdomRmAttr( elConvertBtn, "loading" );
				elMain.classList.add( "ready" );
				break;
		}
	}
};

function setFile( f ) {
	if ( !f || !convertStarted ) {
		file = f;
		elMain.classList.toggle( "loaded", !!f );
		elFileName.textContent = f?.name;
		elFileType.textContent = f?.type;
		elFileSize.textContent = f?.size;
	}
}

function convert() {
	if ( file && !convertStarted ) {
		convertStarted = true;
		GSUdomSetAttr( elConvertBtn, "loading" );

		const rdr = new FileReader();

		rdr.addEventListener( "loadend", () => {
			worker.postMessage( {
				command: "encode",
				args: [ file.name, "encoded.opus" ],
				outData: { "encoded.opus": { "MIME": "audio/ogg" } },
				fileData: { [ file.name ]: new Uint8Array( rdr.result ) },
			} );
		} );
		rdr.readAsArrayBuffer( file );
	}
}

function progress( p ) {
	elProgress.style.width = `${ p * 100 }%`;
}

function download() {
	if ( newBlob ) {
		const name = elFileName.textContent;
		const lastDot = name.lastIndexOf( "." );
		const newName = `${ lastDot < 0 ? name : name.substring( 0, lastDot ) }.opus`;

		GSUdownloadBlob( newName, newBlob );
	}
}
