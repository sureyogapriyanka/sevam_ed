// Utility function to generate patient images based on age and gender
// This function returns a data URL for an SVG avatar

export const generatePatientImage = (age: number, gender: string): string => {
    // Color palette for different age groups
    const ageColors = {
        young: '#4F46E5',    // Indigo for young patients (0-30)
        adult: '#10B981',    // Emerald for adults (31-50)
        mature: '#F59E0B',   // Amber for mature patients (51-65)
        senior: '#EF4444'    // Red for seniors (65+)
    };

    // Gender-specific styling
    const genderStyles = {
        male: {
            hairColor: '#374151',    // Gray for hair
            skinTone: '#FDE68A'      // Warm skin tone
        },
        female: {
            hairColor: '#92400E',    // Brown for hair
            skinTone: '#FCD34D'      // Slightly different skin tone
        }
    };

    // Determine age group
    let ageGroup = 'adult';
    if (age <= 30) {
        ageGroup = 'young';
    } else if (age <= 50) {
        ageGroup = 'adult';
    } else if (age <= 65) {
        ageGroup = 'mature';
    } else {
        ageGroup = 'senior';
    }

    // Get styling based on gender
    const styles = genderStyles[gender as keyof typeof genderStyles] || genderStyles.male;
    const color = ageColors[ageGroup as keyof typeof ageColors];

    // Generate SVG avatar
    const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="50" fill="${styles.skinTone}" />
      
      <!-- Head -->
      <circle cx="50" cy="40" r="25" fill="${styles.skinTone}" />
      
      <!-- Eyes -->
      <circle cx="40" cy="35" r="3" fill="#1F2937" />
      <circle cx="60" cy="35" r="3" fill="#1F2937" />
      
      <!-- Mouth -->
      <path d="M 40 50 Q 50 55 60 50" stroke="#1F2937" stroke-width="2" fill="none" />
      
      <!-- Hair or head covering based on age and gender -->
      ${gender === 'female' && age <= 40
            ? `<circle cx="50" cy="25" r="20" fill="${styles.hairColor}" />`
            : gender === 'male' && age > 40
                ? `<path d="M 30 30 Q 50 20 70 30 L 70 45 Q 50 35 30 45 Z" fill="${styles.hairColor}" />`
                : `<rect x="30" y="20" width="40" height="10" rx="5" fill="${styles.hairColor}" />`
        }
      
      <!-- Clothing based on age group -->
      <rect x="35" y="65" width="30" height="25" rx="5" fill="${color}" />
      
      <!-- Decorative elements based on age -->
      ${age <= 30
            ? `<circle cx="20" cy="20" r="5" fill="#A78BFA" />
             <circle cx="80" cy="20" r="5" fill="#A78BFA" />`
            : age <= 50
                ? `<rect x="15" y="15" width="10" height="10" rx="3" fill="#34D399" />
             <rect x="75" y="15" width="10" height="10" rx="3" fill="#34D399" />`
                : `<circle cx="15" cy="15" r="3" fill="#FBBF24" />
             <circle cx="85" cy="15" r="3" fill="#FBBF24" />
             <circle cx="25" cy="85" r="3" fill="#FBBF24" />
             <circle cx="75" cy="85" r="3" fill="#FBBF24" />`
        }
    </svg>
  `;

    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    return url;
};

// Function to generate a placeholder image for patients without profile images
export const getPatientImage = (patient: any): string => {
    // If patient already has a profile image, return it
    if (patient.profileImage) {
        return patient.profileImage;
    }

    // Generate an image based on age and gender
    const age = patient.age || 30;
    const gender = patient.gender || 'male';

    return generatePatientImage(age, gender);
};
