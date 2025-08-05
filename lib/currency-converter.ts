// Currency conversion utility with static exchange rates
// Updated rates as of 2024 - can be updated periodically

interface CurrencyConfig {
  code: string
  symbol: string
  rate: number // USD to local currency rate
  decimals: number
  thousandsSeparator: string
  decimalSeparator: string
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  // Latin America
  COP: { code: "COP", symbol: "COP", rate: 4100, decimals: 0, thousandsSeparator: ".", decimalSeparator: "," },
  MXN: { code: "MXN", symbol: "MXN", rate: 17.5, decimals: 2, thousandsSeparator: ",", decimalSeparator: "." },
  ARS: { code: "ARS", symbol: "ARS", rate: 850, decimals: 0, thousandsSeparator: ".", decimalSeparator: "," },
  CLP: { code: "CLP", symbol: "CLP", rate: 900, decimals: 0, thousandsSeparator: ".", decimalSeparator: "," },
  PEN: { code: "PEN", symbol: "PEN", rate: 3.7, decimals: 2, thousandsSeparator: ",", decimalSeparator: "." },
  BRL: { code: "BRL", symbol: "R$", rate: 5.2, decimals: 2, thousandsSeparator: ".", decimalSeparator: "," },
  UYU: { code: "UYU", symbol: "UYU", rate: 39, decimals: 0, thousandsSeparator: ".", decimalSeparator: "," },
  BOB: { code: "BOB", symbol: "BOB", rate: 6.9, decimals: 2, thousandsSeparator: ",", decimalSeparator: "." },
  PYG: { code: "PYG", symbol: "PYG", rate: 7300, decimals: 0, thousandsSeparator: ".", decimalSeparator: "," },

  // Europe
  EUR: { code: "EUR", symbol: "€", rate: 0.92, decimals: 2, thousandsSeparator: ".", decimalSeparator: "," },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, decimals: 2, thousandsSeparator: ",", decimalSeparator: "." },

  // Default USD
  USD: { code: "USD", symbol: "$", rate: 1, decimals: 2, thousandsSeparator: ",", decimalSeparator: "." },
}

// Add this constant at the top of the file, after the existing constants
const HOTMART_FIXED_PRICES: Record<string, string> = {
  COP: "$65.042,00", // Colombia
  PEN: "S/ 57.00", // Peru
  MXN: "$344.52", // Mexico
  USD: "$14.90", // United States / Panama / El Salvador / Aruba
  EUR: "€16.94", // Spain
  DOP: "RD$955.00", // Dominican Republic
  CRC: "₡7,945.00", // Costa Rica
  ARS: "ARS 21.114", // Argentina
  CLP: "CLP 17.942", // Chile
  UYU: "$632.00", // Uruguay
  GBP: "£14.40", // United Kingdom
  GTQ: "Q122.00", // Guatemala
  HNL: "L415.00", // Honduras
  PLN: "€17.22", // Poland
  CAD: "$23.10", // Canada
  BGN: "€16.80", // Bulgaria
  PAB: "$14.90", // Panama
  SVC: "$14.90", // El Salvador
  AWG: "$14.90", // Aruba
  BRL: "R$91,38", // Brazil
}

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // Latin America
  CO: "COP", // Colombia
  MX: "MXN", // Mexico
  AR: "ARS", // Argentina
  CL: "CLP", // Chile
  PE: "PEN", // Peru
  BR: "BRL", // Brazil
  UY: "UYU", // Uruguay
  BO: "BOB", // Bolivia
  PY: "PYG", // Paraguay
  EC: "USD", // Ecuador (uses USD)
  PA: "USD", // Panama (uses USD)
  VE: "USD", // Venezuela (fallback to USD)

  // Europe
  ES: "EUR", // Spain
  FR: "EUR", // France
  DE: "EUR", // Germany
  IT: "EUR", // Italy
  PT: "EUR", // Portugal
  GB: "GBP", // United Kingdom

  // Default fallback
  US: "USD",
}

class CurrencyConverter {
  private static instance: CurrencyConverter
  private currentCurrency: CurrencyConfig = CURRENCY_CONFIGS.USD
  private isInitialized = false

  private constructor() {}

