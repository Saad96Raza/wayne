import Home from './home';
import Contact from './contact';
import barba from '@barba/core';
import GSAP from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import LocomotiveScroll from 'locomotive-scroll';
import Atropos from 'atropos';

import _ from '../scss/main.scss'
import shoe from '../media/models/2.glb'
import matcap from '../media/matcap/5.png'


class App{
    constructor(){
        this.pages = {
            home : new Home(),
            contact : new Contact()
        }
        this.screen ={
            width : window.innerWidth,
            height: window.innerHeight

        }
        this.createSmoothScroll()
        this.createPreloader()
        this.createAstropos()
        this.createCamera()
        this.createScene()
        this.createGeometry()
        this.createMaterial()
        // this.createMesh()
        this.createLights()
        this.createRenderer()
        this.createModal()
        this.createAjaxNavigation()
        this.createReRender()
        this.addEventListeners()
        this.update()
        
    }
    createSmoothScroll(){
        this.locomotiveScroll = new LocomotiveScroll({
            el: $('.smooth-scroll').get(0),
            smooth: true,
            lerp:0.050
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
            
        })
        .to($('.fade').get(),{
            opacity: 1,
            y:-40,
            duration: 2,
            ease: 'power2.inOut',
            onComplete:()=>{
                this.locomotiveScroll.start()
            }
        })
        
    }
    createAstropos(){
        Atropos({
            el: '.my-atropos',
            activeOffset: 100,
            shadow: false,
            alwaysActive:true,
            highlight: false,
            duration:1000
        })
    }

    createCamera(){
        this.camera = new THREE.PerspectiveCamera( 70, this.screen.width / this.screen.height, 0.01, 10 );
        this.camera.position.z = 1;
    }
    createScene(){
        this.scene = new THREE.Scene();
        
    }
    createGeometry(){
        this.geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );

    }
    createMaterial(){
        const textureLoader = new THREE.TextureLoader();
        const matcapTexture = textureLoader.load(matcap); // matcap must be URL string

        this.material = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture,
        });
        
    }
    createMesh(){
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }
    createLights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);  
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7); 
        directionalLight.castShadow = true;      
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(-5, 5, -5);
        this.scene.add(pointLight);
    }
    createRenderer(){
        this.renderer = new THREE.WebGLRenderer( {antialias: true} )
        this.renderer.setSize( this.screen.width, this.screen.height )
        $('.home-section-1').append(this.renderer.domElement)
    }
    onResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    createModal(){
        const loader = new GLTFLoader();
        loader.load(shoe, (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = this.material; // Apply matcap
                    child.material.transparent = true;   // ✅ allows fading in
                    child.material.opacity = 0;          // ✅ start invisible
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.scale.set(0.7,0.7,0.7)
                    child.position.set(0,0,0)
                    if (child.material) {
                        child.material.needsUpdate = true;
                    }
                    GSAP.to(child.material, {
                        opacity: 1,
                        duration: 3,     // fade duration (seconds)
                        ease:'none'
                    });
                    GSAP.to(child.rotation,{
                        y:360,
                        repeat:-1,
                        duration:600,
                        ease:'none'

                    })
                }
            })
            this.scene.add(gltf.scene)
        })

    }
 
    createAjaxNavigation(){

        const easeIn = (container,done)=> {
            return GSAP.to(container, {
                autoAlpha: 0,
                duration: 1,
                ease: 'none',
                onComplete: ()=> done()
            })
        }

        const  easeOut = (container) => {

            return GSAP.from(container, {
                autoAlpha: 0,
                duration: 1,
                ease: 'none',
            })
        }

       barba.init({
                preventRunning: true,
                transitions: [
                {
                once({ next }) {
                     easeOut(next.container);
                },
                leave({ current }) {
                    const done = this.async();
                    easeIn(current.container, done);
                },
                enter({ next }) {
                     easeOut(next.container);
                }
                }
            ],
            
        })
        
    }

    createReRender(){
        
        barba.hooks.before(() => {
        })
    
        barba.hooks.after(() => {
            this.pages.home.createReRender() 
           
        })
    }

    addEventListeners(){
        $(window).on("resize",this.onResize.bind(this))
        $(window).on("load",this.createPreloader.bind(this))
    }
    update(){
        this.renderer.render( this.scene, this.camera )
        window.requestAnimationFrame(this.update.bind(this))
    }
}

$(function(){
    new App()
})
