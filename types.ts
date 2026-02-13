
export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export interface BrandColor {
  hex: string;
  name: string;
  usage: string;
}

export interface BrandTypography {
  headerFont: string;
  bodyFont: string;
  pairingReason: string;
}

export interface BrandIdentity {
  brandName: string;
  slogan: string;
  missionStatement: string;
  colorPalette: BrandColor[];
  typography: BrandTypography;
  logoPrompt: string;
  secondaryMarkPrompt: string;
  brandVoice: string;
}

export interface GeneratedImages {
  primaryLogo?: string;
  secondaryMark?: string;
}
