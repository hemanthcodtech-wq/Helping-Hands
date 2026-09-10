import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import FadeIn from "./Common/FadeIn"

function GalleryColumn({ items, reverse = false, columnIndex = 0 }) {
  const doubled = [...items, ...items]

  return (
    <div className="h-[520px] overflow-hidden sm:h-[620px] lg:h-[680px]">
      <motion.div
        className="flex flex-col gap-3 sm:gap-4"
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 26 + columnIndex * 3, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <FadeIn key={`${item.id}-${columnIndex}-${i}`} className="w-full shrink-0">
            <div className="group aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:rounded-3xl">
              <img
                src={item.file_url}
                alt={item.title || "Gallery image"}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                decoding="async"
                loading="eager"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = "/images/gallery-1.png"
                }}
              />
            </div>
          </FadeIn>
        ))}
      </motion.div>
    </div>
  )
}

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resources")
        const data = await res.json()
        if (data.success) {
          // Filter for photo resources
          const photos = data.resources.filter(r => r.category === 'photos')
          setGalleryImages(photos)
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Avoid creating columns if there are no images
  if (loading) {
    return (
      <section id="gallery" className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 text-center">
        <p className="text-sm text-muted-foreground">Loading gallery...</p>
      </section>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <section id="gallery" className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 text-center">
        <p className="text-sm text-muted-foreground">No gallery images available.</p>
      </section>
    )
  }

  const desktopColumns = Array.from({ length: 4 }, (_, columnIndex) =>
    galleryImages.filter((_, index) => index % 4 === columnIndex)
  ).filter(col => col.length > 0)

  const mobileColumns = Array.from({ length: 2 }, (_, columnIndex) =>
    galleryImages.filter((_, index) => index % 2 === columnIndex)
  ).filter(col => col.length > 0)

  return (
    <section id="gallery" className="w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <FadeIn>
          <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary sm:text-lg">Gallery</h2>
        </FadeIn>

        {/* Mobile/tablet: exactly two gallery columns */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:hidden">
          {mobileColumns.map((column, index) => (
            <GalleryColumn
              key={`mobile-gallery-column-${index}`}
              items={column}
              columnIndex={index}
              reverse={index === 1}
            />
          ))}
        </div>

        {/* Desktop: preserve the existing four-column gallery */}
        <div className="mt-8 hidden grid-cols-4 gap-4 lg:grid lg:gap-5">
          {desktopColumns.map((column, index) => (
            <GalleryColumn
              key={`desktop-gallery-column-${index}`}
              items={column}
              columnIndex={index}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
