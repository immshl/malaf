import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ScrollHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the hero section during scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
      });

      // Animate background gradients with 2 scrolls only
      const backgroundTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      backgroundTl
        .to(backgroundRef.current, {
          background: "linear-gradient(135deg, hsl(183 55% 62%) 0%, hsl(195 6% 13%) 50%, hsl(0 1% 15%) 100%)",
          duration: 1,
        })
        .to(backgroundRef.current, {
          background: "linear-gradient(135deg, hsl(0 1% 15%) 0%, hsl(183 55% 62%) 50%, hsl(195 6% 13%) 100%)",
          duration: 1,
        });

      // Animate text lines with scroll - 2 scrolls only
      textLinesRef.current.forEach((line, index) => {
        if (line) {
          let startPercent, endPercent;
          
          // First scroll: elements 0 and 1
          if (index <= 1) {
            startPercent = index * 25;
            endPercent = (index + 1) * 25;
          } 
          // Second scroll: elements 2 and 3
          else {
            startPercent = 50 + ((index - 2) * 25);
            endPercent = 50 + ((index - 1) * 25);
          }
          
          gsap.fromTo(line,
            {
              opacity: 0,
              y: 50,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: heroRef.current,
                start: `top+=${startPercent}% top`,
                end: `top+=${endPercent}% top`,
                scrub: 0.5,
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Animate buttons - appears on second scroll
      gsap.fromTo(".hero-buttons",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top+=75% top",
            end: "bottom top",
            scrub: 0.3,
          },
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const setTextLineRef = (index: number) => (el: HTMLDivElement | null) => {
    textLinesRef.current[index] = el;
  };

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Animated Background with new theme */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: "linear-gradient(135deg, hsl(195 6% 13%) 0%, hsl(183 55% 62%) 100%)",
        }}
      />
      
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content with improved visibility */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="space-y-8">
            <div
              ref={setTextLineRef(0)}
              className="text-sm text-white/90 font-medium opacity-100 backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 inline-block"
            >
              لتمكين العمل الحر
            </div>
            
            <div
              ref={setTextLineRef(1)}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight opacity-100"
            >
              <span className="text-white drop-shadow-lg">
                ملف مهني
              </span>
            </div>
            
            <div
              ref={setTextLineRef(2)}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight opacity-100"
            >
              <span className="text-white/95 drop-shadow-lg">
                خاص بك
              </span>
            </div>

            <div
              ref={setTextLineRef(3)}
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed opacity-100 backdrop-blur-sm bg-white/5 rounded-lg p-4"
            >
              اعرض خدماتك بطريقة مهنية واستقبل طلبات العملاء بسهولة
            </div>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-100 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-foreground hover:bg-white/90 text-lg px-8 py-4 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link to="/signup">
                  اصنع ملفك المهني
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white hover:text-foreground transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
                asChild
              >
                <Link to="/example">
                  شاهد نموذج
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollHero;