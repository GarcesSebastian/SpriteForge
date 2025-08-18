export default function Head() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SpriteForge",
            "alternateName": "SpriteForge - Advanced Sprite Animation Testing Platform",
            "description": "Professional web platform for testing, previewing, and fine-tuning sprite animations in real-time. Perfect for game developers, animators, and digital artists.",
            "url": "https://spriteforge.dev",
            "applicationCategory": "GameApplication",
            "applicationSubCategory": "Development Tool",
            "operatingSystem": "Web Browser",
            "browserRequirements": "HTML5 Canvas support, JavaScript enabled",
            "softwareVersion": "1.0.0",
            "datePublished": "2024-01-01",
            "dateModified": "2024-01-01",
            "author": {
              "@type": "Person",
              "name": "Sebxstt"
            },
            "publisher": {
              "@type": "Person",
              "name": "Sebxstt"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "Real-time sprite animation testing",
              "Multi-sprite workspace",
              "Animation speed control",
              "Loop settings management",
              "Debug mode with frame analysis",
              "Keyboard controller support",
              "Responsive canvas interface",
              "Export capabilities"
            ],
            "screenshot": [
              "https://spriteforge.dev/logo.png"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />
    </>
  )
}
