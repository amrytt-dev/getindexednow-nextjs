"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children?: React.ReactNode;
  images?: string[];
}

export const ContainerScroll = ({
  titleComponent,
  children,
  images,
}: ContainerScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  // Create sticky behavior for images
  const hasImages = images && images.length > 0;
  const sectionHeight = hasImages ? "300vh" : "60rem md:h-[80rem]";

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // MOBILE: show only title/subtext (hide animated frame/images)
  if (isMobile) {
    return (
      <div className="py-10 w-full">
        <div className="max-w-5xl mx-auto text-center">
          {titleComponent}
        </div>
      </div>
    );
  }

  return (
    <div
      className={hasImages ? "h-[300vh]" : "h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"}
      ref={containerRef}
    >
      <div
        className={hasImages ? "sticky top-0 h-screen flex flex-col items-center justify-center py-10 w-full relative" : "py-10 w-full relative"}
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} images={images} scrollProgress={scrollYProgress}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
  images,
  scrollProgress,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  images?: string[];
  scrollProgress?: MotionValue<number>;
}) => {

  // If images are provided, create scroll-based image cycling
  if (images && images.length > 0 && scrollProgress) {
    return (
      <motion.div
        style={{
          rotateX: rotate,
          scale,
          boxShadow:
            "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
        }}
        className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
      >
        <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4 relative">
          {images.map((image, index) => {
            // Create distinct phases for each image
            const totalImages = images.length;
            const phaseSize = 1 / totalImages;
            const startProgress = index * phaseSize;
            const endProgress = (index + 1) * phaseSize;

            // Add a slight extra delay before the second image begins its fade-in,
            // so the first->second transition matches the perceived pacing of later transitions
            const firstToSecondExtraDelay = 0.07; // adjust if needed
            const adjustedStart = index === 1 ? Math.min(1, startProgress + firstToSecondExtraDelay) : startProgress;
            const adjustedEnd = index === 1 ? Math.min(1, endProgress + firstToSecondExtraDelay) : endProgress;
            
            // Create smooth transitions between images
            const opacity = useTransform(
              scrollProgress,
              [
                Math.max(0, (index === 1 ? adjustedStart : startProgress) - 0.05),
                index === 1 ? adjustedStart : startProgress,
                index === 1 ? adjustedEnd : endProgress,
                Math.min(1, (index === 1 ? adjustedEnd : endProgress) + 0.05)
              ],
              [0, 1, 1, 0]
            );

            const imageScale = useTransform(
              scrollProgress,
              [
                Math.max(0, (index === 1 ? adjustedStart : startProgress) - 0.05),
                index === 1 ? adjustedStart : startProgress,
                index === 1 ? adjustedEnd : endProgress,
                Math.min(1, (index === 1 ? adjustedEnd : endProgress) + 0.05)
              ],
              [0.95, 1, 1, 0.95]
            );

            return (
              <motion.div
                key={index}
                style={{
                  opacity,
                  scale: imageScale,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={image}
                  alt={`Dashboard ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                  style={{
                    objectPosition: "center top",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Original card layout for non-image content
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
