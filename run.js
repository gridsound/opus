"use strict";

document.body.append(
	GSUcreateInput( { type: "file" } ),
);

const elInput = document.querySelector( "input" );
const worker = new Worker( "worker/EmsWorkerProxy.js" );

elInput.onchange = () => {
	const f = elInput.files[ 0 ];
	const reader = new FileReader();

	elInput.disabled = true;
	reader.addEventListener( "loadend", () => {
		worker.postMessage( {
			command: "encode",
			args: [ f.name, "encoded.opus" ],
			outData: { "encoded.opus": { "MIME": "audio/ogg" } },
			fileData: { [ f.name ]: new Uint8Array( reader.result ) },
		} );
	} );
	reader.readAsArrayBuffer( f );
};

worker.onmessage = e => {
	if ( e.data ) {
		const val = e.data.values;

		switch( e.data.reply ) {
			case "progress":
				if ( val[ 1 ] ) {
					console.log( `progress: ${ val[ 0 ] / val[ 1 ] * 100 }%` );
				}
				break;
			case "done":
				console.log( "progress: 100%" );
				for ( const fileName in val ) {
					console.log( fileName );
					console.log( val[ fileName ].blob );
					GSUdownloadBlob( fileName, val[ fileName ].blob );
				}
				break;
		}
	}
};
