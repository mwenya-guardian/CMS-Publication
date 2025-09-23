// Example usage of textUtils functions

import { capitalizeWords, capitalizeFirst, toTitleCase } from './textUtils';

// Example usage in a React component
export const ExampleUsage = () => {
  const userName = "john doe smith";
  const userTitle = "software engineer";
  const companyName = "tech corp";

  // Capitalize each word
  const displayName = capitalizeWords(userName); // "John Doe Smith"
  const displayTitle = capitalizeWords(userTitle); // "Software Engineer"
  const displayCompany = capitalizeWords(companyName); // "Tech Corp"

  // Capitalize only first letter
  const sentence = capitalizeFirst("hello world"); // "Hello world"

  // Title case (useful for headings)
  const heading = toTitleCase("welcome to our website"); // "Welcome To Our Website"

  return {
    displayName,
    displayTitle,
    displayCompany,
    sentence,
    heading
  };
};

// Example usage in a service or utility function
export const formatUserDisplayName = (firstName: string, lastName: string): string => {
  return capitalizeWords(`${firstName} ${lastName}`);
};

// Example usage for form labels
export const formatFormLabel = (fieldName: string): string => {
  return capitalizeWords(fieldName.replace(/([A-Z])/g, ' $1').trim());
};

// Example: "firstName" becomes "First Name"
// Example: "emailAddress" becomes "Email Address"
// Example: "phoneNumber" becomes "Phone Number"
