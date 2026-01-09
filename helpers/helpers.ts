export function generateRandomUserDetails()
{
    const randomString = Math.random().toString(36).substring(2, 10);

    return {
        firstName: `TestFirst${randomString}`,
        lastName: `TestLast${randomString}`,
        email: `testuser_${randomString}@mailinator.com`,
        password: `Password@${randomString}`,
        phone: `07${Math.floor(100000000 + Math.random() * 900000000)}`, // UK-style random phone
        subscribe: 'yes', 
    };
}  

export function normaliseCurrency(value: string): number {
    return parseFloat(value.replace(/[$,]/g, ''));
}