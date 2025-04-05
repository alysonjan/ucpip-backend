export const calculateAge = (dob: string): string => {
    const birthDate = new Date(dob); // Parse the date of birth

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date format. Please provide a valid date string.");
    }

    const today = new Date(); // Get today's date
    let age = today.getFullYear() - birthDate.getFullYear(); // Calculate initial age

    // Adjust age if the birthday hasn't occurred yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age.toString(); // Return the calculated age
};


export const generateUniquePeNo = () => {
    // Get the current date and time
    const now = new Date();
    
    // Create a unique number based on the timestamp
    const pe_no = now.getTime(); // Get the timestamp in milliseconds
    
    return pe_no.toString(); // Return the unique PE number
}