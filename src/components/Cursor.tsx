import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { lerp, getMousePos } from '@/utils/math';

interface RenderedStyle {
    previous: number;
    current: number;
    amt: number;
}

interface RenderedStyles {
    tx: RenderedStyle;
    ty: RenderedStyle;
    scale: RenderedStyle;
}

interface CursorProps {
    element: HTMLElement | null;
}

export default function useCursor({ element }: CursorProps) {
    const renderedStylesRef = useRef<RenderedStyles | null>(null);
    const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);
    const boundsRef = useRef<DOMRect | null>(null);
    const onMouseMoveEvRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!element) return;

        const el = element;
        el.style.opacity = '0';
        
        const bounds = el.getBoundingClientRect();
        boundsRef.current = bounds;
        
        const renderedStyles: RenderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.2 },
            ty: { previous: 0, current: 0, amt: 0.2 },
            scale: { previous: 1, current: 1, amt: 0.15 },
        };
        renderedStylesRef.current = renderedStyles;

        // Track mouse position
        const handleMouseMove = (ev: MouseEvent) => {
            mouseRef.current = getMousePos(ev);
        };
        window.addEventListener('mousemove', handleMouseMove);

        const onMouseMoveEv = () => {
            if (!renderedStylesRef.current || !boundsRef.current) return;
            const styles = renderedStylesRef.current;
            const bounds = boundsRef.current;
            styles.tx.previous = styles.tx.current = mouseRef.current.x - bounds.width / 2;
            styles.ty.previous = styles.ty.current = mouseRef.current.y - bounds.height / 2;
            gsap.to(el, { duration: 0.9, ease: 'Power3.easeOut', opacity: 1 });
            if (animationFrameRef.current === null) {
                render();
            }
            window.removeEventListener('mousemove', onMouseMoveEv);
        };
        onMouseMoveEvRef.current = onMouseMoveEv;
        window.addEventListener('mousemove', onMouseMoveEv);

        const render = () => {
            if (!renderedStylesRef.current || !boundsRef.current) return;
            const styles = renderedStylesRef.current;
            const bounds = boundsRef.current;
            
            styles.tx.current = mouseRef.current.x - bounds.width / 2;
            styles.ty.current = mouseRef.current.y - bounds.height / 2;

            for (const key in styles) {
                const style = styles[key as keyof RenderedStyles];
                style.previous = lerp(style.previous, style.current, style.amt);
            }
                        
            el.style.transform = `translateX(${styles.tx.previous}px) translateY(${styles.ty.previous}px) scale(${styles.scale.previous})`;

            animationFrameRef.current = requestAnimationFrame(render);
        };

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (onMouseMoveEvRef.current) {
                window.removeEventListener('mousemove', onMouseMoveEvRef.current);
            }
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [element]);

    const enter = () => {
        if (renderedStylesRef.current) {
            renderedStylesRef.current.scale.current = 2.5;
        }
    };

    const leave = () => {
        if (renderedStylesRef.current) {
            renderedStylesRef.current.scale.current = 1;
        }
    };

    return { enter, leave };
}


