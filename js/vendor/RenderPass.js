"use strict";
(self["webpackChunkRspack"] = self["webpackChunkRspack"] || []).push([["RenderPass"], {
"./node_modules/three/examples/jsm/postprocessing/Pass.js": 
/*!****************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/Pass.js ***!
  \****************************************************************/
(function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  FullScreenQuad: () => (FullScreenQuad),
  Pass: () => (Pass)
});
/* ESM import */var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.core.js");


/**
 * Abstract base class for all post processing passes.
 *
 * This module is only relevant for post processing with {@link WebGLRenderer}.
 *
 * @abstract
 * @three_import import { Pass } from 'three/addons/postprocessing/Pass.js';
 */
class Pass {

	/**
	 * Constructs a new pass.
	 */
	constructor() {

		/**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */
		this.isPass = true;

		/**
		 * If set to `true`, the pass is processed by the composer.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.enabled = true;

		/**
		 * If set to `true`, the pass indicates to swap read and write buffer after rendering.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.needsSwap = true;

		/**
		 * If set to `true`, the pass clears its buffer before rendering
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.clear = false;

		/**
		 * If set to `true`, the result of the pass is rendered to screen. The last pass in the composers
		 * pass chain gets automatically rendered to screen, no matter how this property is configured.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.renderToScreen = false;

	}

	/**
	 * Sets the size of the pass.
	 *
	 * @abstract
	 * @param {number} width - The width to set.
	 * @param {number} height - The height to set.
	 */
	setSize( /* width, height */ ) {}

	/**
	 * This method holds the render logic of a pass. It must be implemented in all derived classes.
	 *
	 * @abstract
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the pass is no longer used in your app.
	 *
	 * @abstract
	 */
	dispose() {}

}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

// https://github.com/mrdoob/three.js/pull/21358

class FullscreenTriangleGeometry extends three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry {

	constructor() {

		super();

		this.setAttribute( 'position', new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
		this.setAttribute( 'uv', new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

	}

}

const _geometry = new FullscreenTriangleGeometry();


/**
 * This module is a helper for passes which need to render a full
 * screen effect which is quite common in context of post processing.
 *
 * The intended usage is to reuse a single full screen quad for rendering
 * subsequent passes by just reassigning the `material` reference.
 *
 * This module can only be used with {@link WebGLRenderer}.
 *
 * @augments Mesh
 * @three_import import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
 */
class FullScreenQuad {

	/**
	 * Constructs a new full screen quad.
	 *
	 * @param {?Material} material - The material to render te full screen quad with.
	 */
	constructor( material ) {

		this._mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( _geometry, material );

	}

	/**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever the instance is no longer used in your app.
	 */
	dispose() {

		this._mesh.geometry.dispose();

	}

	/**
	 * Renders the full screen quad.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 */
	render( renderer ) {

		renderer.render( this._mesh, _camera );

	}

	/**
	 * The quad's material.
	 *
	 * @type {?Material}
	 */
	get material() {

		return this._mesh.material;

	}

	set material( value ) {

		this._mesh.material = value;

	}

}




}),
"./node_modules/three/examples/jsm/postprocessing/RenderPass.js": 
/*!**********************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/RenderPass.js ***!
  \**********************************************************************/
(function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  RenderPass: () => (RenderPass)
});
/* ESM import */var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.core.js");
/* ESM import */var _Pass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pass.js */ "./node_modules/three/examples/jsm/postprocessing/Pass.js");



/**
 * This class represents a render pass. It takes a camera and a scene and produces
 * a beauty pass for subsequent post processing effects.
 *
 * ```js
 * const renderPass = new RenderPass( scene, camera );
 * composer.addPass( renderPass );
 * ```
 *
 * @augments Pass
 * @three_import import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
 */
class RenderPass extends _Pass_js__WEBPACK_IMPORTED_MODULE_0__.Pass {

	/**
	 * Constructs a new render pass.
	 *
	 * @param {Scene} scene - The scene to render.
	 * @param {Camera} camera - The camera.
	 * @param {?Material} [overrideMaterial=null] - The override material. If set, this material is used
	 * for all objects in the scene.
	 * @param {?(number|Color|string)} [clearColor=null] - The clear color of the render pass.
	 * @param {?number} [clearAlpha=null] - The clear alpha of the render pass.
	 */
	constructor( scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null ) {

		super();

		/**
		 * The scene to render.
		 *
		 * @type {Scene}
		 */
		this.scene = scene;

		/**
		 * The camera.
		 *
		 * @type {Camera}
		 */
		this.camera = camera;

		/**
		 * The override material. If set, this material is used
		 * for all objects in the scene.
		 *
		 * @type {?Material}
		 * @default null
		 */
		this.overrideMaterial = overrideMaterial;

		/**
		 * The clear color of the render pass.
		 *
		 * @type {?(number|Color|string)}
		 * @default null
		 */
		this.clearColor = clearColor;

		/**
		 * The clear alpha of the render pass.
		 *
		 * @type {?number}
		 * @default null
		 */
		this.clearAlpha = clearAlpha;

		/**
		 * Overwritten to perform a clear operation by default.
		 *
		 * @type {boolean}
		 * @default true
		 */
		this.clear = true;

		/**
		 * If set to `true`, only the depth can be cleared when `clear` is to `false`.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.clearDepth = false;

		/**
		 * Overwritten to disable the swap.
		 *
		 * @type {boolean}
		 * @default false
		 */
		this.needsSwap = false;
		this._oldClearColor = new three__WEBPACK_IMPORTED_MODULE_1__.Color();

	}

	/**
	 * Performs a beauty pass with the configured scene and camera.
	 *
	 * @param {WebGLRenderer} renderer - The renderer.
	 * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
	 * destination for the pass.
	 * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
	 * previous pass from this buffer.
	 * @param {number} deltaTime - The delta time in seconds.
	 * @param {boolean} maskActive - Whether masking is active or not.
	 */
	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		let oldClearAlpha, oldOverrideMaterial;

		if ( this.overrideMaterial !== null ) {

			oldOverrideMaterial = this.scene.overrideMaterial;

			this.scene.overrideMaterial = this.overrideMaterial;

		}

		if ( this.clearColor !== null ) {

			renderer.getClearColor( this._oldClearColor );
			renderer.setClearColor( this.clearColor, renderer.getClearAlpha() );

		}

		if ( this.clearAlpha !== null ) {

			oldClearAlpha = renderer.getClearAlpha();
			renderer.setClearAlpha( this.clearAlpha );

		}

		if ( this.clearDepth == true ) {

			renderer.clearDepth();

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		if ( this.clear === true ) {

			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

		}

		renderer.render( this.scene, this.camera );

		// restore

		if ( this.clearColor !== null ) {

			renderer.setClearColor( this._oldClearColor );

		}

		if ( this.clearAlpha !== null ) {

			renderer.setClearAlpha( oldClearAlpha );

		}

		if ( this.overrideMaterial !== null ) {

			this.scene.overrideMaterial = oldOverrideMaterial;

		}

		renderer.autoClear = oldAutoClear;

	}

}




}),

}]);