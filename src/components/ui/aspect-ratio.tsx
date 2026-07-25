// v5.84: v5.84: Radix AspectRatio handles aspect-ratio layout. No ARIA needed.
import type { ComponentProps } from "react"

"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

function AspectRatio({
  ...props
}: ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
