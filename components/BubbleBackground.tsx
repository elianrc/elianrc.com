'use client'

import type { ComponentProps, CSSProperties } from 'react'
import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import type { MotionStyle } from 'motion/react'

type BubbleColors = {
  first?: string
  second?: string
  third?: string
  fourth?: string
  fifth?: string
  sixth?: string
  interactive?: string
}

type BubbleBackgroundProps = ComponentProps<'div'> & {
  interactive?: boolean
  colors?: BubbleColors
  transition?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

const defaultColors: Required<BubbleColors> = {
  first: '18, 64, 145',
  second: '22, 91, 188',
  third: '9, 33, 92',
  fourth: '35, 104, 197',
  fifth: '16, 70, 158',
  sixth: '12, 45, 112',
  interactive: '42, 111, 203',
}

export default function BubbleBackground({
  interactive = true,
  colors,
  transition = { stiffness: 100, damping: 20 },
  className,
  ...props
}: BubbleBackgroundProps) {
  const palette = { ...defaultColors, ...colors }
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, transition)
  const springY = useSpring(mouseY, transition)
  const interactiveTransform = useMotionTemplate`translate3d(calc(${springX}px - 50%), calc(${springY}px - 50%), 0)`

  useEffect(() => {
    if (!interactive) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [interactive, mouseX, mouseY])

  return (
    <div
      className={['bubble-background', className].filter(Boolean).join(' ')}
      {...props}
    >
      <svg className="bubble-background-filter" aria-hidden="true" focusable="false">
        <filter id="bubble-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div className="bubble-background-gradients">
        <span className="bubble bubble-one" style={{ '--bubble-color': palette.first } as CSSProperties} />
        <span className="bubble bubble-two" style={{ '--bubble-color': palette.second } as CSSProperties} />
        <span className="bubble bubble-three" style={{ '--bubble-color': palette.third } as CSSProperties} />
        <span className="bubble bubble-four" style={{ '--bubble-color': palette.fourth } as CSSProperties} />
        <span className="bubble bubble-five" style={{ '--bubble-color': palette.fifth } as CSSProperties} />
        <span className="bubble bubble-six" style={{ '--bubble-color': palette.sixth } as CSSProperties} />
        {interactive ? (
          <motion.span
            className="bubble bubble-interactive"
            style={
              {
                '--bubble-color': palette.interactive,
                transform: interactiveTransform,
              } as MotionStyle
            }
          />
        ) : null}
      </div>
    </div>
  )
}
