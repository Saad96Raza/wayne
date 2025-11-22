import GSAP from 'gsap';
import { Scene, PerspectiveCamera, WebGLRenderer, MeshStandardMaterial, TextureLoader, RepeatWrapping, Vector2, BufferAttribute, AmbientLight, DirectionalLight } from "three"

let GLTFLoader, DRACOLoader, EffectComposer, RenderPass, OutlinePass;

const loadModules = async () => {
  GLTFLoader = (await import(
    /* webpackChunkName: "GLTFLoader" */
    "three/examples/jsm/loaders/GLTFLoader.js"
  )).GLTFLoader;

  DRACOLoader = (await import(
    /* webpackChunkName: "DRACOLoader" */
    "three/examples/jsm/loaders/DRACOLoader.js"
  )).DRACOLoader;

  EffectComposer = (await import(
    /* webpackChunkName: "EffectComposer" */
    "three/examples/jsm/postprocessing/EffectComposer.js"
  )).EffectComposer;

  RenderPass = (await import(
    /* webpackChunkName: "RenderPass" */
    "three/examples/jsm/postprocessing/RenderPass.js"
  )).RenderPass;

  OutlinePass = (await import(
    /* webpackChunkName: "OutlinePass" */
    "three/examples/jsm/postprocessing/OutlinePass.js"
  )).OutlinePass;
};

await loadModules();


import LocomotiveScroll from 'locomotive-scroll'
import 'owl.carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import _ from '../scss/main.scss'
import shoe from '../media/models/1.glb'
import matcap from '../media/banner/texture.png'
import {isMobile} from '../apps/extra/media.js'


class App{
    constructor(){

        this.screen ={
            width : window.innerWidth,
            height: window.innerHeight

        }
        this.createSlider()
        this.createSmoothScroll()
        this.createCamera()
        this.createScene()
        this.createMaterial()
        this.createRenderer()
        this.createLights()
        this.createComposer()
        this.createModal()
        this.createResize()
        this.addEventListeners()
        this.update()
        
    }
    createSlider(){
        $(function(){
            $('.owl-carousel').owlCarousel({
                items: 1,              
                loop: true,             
                autoplay: true,         
                autoplayTimeout: 3000,  
                autoplayHoverPause: false,
                mouseDrag: false, 
                touchDrag: false,
                pullDrag: false,
                animateOut: 'fadeOut', 
                animateIn: 'fadeIn',    
                smartSpeed: 1000,
                dots: false,             
                nav: false       
            })
        })
        
    }
    createSmoothScroll(){
        this.locomotiveScroll = new LocomotiveScroll({
            el: $('.smooth-scroll').get(0),
            smooth: true,
            lerp:0.050,
            resetNativeScroll:true,
            smartphone: {
                breakpoint: 768,   
                smooth: true,
                direction: 'vertical',
                multiplier:2
            },
        })
        this.locomotiveScroll.on('call', (value, way) => {
            if (way === 'enter') {
                if (value === 'bg-1') {
                    $(".footer-top").css("background-color", "#7c2529"); 
                }
                if (value === 'bg-2') {
                    $(".footer").css("background-color", "#4d4845");
                }
            }
    
        })
        this.locomotiveScroll.stop()
    }
    createPreloader(){
        this.preloader = GSAP.timeline()
        .to($('.slide svg').get(),{
            scaleY: 1,
            duration: 2,
            ease: "none",
        })
        .to($('.slide svg').get(),{
            opacity: 0,
            duration: 1,
            ease: "none",
        })
        .to($('.slide , .preloader').get(),{
            height: 0,
            duration: 2,
            ease: "expo.out",
            stagger:0.1,
            onComplete:()=>{
                this.locomotiveScroll.update()
                this.locomotiveScroll.start()
            }
            
        })

        
    }


    createCamera(){
        this.camera = new PerspectiveCamera( 70, this.screen.width / this.screen.height, 0.01, 10 );
        this.camera.position.z = 1;
    }
    createScene(){
        this.scene = new Scene();
        
    }
    createMaterial(){
      const texture = new TextureLoader().load(matcap, (tex) => {
            tex.wrapS = RepeatWrapping;
            tex.wrapT = RepeatWrapping;
            tex.repeat.set(2, 2);

        })

        this.material = new MeshStandardMaterial({
            map: texture,
            roughness: 0.1,
            metalness: 0.1,
        });
        
    }


    createLights(){
        const ambientLight = new AmbientLight(0xffffff, 1);  
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7); 
        this.scene.add(directionalLight);

    }
    createRenderer(){
        this.renderer = new WebGLRenderer( {antialias: true} )
        this.renderer.setSize( this.screen.width, this.screen.height )
        $('.home-section-1').append(this.renderer.domElement)
    }
    onResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    }
    createComposer(){
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.outlinePass = new OutlinePass(
        new Vector2(this.screen.width,this.screen.height), 
            this.scene,
            this.camera
        )
        this.outlinePass.edgeStrength = 2.0;         
        this.outlinePass.edgeGlow = 3.0;           
        this.outlinePass.edgeThickness = 1.0;
        this.outlinePass.visibleEdgeColor.set(0xffaa4d)  
        this.composer.addPass(this.outlinePass)


    }
    createModal(){
        const selectedMeshes = [] 

        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()

        dracoLoader.setDecoderPath(window.location.href+'/draco/')  
        dracoLoader.setDecoderConfig({ type: 'js' })
        loader.setDRACOLoader(dracoLoader)  

        loader.load(shoe,(gltf) => {

                gltf.scene.traverse((child) => {

                    child.material = this.material;
                    child.material.transparent = true;
                    child.material.opacity = 0;

                    child.scale.set(0.8, 0.8, 0.8);
                    child.position.set(0, 0, 0);

                    if (child.isMesh) {
                        selectedMeshes.push(child);
                        child.geometry.computeBoundingBox();
                        const bbox = child.geometry.boundingBox;

                        const uv = new Float32Array(child.geometry.attributes.position.count * 2);
                        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
                            uv[i * 2] = (child.geometry.attributes.position.getX(i) - bbox.min.x) / (bbox.max.x - bbox.min.x);
                            uv[i * 2 + 1] = (child.geometry.attributes.position.getY(i) - bbox.min.y) / (bbox.max.y - bbox.min.y);
                        }
                        child.geometry.setAttribute("uv", new BufferAttribute(uv, 2));
                    }
                    GSAP.to(child.material, {
                        opacity: 1,
                        duration: 1,
                        ease: "none"
                    });

                    GSAP.to(child.rotation, {
                        y: Math.PI * 2,
                        duration: 18,
                        repeat: -1,
                        ease: "none"
                    })
                })
                this.outlinePass.selectedObjects = selectedMeshes;  // ✅ apply outline to them
                this.scene.add(gltf.scene);
            },
            (xhr) => {
                if (Number(((xhr.loaded / xhr.total) * 100).toFixed(0)) >= 100) {
                    $(window).on("load",this.createPreloader())
                }
            },
        )

    }

    createResize(){
        new ResizeObserver(() => this.locomotiveScroll.update()).observe(
            $('.smooth-scroll').get(0)
        );
    }
    addEventListeners(){
        $(window).on("resize",this.onResize.bind(this))
    }
    update(){
        this.renderer.render( this.scene, this.camera )
        this.composer.render()

        if (isMobile()) {
            this.camera.zoom = 0.5
            this.camera.updateProjectionMatrix()
        }else {
            this.camera.zoom = 1
            this.camera.updateProjectionMatrix()
        }

        window.requestAnimationFrame(this.update.bind(this))
    }
}

$(function(){
    new App()
})

