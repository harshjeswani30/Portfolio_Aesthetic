import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { convertDriveUrlToDirectImageUrl } from '@/lib/image-utils';

interface GalleryItem {
  id: string;
  title: string;
  number: string;
  image: string;
  tags?: string[];
}

interface HorizontalGalleryProps {
  items: GalleryItem[];
  startText?: { first: string; second: string };
  endText?: { first: string; second: string };
}

export interface HorizontalGalleryRef {
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  imageInnerRefs: React.RefObject<HTMLDivElement[]>;
  itemRefs: React.RefObject<HTMLElement[]>;
  titleRefs: React.RefObject<HTMLElement[]>;
  startTextRefs: React.RefObject<HTMLElement[]>;
  endTextRefs: React.RefObject<HTMLElement[]>;
}

const HorizontalGallery = forwardRef<HorizontalGalleryRef, HorizontalGalleryProps>(
  ({ items, startText, endText }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageInnerRefs = useRef<HTMLDivElement[]>([]);
    const itemRefs = useRef<HTMLElement[]>([]);
    const titleRefs = useRef<HTMLElement[]>([]);
    const startTextRefs = useRef<HTMLElement[]>([]);
    const endTextRefs = useRef<HTMLElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
    const [imagesErrored, setImagesErrored] = useState<Record<string, boolean>>({});

    // Preload all images to ensure they're loaded before display
    useEffect(() => {
      if (!items || items.length === 0) return;

      const loadPromises: Promise<void>[] = [];
      const loadedState: Record<string, boolean> = {};
      const erroredState: Record<string, boolean> = {};

      items.forEach((item) => {
        if (!item.image) {
          erroredState[item.id] = true;
          return;
        }

        const promise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            loadedState[item.id] = true;
            resolve();
          };
          
          img.onerror = () => {
            console.warn(`Failed to load image for item ${item.id}:`, item.image);
            erroredState[item.id] = true;
            resolve(); // Resolve anyway to not block other images
          };
          
          // Set src after handlers to ensure they're attached (convert Google Drive URLs if needed)
          img.src = convertDriveUrlToDirectImageUrl(item.image);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            if (!loadedState[item.id] && !erroredState[item.id]) {
              console.warn(`Image load timeout for item ${item.id}:`, item.image);
              erroredState[item.id] = true;
              resolve();
            }
          }, 10000);
        });

        loadPromises.push(promise);
      });

      Promise.all(loadPromises).then(() => {
        setImagesLoaded(loadedState);
        setImagesErrored(erroredState);
      });
    }, [items]);

    useImperativeHandle(ref, () => ({
      containerRef,
      contentRef,
      imageInnerRefs,
      itemRefs,
      titleRefs,
      startTextRefs,
      endTextRefs,
    }));

    return (
      <div
        ref={containerRef}
        className="gallery-container fixed inset-0 z-30 overflow-hidden bg-background"
        style={{ 
          transform: 'translateY(100%)',
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={contentRef}
          className="gallery flex h-full items-center"
          style={{
            marginLeft: '12vw',
            paddingRight: 0, // Remove extra padding on right since footer comes immediately after
            width: 'fit-content', // Let content determine width naturally
          }}
        >
          {/* Start Text */}
          {startText && (
            <div className="gallery__text shrink-0 text-foreground" style={{
              fontSize: '20vw',
              lineHeight: 0.8,
              margin: '0 10vw 0 14vw',
              textTransform: 'lowercase',
              color: 'transparent',
              WebkitTextStroke: '1px',
              WebkitTextStrokeColor: 'var(--foreground)',
              WebkitTextFillColor: 'transparent',
            } as React.CSSProperties}>
              <span 
                ref={(el) => { if (el) startTextRefs.current[0] = el; }}
                className="gallery__text-inner" 
                style={{ display: 'block' }}
              >
                {startText.first}
              </span>
              <span 
                ref={(el) => { if (el) startTextRefs.current[1] = el; }}
                className="gallery__text-inner" 
                style={{ display: 'block' }}
              >
                {startText.second}
              </span>
            </div>
          )}
          
          {items.map((item, index) => (
            <figure
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current[index] = el;
                }
              }}
              className="gallery__item shrink-0"
              style={{
                margin: '0 3vw',
                display: 'grid',
                gridTemplateAreas: "'... ...' '... gallery-image' '... ...'",
                gridTemplateColumns: '8rem 21vmax',
                gridTemplateRows: '8rem 28vmax 3rem',
                paddingTop: index % 2 === 1 ? '10vh' : '0',
                willChange: 'transform',
              }}
            >
              <div 
                className="gallery__item-img overflow-hidden relative"
                style={{ 
                  gridArea: 'gallery-image',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  willChange: 'transform',
                }}
              >
                <div
                  ref={(el) => {
                    if (el) {
                      imageInnerRefs.current[index] = el;
                      // Update background image once element is ready (convert Google Drive URLs if needed)
                      if (item.image && !imagesErrored[item.id] && imagesLoaded[item.id]) {
                        el.style.backgroundImage = `url(${convertDriveUrlToDirectImageUrl(item.image)})`;
                        el.style.opacity = '1';
                      }
                    }
                  }}
                  className="gallery__item-imginner"
                  style={{
                    backgroundImage: item.image && !imagesErrored[item.id] && imagesLoaded[item.id] ? `url(${convertDriveUrlToDirectImageUrl(item.image)})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 0',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: 'calc(100% + 14vh)',
                    marginTop: '-7vh',
                    willChange: 'transform',
                    filter: 'saturate(0) brightness(0)', // Initial filter state
                    opacity: item.image && (imagesLoaded[item.id] || !imagesErrored[item.id]) ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                >
                  {/* Preload image using img tag for better browser handling */}
                  {item.image && (
                    <img
                      src={convertDriveUrlToDirectImageUrl(item.image)}
                      alt={item.title || `Project ${item.number}`}
                      style={{
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        opacity: 0,
                        pointerEvents: 'none',
                      }}
                      loading="eager"
                      crossOrigin="anonymous"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.src) {
                          setImagesLoaded(prev => ({ ...prev, [item.id]: true }));
                          // Update the background image once loaded
                          const div = imageInnerRefs.current[index];
                          if (div) {
                            div.style.backgroundImage = `url(${img.src})`;
                            div.style.opacity = '1';
                          }
                        }
                      }}
                      onError={() => {
                        console.warn(`Image failed to load for item ${item.id}:`, item.image);
                        setImagesErrored(prev => ({ ...prev, [item.id]: true }));
                      }}
                    />
                  )}
                  {/* Error state placeholder */}
                  {imagesErrored[item.id] && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.875rem',
                        zIndex: 1,
                      }}
                    >
                      Image unavailable
                    </div>
                  )}
                </div>
                {/* Subtitle overlay on image */}
                {item.title && (
                  <p
                    className="gallery__item-tags"
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      fontSize: '1.5rem',
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                      zIndex: 10,
                      margin: 0,
                      padding: '0.5rem 1rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    {item.title}
                  </p>
                )}
              </div>
              <figcaption
                className="gallery__item-caption"
                style={{
                  gridArea: '1 / 1 / 4 / 3',
                  display: 'grid',
                  gridTemplateAreas: "'gallery-number gallery-title' 'gallery-link ...' 'gallery-link ...'",
                  gridTemplateColumns: '8rem auto',
                  gridTemplateRows: '8rem auto 3rem',
                }}
              >
                <span
                  className="gallery__item-number"
                  style={{
                    gridArea: 'gallery-number',
                    fontSize: 'clamp(2.5rem, 9vw, 6.5rem)',
                    justifySelf: 'end',
                    paddingRight: '2rem',
                    color: 'var(--color-gallery-number, #ffffff)',
                  }}
                >
                  {item.number}
                </span>
                <h2
                  ref={(el) => { if (el) titleRefs.current[index] = el; }}
                  className="gallery__item-title m-0"
                  style={{
                    gridArea: 'gallery-title',
                    margin: 0,
                    marginTop: '1rem',
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: 'var(--color-gallery-title, #463832)',
                    alignSelf: 'center',
                    willChange: 'transform',
                  }}
                >
                  Project {parseInt(item.number) || item.number}
                </h2>
                <a
                  className="gallery__item-link cursor-pointer"
                  style={{
                    gridArea: 'gallery-link',
                    alignSelf: 'end',
                    fontSize: '1.5rem',
                    background: 'var(--color-gallery-link-bg, #d75828)',
                    color: 'var(--color-gallery-link, #fff)',
                    textDecoration: 'underline',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-gallery-link-bg-hover, #d4b77d)';
                    e.currentTarget.style.color = 'var(--color-gallery-link-hover, #fff)';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-gallery-link-bg, #d75828)';
                    e.currentTarget.style.color = 'var(--color-gallery-link, #fff)';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                >
                  explore
                </a>
              </figcaption>
              </figure>
          ))}
          
          {/* End Text */}
          {endText && (
            <div className="gallery__text shrink-0 text-foreground" style={{
              fontSize: '20vw',
              lineHeight: 0.8,
              margin: '0 10vw 0 14vw',
              textTransform: 'lowercase',
              color: 'transparent',
              WebkitTextStroke: '1px',
              WebkitTextStrokeColor: 'var(--foreground)',
              WebkitTextFillColor: 'transparent',
            } as React.CSSProperties}>
              <span 
                ref={(el) => { if (el) endTextRefs.current[0] = el; }}
                className="gallery__text-inner" 
                style={{ display: 'block' }}
              >
                {endText.first}
              </span>
              <span 
                ref={(el) => { if (el) endTextRefs.current[1] = el; }}
                className="gallery__text-inner" 
                style={{ display: 'block' }}
              >
                {endText.second}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

HorizontalGallery.displayName = 'HorizontalGallery';

export default HorizontalGallery;
