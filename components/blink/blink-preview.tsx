import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlinkData, currencyIcons } from "@/app/types/blink"

interface BlinkPreviewProps extends BlinkData {}

export function BlinkPreview({
  icon,
  label,
  description,
  title,
  titleDescription,
  font,
  backgroundColor,
  fontColor,
  backgroundImage,
  buttonOptions
}: BlinkPreviewProps) {
  const cardStyle = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: fontColor,
  }

  return (
    <Card className="w-full max-w-6xl mx-auto overflow-hidden shadow-lg" style={cardStyle}>
      <CardHeader className="pt-12">
        <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2" style={{ fontFamily: font }}>{title}</CardTitle>
        {titleDescription && (
          <p className="text-center text-sm sm:text-base" style={{ fontFamily: font }}>{titleDescription}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-4 sm:p-6 md:p-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
          <Image
            src={icon || "https://ucarecdn.com/b60a22da-6905-4228-8b18-6967e01ce462/barkicontransparent.webp"}
            alt={label || "Blink icon"}
            fill
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
            style={{ objectFit: "cover" }}
            className="rounded-full"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
              target.alt = "Placeholder image";
            }}
          />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ fontFamily: font }}>{label}</h2>
        <p className="text-center text-base sm:text-lg md:text-xl max-w-prose" style={{ fontFamily: font }}>{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center pb-8 px-4 sm:px-6 md:px-8">
        {buttonOptions.type !== 'none' && (
          <Button 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md text-sm sm:text-base md:text-lg py-2 sm:py-3 md:py-4" 
            style={{ backgroundColor: fontColor, color: backgroundColor }}
            aria-label={`${buttonOptions.type === 'payment' ? 'Pay' : 'Donate'} ${buttonOptions.amount} ${buttonOptions.currency}`}
          >
            <div className="flex items-center justify-center">
              <Image 
                src={currencyIcons[buttonOptions.currency] || "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"} 
                alt={`${buttonOptions.currency} icon`} 
                width={24} 
                height={24} 
                className="mr-2" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp";
                  target.alt = "Placeholder currency icon";
                }}
              />
              <span>{buttonOptions.type === 'payment' ? 'Pay' : 'Donate'} {buttonOptions.amount} {buttonOptions.currency}</span>
            </div>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

