import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, PenTool, Settings, Share2, CheckCircle } from 'lucide-react'

export function InfoCard() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white">
          How It Works
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <span className="flex items-center justify-center w-8 h-8 text-white bg-primary rounded-full">
                  {step.icon}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{step.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Blink Creation Fee</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The BlinkShare fee is 0.2% of the transaction amount plus the Solana network fee.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const steps = [
  {
    icon: <Wallet className="w-4 h-4" />,
    title: "Connect Your Wallet",
    description: "Use the 'Connect Wallet' button to link your Solana wallet."
  },
  {
    icon: <PenTool className="w-4 h-4" />,
    title: "Fill Out the Blink Form",
    description: "Enter your desired information in the Blink creation form."
  },
  {
    icon: <Settings className="w-4 h-4" />,
    title: "Choose Blink Options",
    description: "Select your Blink type, currency, and other customization options."
  },
  {
    icon: <CheckCircle className="w-4 h-4" />,
    title: "Create and Confirm",
    description: "Click 'Create Blink' and confirm the transaction in your wallet."
  },
  {
    icon: <Share2 className="w-4 h-4" />,
    title: "Share Your Blink",
    description: "Use the provided social sharing options to share your new Blink."
  }
]


