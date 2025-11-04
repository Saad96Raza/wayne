/** @type {import('tailwindcss').Config} */
/**
 * fluid function
 */
import { Fluid } from './src/apps/extra/math.js'
import daisyui from 'daisyui'

module.exports = {
  content: ["./src/**/*.{html,js,pug}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: [Fluid(4, 20)], 
      },
      screens: {
        DEFAULT: '100%', 
        xl: '1440px',    
      },
    },
    extend: {
      fontSize: {        
        xxl: [Fluid(7, 80)], 
        xl: [Fluid(4, 60)], 
        lg: [], 
        md: [Fluid(3, 10)], 
        sm: [Fluid(3, 6)], 
        body: [], 
        input: [],
        link: [Fluid(1, 10)],  
        highlight: [], 
      },      
    },
  },
  plugins: [
    daisyui
  ],
  corePlugins: {
    preflight: true, /** Ensure it's enabled */
  },
}