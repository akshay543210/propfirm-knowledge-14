
export interface ValidationErrors {
  [key: string]: string;
}

export const validateAdminForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Firm name is required';
  }
  if (!formData.funding_amount || !formData.funding_amount.trim()) {
    errors.funding_amount = 'Funding amount is required';
  }

  // Numeric validations
  if (formData.price < 0) {
    errors.price = 'Price must be 0 or greater';
  }
  if (formData.original_price < 0) {
    errors.original_price = 'Original price must be 0 or greater';
  }
  if (formData.profit_split < 0 || formData.profit_split > 100) {
    errors.profit_split = 'Profit split must be between 0 and 100';
  }
  if (formData.payout_rate < 0 || formData.payout_rate > 100) {
    errors.payout_rate = 'Payout rate must be between 0 and 100';
  }
  if (formData.review_score < 0 || formData.review_score > 5) {
    errors.review_score = 'Review score must be between 0 and 5';
  }
  if (formData.trust_rating < 0 || formData.trust_rating > 10) {
    errors.trust_rating = 'Trust rating must be between 0 and 10';
  }
  if (formData.starting_fee && formData.starting_fee < 0) {
    errors.starting_fee = 'Starting fee must be 0 or greater';
  }

  // URL validations
  if (formData.affiliate_url && formData.affiliate_url.trim() && !isValidUrl(formData.affiliate_url)) {
    errors.affiliate_url = 'Affiliate URL must be a valid URL starting with http:// or https://';
  }
  if (formData.logo_url && formData.logo_url.trim() && !isValidLogoUrl(formData.logo_url)) {
    errors.logo_url = 'Logo URL must be a valid path starting with / or a valid URL';
  }

  // String length validations
  if (formData.name && formData.name.length > 255) {
    errors.name = 'Firm name must be less than 255 characters';
  }
  if (formData.description && formData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidLogoUrl = (url: string): boolean => {
  // Allow relative paths starting with /
  if (url.startsWith('/')) {
    return true;
  }
  // Allow full URLs
  return isValidUrl(url);
};
