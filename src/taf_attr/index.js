/**
 * BLOCK: taf-attributes
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InnerBlocks, MediaUpload, MediaUploadCheck } = wp.editor;
const { Button } = wp.components;
const { withState } =  wp.compose;

const ALLOWED_BLOCKS = [ 'core/paragraph' ];

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'taf/block-taf-attributes', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'taf-attributes - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'taf-attributes — TAF Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],

	attributes: {
		imgId: { type: 'number' },
		imgAttr: {
			type: 'array',
			source: 'query',
			selector: 'img',
			query: {
				url: {
					type: 'string',
					source: 'attribute',
					attribute: 'src'
				},
				width: {
					type: 'string',
					source: 'attribute',
					attribute: 'width'
				},
				height: {
					type: 'string',
					source: 'attribute',
					attribute: 'height'
				},
				alt: {
					type: 'string',
					source: 'attribute',
					attribute: 'alt'
				}
			}
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {
		const { attributes: { imgId, imgAttr: { 0: { url: imgSrc } } } } = props;
		const setMedia = (media) => {
			console.log( media.sizes );
			setAttributes( { 
				imgId: media.id,
				imgAttr: {
					url: media.sizes.full.url,
					width: media.sizes.full.width.toString(),
					height: media.sizes.full.height.toString(),
					alt: media.alt
				}
			} ); 
		}
		const contentButton = imgSrc ? (<img src={ imgSrc } />) : "Choix de l'image";
		return (
			<div className={ props.className }>
				<div className="col-img">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ setMedia }
							// allowedTypes={ ALLOWED_MEDIA_TYPES }
							value={ imgId }
							render={ ( { open } ) => (
								<Button 
									onClick={ open }
									className = "media-button"
									>
									{contentButton}
									
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</div>
				<div className="col-text">
					<InnerBlocks
						allowedBlocks = { ALLOWED_BLOCKS }
					/>
				</div>
			</div>
		);
	},


	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
		const { attributes: { imgAttr: { 0: { url: imgSrc, width: imgWidth, height: imgHeight, alt: imgAlt } } } } = props;
		console.log(props.attributes);
		return (
			<div className="row">
				<div className="col-md-3 text-center">
					<img 
						src = { imgSrc }
						width = { imgWidth }
						height = {imgHeight}
						alt = {imgAlt}
						className = "img-illustre rounded-circle"
					/>
				</div>
				<div className="col-md-9">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