  static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter()
    }
    return CurrencyConverter.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Try to detect currency from multiple sources
      const currency = await this.detectUserCurrency()
      this.currentCurrency = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD
      this.isInitialized = true

      console.log(`💰 Currency initialized: ${this.currentCurrency.code}`)
    } catch (error) {
      console.error("Currency detection failed, using USD:", error)
      this.currentCurrency = CURRENCY_CONFIGS.USD
      this.isInitialized = true
    }
  }

  private async detectUserCurrency(): Promise<string> {
    // Method 1: Try browser locale
    try {
      const browserLocale = navigator.language || navigator.languages?.[0]
      if (browserLocale) {
        const countryCode = browserLocale.split("-")[1]?.toUpperCase()
        if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
          console.log(`🌍 Currency detected from browser locale: ${COUNTRY_TO_CURRENCY[countryCode]}`)
          return COUNTRY_TO_CURRENCY[countryCode]
        }
      }
    } catch (error) {
      console.warn("Browser locale detection failed:", error)
    }

    // Method 2: Try timezone-based detection
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const countryFromTimezone = this.getCountryFromTimezone(timezone)
      if (countryFromTimezone && COUNTRY_TO_CURRENCY[countryFromTimezone]) {
        console.log(`🕐 Currency detected from timezone: ${COUNTRY_TO_CURRENCY[countryFromTimezone]}`)
        return COUNTRY_TO_CURRENCY[countryFromTimezone]
      }
    } catch (error) {
      console.warn("Timezone detection failed:", error)
    }

    // Method 3: Try IP-based detection (lightweight)
    try {
      const response = await fetch("https://ipapi.co/json/", {
        method: "GET",
        timeout: 3000,
      })
      if (response.ok) {
        const data = await response.json()
        const countryCode = data.country_code?.toUpperCase()
        if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
          console.log(`🌐 Currency detected from IP: ${COUNTRY_TO_CURRENCY[countryCode]}`)
          return COUNTRY_TO_CURRENCY[countryCode]
        }
      }
    } catch (error) {
      console.warn("IP-based detection failed:", error)
    }

    // Fallback to USD
    console.log("🔄 Using fallback currency: USD")
    return "USD"
  }

  private getCountryFromTimezone(timezone: string): string | null {
    const timezoneToCountry: Record<string, string> = {
      "America/Bogota": "CO",
      "America/Mexico_City": "MX",
      "America/Argentina/Buenos_Aires": "AR",
      "America/Santiago": "CL",
      "America/Lima": "PE",
      "America/Sao_Paulo": "BR",
      "America/Montevideo": "UY",
      "America/La_Paz": "BO",
      "America/Asuncion": "PY",
      "Europe/Madrid": "ES",
      "Europe/Paris": "FR",
      "Europe/Berlin": "DE",
      "Europe/Rome": "IT",
      "Europe/Lisbon": "PT",
      "Europe/London": "GB",
    }

    return timezoneToCountry[timezone] || null
  }

  convertAmount(usdAmount: number): number {
    const converted = usdAmount * this.currentCurrency.rate

    // Round to clean numbers based on currency
    if (this.currentCurrency.decimals === 0) {
      // For currencies without decimals, round to nearest 100 or 1000
      if (converted > 10000) {
        return Math.round(converted / 1000) * 1000
      } else if (converted > 1000) {
        return Math.round(converted / 100) * 100
      } else {
        return Math.round(converted / 10) * 10
      }
    } else {
      // For currencies with decimals, round to 2 decimal places
      return Math.round(converted * 100) / 100
    }
  }

  formatAmount(usdAmount: number): string {
    const convertedAmount = this.convertAmount(usdAmount)
    const config = this.currentCurrency

    // Format number with proper separators
    const parts = convertedAmount.toFixed(config.decimals).split(".")
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator)
    const decimalPart = parts[1]

    let formattedNumber = integerPart
    if (config.decimals > 0 && decimalPart) {
      formattedNumber += config.decimalSeparator + decimalPart
    }

    return `${config.symbol} ${formattedNumber}`
  }

  // Parse USD amount from formatted string (e.g., "$75.00" -> 75)
  parseUSDAmount(formattedAmount: string): number {
    const cleanAmount = formattedAmount.replace(/[^0-9.]/g, "")
    return Number.parseFloat(cleanAmount) || 0
  }

  // Check if current page and URL qualify for Hotmart fixed pricing
  isHotmartOffer(pageSlug: string, checkoutUrl?: string): boolean {
    const isHotmartCheckout = checkoutUrl?.includes("https://pay.hotmart.com/") || false
    const isEligiblePage = ["/discover", "/chat"].some((page) => pageSlug.startsWith(page))
    return isHotmartCheckout && isEligiblePage
  }

  // Get Hotmart fixed price for current user's currency
  getHotmartFixedPrice(pageSlug: string, checkoutUrl?: string): string | null {
    if (this.isHotmartOffer(pageSlug, checkoutUrl)) {
      const currencyCode = this.currentCurrency.code
      return HOTMART_FIXED_PRICES[currencyCode] || null
    }
    return null
  }

  // Enhanced format method that can handle Hotmart fixed pricing
  formatAmountWithContext(usdAmount: number, pageSlug?: string, checkoutUrl?: string): string {
    // Check if this should use Hotmart fixed pricing
    if (pageSlug && checkoutUrl) {
      const fixedPrice = this.getHotmartFixedPrice(pageSlug, checkoutUrl)
      if (fixedPrice) {
        console.log(`💰 Using Hotmart fixed price: ${fixedPrice} for ${this.currentCurrency.code}`)
        return fixedPrice
      }
    }

    // Fall back to regular currency conversion
    return this.formatAmount(usdAmount)
  }

  getCurrentCurrency(): CurrencyConfig {
    return this.currentCurrency
  }

  // Force set currency (for testing)
  setCurrency(currencyCode: string): void {
    if (CURRENCY_CONFIGS[currencyCode]) {
      this.currentCurrency = CURRENCY_CONFIGS[currencyCode]
      console.log(`💰 Currency manually set to: ${currencyCode}`)
    }
  }
}

export default CurrencyConverter
