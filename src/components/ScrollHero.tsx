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
        snap: {
          snapTo: "labels",
          duration: { min: 0.2, max: 3 },
          delay: 0.2,
        },
      });

      // Animate background gradients
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
          background: "linear-gradient(135deg, hsl(211 100% 53%) 0%, hsl(280 100% 60%) 50%, hsl(211 100% 60%) 100%)",
          duration: 1,
        })
        .to(backgroundRef.current, {
          background: "linear-gradient(135deg, hsl(280 100% 60%) 0%, hsl(320 100% 65%) 50%, hsl(211 100% 53%) 100%)",
          duration: 1,
        })
        .to(backgroundRef.current, {
          background: "linear-gradient(135deg, hsl(320 100% 65%) 0%, hsl(211 100% 53%) 50%, hsl(280 100% 60%) 100%)",
          duration: 1,
        });

      // Animate text lines with scroll
      textLinesRef.current.forEach((line, index) => {
        if (line) {
          gsap.fromTo(line,
            {
              opacity: 0,
              y: 100,
              scale: 0.8,
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: heroRef.current,
                start: `top+=${index * 20}% top`,
                end: `top+=${(index + 1) * 20}% top`,
                scrub: 1,
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Animate buttons
      gsap.fromTo(".hero-buttons",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top+=80% top",
            end: "bottom top",
            scrub: 1,
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
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: "linear-gradient(135deg, hsl(211 100% 53%) 0%, hsl(211 100% 60%) 100%)",
        }}
      />
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="space-y-8">
            <div
              ref={setTextLineRef(0)}
              className="text-sm text-white/80 font-medium opacity-0"
            >
              لتمكين العمل الحر
            </div>
            
            <div
              ref={setTextLineRef(1)}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight opacity-0"
            >
              <span className="text-white">
                ملف مهني
              </span>
            </div>
            
            <div
              ref={setTextLineRef(2)}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight opacity-0"
            >
              <span className="text-white/90">
                خاص بك
              </span>
            </div>

            <div
              ref={setTextLineRef(3)}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed opacity-0"
            >
              اعرض خدماتك بطريقة مهنية واستقبل طلبات العملاء بسهولة
            </div>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-4 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link to="/signup">
                  اصنع ملفك المهني
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
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