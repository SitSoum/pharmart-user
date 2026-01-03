import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from "embla-carousel-autoplay"
import { CarouselBanner } from "./carouselBanner"
import "@/components/home/homeSlider/carousel.css"

export function EmblaCarousel() {
//   const [emblaRef] = useEmblaCarousel()
   const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()])
// const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay({delay:1000})]) check EmblaCarousel site for more options and controls over the autoplay plugin

    const image_address= "/assets/pharmat_logo.png"
    const dolipran_img="assets/dolipranBanner.png"
    const suncream= "https://images.unsplash.com/photo-1598662972299-5408ddb8a3dc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070"
   

  return (
    <div className="embla h-full w-full object-contain" ref={emblaRef}>
      

      <div className="embla__container w-full h-full z-10">
     
        <div className="embla__slide ">
            <CarouselBanner image_location={dolipran_img}/>
        </div>

        <div className="embla__slide ">
            <CarouselBanner image_location={suncream}/>
        </div>

        <div className="embla__slide">
            <CarouselBanner image_location={image_address}/>
        </div>

      </div>
    </div>
  )
}
