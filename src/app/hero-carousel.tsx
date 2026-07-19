"use client";

import { useState, useEffect } from "react";

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
    alt: "Torre Eiffel em Paris ao entardecer",
    credit: "Chris Karidis",
  },
  {
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80",
    alt: "Coliseu de Roma ao pôr do sol",
    credit: "David Köhler",
  },
  {
    url: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1920&q=80",
    alt: "Ruas coloridas de Lisboa, Portugal",
    credit: "Daniel Adventures",
  },
  {
    url: "https://images.unsplash.com/photo-1583422409516-2895a77efed6?w=1920&q=80",
    alt: "Sagrada Família em Barcelona",
    credit: "Enes Bayrak",
  },
  {
    url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1920&q=80",
    alt: "Canais de Amsterdam ao anoitecer",
    credit: "Aventureira",
  },
  {
    url: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80",
    alt: "Ponte Charles em Praga",
    credit: "Anthony DELANOIX",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(new Array(HERO_IMAGES.length).fill(false));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Images */}
      {HERO_IMAGES.map((img, index) => (
        <div
          key={img.url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img.url}
            alt={img.alt}
            className="h-full w-full object-cover"
            onLoad={() => {
              setIsLoaded((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }}
          />
        </div>
      ))}

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Photo credit */}
      <div className="absolute bottom-8 right-6 z-20 text-xs text-white/50">
        Foto: {HERO_IMAGES[current].credit}
      </div>
    </>
  );
}
