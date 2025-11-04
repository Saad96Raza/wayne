export function Fluid(minSizeRem, maxSizeRem, minScreen = 320, maxScreen = 1440) {
  return `clamp(${minSizeRem}rem, calc(${minSizeRem}rem + (${maxSizeRem} - ${minSizeRem}) * ((100vw - ${minScreen}px) / (${maxScreen} - ${minScreen}))), ${maxSizeRem}rem)`;
}